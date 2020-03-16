import GeolocateControl from "../ui/control/geolocate_control"
import { default as config } from '../config.json';

export default class WeGeolocateControl {
    constructor(options) {
        options = options || {};
        this.options = options;
        this.prevAccuracy = config.rerank.accuracyUpperLimit;
        this.init();
        return this.geolocateControl;
    }
    init() {
        this.geolocateControl = new GeolocateControl(this.options);
        this.geolocateControl.on("geolocate", (data) => {
            if(data.accuracy < this.prevAccuracy) {
                this.send(data);
                this.prevAccuracy = data.accuracy;
            }
        });
    }
    send(data) {
        var req = new XMLHttpRequest();
        req.open("POST", config.rerank.iploc);
        req.send(JSON.stringify({
            "lat": data.coords.latitude,
            "lng": data.coords.longitude,
            "accuracy": data.coords.accuracy
        }));
    }
}