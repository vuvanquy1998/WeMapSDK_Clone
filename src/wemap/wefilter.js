import { makeRequest } from '../util/ajax';
export default class WeFilterControl {
    constructor(options) {
        this._currentGroup = null;
        this._userLocation = null;
        this._groups = {
            "cuisine": {
                "text": "Ẩm thực",
                "fa-icon": "fa-cutlery",
                "kv": [
                    ["amenity", "restaurant"],
                    ["amenity", "cafe"],
                    ["amenity", "fast_food"],
                    ["amenity", "food_court"],
                    ["amenity", "fast_food"]

                ]
            },
            "hotel": {
                "text": "Nhà nghỉ",
                "fa-icon": "fa-hotel",
                "kv": [
                    ["tourism", "hotel"],
                    ["tourism", "guest_house"],
                    ["tourism", "motel"]
                ]
            },
            "entertainment": {
                "text": "Giải trí",
                "fa-icon": "fa-glass",
                "kv": [
                    ["amenity", "nightclub"],
                    ["amenity", "pub"],
                    ["amenity", "theatre"],
                    ["amenity", "casino"],
                    ["amenity", "cinema"]
                ]
            },
            "shopping": {
                "text": "Mua sắm",
                "fa-icon": "fa-shopping-bag",
                "kv": [
                    ["shop", "mall"],
                    ["shop", "supermarket"],
                    ["shop", "shoes"],
                    ["shop", "jewelry"],
                    ["shop", "fashion"],
                    ["shop", "bakery"],
                    ["shop", "convenience"],
                    ["amenity", "marketplace"]
                ]
            }
        };
        this._locationMarker = null;
        this._markers = [];
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement("div");
        let wefilterContainer = document.createElement("div");
        wefilterContainer.setAttribute("id", "wefilter-container");

        let wefilterTitle = document.createElement("div");
        wefilterTitle.setAttribute("id", "wefilter-title");
        wefilterTitle.innerHTML = "Khám phá xung quanh bạn";

        let wefilterAqi = document.createElement("span");
        wefilterAqi.setAttribute("id", "wefilter-aqi");
        wefilterAqi.innerHTML = "AQI 310";
        wefilterTitle.appendChild(wefilterAqi);

        let wefilterTemp = document.createElement("span");
        wefilterTemp.setAttribute("id", "wefilter-temp");
        wefilterTemp.innerHTML = "<i class='fa fa-cloud'></i> 26°C";
        wefilterTitle.appendChild(wefilterTemp);        

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
        // TODO: when removing this marker?
        this._locationMarker = this.createMarker("wefilter-marker", "wefilter-marker-location", "fa fa-male")
        .setLngLat([this._userLocation.lng, this._userLocation.lat])
        .addTo(this._map);

        if(this._currentGroup == null) { // user want to turn on
            this._currentGroup = group;
            document.getElementById("wefilter-button-container-" + group).classList.add("wefilter-button-container-active");
            this.queryFeatures(group);
        } else {
            document.getElementById("wefilter-button-container-" + this._currentGroup).classList.remove("wefilter-button-container-active");
            if(this._currentGroup != group) { // user want to change
                this.clearPrevResult();
                this.queryFeatures(group);
                this._currentGroup = group;
                document.getElementById("wefilter-button-container-" + group).classList.add("wefilter-button-container-active");
            } else { // user just click again to turn off 
                this._currentGroup = null;
                this.clearPrevResult();
                this._locationMarker.remove();
                this._locationMarker = null;
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

        let keyValuePairs = this._groups[group]["kv"];

        let minLon = null;
        let maxLon = null;
        let minLat = null;
        let maxLat = null;

        let requestNum = 0;

        keyValuePairs.forEach((pair) => {
            let exploreUrl = this.createExploreUrl(this._userLocation.lat,  this._userLocation.lng, pair[0], pair[1], 1000, 20);
            makeRequest({
                url: exploreUrl,
                method: "GET"
            }, (err, res) => {
                requestNum += 1;
                if(res != undefined) {
                    let points = JSON.parse(res);
                    points.forEach(point => {
                        let lat = parseFloat(point.lat);
                        let lon = parseFloat(point.lon);
                        (minLon == null || minLon > lon) && (minLon = lon);
                        (minLat == null || minLat > lat) && (minLat = lat);
                        (maxLon == null || maxLon < lon) && (maxLon = lon);
                        (maxLat == null || maxLat < lat) && (maxLat = lat);
                        
                        let marker = this.createMarker("wefilter-marker", "wefilter-marker-" + group, "fa fa-map-marker").setLngLat([lon, lat]).addTo(this._map);
                        marker.setPopup(this.createPopup(point, pair[1]));
                        let markerEl = marker.getElement();
                        markerEl.addEventListener('mouseenter', () => marker.togglePopup());
                        markerEl.addEventListener('mouseleave', () => marker.togglePopup());
                        this._markers.push(marker);
                    });
                    if(requestNum == keyValuePairs.length) {
                        this._map.fitBounds([
                            [minLon, minLat],
                            [maxLon, maxLat]
                        ]);
                    }               
                }
                
            });

        });
        
    }

    createMarker(elClass, elId, iconClass) {
        let markerEl = document.createElement("div");
        markerEl.setAttribute("class", elClass);
        markerEl.setAttribute("id", elId);
        let markerIcon = document.createElement("i");
        markerIcon.setAttribute("class", iconClass);
        markerEl.appendChild(markerIcon);
        let marker = new wemapgl.Marker(markerEl);
        return marker;
    }

    createPopup(point, value) {
        console.log(point);
        console.log(value);
        console.log(point.address[value]);
        let popup = new wemapgl.Popup({offset: 15}).setHTML(
            '<p>' + point.address[value] + '</p>'
        );
        return popup;
    }

    clearPrevResult() {
        this._markers.forEach(marker => marker.remove());
        this._markers = [];
    }

    createExploreUrl(lat, lon, k, v, distance, limit) {
        // TODO: move to config file
        let url = "https://apis.wemap.asia/we-tools/explore?"
        + "k=" + k + "&"
        + "v=" + v + "&"
        + "lat=" + lat + "&"
        + "lon=" + lon + "&"
        + "limit=" + limit + "&"
        + "d=" + distance;
        return url;
    }

}