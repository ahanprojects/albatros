export interface Feature {
  geometry: {
      coordinates: [number, number];  // Array of two numbers (longitude and latitude)
      type: string;  // Type should be "Point"
  };
  type: string;  // Type should be "Feature"
  properties: {
      osm_type: string;
      osm_id: number;
      country: string;
      osm_key: string;
      countrycode: string;
      osm_value: string;
      name: string;
      county: string;
      state: string;
      type: string;  // Type should be "city"
  };
}

export const FEATURE_DATA: Feature[] = [
  {
    "geometry": {
      "coordinates": [
        107.0454095,
        -6.4798265
      ],
      "type": "Point"
    },
    "type": "Feature",
    "properties": {
      "osm_type": "N",
      "osm_id": 1308679028,
      "country": "Indonesia",
      "osm_key": "place",
      "countrycode": "ID",
      "osm_value": "village",
      "name": "Jonggol",
      "county": "Bogor",
      "state": "West Java",
      "type": "city"
    }
  },
  {
    "geometry": {
      "coordinates": [
        111.3784347,
        -7.9507208
      ],
      "type": "Point"
    },
    "type": "Feature",
    "properties": {
      "osm_type": "N",
      "osm_id": 1308637995,
      "country": "Indonesia",
      "osm_key": "place",
      "countrycode": "ID",
      "osm_value": "village",
      "name": "Jonggol",
      "county": "Ponorogo",
      "state": "East Java",
      "type": "city"
    }
  },
  {
    "geometry": {
      "coordinates": [
        107.02826165905826,
        -6.50818065
      ],
      "type": "Point"
    },
    "type": "Feature",
    "properties": {
      "osm_type": "R",
      "osm_id": 14768427,
      "country": "Indonesia",
      "osm_key": "boundary",
      "countrycode": "ID",
      "osm_value": "administrative",
      "name": "Jonggol",
      "county": "Bogor",
      "state": "West Java",
      "type": "city"
    }
  },
  {
    "geometry": {
      "coordinates": [
        99.2911558,
        1.715526
      ],
      "type": "Point"
    },
    "type": "Feature",
    "properties": {
      "osm_type": "N",
      "osm_id": 1308294471,
      "country": "Indonesia",
      "osm_key": "place",
      "countrycode": "ID",
      "osm_value": "village",
      "name": "Jonggol Jae",
      "county": "South Tapanuli",
      "state": "North Sumatra",
      "type": "city"
    }
  },
]