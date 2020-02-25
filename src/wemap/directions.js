import {default as config} from '../config.json';
import MapboxDirections from '../mapbox-gl-directions/dist/mapbox-gl-directions';

/**
 * WeDirections show direction
 * Class WeDirections
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

        this.weDirection = this.render(this.options);
        this.weDirection.onClick = this._clickHandler();
        this._onRendered();
        // this.weDirection.interactive = this.interactive();
        // this.aRightClick();
        return this.weDirection;
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
     * OnRendered
     * @private
     */
    _onRendered() {
        this._addClass2Container();
        this._addDirectionIcon();
        this._activeDefaultDriveMode();
        this._onReverseInput();
        this._inputChange();
        this._urlPreChecking();
        this._urlCheckChange();
    }

    // aRightClick() {
    //     let self = this.weDirection;
    //     window.addEventListener('DOMContentLoaded', function() {
    //         let mapclick = self._map;
    //         mapclick.on('contextmenu', function(e){
    //             const coords = [e.lngLat.lng, e.lngLat.lat];
    //             const start = document.getElementById('start');
    //             const end = document.getElementById('end');
    //             start.addEventListener('click', function(e){
    //                 self.actions.setOriginFromCoordinates(coords);
    //                 document.getElementById('right-click-menu-container').style.display = "none";
    //             });
    //             end.addEventListener('click', function(e){
    //                 self.actions.setDestinationFromCoordinates(coords);
    //                 document.getElementById('right-click-menu-container').style.display = "none";
    //             })
    //         });
    //     })
    // }

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
                // console.log('Clicked', e);
                if (self._map._interactive) {
                    let origin =  self.getOrigin();
                    let destination = self.getDestination();
                    let lng = e.lngLat.lng;
                    let lat = e.lngLat.lat;
                    const coords = [lng, lat];
                    if (!origin.geometry) {
                        self.actions.setOriginFromCoordinates(coords);
                        // Update route Origin
                        wemapgl.urlController.updateParams("route",{ox: coords[0], oy: coords[1]});
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
                            // Update route Destination
                            wemapgl.urlController.updateParams("route", {dx: coords[0], dy: coords[1]});
                        }
                    }
                }
            });
        });
    }

    /**
     * Add class wemap-direction to container when page loaded
     * @private
     */
    _addClass2Container() {
        let direction = this.weDirection;
        window.addEventListener('DOMContentLoaded', function(){
            let container = direction._map._container.id;
            if (container) {
                let containerSelector = document.getElementById(container);
                containerSelector.classList.add("wemap-direction");
            }
        });
    }

    /**
     * Set Default active drive mode when page loaded
     * @param mode
     * @private
     */
    _activeDefaultDriveMode() {
        let mode = this.options.mode;
        window.addEventListener('DOMContentLoaded', function(){
            const traffic = document.getElementById('mapbox-directions-profile-driving-traffic');
            const driving = document.getElementById('mapbox-directions-profile-driving');
            const walking = document.getElementById('mapbox-directions-profile-walking');
            const cycling = document.getElementById('mapbox-directions-profile-cycling');

            // Active traffic mode
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
     * Check input origin, destination changed and update URL
     * @private
     */
    _inputChange() {
        let direction = this.weDirection;
        window.addEventListener('DOMContentLoaded', function(){
            let origin = document.getElementById('mapbox-directions-origin-input');
            let destination = document.getElementById('mapbox-directions-destination-input');
            origin.addEventListener('change', function(e) {
                let originValue =  direction.getOrigin();
                // console.log('originValue: ', originValue);
                wemapgl.urlController.updateParams("route",
                    {
                        dx: originValue.geometry ? originValue.geometry.coordinates[0] : 0,
                        dy: originValue.geometry ? originValue.geometry.coordinates[1] : 0
                    });
            });

            destination.addEventListener('change', function(e) {
                let destinationValue =  direction.getDestination();
                // console.log('destinationValue: ', destinationValue);
                wemapgl.urlController.updateParams("route",
                    {
                        dx: destinationValue.geometry ? destinationValue.geometry.coordinates[0] : 0,
                        dy: destinationValue.geometry ? destinationValue.geometry.coordinates[1] : 0
                    });
            });
        });
    }

    /**
     * Check URL after page Rendered and render direction
     * @private
     */
    _urlPreChecking() {
        let self = this;
        let direction = self.weDirection;

        window.addEventListener('DOMContentLoaded', function(){
            const urlParams = wemapgl.urlController.getParams();
            if (urlParams.ox && urlParams.oy && urlParams.dx && urlParams.dy) {
                self._activeDirections();
                const originCoords = [urlParams.ox, urlParams.oy];
                const destinationCoords = [urlParams.dx, urlParams.dy];
                direction._map.on('load', function () {
                    direction.actions.setOriginFromCoordinates(originCoords);
                    direction.actions.setDestinationFromCoordinates(destinationCoords);
                });
            }
        });
    }

    /**
     * Check click action to direction icon and set destination coordinate
     * @private
     */
    _urlCheckChange() {
        let self = this;
        let direction = self.weDirection;

        window.addEventListener('DOMContentLoaded', function(){
            const directionSelector = document.getElementById('direction-icon');
            directionSelector.addEventListener('click', function(e) {
                self._activeDirections();
                const urlParams = wemapgl.urlController.getParams();
                if (urlParams.dx && urlParams.dy && urlParams.action) {
                    const coords = [urlParams.dx, urlParams.dy];
                    direction.actions.setDestinationFromCoordinates(coords);
                    wemapgl.reverse.offReverse();
                }
            });
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
                    direction.interactive(false);
                    direction._map._interactive = false;
                    direction.removeRoutes();
                    direction.removeWaypoint();
                });
            }
        });
    }

    _activeDirections() {
        let self = this;
        let direction = self.weDirection;
        direction._map._interactive = true;

        let peliasSelector =
            document.querySelectorAll('div.pelias-ctrl.mapboxgl-ctrl')[0];
        let directionSelector =
            document.querySelectorAll('div.mapboxgl-ctrl-directions.mapboxgl-ctrl')[0];

        directionSelector.classList.remove("hide");
        peliasSelector.classList.add("hide");
        // interactive
        direction.interactive(true);
        direction._map._interactive = true;
    }

    /**
     * OnClick to reverse input
     * @param direction
     * @private
     */
    _onReverseInput() {
        let direction = self.weDirection;
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
