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

        if (options.mode) {
            this.mode = options.mode;
        }

        if (options.highlight) {
            this.highlight = options.highlight;
        }

        this.init();
    }

    /**
     * init function
     * @returns {Object} origin
     */
    init(mode = 'car', highlight = 1) {
        this.mode = mode;
        this.highlight = highlight;
        console.log('Directions Init')
        return 'Directions: ' + mode + highlight;
    }
}
