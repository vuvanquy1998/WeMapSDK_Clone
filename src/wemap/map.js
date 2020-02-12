import getWeMapForm from './form';
import Reverse from './reverse';
export default class WeMap {

    constructor(options) {
        options = options || {};
        this.reverse = false;
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
    showForm() {
        return getWeMapForm();
    }
}
