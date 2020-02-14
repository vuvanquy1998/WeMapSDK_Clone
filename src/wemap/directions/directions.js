import MapboxDirections from '../../mapbox-gl-directions/dist/mapbox-gl-directions';
// import initialState from '../../mapbox-gl-directions/dist/mapbox-gl-directions';

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
        this.api = options.api || 'https://api.mapbox.com/directions/v5/';

        this.unit = options.unit || 'metric';

        this.alternatives = options.alternatives || false;
        this.congestion = options.congestion || false;
        this.flyTo = options.flyTo || true;
        this.placeholderOrigin = options.placeholderOrigin || 'Chọn điểm bắt đầu';
        this.placeholderDestination = options.placeholderDestination || 'Chọn điểm kết thúc';
        this.zoom = options.zoom || 16;
        this.language = options.language || 'vi';
        this.proximity = options.proximity || false;
        this.styles = options.styles || [];
        this.profileSwitcher = options.profileSwitcher || true;
        this.inputs = options.inputs || true;
        this.instructions = options.instructions || true;

        this.sayHello = this.sayHello.bind(this);
        this.elm = document.getElementById('map');
        this.elm.addEventListener("contextmenu", this.sayHello);

        this.engine = ['osrm', 'graphhopper'].includes(options.engine) ? options.engine : 'osrm';   
    };
    
    sayHello(){
        console.log("cái này là của Thảo");
    };
    /**
     * render function
     * Render UI Input
     * @returns {Object} origin
     */
    render() {
        console.log('Directions Init : ', this.engine);
  
        // console.log('initialState: ', new initialState());
        let directions =  new MapboxDirections({
            accessToken: this.accessToken,
            unit: this.unit, // metric
            profile: 'mapbox/' + this.mode,
            api: this.api, // https://api.mapbox.com/directions/v5/

            alternatives: this.alternatives, // false
            congestion: this.congestion, // false
            flyTo: this.flyTo, // true
            placeholderOrigin: this.placeholderOrigin, // 'Chọn điểm bắt đầu'
            placeholderDestination: this.placeholderDestination, // Chọn điểm kết thúc
            zoom: this.zoom, // 16
            language: this.language,
            compile: null,
            proximity: this.proximity, // false
            styles: this.styles, // []
           
            // UI controls
            controls: {
                profileSwitcher: this.profileSwitcher, //true
                inputs: this.inputs, //true
                instructions: this.instructions // true
                  
            },
        });

        return directions;
    }
}
