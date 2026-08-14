import oracledb
import getpass

password = getpass.getpass("Enter RAININTEL password: ")

connection = oracledb.connect(
    user="RAININTEL",
    password=password,
    dsn="127.0.0.1:1521/XEPDB1"
)

cursor = connection.cursor()

def check_table_count(table_name):
    try:
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        return cursor.fetchone()[0]
    except Exception:
        return "Table not created/accessible"

# 1. Counts
print("\nDatabase Table Counts:")
print(f"  SOIL_GRID_CELLS    : {check_table_count('SOIL_GRID_CELLS')}")
print(f"  SOIL_GRID_DATA     : {check_table_count('SOIL_GRID_DATA')}")
print(f"  RAINFALL_DISTRICTS : {check_table_count('RAINFALL_DISTRICTS')}")
print(f"  RAINFALL_RECORDS   : {check_table_count('RAINFALL_RECORDS')}")
print(f"  USERS              : {check_table_count('USERS')}")
print(f"  ASSESSMENTS        : {check_table_count('ASSESSMENTS')}")


# 2. Grid samples
print("\nFirst 5 grid cells:")
cursor.execute("""
    SELECT
        GRID_CELL_ID,
        GRID_ROW,
        GRID_COLUMN,
        X_COORDINATE,
        Y_COORDINATE
    FROM SOIL_GRID_CELLS
    ORDER BY GRID_CELL_ID
    FETCH FIRST 5 ROWS ONLY
""")

for row in cursor:
    print(row)


# 3. Soil data samples
print("\nFirst 5 soil records:")
cursor.execute("""
    SELECT
        GRID_CELL_ID,
        SANDY_FRACTION,
        LOAMY_FRACTION,
        CLAYEY_FRACTION,
        CLAYEY_SKELETAL_FRACTION,
        DEPTH_0_25_FRACTION,
        DEPTH_25_50_FRACTION,
        ORGANIC_CARBON_KG_M2,
        INORGANIC_CARBON_KG_M2
    FROM SOIL_GRID_DATA
    ORDER BY GRID_CELL_ID
    FETCH FIRST 5 ROWS ONLY
""")

for row in cursor:
    print(row)


# 4. Check foreign-key relationship
print("\nChecking matching grid/data records:")

cursor.execute("""
    SELECT COUNT(*)
    FROM SOIL_GRID_CELLS c
    JOIN SOIL_GRID_DATA d
      ON c.GRID_CELL_ID = d.GRID_CELL_ID
""")

print("Matching records:", cursor.fetchone()[0])


# 5. Check fraction ranges
print("\nChecking fraction ranges:")

cursor.execute("""
    SELECT
        MIN(SANDY_FRACTION),
        MAX(SANDY_FRACTION),
        MIN(LOAMY_FRACTION),
        MAX(LOAMY_FRACTION),
        MIN(CLAYEY_FRACTION),
        MAX(CLAYEY_FRACTION)
    FROM SOIL_GRID_DATA
""")

print(cursor.fetchone())


cursor.close()
connection.close()

print("\nVerification completed.")