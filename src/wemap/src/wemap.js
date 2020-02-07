export default class WeMapClass {

    constructor(options) {
        options = options || {};

        this.options = {};

        if (options.params) {
            this.params = options.params;
        }
    }

    /**
     * Returns the origin of the current route.
     * @returns {Object} origin
     */
    getOriginWeMap() {
        return 'origin @WeMap';
    }
}
