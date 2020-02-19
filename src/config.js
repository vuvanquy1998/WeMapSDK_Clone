export const config = {
    "style" : {
        "default" : "https://link-to-default-style",
        "streets" : "https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token="
    },
    "reverse": "https://apis.wemap.asia/we-tools/reverse?key=",
    "lookup": "http://apis.wemap.asia/we-tools/lookup?key=",
    "lookupOsmIdOnly": "https://apis.wemap.asia/we-tools/lookup/",
    "center": [
        105.8550736,
        21.0283243
    ],
    "zoom": 13,
    "direction" : {
        "engine" : {
            "default" : "https://apis.wemap.asia/direction-api/route/v1",
            "osrm" : "https://apis.wemap.asia/direction-api/route/v1",
            "graphhopper" : "",
            "mapbox" : "https://api.mapbox.com/directions/v5/"
        },
        "geocoder" : {
            "default" : "https://apis.wemap.asia/geocode-1/autocomplete?text=",
            "pelias" : "",
            "mapbox" : "https://api.mapbox.com/geocoding/v5/mapbox.places"
        }
    },
    "language" : {
        "vi" : "vi-VN",
        "en" : "en-US"
    }
}
