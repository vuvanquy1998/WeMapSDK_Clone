// import * as json from '../../config.json';
// const {config} = json;
import { default as config } from '../../config.json';

// const config = require('../config.json');
// const fs = require('fs');
//
// const { config } = JSON.parse(fs.readFileSync('../config.json', 'utf8'))
// import {config} from '../../config.js'
import MapboxDirections from '../../mapbox-gl-directions/dist/mapbox-gl-directions';

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
        this.accessToken = options.accessToken || '';
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

        this.geocoder = options.geocoder || {};
        this.geocoder.api = options.geocoder.api ? options.geocoder.api : config.direction.geocoder.pelias;
        this.geocoder.engine = this._geocodeEngine();


        this.engine = ['default', 'osrm', 'graphhopper', 'mapbox'].includes(options.engine) ? options.engine : 'osrm';
        this.api = this._apiEngine();

        // this.mode = options.mode || 'driving'; // traffic, driving, walking, cycling
        this.mode = this._travelMode(options.mode);

        console.log("API: ", this.api);
        console.log("Mode: ", this.mode);

    }

    /**
     * render function
     * Render UI Input
     * @returns {Object} origin
     */
    render() {
        // console.log('Directions Init: ', this.engine);

        let directions =  new MapboxDirections({
            accessToken: this.accessToken,
            unit: this.unit, // metric
            // profile: 'mapbox/' + this.mode,
            profile: this.mode,
            key: this.key,
            api: this.api, // https://api.mapbox.com/directions/v5/

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

        return directions;
    }

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

    _geocodeEngine(engine) {
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

    _geocodeOption(options) {
        let ops = options;
        return ops;
    }
}
