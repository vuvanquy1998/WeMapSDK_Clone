// import { encodeURL } from '../util/encode';
import PeliasGeocoder from "../pelias-geocoder/pelias-geocoder";
import PlaceDetail from "./placeDetail";
import { default as config } from "../config.json";
/**
 * Handle event search
 */
export default class WeGeocoder {
    constructor(options) {
        options = options || {};
        this.options = options;
        this.options.params = { key: this.options.key };
        this.options.url = config.search.url;

        this.options.suggestion.min_chars |= 4;
        if (!this.options.marker) {
            this.options.marker = {};
        }
        this.options.useFocusPoint = true;
        this.options.marker.icon = this.initMarker();
        WeGeocoder.min_chars = this.options.suggestion.min_chars;
        this.geocoder = this.getGeocoder(this.options);
        this.geocoder.resultAutocompele = null;
        this.geocoder.resultSearch = null;
        this.place = new PlaceDetail({ key: this.options.key });
        this.init();
        // delete this.options.key;
        return this.geocoder;
    }

    /**
     * @returns geocoder
     */
    getGeocoder(options) {
        let engine = options.engine;
        switch (engine) {
            case undefined:
            case "default":
            case "pelias":
                return this.enginePeliasGeocoder(options);
            default:
                return null;
        }
    }

    /**
     * @returns peliasGeocoder
     */
    enginePeliasGeocoder(options) {
        return new PeliasGeocoder(options);
    }
    /**
     * init view, all event
     */
    init() {
        this.initMultiView();
        this.overrideFunctionPelias();
        this.initEvent();
    }
    /**
     * fly to feature
     */
    flyto(lat, lon, zoom = 15) {
        let geocoder = this.geocoder;
        let map = geocoder._map;
        var cameraOpts = {
            center: [lon, lat],
            zoom: zoom
        };
        geocoder._removePolygon()
        if (geocoder._useFlyTo(cameraOpts)) {
            map.flyTo(cameraOpts);
        } else {
            map.jumpTo(cameraOpts);
        }
    }
    /**
     * get info from url and show view
     */
    updateInfoFromUrl() {
        let wegeocoder = this;
        let info = wemapgl.urlController.getParams();
        let lat = parseFloat(info.lat);
        let lon = parseFloat(info.lon);
        let geocoder = wegeocoder.geocoder;
        if (lat) {
            wegeocoder.place.setAttribute({
                name: info.name,
                type: info.type,
                lat: lat,
                lon: lon,
                address: info.address,
                osm_id: info.osmid,
                osm_type: info.osmtype
            });
            geocoder._removeMarkers();
            geocoder._results = null;
            wegeocoder.place.showDetailFeature();
            try {
                geocoder._customHtmlMarkers.push(
                    geocoder._addAndGetCustomHtmlMarker([lon, lat])
                );
                wegeocoder.flyto(lat, lon);
            } catch (err) {
                window.addEventListener("DOMContentLoaded", function() {
                    geocoder._customHtmlMarkers.push(
                        geocoder._addAndGetCustomHtmlMarker([lon, lat])
                    );
                    wegeocoder.flyto(lat, lon);
                });
            }
        }
    }

    /**
     * update list marker from results
     */
    updateListMarker(result) {
        if (result) {
            let features = this._removeDuplicates(result.features);
            if (this.opts.marker && this.opts.marker.multiple) {
                this._updateMarkers(features);
            }
        }
    }

    /**
     * get feature from list features by coordinates
     * @param coordinates
     */
    getFeatureFromResultByLatLon(coordinates) {
        let self = this;
        let results = self._results;
        if (!results) {
            return null;
        }
        let features = results.features;

        for (let index in features) {
            if (coordinates == features[index].geometry.coordinates) {
                return features[index];
            }
        }
        return null;
    }

    overrideAddAndGetCustomHtmlMarker(coordinates) {
        let self = this;

        let marker = new mapboxgl.Marker(this.opts.marker.icon.cloneNode(true))
            .setLngLat(coordinates)
            .addTo(this._map);
        let feature = this.getFeatureFromResultByLatLon(coordinates);
        if (!feature) {
            return marker;
        }
        let address = [
            feature.properties.street,
            feature.properties.county,
            feature.properties.region,
            feature.properties.country
        ];
        address = WeGeocoder.getAddress(address);
        let viewPopup = document.createElement("div");
        viewPopup.classList.add("viewPopup");
        viewPopup.innerHTML =
            '<div class="popupname">' +
            feature.properties.name +
            "</div>" +
            '<div class="popupaddress">' +
            address +
            "</div>" +
            '<div class="popuplatlon">' +
            feature.geometry.coordinates[0] +
            ", " +
            feature.geometry.coordinates[1] +
            "</div>";
        marker._map.off("click", marker._onMapClick);
        marker._map.off("mousedown", marker._addDragHandler);
        marker._map.off("touchstart", marker._addDragHandler);
        marker._map.off("mousemove", marker._onMove);
        let markerElement = marker._element;
        markerElement.appendChild(viewPopup);
        let markerIcon = markerElement.firstChild;
        markerIcon.onmouseenter = function(e) {
            const targetElement = e.target;
            if (
                targetElement === markerElement ||
                markerElement.contains(targetElement)
            ) {
                viewPopup.style.display = "block";
            }
        };
        markerIcon.onmouseleave = function(e) {
            viewPopup.style.display = "none";
        };
        markerIcon.onclick = function(e) {
            self._goToFeatureLocation(feature, true);
            if (!e) var e = window.event;
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            let redMarker = wemapgl.reverse.marker;
            if (redMarker) {
                wemapgl.reverse.removeMarkerAndHideUI();
            }
        };

        return marker;
    }

    overrideSearch(opts, callback, api) {
        opts = opts || {};
        if (!opts.text || opts.text.length === 0) {
            return callback();
        }
        if (this.opts.sources instanceof Array) {
            this.opts.sources = this.opts.sources.join(",");
        }
        this._search = opts.text;
        var url =
            this.opts.url +
            "/" +
            api +
            "?text=" +
            opts.text +
            "&boundary.country=VNM" +
            (this.params ? this.params : "") +
            (this.opts.sources ? "&sources=" + this.opts.sources : "") +
            (this.opts.useFocusPoint
                ? "&focus.point.lat=" +
                  this._map.getCenter().lat +
                  "&focus.point.lon=" +
                  this._map.getCenter().lng
                : "");
        this._sendXmlHttpRequest(url, callback);
    }
    initPolygon(){
        let geocoder = this.geocoder
        geocoder.opts.wof = {};
        geocoder.opts.wof.url = 'https://raw.githubusercontent.com/whosonfirst-data/whosonfirst-data-admin-$country/master/data/';
        geocoder.opts.wof.fillColor = "rgba(200, 40, 32, 0.1)";
        geocoder.opts.wof.fillOutlineColor = "rgba(200, 40, 32, 0.7)";
        geocoder.getWOFURL = geocoder.getDefaultWOFURLFunction();
        geocoder._removePolygon = geocoder._removeSources.bind(geocoder, geocoder.opts.wof, geocoder.polygonLayerId);
    }
    overrideRemovePolygon(){

    }
    overrideBuildInputHTMLElement() {
        let self = this;
        var inputEl = this._createElement({ type: "input" });
        inputEl.type = "text";
        inputEl.placeholder = this.opts.placeholder;
        inputEl.addEventListener("focus", function(e) {
            self._removeMarkers();
            if (
                self.resultAutocompele &&
                self.resultAutocompele.features.length > 0
            ) {
                self.updateListMarker(self.resultAutocompele);
                self._resultsListEl.showAll();
            } else if (
                self.resultSearch &&
                self.resultSearch.features.length > 0
            ) {
                self.updateListMarker(self.resultSearch);
                WeGeocoder.showResultSearch();
            }
            WeGeocoder.hideDetailFeatureFrame();
        });
        inputEl.addEventListener("keyup", function(e) {
            WeGeocoder.hideNoResult();
            // Enter -> go to feature location.
            if (
                self._eventMatchKey(e, self._keys.enter) &&
                self._selectedFeature
            ) {
                inputEl.blur();
                self._goToFeatureLocation(self._selectedFeature, true);
                return;
            }

            // Arrow down -> focus on the first result.
            if (
                self._eventMatchKey(e, self._keys.arrowDown) &&
                self._results &&
                self._results.features[0]
            ) {
                self._resultsListEl.firstChild.focus();
                return;
            }

            var value = this.value.trim();

            if (value.length === 0) {
                self._clearAll();
                return;
            }

            if (
                self._selectedFeature &&
                value !== self._selectedFeature.properties.label
            ) {
                self._addOrRemoveClassToElement(
                    self._iconSearchEl,
                    true,
                    "pelias-ctrl-disabled"
                );
                self._selectedFeature = undefined;
            }

            if (
                !self._eventMatchKey(e, self._keys.enter) &&
                self.opts.onSubmitOnly
            ) {
                return;
            }

            self._addOrRemoveClassToElement(
                self._iconCrossEl,
                false,
                "pelias-ctrl-hide"
            );

            // Do the search request.
            if (this._timeoutId !== undefined) {
                clearTimeout(this._timeoutId);
            }
            if (self._eventMatchKey(e, self._keys.enter)) {
                self.search(
                    { text: value },
                    function(err, results) {
                        if (err) {
                            return self._showError(err);
                        }
                        if (results) {
                            self._clearAll();
                            WeGeocoder.hideDetailFeatureFrame();
                            self.createResultsSearch(results);

                            // create list marker
                            self._results = results;
                            self.resultSearch = results;
                            self.resultAutocompele = null;
                            let features = self._removeDuplicates(
                                results.features
                            );
                            if (self.opts.marker && self.opts.marker.multiple) {
                                self._updateMarkers(features);
                            }
                            self._addOrRemoveClassToElement(
                                self._iconCrossEl,
                                false,
                                "pelias-ctrl-hide"
                            );
                            self._addOrRemoveClassToElement(
                                self._iconSearchEl,
                                false,
                                "pelias-ctrl-disabled"
                            );
                        }
                    },
                    "search"
                );
                self._resultsListEl.hideAll();
            }

            if (
                !self._eventMatchKey(e, self._keys.enter) &&
                !self._eventMatchKey(e, self._keys.arrowUp)
            ) {
                if (this.value.length >= WeGeocoder.min_chars) {
                    self.search(
                        { text: value },
                        function(err, result) {
                            if (err) {
                                return self._showError(err);
                            }
                            if (result) {
                                self.resultAutocompele = result;
                                self._resultsListEl.showAll();
                                return self._showResults(result);
                            }
                        },
                        "autocomplete"
                    );
                }
            }
        });
        return inputEl;
    }

    initEventClickBottomCard() {
        document
            .getElementById("wemap-click-detail")
            .addEventListener("click", e => {
                this.updateInfoFromUrl();
                WeGeocoder.hideResultSearch();
            });
    }
    static initEventDirection(lat, lon) {
        WeGeocoder.hideAll();
        wemapgl.urlController.updateParams("route", { dx: lat, dy: lon });
    }

    initEventIconCross() {
        var originBuildIconCross = this.geocoder._buildIconCrossHTMLElement;
        this.geocoder._buildIconCrossHTMLElement = function() {
            let iconCrossEl = originBuildIconCross.call(this);
            var self = this;
            iconCrossEl.addEventListener("click", function() {
                self._results = null;
                self.resultAutocompele = null;
                self.resultSearch = null;
                WeGeocoder.hideDetailFeatureFrame();
                WeGeocoder.hideResultSearch();
                WeGeocoder.removeAllMarker();
            });
            return iconCrossEl;
        };
    }
    /**
     * init event close detail frame
     */
    initEventCloseDetailFrame() {
        var geocoder = this.geocoder;
        document
            .getElementById("wemap-close-detail-button")
            .addEventListener("click", function() {
                geocoder._removeMarkers();
                if (
                    geocoder._results &&
                    geocoder._results.features.length > 0
                ) {
                    geocoder.updateListMarker();
                }
                WeGeocoder.hideDetailFeatureFrame();
            });
    }

    /**
     * Handle event click to icon on the map
     */
    initEventClickMap() {
        let wegeocoder = this;
        let self = wegeocoder.geocoder;
        this.geocoder._map.on("click", e => {
            WeGeocoder.hideResultAutocompele();
            WeGeocoder.removeAllMarker();
            if (self.resultSearch && self.resultSearch.features.length > 0) {
                self.updateListMarker(self.resultSearch);
            }
            if (wemapgl.reverse.isIcon(e)) {
                setTimeout(function() {
                    wegeocoder.updateInfoFromUrl();
                    wemapgl.reverse.removeMarkerAndHideUI();
                }, 300);
            }
        });
    }

    /**
     * init all event
     */
    initEvent() {
        let wegeocoder = this;
        window.addEventListener("DOMContentLoaded", function() {
            wegeocoder.initEventClickBottomCard();
            wegeocoder.initEventCloseDetailFrame();
            wegeocoder.clickedToResultLists();
            wegeocoder.initEventClickMap();
        });
    }
    /**
     * create view result search (enter)
     * @param result
     */
    createResultsSearch(result) {
        let self = this;
        let results = document.getElementById("wemap-results-list");
        if (result.features == false) {
            let no_result = document.getElementById("wemap-no-result");
            no_result.classList.add("wemap-no-result");
            no_result.innerHTML =
                "Không có kết quả tìm kiếm" +
                '<span class="fa fa-times" id= "wemap-icon-cross-noresult"></span>';
            WeGeocoder.hideResultSearch();
            WeGeocoder.showNoResult();
            self._clearAll();

            document
                .getElementById("wemap-icon-cross-noresult")
                .addEventListener("click", function(e) {
                    WeGeocoder.hideNoResult();
                });
            return;
        }
        WeGeocoder.hideNoResult();
        WeGeocoder.showResultSearch();

        let features = result.features;
        self._goToFeatureLocation(features[0]);
        let resultFeatures = "";
        features.forEach(function(feature, i) {
            if (i < features.length) {
                resultFeatures =
                    resultFeatures +
                    '<li class="js-poicard poicard">' +
                    '<div class="f-control feature-directions">' +
                    '<i class="fa fa-arrow-right wemap-directions"  class="routing-button">' +
                    "</i>" +
                    '<div class="result-way">' +
                    "Đường đi" +
                    "</div>" +
                    "</div>" +
                    '<div class="poicard-info w_rating">' +
                    '<h5 class="poicard-title" >' +
                    '<a href="/en/map/3461127733553674">' +
                    feature.properties.name +
                    "</a>" +
                    "</h5>" +
                    '<span class="average">' +
                    0 +
                    " " +
                    "</span>" +
                    '<span class="stars">' +
                    '<div class="rating">' +
                    '<label class = "full" for="star5" title="Awesome - 5 stars">' +
                    "</label>" +
                    '<label class = "full" for="star4" title="Pretty good - 4 stars">' +
                    "</label>" +
                    '<label class = "full" for="star3" title="Meh - 3 stars">' +
                    "</label>" +
                    '<label class = "full" for="star2" title="Kinda bad - 2 stars">' +
                    "</label>" +
                    '<label class = "full" for="star1" title="Sucks big time - 1 star">' +
                    "</label>" +
                    "</div>" +
                    "</span>" +
                    '<span class="average1">' +
                    " (" +
                    Math.floor(300 + Math.random() * 1000) +
                    ")" +
                    "</span>" +
                    '<div class="poicard-category_and_rating">' +
                    '<div class="poicard-category">' +
                    feature.geometry.type +
                    "</div>" +
                    "</div>" +
                    '<ul class="poicard-data">' +
                    '<div class="poicard-data-item address">' +
                    WeGeocoder.getAddress([
                        feature.properties.street,
                        feature.properties.county,
                        feature.properties.region,
                        feature.properties.country
                    ]) +
                    "</div>" +
                    '<div id="lat-log">' +
                    feature.geometry.coordinates[1] +
                    "," +
                    feature.geometry.coordinates[0] +
                    "</div>" +
                    "</ul>" +
                    "</div>" +
                    "</li>";
            }
        });

        results.innerHTML = resultFeatures;
        let resultList = results.querySelectorAll("li");
        resultList.forEach(function(result, index) {
            result.onmouseover = function(e) {
                self._goToFeatureLocation(features[index]);
            };
            result.onclick = function(e) {
                self._selectFeature(features[index]);
                self._goToFeatureLocation(features[index], true);
                WeGeocoder.hideResultSearch();
            };

            let rating = result.querySelectorAll(".full");
            let averageStar = 2 + Math.floor(Math.random() * 3 * 10) / 10;

            for (let i = 0; i < Math.floor(averageStar); i++) {
                rating[4 - i].style.color = "#E7711B";
            }
            let rating_number = result.querySelector(".average");
            rating_number.innerHTML = averageStar;
            rating.onclick = function(e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
            };
            let routing = result.querySelector(".f-control");

            routing.onclick = function(e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                let urlInfo = wemapgl.urlController.getParams();
                // wemapgl.urlController.updateParams("route", {dx: urlInfo.x , dy: urlInfo.y })
                WeGeocoder.initEventDirection(urlInfo.x, urlInfo.y);
            };
            let star = result.querySelector(".stars");
            star.onclick = function(e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
            };
        });
    }

    /**
     * init default marker
     * @returns marker
     */

    initMarker() {
        let iconMarkerEl = document.createElement("div");
        iconMarkerEl.innerHTML =
            "<div class='wemap-marker-arrow'></div>" +
            "<div class='wemap-marker-pulse'></div>";
        return iconMarkerEl;
    }

    /**
     * init view detailFeature, result search
     */
    initMultiView() {
        let view_search = document.createElement("div");
        view_search.setAttribute("id", "wemap-results-search");
        view_search.innerHTML =
            '<div id="wemap-results-items">' +
            '<section class="results with_ads">' +
            '    <ul id="wemap-results-list"></ul>' +
            "</section>" +
            "</div>" +
            '<ul id="wemap-no-result"></ul>';
        let view_detail = document.createElement("div");
        view_detail.setAttribute("id", "wemap-detail-feature");
        view_detail.setAttribute("class", "wemap-scrollbar");
        view_detail.innerHTML =
            '<button class="btn" id="wemap-close-detail-button" title="Close"><i class="fa fa-close"></i></button>' +
            '<div class="wemap-detail-feature-element" id="wemap-feature-img"></div>' +
            '<div class="wemap-detail-feature-heading">' +
            '    <div id="wemap-feature-name"></div>' +
            '    <div class="wemap-detail-feature-category-rating">' +
            '        <div id="feature-rating"></div>' +
            "    </div>" +
            "</div>" +
            '<div id="wemap-feature-controls">' +
            '    <div class="wemap-feature-control" id="wemap-feature-directions">' +
            '        <i class="fa fa-arrow-right "></i><span>Chỉ đường</span>' +
            "    </div>" +
            '    <div class="wemap-feature-control">' +
            '        <i class="fa fa-share-alt"></i><span>Chia sẻ</span>' +
            "    </div>" +
            '    <div class="wemap-feature-control">' +
            '        <i class="fa fa-comments"></i><span>Nhận xét</span>' +
            "    </div>" +
            "</div>" +
            '<div class="wemap-detail-feature-body">' +
            '    <p id="feature-description"></p>' +
            '    <div class="wemap-information-feature">' +
            '        <div class="wemap-detail-feature-element" id="feature-location">' +
            "        </div>" +
            '        <div class="wemap-detail-feature-element" id="feature-coordinates">' +
            "        </div>" +
            '        <div id="feature-website">' +
            "        </div>" +
            '        <div id="feature-phone">' +
            "        </div>" +
            '        <div id="feature-opening-hours">' +
            "        </div>" +
            '        <div id="feature-internt-access">' +
            "        </div>" +
            '        <div id="feature-fax">' +
            "        </div>" +
            '        <div id="feature-email">' +
            "        </div>" +
            '        <div id="feature-level">' +
            "        </div>" +
            '        <div id="feature-smoking">' +
            "        </div>" +
            '        <div id="feature-stars">' +
            "        </div>" +
            '        <div id="feature-smoking">' +
            "        </div>" +
            "    </div>" +
            "</div>";
        document.body.appendChild(view_search);
        document.body.appendChild(view_detail);
    }

    overrideFunctionPelias() {
        let wegeocoder = this;
        let geocoder = wegeocoder.geocoder
        wegeocoder.updateInfoFromUrl();
        geocoder._sendXmlHttpRequest = function(url, callback) {
            // let key = wegeocoder.options.key;
            // url = encodeURL(url, key)
            var req = new XMLHttpRequest();
            req.addEventListener("load", function() {
                switch (this.status) {
                    case 200:
                        return callback(null, JSON.parse(this.responseText));
                    case 400:
                        return callback("You sent a bad request.");
                    case 401:
                        return callback(
                            "You are not authorized to use this geocode."
                        );
                    case 500:
                        return callback("This server can not answer yet.");
                }
            });
            req.open("GET", url);
            req.send();
        };

        wegeocoder.initPolygon()
        geocoder._buildAndGetResult = function(feature, index) {
            let self = this;

            let resultEl = this._createElement({ class: "pelias-ctrl-result" });
            resultEl.feature = feature;
            resultEl.setAttribute("tabindex", "-1");

            var iconClassName = this._layerToIcon(feature.properties.layer);
            if (iconClassName) {
                var resultIconEl = this._createElement({
                    type: "span",
                    class: "pelias-ctrl-icon-result " + iconClassName
                });
                resultEl.appendChild(resultIconEl);
            }

            var labelWrapperEl = this._createElement({
                type: "span",
                class: "pelias-ctrl-wrapper-label"
            });
            var name = "";
            name = feature.properties.name
                ? name + feature.properties.name
                : name;
            name = feature.properties.street
                ? name + ", " + feature.properties.street
                : name;
            var nameEl = this._boldingPartsOfStringAccordingToTheSearch(
                name,
                this._search
            );
            nameEl.className = "name";
            var labelWrapperEl = this._createElement({
                type: "span",
                class: "pelias-ctrl-wrapper-label"
            });
            labelWrapperEl.appendChild(nameEl);

            if (feature.properties.country) {
                // Add a span containing the dash separator.
                var separatorEl = this._createElement({
                    type: "span",
                    class: "pelias-ctrl-separator"
                });
                separatorEl.innerHTML = " - ";
                labelWrapperEl.appendChild(separatorEl);
                var address = "";
                address = feature.properties.locality
                    ? address + feature.properties.locality + ", "
                    : address;
                address = feature.properties.county
                    ? address + feature.properties.county + ", "
                    : address;
                address = feature.properties.region
                    ? address + feature.properties.region + ", "
                    : address;
                address = feature.properties.country
                    ? address + feature.properties.country
                    : address;
                // Add a span containing the location of the result with potentially bold span.
                var locationEl = this._boldingPartsOfStringAccordingToTheSearch(
                    address,
                    this._search
                );
                locationEl.className = "pelias-ctrl-location";
                labelWrapperEl.appendChild(locationEl);
            }

            resultEl.appendChild(labelWrapperEl);

            resultEl.addEventListener("focus", function() {
                self._goToFeatureLocation(feature);
                self._resultsListEl.showAll();
            });
            resultEl.addEventListener("click", function() {
                WeGeocoder.hideResultSearch();
                self._goToFeatureLocation(feature, true);
            });
            resultEl.addEventListener("keydown", function(e) {
                if (self._eventMatchKey(e, self._keys.enter)) {
                    self._goToFeatureLocation(feature, true);
                }
                if (self._eventMatchKey(e, self._keys.arrowUp)) {
                    if (self._resultsListEl.childNodes[index - 1]) {
                        self._resultsListEl.childNodes[index - 1].focus();
                    } else if (index - 1 === -1) {
                        self._inputEl.focus();
                    }
                }
                if (
                    self._eventMatchKey(e, self._keys.arrowDown) &&
                    self._resultsListEl.childNodes[index + 1]
                ) {
                    self._resultsListEl.childNodes[index + 1].focus();
                }
            });
            return resultEl;
        };
        wegeocoder.initEventIconCross();
        geocoder.getFeatureFromResultByLatLon =
            wegeocoder.getFeatureFromResultByLatLon;
        geocoder._addAndGetCustomHtmlMarker =
            wegeocoder.overrideAddAndGetCustomHtmlMarker;
        geocoder.createResultsSearch =
            wegeocoder.createResultsSearch;
        geocoder.search = wegeocoder.overrideSearch;
        wegeocoder.geocoder._buildInputHTMLElement =
            wegeocoder.overrideBuildInputHTMLElement;
        geocoder.updateListMarker = wegeocoder.updateListMarker;

        var originBuildResultsListHTMLElement =
            wegeocoder.geocoder._buildResultsListHTMLElement;
        geocoder._buildResultsListHTMLElement = function() {
            var resultsListEl = originBuildResultsListHTMLElement.call(this);
            resultsListEl.hideAll = function() {
                resultsListEl.style.display = "none";
            };
            resultsListEl.showAll = function() {
                resultsListEl.style.display = "block";
            };
            return resultsListEl;
        };

        geocoder._goToFeatureLocation = function(
            feature,
            viewDetail
        ) {
            let info = feature.properties;
            let lat = feature.geometry.coordinates[1];
            let lon = feature.geometry.coordinates[0];
            let osm_id = "";
            let osm_type = "";
            var get_number = /[0-9]/g;
            if(feature.properties.source == "openstreetmap"){
                osm_id = info.id.match(get_number).join("");
                var get_text = /[a-zA-Z]/;
                osm_type = info.id
                    .match(get_text)
                    .join("")
                    .toUpperCase();
            }

            if (viewDetail) {
                this._removeMarkers();
                let name = info.name;
                let type = feature.geometry.type;

                let address = [
                    info.street,
                    info.locality,
                    info.county,
                    info.region,
                    info.country
                ];
                wegeocoder.place.setAttribute({
                    name,
                    type,
                    lat,
                    lon,
                    address,
                    osm_id,
                    osm_type
                });
                wegeocoder.place.showDetailFeature();
                this._updateMarkers(feature);
            }
            // default goToFeature
            let zoom = this._getBestZoom(feature)
            wegeocoder.flyto(lat, lon, zoom)
            let cameraOpts = {
                center: feature.geometry.coordinates,
                zoom: zoom
            };
            if (
                feature.properties.source === "whosonfirst" &&
                [
                    "macroregion",
                    "region",
                    "macrocounty",
                    "county",
                    "locality",
                    "localadmin",
                    "borough",
                    "macrohood",
                    "neighbourhood",
                    "postalcode"
                ].indexOf(feature.properties.layer) >= 0
            ) {
                this._showPolygon(feature.properties, cameraOpts.zoom);
            } else {
                this._removePolygon();
            }
        };
    }
    /**
     * @returns standardized address
     */
    static getAddress(address) {
        if (!Array.isArray(address)) {
            address = address.split(",");
        }
        let address_result = "";
        var separator = "";
        for (let i = 0; i < address.length; i++) {
            address[i] = address[i] ? address[i] : "";
            if (address[i]) {
                address_result = address_result + separator + address[i];
                separator = ", ";
            }
        }
        return address_result;
    }

    /**
     * hide view show info feature
     */
    static hideDetailFeatureFrame() {
        let detail_feature = document.getElementById("wemap-detail-feature");
        if (detail_feature) {
            document.getElementById("wemap-detail-feature").style.display =
                "none";
        }
        wemapgl.urlController.deleteParams("place");
    }
    /**
     * hide view result search(enter)
     */
    static hideResultSearch() {
        document.getElementById("wemap-results-items").style.display = "none";
        document.getElementById("wemap-no-result").style.display = "none";
    }
    /**
     * show view result search(enter)
     */
    static showResultSearch() {
        document.getElementById("wemap-results-items").style.display =
            "inline-block";
    }
    /**
     * hide view result search - no result
     */
    static hideNoResult() {
        document.getElementById("wemap-no-result").style.display = "none";
    }
    /**
     * show view result search(enter) - no result
     */
    static showNoResult() {
        document.getElementById("wemap-no-result").style.display =
            "inline-block";
    }
    /**
     * hide view result search (typing)
     */
    static hideResultAutocompele() {
        let resultAutocompele = document.getElementsByClassName(
            "pelias-ctrl-results-list"
        )[0];
        if (resultAutocompele) {
            resultAutocompele.style.display = "none";
        }
    }
    /**
     * remove all marker
     */
    static removeAllMarker() {
        const markers = document.querySelectorAll(
            "div.mapboxgl-marker.mapboxgl-marker-anchor-center"
        );
        markers.forEach(ele => {
            ele.remove();
            // wemapgl.WeGeocoder.hideResultSearch();
            // wemapgl.WeGeocoder.hideNoResult();
        });
    }

    static hideAll() {
        let iconCross = document.getElementsByClassName(
            "pelias-ctrl-icon-cross"
        )[0];
        iconCross.click();
    }
    clickedToResultLists() {
        window.addEventListener("DOMContentLoaded", function() {
            const peliasSelector = document.querySelectorAll(
                "div.pelias-ctrl-results.pelias-ctrl-shadow"
            )[0];
            peliasSelector.addEventListener("click", () => {
                wemapgl.reverse.removeMarkerAndHideUI();
            });
        });
    }
}
