import oracledb
import getpass

password = getpass.getpass("Enter RAININTEL password: ")

connection = oracledb.connect(
    user="RAININTEL",
    password=password,
    dsn="127.0.0.1:1521/XEPDB1"
)

cursor = connection.cursor()

cursor.execute("""
MERGE INTO SOIL_SOURCES s
USING (
    SELECT
        'IMD District Rainfall' AS SOURCE_NAME,
        'India Meteorological Department' AS ORGANIZATION,
        'District-wise Rainfall' AS DATASET_NAME,
        0 AS RESOLUTION_M,
        'JSON/HTML' AS DATA_FORMAT,
        'https://mausam.imd.gov.in/' AS SOURCE_URL
    FROM dual
) x
ON (
    s.SOURCE_NAME = x.SOURCE_NAME
)
WHEN NOT MATCHED THEN
    INSERT (
        SOURCE_NAME,
        ORGANIZATION,
        DATASET_NAME,
        RESOLUTION_M,
        DATA_FORMAT,
        SOURCE_URL,
        ACTIVE
    )
    VALUES (
        x.SOURCE_NAME,
        x.ORGANIZATION,
        x.DATASET_NAME,
        x.RESOLUTION_M,
        x.DATA_FORMAT,
        x.SOURCE_URL,
        'Y'
    )
""")

connection.commit()

cursor.execute("""
SELECT SOURCE_ID, SOURCE_NAME, ORGANIZATION
FROM SOIL_SOURCES
WHERE SOURCE_NAME = 'IMD District Rainfall'
""")

row = cursor.fetchone()

print("\nIMD source created/found successfully.")
print("SOURCE_ID    :", row[0])
print("SOURCE_NAME  :", row[1])
print("ORGANIZATION :", row[2])

cursor.close()
connection.close()

print("\nOracle connection closed.")