import sys
import json
from pathlib import Path
from pyproj import CRS, Transformer
from shapely.geometry import shape, Point

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Latitude and longitude arguments are required"}))
        return

    try:
        latitude = float(sys.argv[1])
        longitude = float(sys.argv[2])
    except ValueError:
        print(json.dumps({"error": "Invalid latitude or longitude"}))
        return

    # Define the AEA coordinate system used for soil grid
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
    transformer = Transformer.from_crs(wgs84, soil_crs, always_xy=True)

    # Perform projection
    x, y = transformer.transform(longitude, latitude)

    # Calculate grid position
    CELL_SIZE = 5000
    grid_column = int((x - 895000) // CELL_SIZE) + 1
    grid_row = int((4017500 - y) // CELL_SIZE) + 1

    # Load boundaries to locate the district name
    script_dir = Path(__file__).resolve().parent
    geojson_path = script_dir / "india_districts.geojson"

    district_name = None
    if geojson_path.exists():
        try:
            with open(geojson_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            point = Point(longitude, latitude)
            for feature in data["features"]:
                properties = feature["properties"]
                geometry = feature["geometry"]
                polygon = shape(geometry)
                if polygon.contains(point):
                    district_name = properties.get("shapeName")
                    break
        except Exception as e:
            # Catch parsing issues
            district_name = None

    result = {
        "latitude": latitude,
        "longitude": longitude,
        "xCoordinate": x,
        "yCoordinate": y,
        "gridRow": grid_row,
        "gridColumn": grid_column,
        "districtName": district_name
    }
    print(json.dumps(result))

if __name__ == "__main__":
    main()
