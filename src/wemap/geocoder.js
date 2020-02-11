import PeliasGeocoder from '../pelias-geocoder/pelias-geocoder'
export default class WeGeocoder {

        constructor(options) {
                options = options || {};
                this.options = options;
                this.map = this.options.map
                this.init();
        }

        /**
         * Returns the origin of the current route.
         * @returns {Object} origin
         */
        init(){
            console.log('init geocoder')
            let engine = this.options.engine
            if(engine=='default'||!engine||engine=='pelias'){
                let geocoder = new PeliasGeocoder({
                    params: {'access-token': this.options.accessToken},
                    flyTo: 'hybrid',
                    wof: true,
                    url: 'https://places.jawg.io/v1',
                    useFocusPoint: true,
                    marker: {
                        icon: iconMarkerEl,
                        multiple: false
                    },
                    });
                this.map.addControl(geocoder)
            }
        }
}
