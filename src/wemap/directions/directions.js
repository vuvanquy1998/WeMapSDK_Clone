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
        this.highlight = options.highlight || true;
        this.accessToken = options.accessToken || '';

        this.engine = ['osrm', 'graphhopper'].includes(options.engine) ? options.engine : 'osrm';

        this.unit = options.unit || 'metric';
    }

    /**
     * render function
     * Render UI Input
     * @returns {Object} origin
     */
    render() {
        console.log('Directions Init: ', this.engine);
        let directions =  new MapboxDirections({
            accessToken: this.accessToken,
            unit: 'metric',
            profile: 'mapbox/' + this.mode
        });

        return directions;
    }
}
