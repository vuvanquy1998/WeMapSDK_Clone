import MapboxDirections from '../../mapbox-gl-directions/dist/mapbox-gl-directions';

// import template from 'lodash.template';
// import isEqual from 'lodash.isequal';

// let fs = require('fs');
// let inputTemplate = template(fs.readFileSync(__dirname + 'input.html', 'utf8'));

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
        this.unit = options.unit || 'metric';
    }

    /**
     * render function
     * Render UI Input
     * @returns {Object} origin
     */
    render() {
        console.log('Directions Init');
        return new MapboxDirections({
            accessToken: this.accessToken,
            unit: 'metric',
            profile: 'mapbox/' + this.mode
        });
    }
}
