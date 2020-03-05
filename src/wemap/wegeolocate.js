import GeolocateControl from "../ui/control/geolocate_control"

export default class WeGeolocateControl {
    constructor(options) {
        this.options = options || {};
        this.init();
        return this.geolocateControl;
    }
    init() {
        this.geolocateControl = new GeolocateControl(options);
    }
}