export default class WeFilterControl {
    constructor(options) {
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement("div");
        let wefilterContainer = document.createElement("div");
        wefilterContainer.setAttribute("id", "wefilter-container");

        let wefilterTitle = document.createElement("div");
        wefilterTitle.setAttribute("id", "wefilter-title");
        wefilterTitle.innerHTML = "Khám phá xung quanh bạn";

        wefilterContainer.appendChild(wefilterTitle);

        let groups = {
            "cuisine": {
                "text": "Ẩm thực",
                "fa-icon": "fa-cutlery"
            },
            "hotel": {
                "text": "Nhà nghỉ",
                "fa-icon": "fa-hotel"
            },
            "entertainment": {
                "text": "Giải trí",
                "fa-icon": "fa-glass"
            },
            "shopping": {
                "text": "Mua sắm",
                "fa-icon": "fa-shopping-bag"
            }
        };

        Object.keys(groups).forEach(key => {
            let wefilterButtonContainer = document.createElement("div");
            wefilterButtonContainer.setAttribute("class", "wefilter-button-container");

            let button = document.createElement("button");
            button.setAttribute("class", "wefilter-button");
            button.setAttribute("id", "wefilter-button-" + key);

            let icon = document.createElement("i");
            icon.setAttribute("class", "fa " + groups[key]["fa-icon"]);
            button.appendChild(icon);
            
            wefilterButtonContainer.appendChild(button);

            let span = document.createElement("span");
            span.innerHTML = groups[key]["text"];
            wefilterButtonContainer.appendChild(span);

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

}