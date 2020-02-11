import {getJSON} from '../util/ajax';
import getWeMapForm from './form';

export default class WeMap {
    constructor(options) {
        options = options || {};

        this.styleLinks = {
            "bright" : "https://apis.wemap.asia/vector-tiles/styles/osm-bright/style.json?key=IqzJukzUWpWrcDHJeDpUPLSGndDx",
            "dark" : "https://apis.wemap.asia/vector-tiles/styles/osm-bright/style.json?key=IqzJukzUWpWrcDHJeDpUPLSGndDx",
        }

        this.defaultOptions = {
            // TODO: get link from config file
            style: "bright",
            center: [105.8550736, 21.0283243],
            zoom: 13,
            reverse: false,
            attributionControl: false
        }

        this.options = options;
        this.init();
    }
    
    /**
     * Init
     */
    init() {

        for (var p in this.defaultOptions) {
            if(this.options.hasOwnProperty(p)) {
                if(this.options === "default") {
                    this.options[p] = this.defaultOptions[p];
                }
            } else {
                this.options[p] = this.defaultOptions[p];
            }
        }
        
        this.map = new wemapgl.Map({
                container: this.options.container,
                style: this.styleLinks[this.options.style],
                center: this.options.center,
                zoom: this.options.zoom,
                attributionControl: this.options.attributionControl
        });

        this.map.addControl(new mapboxgl.AttributionControl({
            compact: false,
            customAttribution: ["© WeMap"]
        }));

        getJSON({
            url: this.styleLinks[this.options.style],
            method: 'GET'
        }, (error, data) => {
            var point_layers = [];
            for(let i = 0; i < data.layers.length; i++){
                let layer_id = data.layers[i].id
                if(layer_id.includes('poi')){
                    point_layers.push(layer_id);
                }
            }
            point_layers.forEach((label, index) => {
                this.map.on('mouseover', label, (e) => {
                    this.map.getCanvas().style.cursor = 'pointer';
                })
                this.map.on('mouseleave', label, (e) => {
                    this.map.getCanvas().style.cursor = '';
                })
            })
        });

        if(this.options.reverse) {
            // TODO:
        }
        
    }

    lookup(info) {
        info = info || {};
        // TODO: Call lookup API
        return {};
    }

    doSomething(something) {
        console.log("Hello!");
        console.log(something);
    }

    /**
     * Returns the origin of the current route.
     * @returns {Object} origin
     */
    showForm() {
        return getWeMapForm();
    }
}
