import getWeMapForm from './form';

export default class WeMap {

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
    showForm() {
        return getWeMapForm();
    }
}
