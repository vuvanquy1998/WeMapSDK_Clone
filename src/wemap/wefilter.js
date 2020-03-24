import { makeRequest } from '../util/ajax';
export default class WeFilterControl {
    constructor(options) {
        let defaultLayers = ["poi-level-1", "poi-level-2", "poi-level-3"];
        this._options = options || {
            "filters": {
                "cuisine": {
                    "text": "Ẩm thực",
                    "fa-icon": "fa-cutlery",
                    "color": "#C70039",
                    "featureClasses": ["cafe", "restaurant", "fast_food", "food_court"],
                    "layers": defaultLayers
                },
                "hotel": {
                    "text": "Nhà nghỉ",
                    "fa-icon": "fa-hotel",
                    "color": "#C70039",
                    "featureClasses": ["hotel", "guest_house", "motel"],
                    "layers": defaultLayers
                },
                "entertainment": {
                    "text": "Giải trí",
                    "fa-icon": "fa-glass",
                    "color": "#C70039",
                    "featureClasses": ["bar", "nightclub", "pub", "theatre", "casino", "cinema"],
                    "layers": defaultLayers
                },
                "shopping": {
                    "text": "Mua sắm",
                    "fa-icon": "fa-shopping-bag",
                    "color": "#C70039",
                    "featureClasses": ["shop", "grocery", "alcohol_shop", "jewelry", "mall", "supermarket", "fashion", "convenience", "marketplace"],
                    "layers": defaultLayers
                }
            }
        };
        
        this._currFilter = null;
        this._prevFilter = null;
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement("div");
        let wefilterContainer = document.createElement("div");
        wefilterContainer.setAttribute("id", "wefilter-container");

        let wefilterTitle = document.createElement("div");
        wefilterTitle.setAttribute("id", "wefilter-title");
        wefilterTitle.innerHTML = "Bộ lọc";

        wefilterContainer.appendChild(wefilterTitle);

        Object.keys(this._options["filters"]).forEach(filterId => {
            let wefilterButtonContainer = document.createElement("div");
            wefilterButtonContainer.setAttribute("class", "wefilter-button-container");
            wefilterButtonContainer.setAttribute("id", "wefilter-button-container-" + filterId);

            let button = document.createElement("button");
            button.setAttribute("class", "wefilter-button");
            button.setAttribute("id", "wefilter-button-" + filterId);
            button.style.background = this._options["filters"][filterId]["color"];
            button.style.border = "1px solid" + this._options["filters"][filterId]["color"];

            let icon = document.createElement("i");
            icon.setAttribute("class", "fa " + this._options["filters"][filterId]["fa-icon"]);
            button.appendChild(icon);
            
            wefilterButtonContainer.appendChild(button);

            let span = document.createElement("span");
            span.innerHTML = this._options["filters"][filterId]["text"];
            wefilterButtonContainer.appendChild(span);
            wefilterButtonContainer.addEventListener("click", () => this.onClickFilter(filterId))

            wefilterContainer.appendChild(wefilterButtonContainer);
        });

        this._container.appendChild(wefilterContainer);
        return  this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this.getDOM());
        this._map = undefined;
    }

    getDefaultPosition() {
        return 'top-right';
    }

    onClickFilter(filterId) {
        if(this._currFilter == null) {
            this._prevFilter = null;
            this._currFilter = filterId;
            document.getElementById("wefilter-button-container-" + filterId).classList.add("wefilter-button-container-active");
        } else {
            this._prevFilter = this._currFilter;
            document.getElementById("wefilter-button-container-" + this._currFilter).classList.remove("wefilter-button-container-active");
            if(this._currFilter != filterId) {
                this._currFilter = filterId;
                document.getElementById("wefilter-button-container-" + filterId).classList.add("wefilter-button-container-active");
            } else {
                this._currFilter = null;
            }
        }
        this.filter();
    }

    filter() {
        if(this._prevFilter != null) {
            let rules = ["all"];
            this._options["filters"][this._prevFilter]["layers"].forEach(layerId => {
                this._map.setFilter(layerId, rules);
            });
        }
        if(this._currFilter != null) {
            let rules = [
                "in",
                "class"
            ];
            rules = rules.concat(this._options["filters"][this._currFilter]["featureClasses"]);
            this._options["filters"][this._currFilter]["layers"].forEach(layerId => {
                this._map.setFilter(layerId, rules);
            });
        }
    }

}