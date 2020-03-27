import { makeRequest } from '../util/ajax';
import { tns } from "tiny-slider/src/tiny-slider"

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
                },

            }
        };

        this._currFilter = null;
        this._prevFilter = null;
        this._head = 0;
        this._buttons = [];
        this._numberOfButtons = 4;
        window.addEventListener('DOMContentLoaded', function() {
            let slider = tns({
                "container": '#wefilter-button-section',
                "items": 4,
                "nested": "inner",
                // "edgePadding": 10,
                // "controlsContainer": "#wefilter-control-container",
                // "gutter": 15,
                "controls": false,
                "mouseDrag": true,
                // "nav": false,
                "navPosition": "bottom",
                "loop": false,
                "slideBy": "page",
                "swipeAngle": false,
                "speed": 400
            });
        });
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement("div");
        this._container.setAttribute("id", "wefilter-section");

        let wefilterContainer = document.createElement("div");
        wefilterContainer.setAttribute("id", "wefilter-container");

        this._wefilterTitle = document.createElement("div");
        this._wefilterTitle.setAttribute("id", "wefilter-title");
        this._wefilterTitle.innerHTML = "Hãy lọc ra những địa điểm bạn muốn";

        wefilterContainer.appendChild(this._wefilterTitle);

        let buttonControlSection = document.createElement("div");
        buttonControlSection.setAttribute("id", "wefilter-button-section");
        wefilterContainer.appendChild(buttonControlSection);

        Object.keys(this._options["filters"]).forEach(filterId => {
            let filterButton = document.createElement("div");
            filterButton.setAttribute("class", "wefilter-button");
            filterButton.setAttribute("id", "wefilter-button-" + filterId);

            let filterIcon = document.createElement("i");
            filterIcon.setAttribute("id", "wefilter-icon-" + filterId);
            filterIcon.setAttribute("class", "fa " + this._options["filters"][filterId]["fa-icon"]);

            let filterText = document.createElement("div");
            filterText.setAttribute("id", "wefilter-text-" + filterId);
            filterText.setAttribute("class", "wefilter-text");
            filterText.innerHTML = this._options["filters"][filterId]["text"];

            filterButton.appendChild(filterIcon);
            filterButton.appendChild(filterText);

            filterButton.setAttribute("title", this._options["filters"][filterId]["text"]);
            buttonControlSection.appendChild(filterButton);

            filterIcon.addEventListener("click", () => this.onClickFilter(filterId));
            this._buttons.push(filterIcon);

            this.unhighlightButton(filterIcon, this._options["filters"][filterId]["color"]);
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
            this.highlightButton(document.getElementById("wefilter-icon-" + this._currFilter), this._options["filters"][this._currFilter]["color"]);
            this._wefilterTitle.innerHTML = "Đang lọc: " + this._options["filters"][this._currFilter]["text"];
        } else {
            this._prevFilter = this._currFilter;
            this.unhighlightButton(document.getElementById("wefilter-icon-" + this._prevFilter), this._options["filters"][this._prevFilter]["color"]);
            this._wefilterTitle.innerHTML = "Hãy lọc ra những địa điểm bạn muốn";
            if(this._currFilter != filterId) {
                this._currFilter = filterId;
                this.highlightButton(document.getElementById("wefilter-icon-" + this._currFilter), this._options["filters"][this._currFilter]["color"]);
                this._wefilterTitle.innerHTML = "Đang lọc: " + this._options["filters"][this._currFilter]["text"];
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

    highlightButton(buttonDOM, color) {
        buttonDOM.style.border = "1px solid " + color;
        buttonDOM.style.background = color;
        buttonDOM.style.color = "white";
    }

    unhighlightButton(buttonDOM, color) {
        buttonDOM.style.border = "1px solid " + color;
        buttonDOM.style.background = "white";
        buttonDOM.style.color = color;
    }
}
