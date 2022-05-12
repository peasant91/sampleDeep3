export const SpeedSchema = {
  name: "Speed",
  properties: {
    date: "string",
    speed: "double",
  },
  primaryKey: "date",
}

export const DistanceSchema = {
  name: "Distance",
  properties: {
    date: "string",
    lat: "double",
    lng: "double",
    distance: "double"
  },
  primaryKey: "date",
}