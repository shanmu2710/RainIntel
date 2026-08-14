import oracledb
import getpass
from datetime import date

print("=" * 70)
print("RAININTEL APPLICATION DATABASE - END TO END TEST")
print("=" * 70)

password = getpass.getpass("Enter RAININTEL password: ")

connection = oracledb.connect(
    user="RAININTEL",
    password=password,
    dsn="127.0.0.1:1521/XEPDB1"
)

cursor = connection.cursor()

print("\nConnected to Oracle.")

try:
    # ============================================================
    # 1. FIND EXISTING DISTRICT
    # ============================================================

    print("\n[1] Finding Coimbatore district...")

    cursor.execute("""
        SELECT DISTRICT_ID, DISTRICT_NAME, STATE_NAME
        FROM RAINFALL_DISTRICTS
        WHERE UPPER(DISTRICT_NAME) = 'COIMBATORE'
    """)

    district = cursor.fetchone()

    if not district:
        raise Exception("Coimbatore district not found.")

    district_id = district[0]

    print("District ID   :", district[0])
    print("District Name :", district[1])
    print("State         :", district[2])


    # ============================================================
    # 2. FIND RAINFALL RECORD
    # ============================================================

    print("\n[2] Finding rainfall record...")

    cursor.execute("""
        SELECT
            RAINFALL_ID,
            OBSERVATION_DATE,
            ACTUAL_MM,
            NORMAL_MM,
            DEPARTURE_PERCENT,
            CATEGORY
        FROM RAINFALL_RECORDS
        WHERE DISTRICT_ID = :1
        AND OBSERVATION_DATE = DATE '2026-08-10'
        FETCH FIRST 1 ROW ONLY
    """, (district_id,))

    rainfall = cursor.fetchone()

    if not rainfall:
        raise Exception("Rainfall record not found.")

    rainfall_id = rainfall[0]

    print("Rainfall ID   :", rainfall[0])
    print("Date          :", rainfall[1])
    print("Actual        :", rainfall[2], "mm")
    print("Normal        :", rainfall[3], "mm")
    print("Departure     :", rainfall[4], "%")
    print("Category      :", rainfall[5])


    # ============================================================
    # 3. FIND SOIL GRID CELL
    # ============================================================

    print("\n[3] Finding soil grid cell...")

    # This is the grid cell already obtained from the
    # successful GPS -> soil lookup for the tested location.

    grid_cell_id = 377174

    cursor.execute("""
        SELECT
            GRID_CELL_ID,
            GRID_ROW,
            GRID_COLUMN,
            X_COORDINATE,
            Y_COORDINATE
        FROM SOIL_GRID_CELLS
        WHERE GRID_CELL_ID = :1
    """, (grid_cell_id,))

    grid = cursor.fetchone()

    if not grid:
        raise Exception("Expected soil grid cell 377174 not found.")

    print("Grid Cell ID  :", grid[0])
    print("Grid Row      :", grid[1])
    print("Grid Column   :", grid[2])
    print("X Coordinate  :", grid[3])
    print("Y Coordinate  :", grid[4])


    # ============================================================
    # 4. VERIFY SOIL DATA
    # ============================================================

    print("\n[4] Finding soil data...")

    cursor.execute("""
        SELECT
            SANDY_FRACTION,
            LOAMY_FRACTION,
            CLAYEY_FRACTION,
            ORGANIC_CARBON_KG_M2,
            INORGANIC_CARBON_KG_M2
        FROM SOIL_GRID_DATA
        WHERE GRID_CELL_ID = :1
    """, (grid_cell_id,))

    soil = cursor.fetchone()

    if not soil:
        raise Exception("Soil data not found.")

    print("Sandy fraction :", soil[0])
    print("Loamy fraction :", soil[1])
    print("Clayey fraction:", soil[2])
    print("Organic carbon :", soil[3])
    print("Inorganic carbon:", soil[4])


    # ============================================================
    # 5. START TEST TRANSACTION
    # ============================================================

    print("\n[5] Starting test transaction...")

    cursor.execute("SAVEPOINT RAININTEL_TEST")

    # ============================================================
    # 6. CREATE TEST USER
    # ============================================================

    print("\n[6] Creating test field engineer...")

    cursor.execute("""
        SELECT ROLE_ID
        FROM ROLES
        WHERE ROLE_NAME = 'FIELD_ENGINEER'
    """)

    role = cursor.fetchone()

    if not role:
        raise Exception("FIELD_ENGINEER role not found.")

    role_id = role[0]

    cursor.execute("""
        INSERT INTO USERS (
            USERNAME,
            EMAIL,
            PASSWORD_HASH,
            FULL_NAME,
            ROLE_ID,
            DISTRICT_ID,
            STATUS
        )
        VALUES (
            'test_engineer_rainintel',
            'test@rainintel.local',
            'TEST_HASH',
            'RainIntel Test Engineer',
            :1,
            :2,
            'ACTIVE'
        )
        RETURNING USER_ID INTO :3
    """, (
        role_id,
        district_id,
        cursor.var(int)
    ))

    user_id = cursor.bindvars[2].getvalue()[0]

    print("Test User ID  :", user_id)


    # ============================================================
    # 7. CREATE FIELD ASSESSMENT
    # ============================================================

    print("\n[7] Creating field assessment...")

    latitude = 11.0168
    longitude = 76.9558

    cursor.execute("""
        INSERT INTO FIELD_ASSESSMENTS (
            ENGINEER_ID,
            DISTRICT_ID,
            LATITUDE,
            LONGITUDE,
            ADDRESS,
            BUILDING_TYPE,
            ROOF_AREA_M2,
            ROOF_MATERIAL,
            ROOF_SLOPE,
            WATER_DEMAND_LPD,
            PURPOSE,
            STATUS
        )
        VALUES (
            :1,
            :2,
            :3,
            :4,
            :5,
            :6,
            :7,
            :8,
            :9,
            :10,
            :11,
            'SUBMITTED'
        )
        RETURNING ASSESSMENT_ID INTO :12
    """, (
        user_id,
        district_id,
        latitude,
        longitude,
        "Test Building, Coimbatore",
        "Residential",
        100,
        "RCC",
        5,
        500,
        "Rainwater harvesting feasibility",
        cursor.var(int)
    ))

    assessment_id = cursor.bindvars[11].getvalue()[0]

    print("Assessment ID :", assessment_id)


    # ============================================================
    # 8. CREATE RAINFALL SNAPSHOT
    # ============================================================

    print("\n[8] Creating rainfall snapshot...")

    cursor.execute("""
        INSERT INTO ASSESSMENT_RAINFALL (
            ASSESSMENT_ID,
            RAINFALL_RECORD_ID,
            OBSERVATION_DATE,
            ACTUAL_MM,
            NORMAL_MM,
            DEPARTURE_PERCENT,
            CATEGORY
        )
        VALUES (
            :1,
            :2,
            :3,
            :4,
            :5,
            :6,
            :7
        )
    """, (
        assessment_id,
        rainfall_id,
        rainfall[1],
        rainfall[2],
        rainfall[3],
        rainfall[4],
        rainfall[5]
    ))

    print("Rainfall snapshot created.")


    # ============================================================
    # 9. CREATE SOIL SNAPSHOT
    # ============================================================

    print("\n[9] Creating soil snapshot...")

    cursor.execute("""
        SELECT
            SANDY_FRACTION,
            LOAMY_FRACTION,
            CLAYEY_FRACTION,
            CLAYEY_SKELETAL_FRACTION,
            DEPTH_0_25_FRACTION,
            DEPTH_25_50_FRACTION,
            DEPTH_50_75_FRACTION,
            DEPTH_75_100_FRACTION,
            DEPTH_100_150_FRACTION,
            DEPTH_150_200_FRACTION,
            ORGANIC_CARBON_KG_M2,
            INORGANIC_CARBON_KG_M2
        FROM SOIL_GRID_DATA
        WHERE GRID_CELL_ID = :1
    """, (grid_cell_id,))

    soil_full = cursor.fetchone()

    cursor.execute("""
        INSERT INTO ASSESSMENT_SOIL (
            ASSESSMENT_ID,
            GRID_CELL_ID,
            SANDY_FRACTION,
            LOAMY_FRACTION,
            CLAYEY_FRACTION,
            CLAYEY_SKELETAL_FRACTION,
            DEPTH_0_25_FRACTION,
            DEPTH_25_50_FRACTION,
            DEPTH_50_75_FRACTION,
            DEPTH_75_100_FRACTION,
            DEPTH_100_150_FRACTION,
            DEPTH_150_200_FRACTION,
            ORGANIC_CARBON_KG_M2,
            INORGANIC_CARBON_KG_M2
        )
        VALUES (
            :1, :2, :3, :4, :5, :6,
            :7, :8, :9, :10, :11, :12,
            :13, :14
        )
    """, (
        assessment_id,
        grid_cell_id,
        *soil_full
    ))

    print("Soil snapshot created.")


    # ============================================================
    # 10. CREATE RWH RESULT
    # ============================================================

    print("\n[10] Creating RWH result...")

    roof_area = 100
    rainfall_mm = float(rainfall[2])
    runoff_coefficient = 0.8

    # Simple test calculation only.
    # Backend team will implement the final methodology.

    harvestable_water = (
        roof_area *
        rainfall_mm *
        runoff_coefficient
    )

    cursor.execute("""
        INSERT INTO RWH_RESULTS (
            ASSESSMENT_ID,
            ANNUAL_RAINFALL_MM,
            RUNOFF_COEFFICIENT,
            HARVESTABLE_WATER_L,
            RECHARGE_POTENTIAL_L,
            RECOMMENDED_STORAGE_L,
            CALCULATION_METHOD
        )
        VALUES (
            :1,
            :2,
            :3,
            :4,
            :5,
            :6,
            :7
        )
    """, (
        assessment_id,
        rainfall_mm,
        runoff_coefficient,
        harvestable_water,
        harvestable_water * 0.5,
        harvestable_water,
        "MVP_TEST_CALCULATION"
    ))

    print("RWH result created.")
    print("Test harvestable water:", round(harvestable_water, 2), "L")


    # ============================================================
    # 11. CREATE RECOMMENDATION
    # ============================================================

    print("\n[11] Creating RWH recommendation...")

    cursor.execute("""
        INSERT INTO RWH_RECOMMENDATIONS (
            ASSESSMENT_ID,
            SYSTEM_TYPE,
            STORAGE_CAPACITY_L,
            RECHARGE_TYPE,
            FILTER_TYPE,
            CONFIDENCE_SCORE,
            RECOMMENDATION_REASON
        )
        VALUES (
            :1,
            :2,
            :3,
            :4,
            :5,
            :6,
            :7
        )
    """, (
        assessment_id,
        "Rooftop Rainwater Harvesting",
        harvestable_water,
        "Recharge Pit",
        "Sand + Gravel Filter",
        85,
        "Test recommendation generated from rainfall and soil data."
    ))

    print("Recommendation created.")


    # ============================================================
    # 12. VERIFY COMPLETE CHAIN
    # ============================================================

    print("\n[12] Verifying complete relationship chain...")

    cursor.execute("""
        SELECT
            a.ASSESSMENT_ID,
            u.FULL_NAME,
            d.DISTRICT_NAME,
            ar.ACTUAL_MM,
            aso.GRID_CELL_ID,
            rr.HARVESTABLE_WATER_L,
            rec.SYSTEM_TYPE
        FROM FIELD_ASSESSMENTS a

        JOIN USERS u
            ON u.USER_ID = a.ENGINEER_ID

        JOIN RAINFALL_DISTRICTS d
            ON d.DISTRICT_ID = a.DISTRICT_ID

        JOIN ASSESSMENT_RAINFALL ar
            ON ar.ASSESSMENT_ID = a.ASSESSMENT_ID

        JOIN ASSESSMENT_SOIL aso
            ON aso.ASSESSMENT_ID = a.ASSESSMENT_ID

        JOIN RWH_RESULTS rr
            ON rr.ASSESSMENT_ID = a.ASSESSMENT_ID

        JOIN RWH_RECOMMENDATIONS rec
            ON rec.ASSESSMENT_ID = a.ASSESSMENT_ID

        WHERE a.ASSESSMENT_ID = :1
    """, (assessment_id,))

    result = cursor.fetchone()

    if not result:
        raise Exception("Complete relationship chain verification failed.")

    print("\nCOMPLETE CHAIN VERIFIED")
    print("----------------------------------------")
    print("Assessment ID :", result[0])
    print("Engineer      :", result[1])
    print("District      :", result[2])
    print("Rainfall      :", result[3], "mm")
    print("Soil Grid     :", result[4])
    print("Harvestable   :", result[5], "L")
    print("Recommendation:", result[6])


    # ============================================================
    # 13. ROLLBACK TEST DATA
    # ============================================================

    print("\n[13] Rolling back test data...")

    connection.rollback()

    print("Test data rolled back successfully.")


    # ============================================================
    # 14. VERIFY CLEANUP
    # ============================================================

    cursor.execute("""
        SELECT COUNT(*)
        FROM USERS
        WHERE USERNAME = 'test_engineer_rainintel'
    """)

    remaining_users = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*)
        FROM FIELD_ASSESSMENTS
        WHERE LATITUDE = 11.0168
        AND LONGITUDE = 76.9558
    """)

    remaining_assessments = cursor.fetchone()[0]

    print("\nCleanup verification:")
    print("Test users remaining       :", remaining_users)
    print("Test assessments remaining :", remaining_assessments)


    if remaining_users == 0 and remaining_assessments == 0:
        print("\n" + "=" * 70)
        print("DATABASE END-TO-END TEST PASSED")
        print("=" * 70)
    else:
        print("\nWARNING: Test data still exists.")


except Exception as e:

    print("\n" + "=" * 70)
    print("DATABASE TEST FAILED")
    print("=" * 70)

    print("\nError:")
    print(type(e).__name__, ":", e)

    connection.rollback()

    print("\nTransaction rolled back.")


finally:

    cursor.close()
    connection.close()

    print("\nOracle connection closed.")