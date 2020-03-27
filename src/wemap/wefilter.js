import { makeRequest } from '../util/ajax';
export default class WeFilterControl {
    constructor(options) {
        this._layerIds = [
            "poi-level-1",
            "poi-level-2",
            "poi-level-3"
        ];
        this._groups = {
            "cuisine": {
                "text": "Ẩm thực",
                "fa-icon": "fa-cutlery",
                "featureClasses": ["cafe", "restaurant", "fast_food", "food_court"]
            },
            "hotel": {
                "text": "Nhà nghỉ",
                "fa-icon": "fa-hotel",
                "featureClasses": ["hotel", "guest_house", "motel"]
            },
            "entertainment": {
                "text": "Giải trí",
                "fa-icon": "fa-glass",
                "featureClasses": ["bar", "nightclub", "pub", "theatre", "casino", "cinema"]
            },
            "shopping": {
                "text": "Mua sắm",
                "fa-icon": "fa-shopping-bag",
                "featureClasses": ["shop", "grocery", "alcohol_shop", "jewelry", "mall", "supermarket", "fashion", "convenience", "marketplace"]
            },
            "more": {
                "text": "Xem thêm",
                "fa-icon": "fa fa-ellipsis-h",
                "featureClasses": []
            }
        };
        this._currentGroup = null;
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement("div");
        this._container.setAttribute("id", "wefilter-section");
        let wefilterContainer = document.createElement("div");
        wefilterContainer.setAttribute("id", "wefilter-container");

        let wefilterTitle = document.createElement("div");
        wefilterTitle.setAttribute("id", "wefilter-title");
        wefilterTitle.innerHTML = "Bộ lọc";

        wefilterContainer.appendChild(wefilterTitle);

        Object.keys(this._groups).forEach(group => {
            let wefilterButtonContainer = document.createElement("div");
            wefilterButtonContainer.setAttribute("class", "wefilter-button-container");
            wefilterButtonContainer.setAttribute("id", "wefilter-button-container-" + group);

            let button = document.createElement("button");
            button.setAttribute("class", "wefilter-button");
            button.setAttribute("id", "wefilter-button-" + group);

            let icon = document.createElement("i");
            icon.setAttribute("class", "fa " + this._groups[group]["fa-icon"]);
            button.appendChild(icon);

            wefilterButtonContainer.appendChild(button);

            let span = document.createElement("span");
            span.innerHTML = this._groups[group]["text"];
            wefilterButtonContainer.appendChild(span);
            wefilterButtonContainer.addEventListener("click", () => this.onClickFilter(group))

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

    onClickFilter(group) {
        if(this._currentGroup == null) {
            this._currentGroup = group;
            document.getElementById("wefilter-button-container-" + group).classList.add("wefilter-button-container-active");
        } else {
            document.getElementById("wefilter-button-container-" + this._currentGroup).classList.remove("wefilter-button-container-active");
            if(this._currentGroup != group) {
                console.log('group: ', group);
                this._currentGroup = group;
                document.getElementById("wefilter-button-container-" + group).classList.add("wefilter-button-container-active");
            } else {
                this._currentGroup = null;
            }
        }
        this.filter(this._currentGroup);
    }

    filter(group) {
        let rules = [];
        if(group != null) {
            rules = [
                "in",
                "class"
            ];
            rules = rules.concat(this._groups[group]["featureClasses"]);
        } else {
            rules = ["all"];
        }
        this._layerIds.forEach(layerId => {
            this._map.setFilter(layerId, rules);
        });
    }

}
