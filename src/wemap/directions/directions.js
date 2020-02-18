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

        this.mode = options.mode || 'driving'; // traffic, driving, walking, cycling
        if (this.mode === 'default') {
            this.mode = 'driving';
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

        this.sayHello = this.sayHello.bind(this);
        this.elm = document.getElementById('map');
        this.elm.addEventListener("contextmenu", this.sayHello);

        this.engine = ['default', 'osrm', 'graphhopper', 'mapbox'].includes(options.engine) ? options.engine : 'osrm';
        this.api = '';
        console.log(config);
        console.log(config.style);
        console.log(config.direction.engine);
        switch (this.engine) {
            case 'default':
            case 'osrm':
                this.api = config.direction.engine.osrm;
                console.log('Engine osrm: ', this.api);
                break;
            case 'graphhopper':
                this.api = config.direction.engine.graphhopper;
                console.log('Engine graphhopper: ', this.api);
                break;
            case 'mapbox':
                this.api = config.direction.engine.mapbox;
                console.log('Engine mapbox: ', this.api);
                break;
            default:
                this.api = config.direction.engine.osrm;
                console.log('Engine default: ', this.api);
        }
    };

    sayHello(){
        console.log("cái này là của Thảo");
    };
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
}
