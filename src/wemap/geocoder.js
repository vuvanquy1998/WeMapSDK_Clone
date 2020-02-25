import PeliasGeocoder from '../pelias-geocoder/pelias-geocoder'
import PlaceDetail from './placeDetail'
export default class WeGeocoder {
        constructor(options) {
            options = options || {}
            this.options = options
            this.options.params = {'key': this.options.key}
            // this.options.url = 'https://places.jawg.io/v1'
            this.options.url = 'https://apis.wemap.asia/geocode-1'
            delete this.options.key
            this.options.suggestion.min_chars |= 4
            if(!this.options.marker){
                this.options.marker = {}
            }
            this.options.marker.icon = this.initMarker()
            WeGeocoder.min_chars = this.options.suggestion.min_chars
            this.geocoder = this.init(this.options)
            this.initMultiView()
            this.initEvent()
            this.updateInfoFromUrl()
            return this.geocoder
        }

        /**
         * @returns geocoder
         */
        init(options){
            let engine = options.engine
            switch (engine) {
                case undefined:
                case 'default':
                case 'pelias':
                    return this.enginePeliasGeocoder(options)
                default:
                    return null
            }
        }

        /**
         * @returns peliasGeocoder
         */
        enginePeliasGeocoder(options){
            return new PeliasGeocoder(options);
        }

        updateInfoFromUrl(){
            let info = wemapgl.urlController.getParams()
            if (info.lat) {
                let place = new PlaceDetail({
                    name: info.name, type: info.type,
                    lat: info.lat, lon: info.long, address: info.address, osm_id: info.osmid, osm_type: info.osmtype
                });
                place.showDetailFeature()
            }
        }
        /**
         * @returns standardized address
         */
        static getAddess(address) {
            if(!Array.isArray(address)){
                address = address.split(',')
            }

            let address_result = "";
            var separator = "";
            for (let i = 0; i < address.length; i++) {
              address[i] = address[i] ? address[i] : ""
              if (address[i]) {
                address_result = address_result + separator + address[i]
                separator = ", "
              }
            }
            return address_result;
        }

        /**
         * override PeliasGeocoder.search
         */
        overrideSearch(opts, callback, api){
            opts = opts || {};
            if (!opts.text || opts.text.length === 0) {
                return callback();
            }
            if (this.opts.sources instanceof Array) {
                this.opts.sources = this.opts.sources.join(',');
            }
            this._search = opts.text;
            var url = this.opts.url + '/'+ api+ '?text=' + opts.text + "&boundary.country=VNM"
                + (this.params ? this.params : '')
                + (this.opts.sources ? ('&sources=' + this.opts.sources) : '')
                + (this.opts.useFocusPoint ? ('&focus.point.lat=' + this._map.getCenter().lat + '&focus.point.lon=' + this._map.getCenter().lng) : '');
            this._sendXmlHttpRequest(url, callback);
        }
        overrideBuildInputHTMLElement(){
            let self = this
            var inputEl = this._createElement({type: 'input'});
            inputEl.type = 'text';
            inputEl.placeholder = this.opts.placeholder;
            inputEl.addEventListener("focus", function(e){
                self._resultsListEl.showAll();
            })
            inputEl.addEventListener("keyup", function (e) {
                // Enter -> go to feature location.
                if (self._eventMatchKey(e, self._keys.enter) && self._selectedFeature) {
                    inputEl.blur();
                    self._goToFeatureLocation(self._selectedFeature);
                    return;
                }
                //  if(self._results){
                //     console.log(self._results)
                //  }
                
                // Arrow down -> focus on the first result.
                if (self._eventMatchKey(e, self._keys.arrowDown) && self._results && self._results.features[0]) {
                    self._resultsListEl.firstChild.focus();
                    return;
                }
            
                var value = this.value.trim();
            
                if (value.length === 0) {
                    self._clearAll();
                    return;
                }
            
                if (self._selectedFeature && value !== self._selectedFeature.properties.label) {
                    self._addOrRemoveClassToElement(self._iconSearchEl, true, "pelias-ctrl-disabled");
                    self._selectedFeature = undefined;
                }
            
                if (!self._eventMatchKey(e, self._keys.enter) && self.opts.onSubmitOnly) {
                    return;
                }
            
                self._addOrRemoveClassToElement(self._iconCrossEl, false, "pelias-ctrl-hide");
            
                // Do the search request.
                if (this._timeoutId !== undefined) {
                    clearTimeout(this._timeoutId);
                }
                if (self._eventMatchKey(e, self._keys.enter)) {
                    self.search({text: value}, function (err, result) {
                    if (err) {
                        return self._showError(err);
                    }
                    if (result) {
                        // self._clearAll()
                        WeGeocoder.hideDetailFeatureFrame()
                        self.showResultsSearch(result)
                    }
                    }, 'search');
                    self._resultsListEl.hideAll();
                    document.getElementById('results-search').style.display = 'inline-block';
                }
            
                if (!self._eventMatchKey(e, self._keys.enter)&&!self._eventMatchKey(e, self._keys.arrowUp)) {
                    if(this.value.length >= WeGeocoder.min_chars){
                        self.search({text: value}, function (err, result) {
                        if (err) {
                            return self._showError(err);
                        }
                        if (result) {
                            // self._resultsListEl.showAll();
                            return self._showResults(result)
                        }
                        }, 'autocomplete');
                    }
                }
            })
            return inputEl
        }

        /**
         * override PeliasGeocoder.goToFeatureLocation
         */
        overrideGoToFeatureLocation(feature){
            
        }
        
        initEventIconCross(){
            // var iconCrossEl = document.getElementsByClassName('pelias-ctrl-icon-cross')
            // iconCrossEl.addEventListener("click", function () {
            //     this._clearAll();
            //     WeGeocoder.hideDetailFeatureFrame();
            //     WeGeocoder.hideResultSearch();
            //   });
            var originBuildResultsListHTMLElement = this.geocoder._buildResultsListHTMLElement
            this.geocoder._buildResultsListHTMLElement = function(){
                var resultsListEl = originBuildResultsListHTMLElement.call(this)
                resultsListEl.hideAll = function (){
                    resultsListEl.style.display= 'none';
                }
                
                resultsListEl.showAll = function (){
                    resultsListEl.style.display= 'block';
                }
                return resultsListEl
            }
            var originBuildIconCross = this.geocoder._buildIconCrossHTMLElement
            this.geocoder._buildIconCrossHTMLElement = function(){
                let iconCrossEl = originBuildIconCross.call(this)
                iconCrossEl.addEventListener("click", function () {
                    // if(marker){
                    //     marker.remove();
                    // }
                    // self._clearAll();
                    WeGeocoder.hideDetailFeatureFrame();
                    WeGeocoder.hideResultSearch();
                    // document.getElementById('place').style.display = 'none'
                });
                return iconCrossEl
            }
        }
        /**
         * init event close detail frame
         */
        initEventCloseDetailFrame(){
            document.getElementById('close-detail-button').addEventListener('click', function(){
                WeGeocoder.hideDetailFeatureFrame()
            })
        }

        /**
         * init all event
         */
        initEvent(){
            if(!this.geocoder){
                return
            }
            var originBuildAndGetResult = this.geocoder._buildAndGetResult
            this.geocoder._buildAndGetResult = function(feature, index){
                let self = this
                let resultEl = originBuildAndGetResult.call(this, feature, index)
                let lastChild = resultEl.lastElementChild
                
                resultEl.removeChild(lastChild)
                var name = '';
                name = feature.properties.name ? (name + feature.properties.name ) : name;
                name = feature.properties.street ? (name + ", " + feature.properties.street) : name;
                var nameEl = this._boldingPartsOfStringAccordingToTheSearch(name, this._search);
                nameEl.className = "name";
                var labelWrapperEl = this._createElement({type: "span", class: "pelias-ctrl-wrapper-label"});
                labelWrapperEl.appendChild(nameEl);
                
                if (feature.properties.country) {
                    // Add a span containing the dash separator.
                    var separatorEl = this._createElement({type: "span", class: "pelias-ctrl-separator"});
                    separatorEl.innerHTML = ' - ';
                    labelWrapperEl.appendChild(separatorEl);
                    var address = '';
                    address = feature.properties.county ? (address + feature.properties.county + ", ") : address;
                    address = feature.properties.region ? (address + feature.properties.region + ", ") : address;
                    address = feature.properties.country ? (address + feature.properties.country) : address;
                    // Add a span containing the location of the result with potentially bold span.
                    var locationEl = this._boldingPartsOfStringAccordingToTheSearch(address, this._search);
                    locationEl.className = "pelias-ctrl-location";
                    labelWrapperEl.appendChild(locationEl);
                }
            
                resultEl.appendChild(labelWrapperEl);
                
                resultEl.addEventListener("focus", function () {
                    self._goToFeatureLocation(feature);
                    WeGeocoder.hideDetailFeatureFrame();
                    self._resultsListEl.showAll();
                  });
                return resultEl
            }
            this.geocoder.showResultsSearch = this.showResultsSearch
            this.geocoder.search = this.overrideSearch
            this.geocoder._buildInputHTMLElement = this.overrideBuildInputHTMLElement
            this.initEventIconCross()
            this.initEventCloseDetailFrame()
            var originGoToFeatureLocation = this.geocoder._goToFeatureLocation
            this.geocoder._goToFeatureLocation = function(feature){
                let info = feature.properties
                let osm_id = ''
                let osm_type = ''
                if(info.source == 'openstreetmap'){
                    var get_number = /[0-9]/g
                    osm_id = info.id.match(get_number).join('')
                    var get_text = /[a-zA-Z]/
                    osm_type = info.id.match(get_text).join('').toUpperCase()
                }
                let name = info.name
                let type = feature.geometry.type
                let lat = feature.geometry.coordinates[0]
                let lon = feature.geometry.coordinates[1]
                let address = [info.street, info.county, info.region, info.country]
                let place = new PlaceDetail({name: name, type: type, lat: lat, lon: lon,address: address ,osm_id: osm_id, osm_type: osm_type});
                
                place.showDetailFeature()
                // default goToFeature
                this._results = undefined;
                var cameraOpts = {
                    center: feature.geometry.coordinates,
                    zoom: this._getBestZoom(feature)
                };
                if (this._useFlyTo(cameraOpts)) {
                    this._map.flyTo(cameraOpts);
                } else {
                    this._map.jumpTo(cameraOpts);
                }
                // this._updateMarkers(feature);
                if (feature.properties.source === 'whosonfirst' && ['macroregion', 'region', 'macrocounty', 'county', 'locality', 'localadmin', 'borough', 'macrohood', 'neighbourhood', 'postalcode'].indexOf(feature.properties.layer) >= 0) {
                    this._showPolygon(feature.properties, cameraOpts.zoom);
                } else {
                    this._removePolygon();
                }
                // wemapgl.urlController.updatePlaceParams({ })
            }
        }

        showResultsSearch(result) {
            let features = result.features;
            let resultFeatures = '';
            let self = this
            features.forEach(function (feature, i) {
              if (i < features.length) {
                resultFeatures = resultFeatures + '<li class="js-poicard poicard">' +
                  '<div class="f-control feature-directions">' +
                  '<i id="directions" class="fa fa-arrow-right"  class="routing-button">' + '</i>' +
                  '<div class="result-way">' + 'Đường đi' + '</div>' +
                  '</div>' +
                  '<div class="poicard-info w_rating">' +
                  '<h5 class="poicard-title" >' +
                  '<a href="/en/map/3461127733553674">' + feature.properties.name + '</a>' +
                  '</h5>' +
                  '<span class="average">' +0  + ' ' + '</span>' +
                  '<span class="stars">' +
                  '<div class="rating">' +
                  '<label class = "full" for="star5" title="Awesome - 5 stars">' + '</label>' +
                  '<label class = "full" for="star4" title="Pretty good - 4 stars">' + '</label>' +
                  '<label class = "full" for="star3" title="Meh - 3 stars">' + '</label>' +
                  '<label class = "full" for="star2" title="Kinda bad - 2 stars">' + '</label>' +
                  '<label class = "full" for="star1" title="Sucks big time - 1 star">' + '</label>' +
                  '</div>' +
                  '</span>' +
                  '<span class="average1">' + ' ('+ Math.floor(300+Math.random()*1000) + ')' + '</span>' +
                  '<div class="poicard-category_and_rating">' +
                  '<div class="poicard-category">' + feature.geometry.type +
                  '</div>' +
                  '</div>' +
                  '<ul class="poicard-data">'+
                  '<div class="poicard-data-item address">' + WeGeocoder.getAddess([feature.properties.street, feature.properties.county, feature.properties.region, feature.properties.country]) +
                  '</div>' +
                  '<div id="lat-log">' + feature.geometry.coordinates[1]+',' + feature.geometry.coordinates[0] + '</div>' +
                  '</ul>' +
                  '</div>' +
                  '</li>';
              }
            });
            let results = document.getElementById('results-list');
            results.innerHTML = resultFeatures;
            let resultList = results.querySelectorAll("li");
            resultList.forEach(function (result, index) {
              result.onmouseover = function (e) {
                self._selectFeature(features[index]);
                self._goToFeatureLocation(features[index]);
                WeGeocoder.hideDetailFeatureFrame();
              }
              result.onclick = function (e) {
                self._selectFeature(features[index]);
                self._goToFeatureLocation(features[index]);
                WeGeocoder.hideResultSearch();
              };
          
              let rating = result.querySelectorAll('.full');
              let averageStar = Math.floor((Math.random()*5)*10)/10 ;

              for (let i=0; i< Math.floor(averageStar ); i++ ){
                rating[4-i].style.color = '#E7711B'
              }
              let rating_number = result.querySelector('.average');
              rating_number.innerHTML = averageStar
              rating.onclick = function (e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
              }
              let routing = result.querySelector('.f-control');
              routing.onclick = function (e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                navigator.geolocation.getCurrentPosition(function (currentLocation) {
                  var a = document.getElementById('lat-log');
                  var coordinates = a.textContent.replace(/\s/g, '');
                  url = window.location.host
                    + '?x=' + viewX
                    + '&y=' + viewY
                    + '&z=' + viewZ
                    + '&x1=' + currentLocation.coords.longitude + "&y1=" + currentLocation.coords.latitude
                    + '&x2=' + coordinates.split(",")[0] + '&y2=' + coordinates.split(",")[1];
                  window.open(url, "_self");
                });
          
              }
              let star = result.querySelector('.stars');
              star.onclick = function (e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
              }
            })
          }
        
        /**
         * init default marker
         */  
        initMarker(){
            let iconMarkerEl = document.createElement("div")
            iconMarkerEl.innerHTML = "<div class='marker-arrow'></div>" +
                "<div class='marker-pulse'></div>"
            return iconMarkerEl
        }
        /**
         * init view detailFeature, result search
         */
        initMultiView(){
            let view = document.createElement('div')
            view.innerHTML = '<div id="no-result"\>'+
            '<p>Không tìm thấy kết quả</p>'+
            '</div>'+
            '<div id="results-search">'+
                '<section class="results with_ads">'+
                '    <ul id="results-list"></ul>'+
                '</section>'+
            '</div>'+
    
            '<div id="detail-feature" class="scrollbar">'+
                '<button class="btn" id="close-detail-button" title="Close"><i class="fa fa-close"></i></button>'+
            '<div class="detail-feature-element" id="feature-img"></div>'+
            '<div class="detail-feature-heading">'+
            '    <div id="feature-name"></div>'+
            '    <div class="detail-feature-category-rating">'+
            '        <!-- <div id="feature-category">Education</div> -->'+
            '        <div id="feature-rating"></div>'+
            '    </div>'+
    
            '</div>'+
            '<div id="feature-controls">'+
            '    <div class="feature-control" id="feature-directions">'+
            '        <i class="fa fa-arrow-right "></i><span>Chỉ đường</span>'+
            '    </div>'+
            '    <div class="feature-control">'+
            '        <i class="fa fa-share-alt"></i><span>Chia sẻ</span>'+
            '    </div>'+
            '    <div class="feature-control">'+
            '        <i class="fa fa-comments"></i><span>Nhận xét</span>'+
            '    </div>'+
            '</div>'+
    
            '<div class="detail-feature-body">'+
            '    <p id="feature-description"></p>'+
    
            '    <div class="information-feature">'+
            '        <div class="detail-feature-element" id="feature-location">'+
            '        </div>'+
            '        <div class="detail-feature-element" id="feature-coordinates">'+
            '        </div>'+
            '        <div id="feature-website">'+
            '        </div>'+
            '        <div id="feature-phone">'+
            '        </div>'+
            '        <div id="feature-opening-hours">'+
            '        </div>'+
            '    </div>'+
            '</div>'
            document.body.appendChild(view)
        }

        static hideDetailFeatureFrame() {
            let detail_feature = document.getElementById("detail-feature");
            if (detail_feature) {
              document.getElementById("detail-feature").style.display = "none";
            }
            // deleteAllUrlParams()
            wemapgl.urlController.deleteParams("place")
        }
        static hideResultSearch() {
            document.getElementById("results-search").style.display = "none";
        }
        static hideResultAutocompele() {
            let resultAutocompele = document.getElementsByClassName(
              "pelias-ctrl-results-list"
            );
            if (resultAutocompele) {
              resultAutocompele.style.display = "none";
            }
        }

}
