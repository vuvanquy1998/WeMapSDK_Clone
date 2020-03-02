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
        this.polygon = false;

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
     * get reverse data by e.lngLat
     * @param {*} e 
     */
    getReverseData(e){
        return new Promise((res, rej) => {
            getJSON({
                // url:`${config.reverse}${this.key}&lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`,
                url: `https://apis.wemap.asia/geocode-1/reverse?point.lat=${e.lngLat.lat}&point.lon=${e.lngLat.lng}&key=vpstPRxkBBTLaZkOaCfAHlqXtCR`,
                method: 'GET'
            }, (err, data) => {
                if(err) rej(err)
                else res(data)
            })
        })
    }
    /**
     * get reverse polygon when the first reverse returns distance > 20m
     * @param {*} e
     */
    getReversePolygonData(e){
        return new Promise((res, rej) => {
            getJSON({
                // url:`${config.reverse}${this.key}&lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`,
                url: `https://apis.wemap.asia/we-tools/pip/${e.lngLat.lng}/${e.lngLat.lat}?key=vpstPRxkBBTLaZkOaCfAHlqXtCR`,
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
        let isIcon = this.isIcon(e);
        this.getReverseData(e).then(data => {
            console.log('first reverse', data)
            let allPoints = data.features;
            let nPoints = allPoints.length;

            let notIconAndFarDistance = false;
            if(nPoints != 0 && !isIcon){
                let satisfied = this.checkDistance(allPoints[0])
                if(!satisfied){
                    notIconAndFarDistance = true;
                }
            }

            if(nPoints == 0 || notIconAndFarDistance){
                this.getReversePolygonData(e).then(secondData => {
                    console.log(secondData)
                    if(secondData.error){
                        this.showUiNoData(e.lngLat.lat, e.lngLat.lng);
                    }else{
                        this.polygon = true;
                        this.clickoutIcon({
                            locality: secondData.locality[0].name,
                            county: secondData.county[0].name,
                            region: secondData.region[0].name,
                            country: secondData.country[0].name,
                            continent: secondData.continent[0].name,
                            geometry:{coordinates: [e.lngLat.lng, e.lngLat.lat]},
                        })
                    }
                })
            }else if(!isIcon){
                this.polygon = false;
                this.clickoutIcon(allPoints[0]);
            }else{
                this.clickonIcon(allPoints[0]);
            }
            this.addMarker(e.lngLat.lng, e.lngLat.lat)
        })
        .catch(err => console.log(err))
    }
    /**
     * check if click event is clicking on icon or not
     * @param {*} e
     */
    isIcon(e){
        let features = this.map.queryRenderedFeatures(e.point);
        let isIcon = false;
        for(let i = 0; i < features.length; i++){
            if(this.pointLayers.includes(features[i].layer.id)){
                isIcon = true;
                break;
            }
        }
        return isIcon;
    }
    /**
     * render ui when clicked point is not an icon
     * @param {Object} data 
     */
    clickoutIcon(data){
        //this.displayUI('wemap-detail-feature', 'none')
        wemapgl.urlController.deleteParams('route')
        wemapgl.urlController.deleteParams('place')
        this.displayUI('wemap-place', 'block');
        let address = [];
        if(this.polygon){
            address = [data.locality, data.county, data.region, data.country, data.continent]
        }else{
            address = [data.properties.name, data.properties.street, data.properties.district, data.properties.city, data.properties.country]
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
     * check whether the reverse data returns distance < 20m
     * @param {*} data
     */
    checkDistance(data){
        let satisfied = false;
        if(data.properties.distance <= 0.02){
            satisfied = true;
        }
        return satisfied;
    }
    /**
     * render ui when a icon is clicked
     * @param {Object} data 
     */
    clickonIcon(data){
        this.displayUI('wemap-place', 'none')
        this.polygon = false
        this.updateUrlDetailFeatures(data)
    }
    /**
     * update URL to showDetailFeature
     * @param {Object} data 
     */
    updateUrlDetailFeatures(data){     
        let urlParams = {}
        if(this.polygon){
            urlParams = {
                name: data.locality,
                address: [data.county, data.region, data.country, data.continent],
                lat: data.geometry.coordinates[1],
                lon: data.geometry.coordinates[0]
            }
        }else{
            urlParams = {
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
        }
        wemapgl.urlController.deleteParams('route')
        wemapgl.urlController.updateParams("place", urlParams)
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
}
