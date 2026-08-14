from pathlib import Path
import getpass
import time
import oracledb


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent / "data" / "soil"

BATCH_SIZE = 5000

FILES = {
    "sandy": BASE_DIR / "Soil Texture" / "fsandy.asc",
    "loamy": BASE_DIR / "Soil Texture" / "floamy.asc",
    "clayey": BASE_DIR / "Soil Texture" / "fclayey.asc",
    "clayey_skeletal": BASE_DIR / "Soil Texture" / "fclayskeletal.asc",

    "depth_0_25": BASE_DIR / "Soil Depth" / "fsoildep0_25.asc",
    "depth_25_50": BASE_DIR / "Soil Depth" / "fsoildep25_50.asc",
    "depth_50_75": BASE_DIR / "Soil Depth" / "fsoildep50_75.asc",
    "depth_75_100": BASE_DIR / "Soil Depth" / "fsoildep75_100.asc",
    "depth_100_150": BASE_DIR / "Soil Depth" / "fsoildep100_150.asc",
    "depth_150_200": BASE_DIR / "Soil Depth" / "fsoildep150_200.asc",

    "organic_carbon": BASE_DIR / "Soil Carbon Density" / "meantocd.asc",
    "inorganic_carbon": BASE_DIR / "Soil Carbon Density" / "meanticd.asc",
}


# ============================================================
# READ ASCII GRID
# ============================================================

def read_ascii_grid(path):

    header = {}

    with open(path, "r", encoding="utf-8") as f:

        for _ in range(6):
            line = f.readline().strip()
            key, value = line.split(maxsplit=1)
            header[key.lower()] = value

        values = []

        for line in f:
            for value in line.split():
                values.append(float(value))

    return header, values


# ============================================================
# LOAD DATASETS
# ============================================================

def load_datasets():

    print("=" * 70)
    print("LOADING BHUVAN SOIL DATA")
    print("=" * 70)

    datasets = {}

    for name, path in FILES.items():

        print(f"Reading {name}...")

        if not path.exists():
            raise FileNotFoundError(f"Missing file: {path}")

        header, values = read_ascii_grid(path)

        ncols = int(header["ncols"])
        nrows = int(header["nrows"])
        cellsize = float(header["cellsize"])
        xllcorner = float(header["xllcorner"])
        yllcorner = float(header["yllcorner"])
        nodata = float(header["nodata_value"])

        expected = ncols * nrows

        if len(values) != expected:
            raise ValueError(
                f"{name}: expected {expected} values, "
                f"found {len(values)}"
            )

        datasets[name] = {
            "values": values,
            "ncols": ncols,
            "nrows": nrows,
            "cellsize": cellsize,
            "xllcorner": xllcorner,
            "yllcorner": yllcorner,
            "nodata": nodata,
        }

        print(f"  {nrows} rows × {ncols} columns")

    return datasets


# ============================================================
# VALIDATE GRID
# ============================================================

def validate_grid(datasets):

    reference = datasets["sandy"]

    for name, data in datasets.items():

        for key in [
            "ncols",
            "nrows",
            "cellsize",
            "xllcorner",
            "yllcorner"
        ]:

            if data[key] != reference[key]:

                raise ValueError(
                    f"Grid mismatch: {name} differs in {key}"
                )

    print()
    print("Grid validation successful.")
    print(f"Rows       : {reference['nrows']}")
    print(f"Columns    : {reference['ncols']}")
    print(f"Cell size  : {reference['cellsize']} m")
    print(
        f"Total cells: "
        f"{reference['nrows'] * reference['ncols']}"
    )

    return reference


# ============================================================
# CONVERSION FUNCTIONS
# ============================================================

def fraction(data, index):

    value = data["values"][index]

    if value == data["nodata"]:
        return None

    result = value / 10000.0

    if result < 0 or result > 1:
        raise ValueError(
            f"Invalid fraction {result} at index {index}"
        )

    return result


def carbon(data, index):

    value = data["values"][index]

    if value == data["nodata"]:
        return None

    return value


# ============================================================
# MAIN IMPORT
# ============================================================

start_time = time.time()

print()
print("=" * 70)
print("RAININTEL FULL SOIL DATA IMPORT")
print("=" * 70)

datasets = load_datasets()

reference = validate_grid(datasets)

nrows = reference["nrows"]
ncols = reference["ncols"]
cellsize = reference["cellsize"]
xllcorner = reference["xllcorner"]
yllcorner = reference["yllcorner"]

total_cells = nrows * ncols


# ============================================================
# ORACLE CONNECTION
# ============================================================

print()
print("Connecting to Oracle...")

password = getpass.getpass("Enter RAININTEL password: ")

connection = oracledb.connect(
    user="RAININTEL",
    password=password,
    dsn="127.0.0.1:1521/XEPDB1"
)

cursor = connection.cursor()

print("Connected to Oracle.")


# ============================================================
# CHECK SOURCE
# ============================================================

cursor.execute("""
    SELECT SOURCE_ID
    FROM SOIL_SOURCES
    WHERE SOURCE_NAME = 'Bhuvan / NRSC'
      AND ACTIVE = 'Y'
""")

source_row = cursor.fetchone()

if source_row is None:
    raise RuntimeError(
        "Bhuvan / NRSC source not found."
    )

source_id = source_row[0]

print("Source ID:", source_id)


# ============================================================
# SAFETY CHECK
# ============================================================

cursor.execute(
    "SELECT COUNT(*) FROM SOIL_GRID_CELLS"
)

existing_grid = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM SOIL_GRID_DATA"
)

existing_data = cursor.fetchone()[0]

print()
print("Existing database records:")
print("SOIL_GRID_CELLS:", existing_grid)
print("SOIL_GRID_DATA :", existing_data)

if existing_grid != 0 or existing_data != 0:

    raise RuntimeError(
        "Tables are not empty. Import stopped for safety."
    )


# ============================================================
# INSERT GRID CELLS
# ============================================================

print()
print("=" * 70)
print("INSERTING GRID CELLS")
print("=" * 70)

grid_sql = """
INSERT INTO SOIL_GRID_CELLS
(
    GRID_ROW,
    GRID_COLUMN,
    X_COORDINATE,
    Y_COORDINATE,
    SOURCE_ID
)
VALUES
(
    :1,
    :2,
    :3,
    :4,
    :5
)
"""


grid_batch = []

for index in range(total_cells):

    grid_row = index // ncols + 1
    grid_column = index % ncols + 1

    x = (
        xllcorner
        + (grid_column - 0.5) * cellsize
    )

    y = (
        yllcorner
        + (nrows - grid_row + 0.5) * cellsize
    )

    grid_batch.append(
        (
            grid_row,
            grid_column,
            x,
            y,
            source_id
        )
    )

    if len(grid_batch) >= BATCH_SIZE:

        cursor.executemany(
            grid_sql,
            grid_batch
        )

        grid_batch.clear()

        processed = index + 1

        print(
            f"Grid cells inserted: "
            f"{processed:,}/{total_cells:,}"
        )


if grid_batch:

    cursor.executemany(
        grid_sql,
        grid_batch
    )

    grid_batch.clear()


print("All grid cells inserted.")


# ============================================================
# GET GENERATED GRID IDs
# ============================================================

print()
print("Reading generated GRID_CELL_ID values...")

cursor.execute("""
    SELECT
        GRID_CELL_ID,
        GRID_ROW,
        GRID_COLUMN
    FROM SOIL_GRID_CELLS
    WHERE SOURCE_ID = :1
    ORDER BY GRID_ROW, GRID_COLUMN
""", (source_id,))

grid_ids = {}

for grid_cell_id, grid_row, grid_column in cursor:

    grid_ids[
        (grid_row, grid_column)
    ] = grid_cell_id


if len(grid_ids) != total_cells:

    raise RuntimeError(
        f"Expected {total_cells} grid IDs, "
        f"found {len(grid_ids)}"
    )

print(
    f"Retrieved {len(grid_ids):,} grid cell IDs."
)


# ============================================================
# INSERT SOIL DATA
# ============================================================

print()
print("=" * 70)
print("INSERTING SOIL DATA")
print("=" * 70)

data_sql = """
INSERT INTO SOIL_GRID_DATA
(
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
VALUES
(
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
    :12,
    :13
)
"""


data_batch = []

for index in range(total_cells):

    grid_row = index // ncols + 1
    grid_column = index % ncols + 1

    grid_cell_id = grid_ids[
        (grid_row, grid_column)
    ]

    record = (
        grid_cell_id,

        fraction(
            datasets["sandy"],
            index
        ),

        fraction(
            datasets["loamy"],
            index
        ),

        fraction(
            datasets["clayey"],
            index
        ),

        fraction(
            datasets["clayey_skeletal"],
            index
        ),

        fraction(
            datasets["depth_0_25"],
            index
        ),

        fraction(
            datasets["depth_25_50"],
            index
        ),

        fraction(
            datasets["depth_50_75"],
            index
        ),

        fraction(
            datasets["depth_75_100"],
            index
        ),

        fraction(
            datasets["depth_100_150"],
            index
        ),

        fraction(
            datasets["depth_150_200"],
            index
        ),

        carbon(
            datasets["organic_carbon"],
            index
        ),

        carbon(
            datasets["inorganic_carbon"],
            index
        )
    )

    data_batch.append(record)

    if len(data_batch) >= BATCH_SIZE:

        cursor.executemany(
            data_sql,
            data_batch
        )

        data_batch.clear()

        processed = index + 1

        print(
            f"Soil records inserted: "
            f"{processed:,}/{total_cells:,}"
        )


if data_batch:

    cursor.executemany(
        data_sql,
        data_batch
    )

    data_batch.clear()


print("All soil data inserted.")


# ============================================================
# COMMIT
# ============================================================

print()
print("Committing transaction...")

connection.commit()

print("COMMIT successful.")


# ============================================================
# FINAL VALIDATION
# ============================================================

cursor.execute(
    "SELECT COUNT(*) FROM SOIL_GRID_CELLS"
)

final_grid_count = cursor.fetchone()[0]

cursor.execute(
    "SELECT COUNT(*) FROM SOIL_GRID_DATA"
)

final_data_count = cursor.fetchone()[0]

print()
print("=" * 70)
print("IMPORT COMPLETE")
print("=" * 70)

print(
    f"SOIL_GRID_CELLS : {final_grid_count:,}"
)

print(
    f"SOIL_GRID_DATA  : {final_data_count:,}"
)

if (
    final_grid_count == total_cells
    and final_data_count == total_cells
):

    print()
    print("SUCCESS: All soil grid data imported correctly.")

else:

    print()
    print("WARNING: Record count does not match expected total.")


# ============================================================
# CLOSE
# ============================================================

cursor.close()
connection.close()

elapsed = time.time() - start_time

print()
print(f"Total time: {elapsed:.2f} seconds")
print("Oracle connection closed.")