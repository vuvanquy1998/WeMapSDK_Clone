export default class WeFilterControl {
    constructor(options) {

    }

    renderView() {
        // TODO: check if viewport has only 1 feature, dont render "Show all classes" radio, checked that radio immediately

        this._poiLayers = ["poi-level-1-en", "poi-level-1", "poi-level-2-en", "poi-level-2", "poi-level-3-en", "poi-level-3"];

        this._container.innerHTML = "";

        const features = this._map.queryRenderedFeatures({
            layers: this._poiLayers
        });
        if(features.length > 0) {
            const showAllClassesRadio = this.createRadioGroup("radio-feature-class-all", "radio-feature-class", "Show all classes");
            showAllClassesRadio.addEventListener('click', () => this.showAllClasses());
            this._container.appendChild(showAllClassesRadio);
            
            const featureClasses = new Set();
            features.forEach(feature => {
                featureClasses.add(feature.properties.class);
            });

            featureClasses.forEach(featureClass => {
                const featureClassRadio = this.createRadioGroup("radio-feature-class-" + featureClass, "radio-feature-class", featureClass);
                featureClassRadio.addEventListener("click", () => this.showSpecifiedClass(featureClass));
                this._container.appendChild(featureClassRadio);
            });
        } else {
            this._container.innerHTML = "No feature rendered";
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

    createCheckboxGroup() {

    }

    showSpecifiedClass(className) {
        this._poiLayers.forEach(layer => {
            this._map.setFilter(layer, ["==", "class", className]);
        });
    }

    showMultipleClass(classNames) {
    
    }

    showAllClasses() {
        this._poiLayers.forEach(layer => {
            this._map.setFilter(layer, null);
        });
    }

    hideAllClasses() {
        
    }
}