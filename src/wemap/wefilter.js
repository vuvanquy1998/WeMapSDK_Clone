export default class WeFilterControl {
    constructor(options) {

    }

    renderView() {
        const allLayersRadio = this.createRadioGroup("show-all-layers-radio", "layer-filter-radio", "Show all layers", true)
        allLayersRadio.addEventListener("click", () => this.showAllLayers());
        this._container.appendChild(allLayersRadio);
        
        this._layers = [];
        this._map.getStyle().layers.forEach(layer => {
            if(layer.id.includes("")) {
                this._layers.push(layer);
                const layerRadio = this.createRadioGroup(layer.id + "-radio", "layer-filter-radio", layer.id, false);
                layerRadio.addEventListener("click", () => this.showLayer(layer.id));
                this._container.appendChild(layerRadio);
            }
        });
                
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.setAttribute("id", "wemap-ctrl-filter");
        this._map.on('load', () => {
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

    createRadioGroup(id, name, value, checked) {
        const radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("id", id);
        radio.setAttribute("name", name);
        radio.setAttribute("value", value);
        checked && radio.setAttribute("checked", "checked");

        const label = document.createElement('label');
        label.setAttribute("for", id);
        label.innerHTML = value;

        const radioGroupContainer = document.createElement('div');
        radioGroupContainer.appendChild(radio);
        radioGroupContainer.appendChild(label);
        radioGroupContainer.appendChild(document.createElement("br"));

        return radioGroupContainer;
    }

    showLayer(layerId) {
        this._layers.forEach(layer => {
            const visibilityValue = layer.id == layerId ? "visible" : "none";
            this._map.setLayoutProperty(layer.id, "visibility", visibilityValue);
        });
    }

    showAllLayers() {
        this._layers.forEach(layer => {
            this._map.setLayoutProperty(layer.id, "visibility", "visible");
        });
    }
}