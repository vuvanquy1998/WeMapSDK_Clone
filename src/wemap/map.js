import getWeMapForm from './form';
import API from './api';

import Reverse from './reverse';

export default class WeMap {
    constructor(options) {
        options = options || {};
        this.styleLinks = {
            // TODO: get link from config file
            "bright" : "https://apis.wemap.asia/vector-tiles/styles/osm-bright/style.json?key=",
            "dark" : "https://apis.wemap.asia/vector-tiles/styles/osm-bright/style.json?key=",
        }

        this.options = options;
        this.init();
    }
    
    /**
     * Init
     */
    init() {
        // center param
        if(!this.isNotNull(this.options.center)) {
            this.options.center = [105.8550736, 21.0283243]; 
        }

        // zoom param
        if(!this.isNotNull(this.options.zoom)) {
            this.options.zoom = 13;
        }

        // style param
        if(this.isNotNull(this.options.style)) {
            this.options.style = this.options.style.toLowerCase();
        }
        switch (this.options.style) {
            case 'dark':
            case 'bright':
                break;
            default:
                this.options.style = 'bright';
                break;
        }

        // reverse
        switch (this.options.reverse) {
            case true:
            case false:
                break;
            default:
                this.options.reverse = false;
                break;
        }

        // disable attribution control by default
        this.options.attributionControl = false;


        // create mapbox options object
        var mapboxOptions = Object.assign({}, this.options);
        // map wemap style -> link + key
        mapboxOptions.style = this.styleLinks[this.options.style] + this.options.key;
        // remove options copied from wemap option
        delete mapboxOptions.reverse;
        delete mapboxOptions.key;

        // init mapbox
        this.map = new wemapgl.Map(mapboxOptions);

        // custom attribution
        this.map.addControl(new mapboxgl.AttributionControl({
            compact: false,
            customAttribution: ["© WeMap"]
        }));

        if(this.options.reverse) {
            this.reverse = new Reverse(this.map);
        }
        
    }

    isNotNull(variable) {
        return (variable != null && variable != undefined) ? true : false;

    }

    /**
     * Returns the origin of the current route.
     * @returns {Object} origin
     */
    showForm() {
        return getWeMapForm();
    }
}
