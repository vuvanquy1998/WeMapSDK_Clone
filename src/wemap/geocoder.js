import PeliasGeocoder from '../pelias-geocoder/pelias-geocoder'
export default class WeGeocoder {

        constructor(options) {
                options = options || {};
                this.options = options;
                this.map = this.options.map
                this.initMultiView()
                return this.init();
        }

        /**
         * add engine to map
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
        initMultiView(){
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

        

}
