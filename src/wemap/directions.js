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

        this._updateOptions();

        this.weDirection = this.render(this.options);
        this.weDirection.onClick = this._clickHandler();
        this._onRendered();
        return this.weDirection;
    }

    /**
     * Update option config
     * @private
     */
    _updateOptions() {
        this._apiEngine = this.options.engine;

        this._geocodeEngine = this.options.geocoder.engine;

        this._geocodeApi = this.options.geocoder.engine;

        this._optionProfile = this.options.mode;
    }

    /**
     * Setter update API correct engine option
     * @param engine
     * @private
     */
    set _apiEngine(engine) {
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
        this.options.api = api;
    }

    /**
     * Setter update Geocode Engine
     * @param engine
     * @private
     */
    set _geocodeEngine(engine) {
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
        this.options.geocoder.engine = geoEngine;
    }

    /**
     * Setter update Geocode Api
     * @param engine
     * @private
     */
    set _geocodeApi(engine) {
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
        this.options.geocoder.api = geoApi;
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
        let self = this;
        window.addEventListener('DOMContentLoaded', function() {
            self._addClass2Container();
            self._checkActiveGeocode();
            self._addDirectionIcon();
            self._rightClickHandler();
            self._activeDefaultDriveMode();
            self._onReverseInput();
            self._inputChange();
            self._urlPreChecking();
            self._urlCheckChange();
        });
    }

    /**
     * Overwrite Handler click of MapboxGL Directions
     * @private
     */
    _clickHandler() {
        const self = this.weDirection;
        const interactive = this.options.interactive;
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
     * Handler right click start here and and here
     * @private
     */
    _rightClickHandler() {
        const self = this;
        const direction = self.weDirection;
        const startHere = document.getElementById('right-click-start');
        const endHere = document.getElementById('right-click-end');

        startHere.addEventListener('click', function() {
            self.activeDirections();
            wemapgl.rightClick.closeMenuUI();
            const urlParams = wemapgl.urlController.getParams();
            if (urlParams.ox && urlParams.oy) {
                const coords = [urlParams.ox, urlParams.oy];
                direction.actions.setOriginFromCoordinates(coords);
            }
        });
        endHere.addEventListener('click', function() {
            self.activeDirections();
            wemapgl.rightClick.closeMenuUI();
            const urlParams = wemapgl.urlController.getParams();
            if (urlParams.dx && urlParams.dy) {
                const coords = [urlParams.dx, urlParams.dy];
                direction.actions.setDestinationFromCoordinates(coords);
            }
        });
    }

    /**
     * Add class wemap-direction to container when page loaded
     * @private
     */
    _addClass2Container() {
        const direction = this.weDirection;
        const container = direction._map._container.id;
        if (container) {
            const containerSelector = document.getElementById(container);
            containerSelector.classList.add("wemap-direction");
        }
    }

    /**
     * Check Geocode Active, if Geocode not activated always show Directions
     * @private
     */
    _checkActiveGeocode() {
        const peliasSelector =
            document.querySelectorAll('div.pelias-ctrl.mapboxgl-ctrl')[0];
        if (!peliasSelector) {
            const directionSelector =
                document.querySelectorAll('.mapboxgl-control-container .mapboxgl-ctrl-directions.mapboxgl-ctrl')[0];
            directionSelector.classList.remove("hide");
        }
    }

    /**
     * Set Default active drive mode when page loaded
     * @private
     */
    _activeDefaultDriveMode() {
        let mode = this.options.mode;
        const urlParams = wemapgl.urlController.getParams();
        if (urlParams.vehicle) {
            this.options.profile = urlParams.vehicle;
            mode = urlParams.vehicle;
        }

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
    }

    /**
     * Update option profile
     * @param profile
     */
    set _optionProfile(profile) {
        const engine = this.options.engine;
        const urlParams = wemapgl.urlController.getParams();
        if (urlParams.vehicle) {
            this.options.profile = urlParams.vehicle;
        } else if (engine === 'mapbox') {
            this.options.profile = 'mapbox' + '/' + profile;
        } else {
            this.options.profile = profile;
        }
    }

    _activeProfile() {
        let checked = '';
        let inputs = document.querySelectorAll('.mapbox-directions-inputs .mapbox-directions-profile input');
        inputs.forEach(element => {
            if (element.checked === true) {
                checked = element.value;
                checked = checked.replace("mapbox/", "");
            }
        });
        return checked;
    }

    /**
     * Check input origin, destination changed and update URL
     * @private
     */
    _inputChange() {
        const self = this;
        const direction = self.weDirection;
        const directionSelector = document.getElementById('mapbox-directions-form-area');

        const directionSelectorAll = document.querySelectorAll('.mapboxgl-ctrl-directions.mapboxgl-ctrl .mapbox-directions-component.mapbox-directions-inputs')[0];

        let originValue = {};
        let destinationValue = {};

        directionSelectorAll.addEventListener('change', function() {
            let o = document.querySelectorAll('#mapbox-directions-origin-input input')[0];
            let d = document.querySelectorAll('#mapbox-directions-destination-input input')[0];
            if (o.value && d.value) {
                wemapgl.reverse.onReverse();
            } else {
                wemapgl.reverse.offReverse();
            }

            originValue =  direction.getOrigin();
            destinationValue =  direction.getDestination();

            let vehicle = self._activeProfile();

            wemapgl.urlController.updateParams("route",
                {
                    ox: originValue.geometry ? originValue.geometry.coordinates[0] : 0,
                    oy: originValue.geometry ? originValue.geometry.coordinates[1] : 0,
                    dx: destinationValue.geometry ? destinationValue.geometry.coordinates[0] : 0,
                    dy: destinationValue.geometry ? destinationValue.geometry.coordinates[1] : 0,
                    vehicle: vehicle
                });
        });
    }

    /**
     * Check URL after page Rendered and render direction
     * @private
     */
    _urlPreChecking() {
        const self = this;
        const direction = self.weDirection;

        const urlParams = wemapgl.urlController.getParams();
        if (urlParams.ox && urlParams.oy && urlParams.dx && urlParams.dy) {
            self.activeDirections();
            direction._map.on('load', function () {
                // console.log('Map loaded');
                // TODO: Check bug add layer when direction url
                // URL: https://github.com/mapbox/mapbox-gl-directions/issues/190
                // URL: https://github.com/mapbox/mapbox-gl-directions/blob/master/src/directions_style.js
                // URL: https://github.com/mapbox/mapbox-gl-directions/issues/95
                // URL: https://github.com/mapbox/mapbox-gl-directions/pull/163
                // direction._map.addLayer({ 'id': 'directions-route-line-alt'});
                const originCoords = [urlParams.ox, urlParams.oy];
                const destinationCoords = [urlParams.dx, urlParams.dy];
                direction.actions.setOriginFromCoordinates(originCoords);
                direction.actions.setDestinationFromCoordinates(destinationCoords);
            });
        }
    }

    /**
     * Check click action to direction icon and set destination coordinate
     * @private
     */
    _urlCheckChange() {
        const self = this;
        const direction = self.weDirection;

        const directionSelector = document.getElementById('direction-icon');
        directionSelector.addEventListener('click', function(e) {
            self.activeDirections();
            const urlParams = wemapgl.urlController.getParams();
            if (urlParams.dx && urlParams.dy) {
                const coords = [urlParams.dx, urlParams.dy];
                direction.actions.setDestinationFromCoordinates(coords);
                wemapgl.reverse.offReverse();
            }
        });
    }

    /**
     * Add Direction Icon when Geocode active
     * @private
     */
    _addDirectionIcon() {
        const self = this;

        const peliasSelector =
            document.querySelectorAll('div.pelias-ctrl.mapboxgl-ctrl')[0];
        const peliasInputSelector =
            document.querySelectorAll('div.pelias-ctrl-input-actions-wrapper.pelias-ctrl-shadow')[0];
        const directionInputSelector = document.getElementById('mapbox-directions-form-area');

        if (peliasInputSelector) {
            const directionOpen = document.createElement('span');
            directionOpen.setAttribute("id", "direction-icon-open");
            directionOpen.className =
                'pelias-ctrl-action-icon pelias-ctrl-action-icon-directions pelias-ctrl-disabled';
            peliasInputSelector.appendChild(directionOpen);
            directionOpen.addEventListener('click', () => {
                // console.log('Active direction');
                self.activeDirections();
            });
        }

        if (peliasSelector) {
            if (directionInputSelector) {
                const directionClose = document.createElement('span');
                directionClose.setAttribute("id", "direction-icon-close");
                directionClose.className =
                    'direction-icon-search';
                directionInputSelector.appendChild(directionClose);
                directionClose.addEventListener('click', () => {
                    // console.log('Deactive direction');
                    self.deactiveDirections();
                });
            }
        }
    }

    /**
     * Handle action when active Directions
     */
    activeDirections() {
        const self = this;
        const direction = self.weDirection;
        direction._map._interactive = true;
        wemapgl.reverse.offReverse(); // Off reverse when direction active

        const peliasSelector =
            document.querySelectorAll('div.pelias-ctrl.mapboxgl-ctrl')[0];
        const directionSelector =
            document.querySelectorAll('div.mapboxgl-ctrl-directions.mapboxgl-ctrl')[0];

        directionSelector.classList.remove("hide");
        peliasSelector.classList.add("hide");
        // interactive
        direction.interactive(true);
        direction._map._interactive = true;
    }

    /**
     * Handle action when deactive Directions
     */
    deactiveDirections() {
        const self = this;
        const direction = self.weDirection;
        direction._map._interactive = true;
        wemapgl.reverse.onReverse(); // Active reverse when direction off

        const peliasSelector =
            document.querySelectorAll('div.pelias-ctrl.mapboxgl-ctrl')[0];
        const directionSelector =
            document.querySelectorAll('div.mapboxgl-ctrl-directions.mapboxgl-ctrl')[0];

        const o = document.querySelectorAll('#mapbox-directions-origin-input input')[0];
        o.value = ''; // Reset input origin
        const d = document.querySelectorAll('#mapbox-directions-destination-input input')[0];
        d.value = ''; // Reset input destination

        peliasSelector.classList.remove("hide");
        directionSelector.classList.add("hide");
        // interactive
        direction.interactive(false);
        direction._map._interactive = false;
        direction.removeRoutes();
        direction.removeWaypoint();
        direction.actions.hoverMarker();
        wemapgl.urlController.deleteParams("route");
    }

    /**
     * OnClick to reverse input
     * @private
     */
    _onReverseInput() {
        const direction = self.weDirection;

        const reverseButton = document.querySelectorAll('button.directions-reverse')[0];
        reverseButton.addEventListener('click', () => {
            const origin =  direction.getOrigin();
            const destination =  direction.getDestination();
            const originCoordinate =
                [origin.geometry ? origin.geometry.coordinates[0] : 0,
                    origin.geometry ? origin.geometry.coordinates[1] : 0];
            const destinationCoordinate =
                [destination.geometry ? destination.geometry.coordinates[0] : 0,
                    destination.geometry ? destination.geometry.coordinates[1] : 0];
            direction.actions.setOriginFromCoordinates(destinationCoordinate);
            direction.actions.setDestinationFromCoordinates(originCoordinate);
            direction.actions.reverse();
        });
    }
}
