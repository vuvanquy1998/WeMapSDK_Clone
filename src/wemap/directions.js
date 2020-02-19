// import * as json from '../../config.json';
// const {config} = json;
import { default as config } from '../config.json';

// const config = require('../config.json');
import MapboxDirections from '../mapbox-gl-directions/dist/mapbox-gl-directions';
import UrlController from "./url";

// import updateRouteParams from './url';

/**
 * WeDirections
 */
export default class WeDirections {

    constructor(options) {
        options = options || {};

        this.options = options || {};

        this.options.accessToken = options.key || '';
        this.options.placeholderOrigin = options.placeholderOrigin || 'Chọn điểm bắt đầu';
        this.options.placeholderDestination = options.placeholderDestination || 'Chọn điểm kết thúc';
        this.options.engine = ['default', 'osrm', 'graphhopper', 'mapbox'].includes(options.engine) ? options.engine : 'osrm';

        this.options.geocoder = options.geocoder || {};
        this.options.mode = options.mode || 'driving';

        this.options.geocoder.engine = this._geocodeEngine(this.options.geocoder.engine);
        this.options.geocoder.api = this._geocodeApi(this.options.geocoder.engine, this.options.geocoder.api);
        this.options.api = this._apiEngine(this.options.engine);

        this._onRendered(this.options.mode);
        this._onChange(this.options.engine);
        return this.render(this.options)
    }

    /**
     * render function
     * Render UI Direction
     * @returns {Object} origin
     */
    render(options) {
        document.getElementById('start').style.display ="block";
        document.getElementById('end').style.display ="block";

        return  new MapboxDirections(options);
    }

    /**
     * Check active default drive mode
     * @param mode
     * @private
     */
    _onRendered(mode) {
        window.addEventListener('DOMContentLoaded', function(){
            const traffic = document.getElementById('mapbox-directions-profile-driving-traffic');
            const driving = document.getElementById('mapbox-directions-profile-driving');
            const walking = document.getElementById('mapbox-directions-profile-walking');
            const cycling = document.getElementById('mapbox-directions-profile-cycling');
            if (mode === 'traffic') {
                traffic.checked = true;
            } else if (mode === 'driving') {
                driving.checked = true;
            } else if (mode === 'walking') {
                walking.checked = true;
            } else if (mode === 'cycling') {
                cycling.checked = true;
            }
        });
    }

    /**
     * Check change value in input direction
     * @private
     */
    _onChange() {
        window.addEventListener('DOMContentLoaded', function(){

            var start = document.getElementById('mapbox-directions-origin-input');
            var end = document.getElementById('mapbox-directions-destination-input');
            let latlonStart = '';
            let latlonEnd = '';

            start.addEventListener('change', () => {
                latlonStart = start.querySelectorAll('input')[0].value;
                console.log('latlonStart: ', latlonStart);
            });

            end.addEventListener('change', () => {
                latlonEnd = end.querySelectorAll('input')[0].value;
                console.log('latlonEnd: ', latlonEnd);
            });

        });
    }

    /**
     * Return API Engine
     * @returns {string}
     * @private
     */
    _apiEngine(engine) {
        let api = '';
        switch (engine) {
            case 'default':
            case 'osrm':
                console.log('Engine osrm');
                api = config.direction.engine.osrm;
                break;
            case 'graphhopper':
                console.log('Engine graphhopper');
                api = config.direction.engine.graphhopper;
                break;
            case 'mapbox':
                console.log('Engine mapbox');
                api = config.direction.engine.mapbox;
                break;
            default:
                console.log('Engine default');
                api = config.direction.engine.osrm;
                break;
        }

        return api;
    }

    /**
     * Return Geocode Engine
     * @param engine
     * @returns {string}
     * @private
     */
    _geocodeEngine(engine) {
        // console.log('GeoCode Engine: ', engine)
        let geoEngine = '';
        switch (engine) {
            case 'default':
            case 'pelias':
                geoEngine = 'pelias';
                break;
            case 'mapbox':
                geoEngine = 'mapbox';
                break;
            default:
                geoEngine = 'pelias';
                break;
        }
        return geoEngine;
    }

    /**
     * Return Geocode Api
     * @param engine
     * @param api
     * @returns {string}
     * @private
     */
    _geocodeApi(engine, api) {
        // console.log('GeoCode Engine: ', engine)
        let geoApi = '';
        switch (engine) {
            case 'default':
            case 'pelias':
                geoApi = api ? api : config.direction.geocoder.pelias;
                break;
            case 'mapbox':
                geoApi = api ? api : config.direction.geocoder.mapbox;
                break;
            default:
                geoApi = api ? api : config.direction.geocoder.pelias;
                break;
        }
        return geoApi;
    }
}
