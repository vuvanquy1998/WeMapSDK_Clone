import getWeMapForm from './form';

export default class WeMap {
    constructor(options) {
        options = options || {};
        this.defaultOptions = {
            style: "mapbox://styles/mapbox/streets-v11",
            center: [105.8550736, 21.0283243],
            zoom: 13,
            reverse: false,
            attributionControl: false
        }
        this.options = options;
        this.setDefaultValue(this.defaultOptions, this.options);
        this.init();
    }
    
    /**
     * Init
     */
    init() {

        this.map = new wemapgl.Map({
                container: this.options.container,
                style: this.options.style,
                center: this.options.center,
                zoom: this.options.zoom,
                attributionControl: this.options.attributionControl
        });

        this.map.addControl(new mapboxgl.AttributionControl({
            compact: false,
            customAttribution: ["© WeMap"]
        }));

        if(this.options.reverse) {
            // TODO:
        }
        
    }

    setDefaultValue(defaultOptions, options) {
        for (var p in defaultOptions) {
            if(options.hasOwnProperty(p)) {
                if(options === "default") {
                    options[p] = defaultOptions[p];
                }
            } else {
                options[p] = defaultOptions[p];
            }
        }
    }

    lookup(info) {
        info = info || {};
        // TODO: Call lookup API
    }

    /**
     * Returns the origin of the current route.
     * @returns {Object} origin
     */
    showForm() {
        return getWeMapForm();
    }
}
