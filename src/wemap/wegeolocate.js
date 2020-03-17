import GeolocateControl from "../ui/control/geolocate_control"
import { default as config } from '../config.json';
import { makeRequest } from '../util/ajax';

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
            if(data.coords.accuracy < this.prevAccuracy) {
                this.send(data);
                this.prevAccuracy = data.coords.accuracy;
            }
        });
    }
    send(data) {
        let bodyJSON = JSON.stringify({
            "lat": data.coords.latitude,
            "lng": data.coords.longitude,
            "accuracy": data.coords.accuracy,
            "src": "wemap"
        });
        makeRequest({
            url: config.rerank.iploc,
            method: "POST",
            body: bodyJSON
        }, (err, res) => {});
    };
   
}