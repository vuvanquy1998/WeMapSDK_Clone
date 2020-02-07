function WeMapProperties(options) {
    options = options || {};

    this.options = {};

    if (options.params) {
        this.params = options.params;
    }
}

WeMapProperties.prototype.getInfo = function () {
    return '@WeMap'
};

if (typeof module !== 'undefined') { module.exports = WeMapProperties; }

