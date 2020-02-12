import PeliasGeocoder from '../pelias-geocoder/pelias-geocoder'
export default class WeGeocoder {

        constructor(options) {
                options = options || {};
                this.options = options;
                WeGeocoder.initMultiView()
                this.geocoder = this.init();
                return this.geocoder
        }

        /**
         * @returns geocoder
         */
        init(){
            console.log('init geocoder')
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
        /**
         * init view detailFeature, result search
         */
        static initMultiView(){
            console.log('init multi view')
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
            deleteAllUrlParams()
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
