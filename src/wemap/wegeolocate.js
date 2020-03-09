import GeolocateControl from "../ui/control/geolocate_control"
import { default as config } from '../config.json';

export default class WeGeolocateControl {
    constructor(options) {
        options = options || {};
        this.options = options;
        this.accuracyUpperLimit = config.rerank.accuracyUpperLimit;
        this.prevAccuracy = this.accuracyUpperLimit;
        this.isUpdated = false;
        this.init();
        return this.geolocateControl;
    }
    init() {
        this.geolocateControl = new GeolocateControl(this.options);
        this.geolocateControl.on("geolocate", (data) => {
            if(this.isUpdated) {
                
            } else {

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