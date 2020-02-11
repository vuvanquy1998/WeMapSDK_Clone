import getWeMapForm from './form';
import Reverse from './reverse';
export default class WeMap {

    constructor(options) {
        options = options || {};
        this.reverse = false;
        this.options = {};

        if (options.params) {
            this.params = options.params;
        }

        this.init();
    }

    /**
     * Returns the origin of the current route.
     * @returns {Object} origin
     */
    showForm() {
        return getWeMapForm();
    }
    init(){
        wemapgl.accessToken = "pk.eyJ1IjoicGh1b25naHgiLCJhIjoiY2s2N3IxMnNiMWdlbTNlcW8ybG5jaXU4MCJ9.CkMLijVJ1Lp2ZbaR0zDgrg";
        let reverse = this.params.reverse;
        let wm = new wemapgl.Map({
            container: 'map',
            style: 'https://apis.wemap.asia/vector-tiles/styles/osm-bright/style.json?key=IqzJukzUWpWrcDHJeDpUPLSGndDx',
            center: [-79.4512, 43.6568],
            zoom: 13
        });
        console.log("init map")
        if(reverse){
            wm = new Reverse(wm).init();
        }
        return wm;
    }
}
