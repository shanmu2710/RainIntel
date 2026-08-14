import json
import re
import getpass
import oracledb

from shapely.geometry import shape, Point
from pyproj import CRS, Transformer


# ============================================================
# CONFIGURATION
# ============================================================

GEOJSON_FILE = "india_districts.geojson"

ORACLE_DSN = "127.0.0.1:1521/XEPDB1"
ORACLE_USER = "RAININTEL"

CELL_SIZE = 5000


# ============================================================
# SOIL GRID PROJECTION
# ============================================================

soil_crs = CRS.from_proj4(
    "+proj=aea "
    "+lat_1=28 "
    "+lat_2=12 "
    "+lat_0=20 "
    "+lon_0=78 "
    "+x_0=2000000 "
    "+y_0=2000000 "
    "+datum=WGS84 "
    "+units=m "
    "+no_defs"
)

wgs84 = CRS.from_epsg(4326)

transformer = Transformer.from_crs(
    wgs84,
    soil_crs,
    always_xy=True
)


# ============================================================
# LOAD DISTRICT POLYGONS
# ============================================================

print("Loading India district boundaries...")

with open(GEOJSON_FILE, encoding="utf-8") as f:
    geojson = json.load(f)

districts = []

for feature in geojson["features"]:

    properties = feature["properties"]
    geometry = feature["geometry"]

    polygon = shape(geometry)

    districts.append({
        "name": properties.get("shapeName"),
        "polygon": polygon
    })

print("District boundaries loaded:", len(districts))


# ============================================================
# FIND DISTRICT FROM GPS
# ============================================================

def find_district(latitude, longitude):

    point = Point(longitude, latitude)

    for district in districts:

        # covers() also handles points exactly on a boundary
        if district["polygon"].covers(point):

            return district["name"]

    return None


# ============================================================
# NORMALIZE DISTRICT NAME
# ============================================================

def normalize_name(name):

    if not name:
        return ""

    name = name.upper().strip()

    name = name.replace("&", "AND")
    name = name.replace("-", " ")

    name = re.sub(r"[^A-Z0-9 ]", " ", name)
    name = re.sub(r"\s+", " ", name)

    return name.strip()


# ============================================================
# FIND IMD DISTRICT
# ============================================================

def find_imd_district(cursor, district_name):

    normalized = normalize_name(district_name)

    cursor.execute("""
        SELECT
            DISTRICT_ID,
            DISTRICT_NAME
        FROM RAINFALL_DISTRICTS
    """)

    rows = cursor.fetchall()

    for district_id, db_name in rows:

        if normalize_name(db_name) == normalized:

            return district_id, db_name

    return None


# ============================================================
# GET RAINFALL
# ============================================================

def get_rainfall(cursor, district_id):

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
        ORDER BY OBSERVATION_DATE DESC
        FETCH FIRST 1 ROW ONLY
    """, (district_id,))

    return cursor.fetchone()


# ============================================================
# GET SOIL GRID
# ============================================================

def get_soil(cursor, latitude, longitude):

    # Convert GPS → soil projection
    x, y = transformer.transform(
        longitude,
        latitude
    )

    # Calculate grid position
    grid_column = int(
        (x - 895000) // CELL_SIZE
    ) + 1

    grid_row = int(
        (4017500 - y) // CELL_SIZE
    ) + 1

    # Find grid cell
    cursor.execute("""
        SELECT
            GRID_CELL_ID,
            GRID_ROW,
            GRID_COLUMN,
            X_COORDINATE,
            Y_COORDINATE
        FROM SOIL_GRID_CELLS
        WHERE GRID_ROW = :1
        AND GRID_COLUMN = :2
    """, (grid_row, grid_column))

    grid = cursor.fetchone()

    if grid is None:
        return {
            "projected_x": x,
            "projected_y": y,
            "grid_row": grid_row,
            "grid_column": grid_column,
            "grid": None,
            "soil": None
        }

    # Get soil data
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
    """, (grid[0],))

    soil = cursor.fetchone()

    return {
        "projected_x": x,
        "projected_y": y,
        "grid_row": grid_row,
        "grid_column": grid_column,
        "grid": grid,
        "soil": soil
    }


# ============================================================
# MAIN
# ============================================================

print()
print("=" * 70)
print("RAININTEL LOCATION ASSESSMENT - MVP")
print("=" * 70)

latitude = float(
    input("Enter latitude: ")
)

longitude = float(
    input("Enter longitude: ")
)


# ============================================================
# GPS → DISTRICT
# ============================================================

print()
print("Finding district...")

district_name = find_district(
    latitude,
    longitude
)

if district_name is None:

    print("No district polygon found for this GPS location.")
    exit()

print("District:", district_name)


# ============================================================
# ORACLE CONNECTION
# ============================================================

print()
print("Connecting to Oracle...")

password = getpass.getpass(
    "Enter RAININTEL password: "
)

connection = oracledb.connect(
    user=ORACLE_USER,
    password=password,
    dsn=ORACLE_DSN
)

cursor = connection.cursor()

print("Connected to Oracle.")


# ============================================================
# DISTRICT → IMD
# ============================================================

print()
print("Finding IMD district...")

imd = find_imd_district(
    cursor,
    district_name
)

if imd is None:

    print()
    print("WARNING: District was found from GPS,")
    print("but no matching IMD district was found.")

    print()
    print("GPS District :", district_name)
    print("Rainfall     : Not available")

    rainfall = None

else:

    district_id, imd_name = imd

    print("IMD District :", imd_name)
    print("District ID  :", district_id)

    rainfall = get_rainfall(
        cursor,
        district_id
    )


# ============================================================
# SOIL LOOKUP
# ============================================================

print()
print("Finding soil information...")

soil_result = get_soil(
    cursor,
    latitude,
    longitude
)


# ============================================================
# FINAL RESULT
# ============================================================

print()
print("=" * 70)
print("RAININTEL RESULT")
print("=" * 70)

print()
print("LOCATION")
print("-" * 70)

print("Latitude  :", latitude)
print("Longitude :", longitude)
print("District  :", district_name)


# ------------------------------------------------------------
# RAINFALL
# ------------------------------------------------------------

print()
print("RAINFALL")
print("-" * 70)

if rainfall:

    (
        rainfall_id,
        observation_date,
        actual,
        normal,
        departure,
        category
    ) = rainfall

    print("Observation date :", observation_date.date())
    print("Actual rainfall  :", actual, "mm")
    print("Normal rainfall  :", normal, "mm")
    print("Departure        :", departure, "%")
    print("Category         :", category)

else:

    print("Rainfall data not available.")


# ------------------------------------------------------------
# SOIL
# ------------------------------------------------------------

print()
print("SOIL")
print("-" * 70)

if soil_result["grid"] is None:

    print("No soil grid cell found.")

else:

    grid = soil_result["grid"]

    print("Grid Cell ID :", grid[0])
    print("Grid Row     :", grid[1])
    print("Grid Column  :", grid[2])

    soil = soil_result["soil"]

    if soil:

        names = [
            "Sandy fraction",
            "Loamy fraction",
            "Clayey fraction",
            "Clayey skeletal fraction",
            "Depth 0-25 fraction",
            "Depth 25-50 fraction",
            "Depth 50-75 fraction",
            "Depth 75-100 fraction",
            "Depth 100-150 fraction",
            "Depth 150-200 fraction",
            "Organic carbon kg/m²",
            "Inorganic carbon kg/m²"
        ]

        for name, value in zip(names, soil):

            print(
                f"{name:30}: {value}"
            )

    else:

        print("No soil data found.")


# ============================================================
# CLOSE
# ============================================================

cursor.close()
connection.close()

print()
print("=" * 70)
print("RainIntel assessment complete.")
print("Oracle connection closed.")
print("=" * 70)