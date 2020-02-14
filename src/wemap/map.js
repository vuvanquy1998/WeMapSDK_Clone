import getWeMapForm from './form';

import Reverse from './reverse';
import UrlController from './url';

// const config = require('../config.json');

export default class WeMap {
    /**
     * WeMap class contructor
     * @param {*} options
     * Default options: {style: "bright", center: [105.8550736, 21.0283243], zoom: 13, reverse: false}
     */
    constructor(options) {
        options = options || {};
        this.styleLinks = {
            // TODO: get link from config file
            "bright" : "https://apis.wemap.asia/vector-tiles/styles/osm-bright/style.json?key=",
            "dark" : "https://apis.wemap.asia/vector-tiles/styles/osm-bright/style.json?key=",
        }

        this.options = options;
        this.init();
        return this.map;
    }
    
    /**
     * Init WeMap
     */
    init() {
        // console.log(config);
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

        // url controller
        switch (this.options.urlController) {
            case true:
            case false:
                break;
            default:
                this.options.urlController = true;
                break;
        }

        // disable attribution control by default
        this.options.attributionControl = false;

        // create mapbox options object
        var mapboxOptions = Object.assign({}, this.options);
        // map wemap style -> style link + key
        mapboxOptions.style = this.styleLinks[this.options.style] + this.options.key;
        // remove options copied from wemap option
        delete mapboxOptions.reverse;
        delete mapboxOptions.key;
        delete mapboxOptions.urlController;

        // init mapbox
        this.map = new wemapgl.Map(mapboxOptions);

        // custom attribution
        this.map.addControl(new wemapgl.AttributionControl({
            compact: false,
            customAttribution: ["© WeMap"]
        }));

        if(this.options.urlController) {
            var urlParams = UrlController.getParams();
            if(urlParams.x != null
            && urlParams.y != null) {
                // If z param is not given, assign the default value
                if(urlParams.z == null) {
                    urlParams.z = this.map.getZoom();
                } 

                this.map.jumpTo({
                    center: [
                        urlParams.x,
                        urlParams.y
                    ],
                    zoom: urlParams.z
                });

                // This update call is for case that z param is not given in url
                UrlController.updateViewParams(urlParams);
            } else {
                UrlController.updateViewParams({
                    x: this.map.getCenter().lng,
                    y: this.map.getCenter().lat,
                    z: this.map.getZoom()
                });
            }
            this.map.on("zoomend", () => {
                UrlController.updateViewParams({
                    x: this.map.getCenter().lng,
                    y: this.map.getCenter().lat,
                    z: this.map.getZoom()
                });
            });
            this.map.on('moveend', () => {
                UrlController.updateViewParams({
                    x: this.map.getCenter().lng,
                    y: this.map.getCenter().lat,
                    z: this.map.getZoom()
                });
            });
        }

        if(this.options.reverse) {
            this.reverse = new Reverse(this.map, true);
        }
    }

    /**
     * Return false if value a variable is null or undefined
     * @param {any} variable 
     * @returns {Boolean}
     */
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
