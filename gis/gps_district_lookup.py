import json
from shapely.geometry import shape, Point


# ============================================================
# LOAD INDIA DISTRICT BOUNDARIES
# ============================================================

print("Loading district boundaries...")

with open("india_districts.geojson", encoding="utf-8") as f:
    data = json.load(f)

districts = []

for feature in data["features"]:

    properties = feature["properties"]
    geometry = feature["geometry"]

    polygon = shape(geometry)

    districts.append({
        "name": properties.get("shapeName"),
        "polygon": polygon
    })

print("Districts loaded:", len(districts))


# ============================================================
# GPS → DISTRICT
# ============================================================

def find_district(latitude, longitude):

    point = Point(longitude, latitude)

    for district in districts:

        if district["polygon"].contains(point):

            return district["name"]

    return None


# ============================================================
# TEST
# ============================================================

print()
print("=" * 60)
print("GPS DISTRICT LOOKUP TEST")
print("=" * 60)

latitude = float(input("Enter latitude: "))
longitude = float(input("Enter longitude: "))

district = find_district(latitude, longitude)

print()

if district:

    print("GPS location :", latitude, longitude)
    print("District     :", district)

else:

    print("No district found for this GPS location.")


print("=" * 60)