export default class WeFilterControl {
    constructor(options) {
        
        this._groups = {
            "Ẩm thực": {
                "color": "red",
                "classes": ["restaurant", "fast_food"]
            },

            "Khách sạn": {
                "color": "black",
                "classes": ["lodging", "hotel"]
            },

            "Giải trí": {
                "color": "blue",
                "classes": ["cafe", "bar"]
            },

            "Mua sắm": {
                "color": "blue",
                "classes": ["shop", "grocery", "clothing_store"]
            }
        };

        this._poiLayers = ["poi-level-1-en", "poi-level-1", "poi-level-2-en", "poi-level-2", "poi-level-3-en", "poi-level-3"];
        this._choosedGroup = "";
        this._markers = [];
    }

    renderView() {
        if(this._choosedGroup != "") {
            const matchedFeatures = [];
            this._map.queryRenderedFeatures({
                layers: this._poiLayers
            }).forEach(feature => {
                console.log(feature.geometry.coordinates);
                (this._groups[this._choosedGroup]["classes"].includes(feature.properties.class) && matchedFeatures.push(feature));
            });
            console.log(matchedFeatures)
            this.addMarkers(matchedFeatures);
        } else {

        }
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        Object.keys(this._groups).forEach(key => {
            this._container.appendChild(this.createGroupButton(key));
        });
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

    addMarkers(features) {
        this.removeMarkers();
        features.forEach(feature => {
            const markerEl = document.createElement("div");
            markerEl.innerHTML =
                "<div class='wemap-marker-arrow'></div>" +
                "<div class='wemap-marker-pulse'></div>";

            // TODO: add marker
            
            const marker = new wemapgl.Marker(markerEl).setLngLat(feature.geometry.coordinates).addTo(this._map);
            this._markers.push(marker);
        });
    }

    removeMarkers(group) {
        this._markers.forEach(marker => marker.remove());
    }

    createGroupButton(group) {
        const button = document.createElement("button");
        button.setAttribute("class", "wemap-ctrl-filter-button");
        button.innerHTML = group;
        button.addEventListener('click', () => {
            if(this._choosedGroup == group) {
                this._choosedGroup = "";
            } else {
                this._choosedGroup = group;
                this.renderView();
            }
        });
        return button;
    }

}