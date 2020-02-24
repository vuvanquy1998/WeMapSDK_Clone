// import * as json from '../../config.json';
// const {config} = json;
import {default as config} from '../config.json';
// const config = require('../config.json');
import MapboxDirections from '../mapbox-gl-directions/dist/mapbox-gl-directions';

/**
 * WeDirections show direction
 *
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
        this.options.interactive = options.interactive || false;

        this.options.geocoder.engine = this._geocodeEngine(this.options.geocoder.engine);
        this.options.geocoder.api = this._geocodeApi(this.options.geocoder.engine);
        this.options.api = this._apiEngine(this.options.engine);

        this._onRendered(this.options.mode);
        this.weDirection = this.render(this.options);
        this._onReverseInput(this.weDirection);

        this._addDirectionIcon();

        this._urlPreChecking();
        this._urlCheckChange();

        this.weDirection.onClick = this._clickHandler();
        // this.weDirection.interactive = this.interactive();
        return this.weDirection;
    }

    interactive(state) {
        // TODO: Re check interactive function
        let self = this.weDirection;
        window.addEventListener('DOMContentLoaded', function() {
            if (state) {
                self._map.on('touchstart', self.move);
                self._map.on('touchstart', self.onDragDown);

                self._map.on('mousedown', self.onDragDown);
                self._map.on('mousemove', self.move);
                // this._map.on('click', this.onClick);
            } else {
                self._map.off('touchstart', self.move);
                self._map.off('touchstart', self.onDragDown);

                self._map.off('mousedown', self.onDragDown);
                self._map.off('mousemove', self.move);
                // this._map.off('click', this.onClick);
            }
            return this;
        });

    }

    _clickHandler() {
        let self = this.weDirection;
        let interactive = this.options.interactive;
        window.addEventListener('DOMContentLoaded', function() {
            let mapclick = self._map;
            self._map._interactive = interactive;
            mapclick.on('click', function(e) {
                if (self._map._interactive) {
                    let origin =  self.getOrigin();
                    let destination = self.getDestination();
                    let lng = e.lngLat.lng;
                    let lat = e.lngLat.lat;
                    const coords = [lng, lat];
                    if (!origin.geometry) {
                        self.actions.setOriginFromCoordinates(coords);
                    } else {

                        const features = mapclick.queryRenderedFeatures(e.point, {
                            layers: [
                                'directions-origin-point',
                                'directions-destination-point',
                                'directions-waypoint-point',
                                'directions-route-line-alt'
                            ]
                        });

                        if (features.length) {
                            // Remove any waypoints
                            features.forEach((f) => {
                                if (f.layer.id === 'directions-waypoint-point') {
                                    self.actions.removeWaypoint(f);
                                }
                            });

                            if (features[0].properties.route === 'alternate') {
                                const index = features[0].properties['route-index'];
                                self.actions.setRouteIndex(index);
                            }
                        } else if (!destination.geometry){
                            self.actions.setDestinationFromCoordinates(coords);
                            mapclick.flyTo({ center: coords });
                        }
                    }
                }
            });
        });
    }

    /**
     * render function
     * Render UI Direction
     * @returns {Object} origin
     */
    render(options) {
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
     *
     * @private
     */
    _urlPreChecking() {
        let urlParams = wemapgl.urlController.getParams();
        console.log('urlParams: ', urlParams);
    }

    /**
     *
     * @private
     */
    _urlCheckChange() {
        let urlParams = wemapgl.urlController.getParams();
        // console.log('urlParams: ', urlParams);
        // window.addEventListener('locationchange', function(e){
        //     console.log('location changed!');
        //     urlParams = wemapgl.urlController.getParams();
        //     console.log('urlParams: ', urlParams);
        // });
        //
        // window.onhashchange = function(e) {
        //     //code
        //     console.log('hash changed: ', e)
        // }

        // window.addEventListener('popstate', function(e){console.log('url changed')});

        // window.onpopstate = history.onpushstate = function(e) {
        //     console.log('url changed')
        // }

        // window.addEventListener('DOMContentLoaded', function() {
        //     window.addEventListener('pushState', function (e) {
        //         console.warn('url changed!', e);
        //     });
        // });

        // window.addEventListener('hashchange', function(e){
        //     console.log('hash changed')
        //     urlParams = wemapgl.urlController.getParams();
        //     console.log('urlParams: ', urlParams);
        // });

        let _wr = function(type) {
            let orig = history[type];
            return function() {
                let rv = orig.apply(this, arguments);
                let e = new Event(type);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');

        window.addEventListener('replaceState', function(e) {
            console.log('replaceState!');
            console.log('urlParams: ', urlParams);
        });

        window.addEventListener('pushState', function(e) {
            console.log('pushState!');
            console.log('urlParams: ', urlParams);
        });
    }

    /**
     *
     * @private
     */
    _addDirectionIcon() {
        let self = this;
        let direction = self.weDirection;
        // let self = this;
        window.addEventListener('DOMContentLoaded', function(){
            let peliasSelector =
                document.querySelectorAll('div.pelias-ctrl.mapboxgl-ctrl')[0];
            let peliasInputSelector =
                document.querySelectorAll('div.pelias-ctrl-input-actions-wrapper.pelias-ctrl-shadow')[0];
            let directionSelector =
                document.querySelectorAll('div.mapboxgl-ctrl-directions.mapboxgl-ctrl')[0];
            let directionInputSelector = document.getElementById('mapbox-directions-form-area');

            console.log(direction);
            let container = direction._map._container.id;

            if (container) {
                let containerSelector = document.getElementById(container);
                containerSelector.classList.add("wemap-direction");
            }

            if (peliasInputSelector) {
                const directionOpen = document.createElement('span');
                directionOpen.setAttribute("id", "direction-icon-open");
                directionOpen.className =
                    'pelias-ctrl-action-icon pelias-ctrl-action-icon-directions pelias-ctrl-disabled';
                peliasInputSelector.appendChild(directionOpen);
                // Add Event
                directionOpen.addEventListener('click', () => {
                    console.log('Active direction');
                    directionSelector.classList.remove("hide");
                    peliasSelector.classList.add("hide");
                    // interactive
                    // self.weDirection.interactive(true);
                    // console.log('Self: ', self);
                    direction.interactive(true);
                    direction._map._interactive = true;
                });
            }

            if (directionInputSelector) {
                const directionClose = document.createElement('span');
                directionClose.setAttribute("id", "direction-icon-close");
                directionClose.className =
                    'direction-icon-search';
                directionInputSelector.appendChild(directionClose);
                directionClose.addEventListener('click', () => {
                    console.log('Deactive direction');
                    peliasSelector.classList.remove("hide");
                    directionSelector.classList.add("hide");
                    // interactive
                    // self.weDirection.interactive(false);
                    // self.weDirection.removeRoutes();
                    // self.weDirection.removeWaypoint();
                    // console.log('Self: ', self);
                    direction.interactive(false);
                    direction._map._interactive = false;
                    direction.removeRoutes();
                    direction.removeWaypoint();
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
                geoApi = config.direction.geocoder.pelias;
                break;
            case 'mapbox':
                geoApi = config.direction.geocoder.mapbox;
                break;
            default:
                geoApi = config.direction.geocoder.pelias;
                break;
        }
        return geoApi;
    }
}
