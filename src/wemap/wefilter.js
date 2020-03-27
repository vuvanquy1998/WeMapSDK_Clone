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
                },
                
            }
        };
        
        this._currFilter = null;
        this._prevFilter = null;
        this._head = 0;
        this._buttons = [];
        this._numberOfButtons = 4;
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement("div");
        let wefilterContainer = document.createElement("div");
        wefilterContainer.setAttribute("id", "wefilter-container");

        this._wefilterTitle = document.createElement("div");
        this._wefilterTitle.setAttribute("id", "wefilter-title");
        this._wefilterTitle.innerHTML = "Hãy lọc ra những địa điểm bạn muốn";

        wefilterContainer.appendChild(this._wefilterTitle);

        this._leftButton = document.createElement("div");
        this._leftButton.setAttribute("class", "wefilter-control");
        this._leftButton.setAttribute("id", "wefilter-control-left");
        let leftIcon = document.createElement("i");
        leftIcon.setAttribute("class", "fa fa-chevron-left");
        this._leftButton.appendChild(leftIcon);
        this._leftButton.addEventListener("click", () => this.updateCarousel(--this._head));
        wefilterContainer.appendChild(this._leftButton);


        Object.keys(this._options["filters"]).forEach(filterId => {
            let filterButton = document.createElement("div");
            filterButton.setAttribute("class", "wefilter-button");
            filterButton.setAttribute("id", "wefilter-button-" + filterId);
            let filterIcon = document.createElement("i");
            filterIcon.setAttribute("class", "fa " + this._options["filters"][filterId]["fa-icon"]);
            filterButton.appendChild(filterIcon);
            filterButton.setAttribute("title", this._options["filters"][filterId]["text"]);
            wefilterContainer.appendChild(filterButton);

            filterButton.addEventListener("click", () => this.onClickFilter(filterId));
            this._buttons.push(filterButton);
            this.unhighlightButton(filterButton, this._options["filters"][filterId]["color"]);
        });

        this._rightButton = document.createElement("div");
        this._rightButton.setAttribute("class", "wefilter-control");
        this._rightButton.setAttribute("id", "wefilter-control-right");
        let rightIcon = document.createElement("i");
        
        rightIcon.setAttribute("class", "fa fa-chevron-right");
        this._rightButton.appendChild(rightIcon);
        this._rightButton.addEventListener("click", () => this.updateCarousel(++this._head));
        wefilterContainer.appendChild(this._rightButton);

        this._container.appendChild(wefilterContainer);
        this.updateCarousel(this._head);
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
            this.highlightButton(document.getElementById("wefilter-button-" + this._currFilter), this._options["filters"][this._currFilter]["color"]);
            this._wefilterTitle.innerHTML = "Đang lọc: " + this._options["filters"][this._currFilter]["text"];
        } else {
            this._prevFilter = this._currFilter;
            this.unhighlightButton(document.getElementById("wefilter-button-" + this._prevFilter), this._options["filters"][this._prevFilter]["color"]);
            this._wefilterTitle.innerHTML = "Hãy lọc ra những địa điểm bạn muốn";
            if(this._currFilter != filterId) {
                this._currFilter = filterId;
                this.highlightButton(document.getElementById("wefilter-button-" + this._currFilter), this._options["filters"][this._currFilter]["color"]);
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

    updateCarousel(head) {
        let numberOfButton = 4;
        head == 0 ? this.disableButton(this._leftButton) : this.enableButton(this._leftButton);
        head == (this._buttons.length - this._numberOfButtons) ? this.disableButton(this._rightButton) : this.enableButton(this._rightButton);
        this._buttons.forEach((button, index) => {
            button.style.display = (this._head <= index && index <= this._head + this._numberOfButtons - 1) ? "inline-block":"none";
        });
    }

    highlightButton(buttonDOM, color) {
        buttonDOM.style.border = "1px solid " + color;
        buttonDOM.style.background = color;
        Array.from(buttonDOM.children)[0].style.color = "white";
    }

    unhighlightButton(buttonDOM, color) {
        buttonDOM.style.border = "1px solid " + color;
        buttonDOM.style.background = "white";
        Array.from(buttonDOM.children)[0].style.color = color;
    }

    disableButton(buttonDOM) {
        buttonDOM.style.pointerEvents = "none";
        buttonDOM.style.opacity = 0.3;
    }

    enableButton(buttonDOM) {
        buttonDOM.style.pointerEvents = "auto";
        buttonDOM.style.opacity = 1;
    }
}