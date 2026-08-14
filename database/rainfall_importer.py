import urllib.request
import re
import html
import getpass
import oracledb
from datetime import date

IMD_URL = "https://mausam.imd.gov.in/imd_latest/contents/rainfallinformation.php"

print("=" * 70)
print("RAININTEL - FULL IMD RAINFALL IMPORT")
print("=" * 70)

# ------------------------------------------------------------
# DOWNLOAD IMD PAGE
# ------------------------------------------------------------

print("\nDownloading IMD rainfall page...")

request = urllib.request.Request(
    IMD_URL,
    headers={"User-Agent": "Mozilla/5.0"}
)

with urllib.request.urlopen(request, timeout=30) as response:
    page = response.read().decode("utf-8", errors="ignore")

print("Page downloaded:", len(page), "bytes")


# ------------------------------------------------------------
# GET IMD DATE
# ------------------------------------------------------------

date_match = re.search(
    r'Daily\s*\(\s*(\d{2})-(\d{2})-(\d{4})\s*\)',
    page,
    re.IGNORECASE
)

if not date_match:
    raise RuntimeError("Could not find IMD observation date.")

observation_date = date(
    int(date_match.group(3)),
    int(date_match.group(2)),
    int(date_match.group(1))
)

print("IMD observation date:", observation_date)


# ------------------------------------------------------------
# PARSE DISTRICTS
# ------------------------------------------------------------

pattern = re.compile(
    r'"title"\s*:\s*"(?P<title>[^"]+)"'
    r'.*?'
    r'"id"\s*:\s*"(?P<id>\d+)"'
    r'.*?'
    r'"info"\s*:\s*"(?P<info>[^"]*)"'
    r'.*?'
    r'"balloonText"\s*:\s*"(?P<balloon>[^"]*)"',
    re.DOTALL
)

matches = list(pattern.finditer(page))

print("Records found:", len(matches))


records = []
unique_records = {}

for match in matches:

    district_name = html.unescape(
        match.group("title")
    ).strip()

    district_id = int(match.group("id"))

    balloon = html.unescape(
        match.group("balloon")
    )

    # Actual rainfall
    actual_match = re.search(
        r"Actual\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*mm",
        balloon,
        re.IGNORECASE
    )

    actual = (
        float(actual_match.group(1))
        if actual_match
        else None
    )

    # Normal rainfall
    normal_match = re.search(
        r"Normal\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*mm",
        balloon,
        re.IGNORECASE
    )

    normal = (
        float(normal_match.group(1))
        if normal_match
        else None
    )

    # Departure
    departure_match = re.search(
        r"Departure\s*:\s*([^<]+)",
        balloon,
        re.IGNORECASE
    )

    departure = None

    if departure_match:
        text = (
            departure_match.group(1)
            .replace("%", "")
            .strip()
        )

        try:
            departure = float(text)
        except ValueError:
            departure = None

    # Category
    if departure is None:
        category = "NR"
    elif departure >= 60:
        category = "LE"
    elif departure >= 20:
        category = "E"
    elif departure >= -19:
        category = "N"
    elif departure >= -59:
        category = "D"
    elif departure >= -99:
        category = "LD"
    else:
        category = "NR"

    unique_records[district_id] = {
        "district_id": district_id,
        "district_name": district_name,
        "actual": actual,
        "normal": normal,
        "departure": departure,
        "category": category
    }


records = list(unique_records.values())

print("Unique districts:", len(records))


# ------------------------------------------------------------
# CONNECT TO ORACLE
# ------------------------------------------------------------

print("\nConnecting to Oracle...")

password = getpass.getpass(
    "Enter RAININTEL password: "
)

connection = oracledb.connect(
    user="RAININTEL",
    password=password,
    dsn="127.0.0.1:1521/XEPDB1"
)

cursor = connection.cursor()

print("Connected to Oracle.")


# ------------------------------------------------------------
# SOURCE ID
# ------------------------------------------------------------

cursor.execute("""
    SELECT SOURCE_ID
    FROM SOIL_SOURCES
    WHERE SOURCE_NAME = 'IMD District Rainfall'
      AND ACTIVE = 'Y'
""")

row = cursor.fetchone()

if row is None:
    raise RuntimeError(
        "IMD District Rainfall source not found."
    )

source_id = row[0]

print("IMD Source ID:", source_id)


# ------------------------------------------------------------
# DISTRICT MERGE
# ------------------------------------------------------------

district_sql = """
MERGE INTO RAINFALL_DISTRICTS d
USING (
    SELECT :1 AS district_id,
           :2 AS district_name
    FROM dual
) s
ON (
    d.DISTRICT_ID = s.district_id
)
WHEN MATCHED THEN
    UPDATE SET
        d.DISTRICT_NAME = s.district_name
WHEN NOT MATCHED THEN
    INSERT (
        DISTRICT_ID,
        DISTRICT_NAME
    )
    VALUES (
        s.district_id,
        s.district_name
    )
"""


# ------------------------------------------------------------
# RAINFALL MERGE
# ------------------------------------------------------------

rainfall_sql = """
MERGE INTO RAINFALL_RECORDS r
USING (
    SELECT
        :1 AS district_id,
        :2 AS observation_date,
        :3 AS actual_mm,
        :4 AS normal_mm,
        :5 AS departure_percent,
        :6 AS category,
        :7 AS source_id
    FROM dual
) s
ON (
    r.DISTRICT_ID = s.district_id
    AND r.OBSERVATION_DATE = s.observation_date
    AND r.SOURCE_ID = s.source_id
)
WHEN MATCHED THEN
    UPDATE SET
        r.ACTUAL_MM = s.actual_mm,
        r.NORMAL_MM = s.normal_mm,
        r.DEPARTURE_PERCENT = s.departure_percent,
        r.CATEGORY = s.category
WHEN NOT MATCHED THEN
    INSERT (
        DISTRICT_ID,
        OBSERVATION_DATE,
        ACTUAL_MM,
        NORMAL_MM,
        DEPARTURE_PERCENT,
        CATEGORY,
        SOURCE_ID
    )
    VALUES (
        s.district_id,
        s.observation_date,
        s.actual_mm,
        s.normal_mm,
        s.departure_percent,
        s.category,
        s.source_id
)
"""


# ------------------------------------------------------------
# IMPORT ALL RECORDS
# ------------------------------------------------------------

print("\nImporting all rainfall records...")

for i, record in enumerate(records, start=1):

    cursor.execute(
        district_sql,
        (
            record["district_id"],
            record["district_name"]
        )
    )

    cursor.execute(
        rainfall_sql,
        (
            record["district_id"],
            observation_date,
            record["actual"],
            record["normal"],
            record["departure"],
            record["category"],
            source_id
        )
    )

    if i % 100 == 0:
        print(
            f"Processed {i}/{len(records)}"
        )


# ------------------------------------------------------------
# COMMIT
# ------------------------------------------------------------

connection.commit()

print("\n" + "=" * 70)
print("FULL IMPORT COMMITTED")
print("=" * 70)


# ------------------------------------------------------------
# VERIFY
# ------------------------------------------------------------

cursor.execute("""
    SELECT COUNT(*)
    FROM RAINFALL_DISTRICTS
""")

district_count = cursor.fetchone()[0]

cursor.execute("""
    SELECT COUNT(*)
    FROM RAINFALL_RECORDS
    WHERE OBSERVATION_DATE = :1
      AND SOURCE_ID = :2
""", (observation_date, source_id))

rainfall_count = cursor.fetchone()[0]

print("Districts in database :", district_count)
print("Rainfall records      :", rainfall_count)
print("IMD observation date  :", observation_date)

cursor.close()
connection.close()

print("\nOracle connection closed.")