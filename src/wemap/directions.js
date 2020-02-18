// import * as json from '../../config.json';
// const {config} = json;
import { default as config } from '../config.json';

// const config = require('../config.json');
// const fs = require('fs');
//
// const { config } = JSON.parse(fs.readFileSync('../config.json', 'utf8'))
// import {config} from '../../config.js'
import MapboxDirections from '../mapbox-gl-directions/dist/mapbox-gl-directions';
import UrlController from "./url";
import {clearOrigin} from "../mapbox-gl-directions/src/actions";

// import updateRouteParams from './url';

/**
 * WeDirections show direction
 *
 */
export default class WeDirections {

    constructor(options) {
        options = options || {};

        this.options = {};

        if (options.params) {
            this.params = options.params;
        }


        this.highlight = options.highlight || true;
        this.key = options.key || '';

        this.unit = options.unit || 'metric';

        this.alternatives = options.alternatives || false;
        this.congestion = options.congestion || false;
        this.flyTo = options.flyTo || true;
        this.placeholderOrigin = options.placeholderOrigin || 'Chọn điểm bắt đầu';
        this.placeholderDestination = options.placeholderDestination || 'Chọn điểm kết thúc';
        this.zoom = options.zoom || 16;
        this.language = options.language || 'vi';
        this.proximity = options.proximity || false;
        this.styles = options.styles || [];
        this.profileSwitcher = options.profileSwitcher || true;
        this.inputs = options.inputs || true;
        this.instructions = options.instructions || true;

        this.engine = ['default', 'osrm', 'graphhopper', 'mapbox'].includes(options.engine) ? options.engine : 'osrm';

        this.geocoder = options.geocoder || {};

        this.geocoder.engine = this._geocodeEngine(options.geocoder.engine);
        // this.geocoder.api = options.geocoder.api ? options.geocoder.api : config.direction.geocoder.pelias;
        this.geocoder.api = this._geocodeApi(options.geocoder.engine, options.geocoder.api);

        this.api = this._apiEngine();

        // this.mode = options.mode || 'driving'; // traffic, driving, walking, cycling
        this.mode = this._travelMode(options.mode);

        console.log("API: ", this.api);
        console.log("Mode: ", this.mode);
        this.onClick(this.engine);
        this.onChange(this.engine);
    }

    /**
     * render function
     * Render UI Input
     * @returns {Object} origin
     */
    render() {
        // console.log('Directions Init: ', this.engine);
        let directions =  new MapboxDirections({
            accessToken: this.key,
            unit: this.unit, // metric
            // profile: 'mapbox/' + this.mode,
            profile: this.mode,
            key: this.key,
            api: this.api, // https://api.mapbox.com/directions/v5/
            engine: this.engine,

            alternatives: this.alternatives, // false
            congestion: this.congestion, // false
            flyTo: this.flyTo, // true
            placeholderOrigin: this.placeholderOrigin, // 'Chọn điểm bắt đầu'
            placeholderDestination: this.placeholderDestination, // Chọn điểm kết thúc
            zoom: this.zoom, // 16
            language: this.language,
            compile: null,
            proximity: this.proximity, // false
            styles: this.styles, // []

            geocoder: this.geocoder,

            // UI controls
            controls: {
                profileSwitcher: this.profileSwitcher, //true
                inputs: this.inputs, //true
                instructions: this.instructions // true
            },
        });
        console.log('Directions Init: ', directions);
        document.getElementById('start').style.display ="block";
        document.getElementById('end').style.display ="block";

        return directions;
    }

    onClick(engine) {
        window.addEventListener('DOMContentLoaded', function(){
            var traffic = document.getElementById('mapbox-directions-profile-driving-traffic');
            var driving = document.getElementById('mapbox-directions-profile-driving');
            var walking = document.getElementById('mapbox-directions-profile-walking');
            var cycling = document.getElementById('mapbox-directions-profile-cycling');

            traffic.addEventListener('click', () => {
                if (engine === 'osrm') {
                    traffic.value = 'driving';
                }
                if (engine === 'graphhopper') {
                    traffic.value = 'car';
                }
                if (engine === 'mapbox') {
                    traffic.value = 'mapbox/' + 'traffic';
                }
                // console.log(engine, traffic);
            });

            driving.addEventListener('click', () => {
                if (engine === 'osrm') {
                    driving.value = 'driving';
                }
                if (engine === 'graphhopper') {
                    driving.value = 'car';
                }
                if (engine === 'mapbox') {
                    driving.value = 'mapbox/' + 'driving';
                }
                // console.log(engine, driving);
            });

            walking.addEventListener('click', () => {
                if (engine === 'osrm') {
                    walking.value = 'walking';
                }
                if (engine === 'graphhopper') {
                    walking.value = 'foot';
                }
                if (engine === 'mapbox') {
                    walking.value = 'mapbox/' + 'walking';
                }
                // console.log(engine, walking);
            });

            cycling.addEventListener('click', () => {
                if (engine === 'osrm') {
                    cycling.value = 'cycling';
                }
                if (engine === 'graphhopper') {
                    cycling.value = 'bike';
                }
                if (engine === 'mapbox') {
                    cycling.value = 'mapbox/' + 'cycling';
                }
                // console.log(engine, cycling);
            });
        });
    }

    /**
     *
     */
    onChange(engine) {
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
    _apiEngine() {
        let api = '';
        switch (this.engine) {
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
        }

        return api;
    }

    /**
     * Return travel Mode
     * @param modeDrive
     * @returns {string}
     * @private
     */
    _travelMode(modeDrive) {
        console.log('modeDrive: ', modeDrive);
        let mode = '';
        switch (this.engine) {
            case 'default':
            case 'osrm':
                console.log('Engine osrm');
                switch (modeDrive) {
                    case 'default':
                    case 'driving':
                        mode = 'driving';
                        break;
                    case 'walking':
                        mode = 'walking';
                        break;
                    case 'cycling':
                        mode = 'cycling';
                        break;
                    default:
                        mode = 'driving';
                        break;
                }
                break;
            case 'graphhopper':
                console.log('Engine graphhopper');
                switch (modeDrive) {
                    case 'default':
                    case 'driving':
                        mode = 'car';
                        break;
                    case 'walking':
                        mode = 'foot';
                        break;
                    case 'cycling':
                        mode = 'bike';
                        break;
                    default:
                        mode = 'car';
                        break;
                }
                break;
            case 'mapbox':
                console.log('Engine mapbox');
                switch (modeDrive) {
                    case 'default':
                    case 'driving':
                        mode = 'mapbox/' + 'driving';
                        break;
                    case 'walking':
                        mode = 'mapbox/' + 'walking';
                        break;
                    case 'cycling':
                        mode = 'mapbox/' + 'cycling';
                        break;
                    default:
                        mode = 'mapbox/' + 'driving';
                        break;
                }
                break;
            default:
                console.log('Engine default');
                switch (modeDrive) {
                    case 'default':
                    case 'driving':
                        mode = 'driving';
                        break;
                    case 'walking':
                        mode = 'walking';
                        break;
                    case 'cycling':
                        mode = 'cycling';
                        break;
                    default:
                        mode = 'driving';
                        break;
                }
        }

        return mode;
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
