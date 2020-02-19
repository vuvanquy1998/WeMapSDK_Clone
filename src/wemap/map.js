import getWeMapForm from './form';

import Reverse from './reverse';
import RightClick from './rightclick';
import UrlController from './url';

import { default as config } from '../config.json';
import API from './api';

export default class WeMap {
    /**
     * WeMap class contructor
     * @param {*} options
     * Default options: {style: "bright", center: [105.8550736, 21.0283243], zoom: 13, reverse: false}
     */
    constructor(options) {
        options = options || {};
        this.styleLinks = {
            "bright": config.style.bright,
            "dark": config.style.dark,
        }
        this.options = options;
        this.init();
        return this.map;
    }

    /**
     * Init WeMap
     */
    init() {
        // center param
        if (!this.isNotNull(this.options.center)) {
            this.options.center = config.center;
        }

        // zoom param
        if (!this.isNotNull(this.options.zoom)) {
            this.options.zoom = config.zoom;
        }

        // style param
        if (this.isNotNull(this.options.style)) {
            this.options.style = this.options.style.toLowerCase();
        }
        switch (this.options.style) {
            case 'dark':
            case 'bright':
                break;
            default:
                this.options.style = config.style.default;
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

        if (this.options.urlController) {
            var urlParams = UrlController.getParams();
            if (urlParams.x != null
                && urlParams.y != null) {
                // If z param is not given, assign the default value
                if (urlParams.z == null) {
                    urlParams.z = this.map.getZoom();
                    UrlController.updateViewParams(urlParams);
                }
            } else {
                UrlController.updateViewParams({
                    x: this.map.getCenter().lng,
                    y: this.map.getCenter().lat,
                    z: this.map.getZoom()
                });
            }

            this.map.jumpTo({center: [urlParams.x, urlParams.y], zoom: urlParams.z});

            if(urlParams.ox != null && urlParams.oy != null && urlParams.dx != null && urlParams.dy != null) {
                if(urlParams.vehicle == null) {
                    // TODO: Set default vechicle
                }
                // TODO: Show directions
            }

            if(urlParams.osmId != null) {
                // TODO: Show detail
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

        if (this.options.reverse) {
            wemapgl.rightClick = new RightClick(this.map, true);
            wemapgl.reverse = new Reverse(this.map)
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

    /**
     * Test wemapgl.API.lookup({...})
     */
    testLookup() {
        API.lookup({ osmId: "123", key: this.options.key }, (data) => {
            console.log(data);
        });
        API.lookup({ osmId: "123", osmType: "W", key: this.options.key }, (data) => {
            console.log(data);
        });
    }
}
