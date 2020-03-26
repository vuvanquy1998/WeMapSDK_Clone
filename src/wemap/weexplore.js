import { makeRequest } from '../util/ajax';
export default class WeExploreControl {
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
        let weexploreContainer = document.createElement("div");
        weexploreContainer.setAttribute("id", "weexplore-container");

        let weexploreTitle = document.createElement("div");
        weexploreTitle.setAttribute("id", "weexplore-title");
        weexploreTitle.innerHTML = "Khám phá xung quanh bạn";

        let weexploreAqi = document.createElement("span");
        weexploreAqi.setAttribute("id", "weexplore-aqi");
        weexploreAqi.innerHTML = "AQI 310";
        weexploreTitle.appendChild(weexploreAqi);

        let weexploreTemp = document.createElement("span");
        weexploreTemp.setAttribute("id", "weexplore-temp");
        weexploreTemp.innerHTML = "<i class='fa fa-cloud'></i> 26°C";
        weexploreTitle.appendChild(weexploreTemp);        

        weexploreContainer.appendChild(weexploreTitle);

        Object.keys(this._groups).forEach(group => {
            let weexploreButtonContainer = document.createElement("div");
            weexploreButtonContainer.setAttribute("class", "weexplore-button-container");
            weexploreButtonContainer.setAttribute("id", "weexplore-button-container-" + group);

            let button = document.createElement("button");
            button.setAttribute("class", "weexplore-button");
            button.setAttribute("id", "weexplore-button-" + group);

            let icon = document.createElement("i");
            icon.setAttribute("class", "fa " + this._groups[group]["fa-icon"]);
            button.appendChild(icon);
            
            weexploreButtonContainer.appendChild(button);
            weexploreButtonContainer.addEventListener("click", () => this.onGroupClick(group));

            let span = document.createElement("span");
            span.innerHTML = this._groups[group]["text"];
            weexploreButtonContainer.appendChild(span);

            weexploreContainer.appendChild(weexploreButtonContainer);
        });

        this._container.appendChild(weexploreContainer);
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
        this._locationMarker = this.createMarker("weexplore-marker", "weexplore-marker-location", "fa fa-male")
        .setLngLat([this._userLocation.lng, this._userLocation.lat])
        .addTo(this._map);

        if(this._currentGroup == null) { // user want to turn on
            this._currentGroup = group;
            document.getElementById("weexplore-button-container-" + group).classList.add("weexplore-button-container-active");
            this.queryFeatures(group);
        } else {
            document.getElementById("weexplore-button-container-" + this._currentGroup).classList.remove("weexplore-button-container-active");
            if(this._currentGroup != group) { // user want to change
                this.clearPrevResult();
                this.queryFeatures(group);
                this._currentGroup = group;
                document.getElementById("weexplore-button-container-" + group).classList.add("weexplore-button-container-active");
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
        errorContainer.setAttribute("id", "weexplore-error-container");
        errorContainer.innerHTML = str;
        document.getElementById("weexplore-container").appendChild(errorContainer);
    }

    clearError() {
        let el = document.getElementById("weexplore-error-container");
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
                        
                        let marker = this.createMarker("weexplore-marker", "weexplore-marker-" + group, "fa fa-map-marker").setLngLat([lon, lat]).addTo(this._map);
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