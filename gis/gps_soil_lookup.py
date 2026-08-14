import oracledb
import getpass
from pyproj import CRS, Transformer


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
# TEST GPS LOCATION
# ============================================================

# Example: Chennai
latitude = 13.0827
longitude = 80.2707


x, y = transformer.transform(
    longitude,
    latitude
)

print("=" * 60)
print("GPS → SOIL GRID TEST")
print("=" * 60)

print("Latitude  :", latitude)
print("Longitude :", longitude)

print("\nProjected coordinates:")
print("X :", round(x, 3))
print("Y :", round(y, 3))


# ============================================================
# FIND GRID CELL
# ============================================================

CELL_SIZE = 5000

grid_column = int((x - 895000) // CELL_SIZE) + 1
grid_row = int((4017500 - y) // CELL_SIZE) + 1

print("\nCalculated grid position:")
print("Grid row    :", grid_row)
print("Grid column :", grid_column)


# ============================================================
# CONNECT TO ORACLE
# ============================================================

password = getpass.getpass(
    "\nEnter RAININTEL password: "
)

connection = oracledb.connect(
    user="RAININTEL",
    password=password,
    dsn="127.0.0.1:1521/XEPDB1"
)

cursor = connection.cursor()

print("\nConnected to Oracle.")


# ============================================================
# LOOK UP GRID CELL
# ============================================================

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

    print("\nNo soil grid cell found.")

else:

    print("\nSoil grid cell found:")
    print("GRID_CELL_ID :", grid[0])
    print("GRID_ROW     :", grid[1])
    print("GRID_COLUMN  :", grid[2])
    print("X_COORDINATE :", grid[3])
    print("Y_COORDINATE :", grid[4])


    # ========================================================
    # GET SOIL DATA
    # ========================================================

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

    if soil:

        print("\nSoil properties:")

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
            print(f"{name:30}: {value}")

    else:

        print("\nNo soil data found for this grid cell.")


cursor.close()
connection.close()

print("\nOracle connection closed.")