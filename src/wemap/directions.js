export default class WeDirections {

    constructor(options) {
        options = options || {};

        this.options = {};

        if (options.params) {
            this.params = options.params;
        }

        this.init();
    }

    /**
     * Returns the origin of the current route.
     * @returns {Object} origin
     */
    init() {
        return 'Directions';
    }
}
