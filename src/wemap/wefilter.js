import { makeRequest } from '../util/ajax';
export default class WeFilterControl {
    constructor(options) {
        this._currentGroup = null;
        this._userLocation = null;
        this._groups = {
            "cuisine": {
                "text": "Ẩm thực",
                "fa-icon": "fa-cutlery",
                "k": "amenity",
                "v": "restaurant"
            },
            "hotel": {
                "text": "Nhà nghỉ",
                "fa-icon": "fa-hotel",
                "k": "tourism",
                "v": "hotel"
            },
            "entertainment": {
                "text": "Giải trí",
                "fa-icon": "fa-glass",
                "k": "amenity",
                "v": "nightclub"
            },
            "shopping": {
                "text": "Mua sắm",
                "fa-icon": "fa-shopping-bag",
                "k": "amenity",
                "v": "nightclub"
            }
        };
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
            wefilterButtonContainer.addEventListener("click", () => this.onGroupClick(group));

            let span = document.createElement("span");
            span.innerHTML = this._groups[group]["text"];
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

    onGroupClick(group) {
        if(this._userLocation == null) {
            navigator.geolocation.getCurrentPosition((position) => {
                this._userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.explore(group);
            }, () => {
                this.printError("Không thể lấy vị trí của bạn");
            });
        } else {
            this.explore(group);
        }
        
    }

    explore(group) {
        if(this._currentGroup == null) { // user want to turn on
            this._currentGroup = group;
            document.getElementById("wefilter-button-container-" + group).classList.add("wefilter-button-container-active");
            this.queryFeatures(group);
        } else {
            document.getElementById("wefilter-button-container-" + this._currentGroup).classList.remove("wefilter-button-container-active");
            if(this._currentGroup != group) { // user want to change
                this.queryFeatures(group);
                this._currentGroup = group;
                document.getElementById("wefilter-button-container-" + group).classList.add("wefilter-button-container-active");
            } else { // user just click again to turn off
                this._currentGroup = null;
            }
        }
    }

    printError(str) {
        this.clearError();
        let errorContainer = document.createElement("div");
        errorContainer.setAttribute("id", "wefilter-error-container");
        errorContainer.innerHTML = str;
        document.getElementById("wefilter-container").appendChild(errorContainer);
    }

    clearError() {
        let el = document.getElementById("wefilter-error-container");
        if(el != null) {
            el.parentNode.removeChild(el);
        };
    }

    queryFeatures(group) {
        this.clearResult();
        let exploreUrl = "https://apis.wemap.asia/we-tools/explore?"
        + "k=" + this._groups[group]["k"] + "&"
        + "v=" + this._groups[group]["v"] + "&"
        + "lat=" + this._userLocation.lat + "&"
        + "lon=" + this._userLocation.lng + "&"
        + "limit=20&d=1000";
        makeRequest({
            url: exploreUrl
        }, (err, res) => {
            
        });
    }

    clearResult() {

    }


}