import { getJSON } from '../util/ajax'
import { default as config } from '../config.json'; 
import WeGeocoder from './geocoder';

export default class Reverse{
    /**
     * create new class
     * @param {Object} options
     */
    constructor(options) {
        this.options = options;
        this.map = this.options.map;
        this.key = this.options.key;
        this.on = true;
        this.pointLayers = [];
        this.receivedData = {};
        this.marker;
  
        this.getStyle();
        this.leftClick();
        this.clickBottomCard();
        this.clickDirectionIcon();
        this.closeBottomCard();
    }
    /**
     * turn on reverse
     */   
    onReverse(){
        this.on = true;
    }
    /**
     * turn off reverse
     */
    offReverse(){
        this.displayUI("wemap-place", "none")
        this.on = false;
    }
    /**
     * get style json and create list of layers on map
     */
    getStyle(){
        let pointLayers = []
        getJSON({
            url: `${config.style.bright}${this.key}`,
            method: 'GET'
        }, (err, data) => {
            for(let i = 0; i < data.layers.length; i++){
                let layerId = data.layers[i].id
                if(layerId.includes('poi')){
                    pointLayers.push(layerId)
                }
            }
            this.pointLayers = pointLayers
            this.hoverIcon()
        })
    }
    /**
     * change cursor to pointer when hovering icon on map
     */
    hoverIcon(){
        this.pointLayers.forEach((label, index) => {
            this.map.on('mouseover', label, (e) => {
                this.map.getCanvas().style.cursor = 'pointer';
            })
            this.map.on('mouseleave', label, (e) => {
                this.map.getCanvas().style.cursor = '';
            })
        })
    }
    /**
     * get reverse data object by e.lngLat
     * @param {*} e 
     */
    getReverseData(e){
        return new Promise((res, rej) => {
            getJSON({
                url:`${config.reverse}${this.key}&lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`,
                method: 'GET'
            }, (err, data) => {
                if(err) rej(err)
                else res(data)
            })
        })
    }
    /**
     * handle reverse event of left click
     */
    leftClick(){
        this.map.on('click', (e) => {
            if(this.on){
                this.onClick(e)
            }
        })
    }
    /**
     * handle reverse event of right click
     * @param {Object} e 
     */
    rightClick(e){
        this.onClick(e)
    }
    /**
     * render UI based on type of layer clicked
     * @param {Object} e 
     */
    onClick(e){
        let features = this.map.queryRenderedFeatures(e.point);
        this.getReverseData(e).then(data => {
            if(data.features.length == 0){
                this.showUiNoData(e.lngLat.lat, e.lngLat.lng)
            }else{
                if(features.length == 0){
                    this.clickoutIcon(data.features[0], e.lngLat)
                }else{
                    let notPointLayer = 0

                    features.forEach((feature,index) => {
                        if(this.pointLayers.includes(feature.layer.id)){
                            this.clickonIcon(data.features[0]);
                            notPointLayer += 1
                        }
                    });

                    if(notPointLayer == 0){
                        this.clickoutIcon(data.features[0], e.lngLat)
                    }
                }
            }
            this.addMarker(e.lngLat.lng, e.lngLat.lat)
        })
        .catch(err => console.log(err))
    }
    /**
     * render ui when clicked point is not an icon
     * @param {Object} data 
     */
    clickoutIcon(data, originalCoordinates){
        //this.displayUI('wemap-detail-feature', 'none')                
        this.displayUI('wemap-place', 'block')    

        let originalLat = originalCoordinates.lat;
        let originalLon = originalCoordinates.lng;

        let distance = this.getDistance({
            lat: originalLat,
            lon: originalLon
        }, {
            lat: data.geometry.coordinates[1],
            lon: data.geometry.coordinates[0]
        })

        let address = [data.properties.name, data.properties.street, data.properties.district, data.properties.city, data.properties.country]

        if(distance > 20){
            address.shift();
        }

        let secondLine = []
        let lastI = 0
        for(let i = 0; i < 5; i++){
            let unit = address[i]
            if(unit){
                document.getElementById('wemap-placename').innerHTML = unit
                lastI = i
                break
            }
        }
        for(let j = lastI + 1; j < 5; j++){
            let unit = address[j]
            if(unit){
                secondLine.push(unit)
            }
        }
        document.getElementById('wemap-placeadd').innerHTML = secondLine.join(', ')
        document.getElementById('wemap-placelatlon').innerHTML = Number(data.geometry.coordinates[0]).toFixed(7)+' ,'+ Number(data.geometry.coordinates[1]).toFixed(7)    
        this.receivedData = data                          
    }
    /**
     * render ui when a icon is clicked
     * @param {Object} data 
     */
    clickonIcon(data){
        this.displayUI('wemap-place', 'none')
        this.updateUrlDetailFeatures(data)
    }
    /**
     * update URL to showDetailFeature
     * @param {Object} data 
     */
    updateUrlDetailFeatures(data){     
        // wemapgl.urlController.deleteParams('route')
        wemapgl.urlController.updateParams("place", 
            {
                name: data.properties.name, 
                type: data.type, 
                lat: data.geometry.coordinates[1], 
                lon: data.geometry.coordinates[0],
                address: [
                    data.properties.housenumber,
                    data.properties.street, 
                    data.properties.district, 
                    data.properties.city, 
                    data.properties.country
                ],
                osm_id: data.properties.osm_id, 
                osm_type: data.properties.osm_type
            }
        )
    }
    /**
     * render UI when point has no data
     */

    showUiNoData(lat, lon){
        //this.displayUI('wemap-detail-feature', 'none')
        this.displayUI('wemap-place', 'block')
        this.receivedData = {}
        document.getElementById('wemap-placename').innerHTML = "Không có thông tin"
        document.getElementById('wemap-placeadd').innerHTML = "Không có thông tin"
        document.getElementById('wemap-placelatlon').innerHTML = Number(lon).toFixed(7)+' ,'+ Number(lat).toFixed(7)
    }
    /**
     * 
     * @param {Number} lon 
     * @param {Number} lat 
     */
    addMarker(lon, lat){
        if(this.marker){
            this.marker.remove();
        }
        let iconMarkerEl = document.createElement("div");
        iconMarkerEl.innerHTML = "<div class='wemap-marker-arrow wemap-background-color-red'></div>"
                    + "<div class='wemap-marker-pulse'></div>";
        this.marker = new wemapgl.Marker(iconMarkerEl).setLngLat([lon, lat]).addTo(this.map);
    }
    /**
     * show feature detail when click reverse bottom card
     */
    clickBottomCard(){
        document.getElementById('wemap-click-detail').addEventListener('click', (e) => {
            this.displayUI('wemap-place', 'none')
            this.marker.remove();
            if(Object.keys(this.receivedData).length){
                this.updateUrlDetailFeatures(this.receivedData)
            }
            
        })
    }

    removeMarkerAndHideUI() {
        this.displayUI('wemap-place', 'none');
        if (this.marker) {
            this.marker.remove();
        }
    }
    /**
     * close reverse bottom card
     */
    closeBottomCard(){
        document.getElementById('wemap-placeclose').addEventListener('click', (e) => {
            this.displayUI('wemap-place', 'none')
        })
    }
    /**
     * change url when click direction icon
     */
    clickDirectionIcon(){
        document.getElementById('wemap-direction-icon').addEventListener('click', (e) => {
            WeGeocoder.hideAll()
            if(Object.keys(this.receivedData).length){
                wemapgl.urlController.updateParams("route", {
                    dx: this.receivedData.geometry.coordinates[0],
                    dy: this.receivedData.geometry.coordinates[1],
                })
            }
        })
    }

    /**
     * change style of html element by id
     * @param {*} id 
     * @param {*} text 
     */
    displayUI(id, text){
        document.getElementById(id).style.display = text;
    }
    /**
     * calculate distance between 2 points
     */
    getDistance(p1, p2){
        let R = 6378137; 
        let dLat = rad(p2.lat - p1.lat);
        let dLong = rad(p2.lon - p1.lon);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d;

        function rad(x){
            return x * Math.PI /180;
        }
    }

}
