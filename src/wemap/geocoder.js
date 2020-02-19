import PeliasGeocoder from '../pelias-geocoder/pelias-geocoder'
import PlaceDetail from './placeDetail';
export default class WeGeocoder {
        constructor(options) {
                options = options || {};
                this.options = options;

                this.geocoder = this.init();
                WeGeocoder.initMultiView()
                this.initEvent()
                return this.geocoder
        }

        /**
         * @returns geocoder
         */
        init(){
            let engine = this.options.engine
            switch (engine) {
                case undefined:
                    return this.enginePeliasGeocoder()
                case 'default':
                    return this.enginePeliasGeocoder()
                case 'pelias':
                    return this.enginePeliasGeocoder()
                default:
                    return null
            }
        }

        /**
         * @returns peliasGeocoder
         */
        enginePeliasGeocoder(){
            let geocoder = new PeliasGeocoder({
                params: {'access-token': this.options.accessToken},
                flyTo: this.options.flyTo,
                wof: this.options.wof,
                url: 'https://places.jawg.io/v1',
                useFocusPoint: this.options.useFocusPoint,
                marker: {
                    icon: this.options.marker.icon,
                    multiple: this.options.marker.multiple
                },
            });
            return geocoder
        }
        overridebuildInputHTMLElement(){
            let self = this;

            var inputEl = self._createElement({type: 'input'});
            inputEl.type = 'text';
            inputEl.placeholder = self.opts.placeholder;

            inputEl.addEventListener("keyup", function (e) {
            // Enter -> go to feature location.
                if (self._eventMatchKey(e, self._keys.enter) && self._selectedFeature) {
                inputEl.blur();
                self._goToFeatureLocation(self._selectedFeature);
                return;
                }

                if (e.keyCode == 27) {
                self._resultsListEl.hideAll();
                return;
                }
                //  inputEl.blur();
                //  self._goToFeatureLocation(self._selectedFeature);
                //  return;
                //}


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

                //if (!self._eventMatchKey(e, self._keys.enter) && self.opts.onSubmitOnly) {
                //  return;
                //}


                // if (self._eventMatchKey(e, self._keys.enter)) {
                //   // if(this.value.length > 3)
                //     self.search({text: value}, function (err, result) {
                //       if (err) {
                //         return self._showError(err);
                //       }
                //       if (result) {
                //         // self._clearAll()

                //         hideDetailFeatureFrame();
                //         showresultsSearch(result)
                //       }
                //     }, 'search');
                //     self._resultsListEl.hideAll();
                //     document.getElementById('results-search').style.display = 'inline-block';
                // }

                if (!self._eventMatchKey(e, self._keys.enter)) {
                if(value.length > 3)
                    self.autocomplete({text: value}, function (err, result) {
                    if (err) {
                        return self._showError(err);
                    }
                    if (result) {
                        console.log(result)
                        // self._resultsListEl.showAll();
                        return self._showResults(result)
                    }
                    });
                }

                self._addOrRemoveClassToElement(self._iconCrossEl, false, "pelias-ctrl-hide");

            });
            return inputEl;
        }
        initEventIconCross(){
            // var iconCrossEl = document.getElementsByClassName('pelias-ctrl-icon-cross')
            // iconCrossEl.addEventListener("click", function () {
            //     this._clearAll();
            //     WeGeocoder.hideDetailFeatureFrame();
            //     WeGeocoder.hideResultSearch();
            //   });
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
        initEventCloseDetailFrame(){
            document.getElementById('close-detail-button').addEventListener('click', function(){
                WeGeocoder.hideDetailFeatureFrame()
            })
        }
        initEvent(){
            if(!this.geocoder){
                return
            }
            this.initEventIconCross()
            this.initEventCloseDetailFrame()
            // this.geocoder._buildInputHTMLElement = this.overridebuildInputHTMLElement
            var originGoToFeatureLocation =  this.geocoder._goToFeatureLocation
            this.geocoder._goToFeatureLocation = function(feature){
                // let place = new PlaceDetail()
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
                // {name: name, type: type, lat: lat, lon: lon,address: address ,osm_id: osm_id, osm_type: osm_type}
                let place = new PlaceDetail({name: name, type: type, lat: lat, lon: lon,address: address ,osm_id: osm_id, osm_type: osm_type});
                
                place.showDetailFeature()
                originGoToFeatureLocation.call(this, feature)
            }

        }
        /**
         * init view detailFeature, result search
         */
        static initMultiView(){
            let map = document.getElementById('map')
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
            '        <i class="fas fa-directions"></i><span>Chỉ đường</span>'+
            '    </div>'+
            '    <div class="feature-control">'+
            '        <i class="fas fa-share-alt"></i><span>Chia sẻ</span>'+
            '    </div>'+
            '    <div class="feature-control">'+
            '        <i class="fas fa-feather-alt"></i><span>Nhận xét</span>'+
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
            // deleteAllUrlParams()
            let detail_feature = document.getElementById("detail-feature");
            if (detail_feature) {
              document.getElementById("detail-feature").style.display = "none";
            }
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
        static showresultsSearch(result) {
            let features = result.features;
            let resultFeatures = '';
            changeStarColor = function(){

            }
            features.forEach(function (feature, i) {
                if (i < features.length) {
                    resultFeatures = resultFeatures + '<li class="js-poicard poicard">' +
                    '<div class="f-control" id="feature-directions">' +
                    '<i id="directions" class="fas fa-directions"  class="routing-button">' + '</i>' +
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
                    '<span class="average1">' + ' ('+ Math.floor(Math.random()*255) + ')' + '</span>' +
                    '<div class="poicard-category_and_rating">' +
                    '<div class="poicard-category">' + feature.geometry.type +
                    '</div>' +
                    '</div>' +
                    '<ul class="poicard-data">'+
                    '<div class="poicard-data-item address">' + getAddess([feature.properties.street, feature.properties.county, feature.properties.region, feature.properties.country]) +
                    '</div>' +
                    '<div id="lat-log">' + feature.geometry.coordinates[1]+',' + feature.geometry.coordinates[0] + '</div>' +
                    '</ul>' +
                    '</div>' +
                    '</li>';
                }
            });
        }

}
