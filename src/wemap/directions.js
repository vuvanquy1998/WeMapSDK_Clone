// import * as json from '../../config.json';
// const {config} = json;
import { default as config } from '../config.json';

// const config = require('../config.json');
import MapboxDirections from '../mapbox-gl-directions/dist/mapbox-gl-directions';
import UrlController from "./url";

/**
 * WeDirections
 */
export default class WeDirections {

    constructor(options) {
        options = options || {};

        this.options = options || {};

        this.options.accessToken = options.key || '';
        this.options.unit = options.unit || 'metric';
        this.options.placeholderOrigin = options.placeholderOrigin || 'Chọn điểm bắt đầu';
        this.options.placeholderDestination = options.placeholderDestination || 'Chọn điểm kết thúc';
        this.options.engine = ['default', 'osrm', 'graphhopper', 'mapbox'].includes(options.engine) ? options.engine : 'osrm';
        this.options.geocoder = options.geocoder || {};
        this.options.mode = options.mode || 'driving';

        this.options.geocoder.engine = this._geocodeEngine(this.options.geocoder.engine);
        this.options.geocoder.api = this._geocodeApi(this.options.geocoder.engine);
        this.options.api = this._apiEngine(this.options.engine);

        this._onRendered(this.options.mode);
        this.weDirection = this.render(this.options);
        this._onReverseInput(this.weDirection);

        this._addDirectionIcon();
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

    _addDirectionIcon() {
        window.addEventListener('DOMContentLoaded', function(){
            let peliasSelector =
                document.querySelectorAll('div.pelias-ctrl.mapboxgl-ctrl')[0];

            let peliasInputSelector =
                document.querySelectorAll('div.pelias-ctrl-input-actions-wrapper.pelias-ctrl-shadow')[0];

            let directionSelector =
                document.querySelectorAll('div.mapboxgl-ctrl-directions.mapboxgl-ctrl')[0];

            let directionInputSelector = document.getElementById('mapbox-directions-form-area');

            if (peliasInputSelector) {
                // Add Inner HTML
                const directionOpen = document.createElement('span');
                directionOpen.setAttribute("id", "direction-icon-open");
                directionOpen.className =
                    'pelias-ctrl-action-icon pelias-ctrl-action-icon-directions pelias-ctrl-disabled';
                // Append child
                peliasInputSelector.appendChild(directionOpen);

                // Add Event
                directionOpen.addEventListener('click', () => {
                    console.log('active direction');
                    directionSelector.classList.remove("hide");
                    peliasSelector.classList.add("hide");
                });

            }

            if (directionInputSelector) {
                const directionClose = document.createElement('span');
                directionClose.setAttribute("id", "direction-icon-close");
                directionClose.className =
                    'direction-icon-search';
                // Append child
                directionInputSelector.appendChild(directionClose);
                directionClose.addEventListener('click', () => {
                    console.log('active direction');
                    peliasSelector.classList.remove("hide");
                    directionSelector.classList.add("hide");
                });
            }
        });
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
     * @returns {string}
     * @private
     */
    _geocodeApi(engine) {
        let geoApi = '';
        switch (engine) {
            case 'default':
            case 'pelias':
                // geoApi = api ? api : config.direction.geocoder.pelias;
                geoApi = config.direction.geocoder.pelias;
                break;
            case 'mapbox':
                // geoApi = api ? api : config.direction.geocoder.mapbox;
                geoApi = config.direction.geocoder.mapbox;
                break;
            default:
                // geoApi = api ? api : config.direction.geocoder.pelias;
                geoApi = config.direction.geocoder.pelias;
                break;
        }
        return geoApi;
    }
}
