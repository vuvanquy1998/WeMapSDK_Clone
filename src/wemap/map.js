import Reverse from './reverse';
import RightClick from './rightclick';
import UrlController from './url';

import { default as config } from '../config.json';

export default class WeMap {
    /**
     * WeMap class contructor
     * @param {*} options
     * Default options: {style: string, center: [float, float], zoom: float, reverse: boolean}
     */
    constructor(options) {
        options = options || {};
        this.options = options;
        this.init();
        return this.map;
    }

    /**
     * Init WeMap
     */
    init() {
        // style
        switch (this.options.style) {
            case 'dark':
            case 'bright':
                break;
            default:
                this.options.style = config.style.default;
        }

        // create mapbox options object
        var mapboxOptions = Object.assign({}, this.options);
        // WeMap style -> style link + key
        mapboxOptions.style = config.style[this.options.style] + this.options.key;
        console.log(mapboxOptions.style);
        // remove options copied from wemap option
        delete mapboxOptions.reverse;
        delete mapboxOptions.key;
        delete mapboxOptions.urlController;
        // disable attribution control by default
        mapboxOptions.attributionControl = false;

        // init mapbox
        this.map = new wemapgl.Map(mapboxOptions);

        // reverse
        if(this.options.reverse == true) {
            wemapgl.rightClick = new RightClick(this.map, this.options.key);
            wemapgl.reverse = new Reverse(this.map, this.options.key);
        }
        
        // TODO: implement Url features
        

        // add WeMap attribution
        this.map.addControl(new wemapgl.AttributionControl({
            compact: false,
            customAttribution: ["© WeMap"]
        }));
    }

}
