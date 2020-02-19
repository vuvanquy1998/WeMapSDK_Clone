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
        this.weDirection = this.render(this.options);
        // this._onChangeInput(this.weDirection);
        this._onReverseInput(this.weDirection);
        // return this.render(this.options);
        return this.weDirection;
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
    _onChangeInput(direction) {
        // window.addEventListener('DOMContentLoaded', function(){
        //     // let origin = document.getElementById('mapbox-directions-origin-input');
        //     // let destination = document.getElementById('mapbox-directions-destination-input');
        //     let directionInput = document.getElementById('mapbox-directions-form-area');
        //     let buttonCloseOrigin = document.querySelectorAll('button.geocoder-icon-close')[0];
        //     let buttonCloseDestination = document.querySelectorAll('button.geocoder-icon-close')[1];
        //
        //     directionInput.addEventListener('change', () => {
        //         let origin =  direction.getOrigin();
        //         let destination =  direction.getDestination();
        //
        //         let originCoordinate =
        //             [origin.geometry ? origin.geometry.coordinates[0] : 0,
        //             origin.geometry ? origin.geometry.coordinates[1] : 0];
        //         let destinationCoordinate =
        //             [destination.geometry ? destination.geometry.coordinates[0] : 0,
        //             destination.geometry ? destination.geometry.coordinates[1] : 0];
        //
        //         console.log('origin: ', originCoordinate);
        //         console.log('destination: ', destinationCoordinate);
        //
        //         buttonCloseOrigin.classList.add("active");
        //         buttonCloseDestination.classList.add("active");
        //     });
        // });
    }

    /**
     * OnClick to reverse input
     * @param direction
     * @private
     */
    _onReverseInput(direction) {
        window.addEventListener('DOMContentLoaded', function(){
            let reverseButton = document.querySelectorAll('button.directions-reverse')[0];
            reverseButton.addEventListener('click', () => {
                let origin =  direction.getOrigin();
                let destination =  direction.getDestination();
                let originCoordinate =
                    [origin.geometry ? origin.geometry.coordinates[0] : 0,
                        origin.geometry ? origin.geometry.coordinates[1] : 0];
                let destinationCoordinate =
                    [destination.geometry ? destination.geometry.coordinates[0] : 0,
                        destination.geometry ? destination.geometry.coordinates[1] : 0];
                direction.actions.setOriginFromCoordinates(destinationCoordinate);
                direction.actions.setDestinationFromCoordinates(originCoordinate);
                direction.actions.reverse();
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
                api = config.direction.engine.osrm;
                break;
            case 'graphhopper':
                api = config.direction.engine.graphhopper;
                break;
            case 'mapbox':
                api = config.direction.engine.mapbox;
                break;
            default:
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
