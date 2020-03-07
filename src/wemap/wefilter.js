export default class WeFilterControl {
    constructor(options) {

    }

    renderView() {
        this._map.getStyle().layers.forEach(layer => {
            if(layer.id.includes("poi")) {
                const radio = document.createElement("input");
                radio.setAttribute("type", "radio");
                radio.setAttribute("id", layer.id);
                radio.setAttribute("name", layer.id);
                radio.setAttribute("value", layer.id);

                const label = document.createElement('label');
                label.setAttribute("for", layer.id);
                label.innerHTML = layer.id

                this._container.appendChild(radio);
                this._container.appendChild(label);
                this._container.appendChild(document.createElement("br"));
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
}