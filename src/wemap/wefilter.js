export default class WeFilterControl {
    constructor(options) {
        
        this._groups = [
            {
                "Ẩm thực": {
                    "color": "red",
                    "classes": ["restaurant", "fast_food"]
                }
            },
            {
                "Khách sạn": {
                    "color": "black",
                    "classes": ["lodging", "hotel"]
                }
            },
            {
                "Giải trí": {
                    "color": "blue",
                    "classes": ["cafe", "bar"]
                }
            },
            {
                "Mua sắm": {
                    "color": "blue",
                    "classes": ["shop", "grocery", "clothing_store"]
                }
            }
        ];

        this._poiLayers = ["poi-level-1-en", "poi-level-1", "poi-level-2-en", "poi-level-2", "poi-level-3-en", "poi-level-3"];
        this._choosedGroup = "";
    }

    renderView() {
        // get all features that match choosed group
        if(this._choosedGroup != "") {
            const matchedFeatures = [];
            this._map.queryRederedFeatures({
                layers: this._poiLayers
            }).forEach(feature => (this._groups[this._choosedGroup]["classes"].includes(feature.properties.class) && matchedFeatures.push(feature)));
            console.log(matchedFeatures);
        }
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.setAttribute("id", "wemap-ctrl-filter");
        this._map.on('idle', () => {
            this.renderView();
        });
        return  this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this.getDOM());
        this._map = undefined;
    }

    getDefaultPosition() {
        return 'top-right';
    }

}