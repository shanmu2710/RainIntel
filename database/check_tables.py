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
    SELECT table_name
    FROM user_tables
    WHERE table_name IN (
        'SOIL_SOURCES',
        'SOIL_GRID_CELLS',
        'SOIL_TEXTURE_CLASSES',
        'SOIL_DEPTH_CLASSES',
        'SOIL_GRID_DATA'
    )
    ORDER BY table_name
""")

print("\nRainIntel soil tables:")
for row in cursor:
    print("  ", row[0])

cursor.execute("SELECT COUNT(*) FROM SOIL_GRID_CELLS")
print("\nSOIL_GRID_CELLS:", cursor.fetchone()[0])

cursor.execute("SELECT COUNT(*) FROM SOIL_GRID_DATA")
print("SOIL_GRID_DATA :", cursor.fetchone()[0])

cursor.close()
connection.close()

print("\nDatabase check completed successfully.")