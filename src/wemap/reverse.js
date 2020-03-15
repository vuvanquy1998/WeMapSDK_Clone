import { makeRequest } from '../util/ajax';
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
        this.receivedDataType = '';

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
        this.displayUI("wemap-place", "none");
        this.on = false;
    }
    /**
     * get style json and create list of layers on map
     */
    getStyle(){
        let pointLayers = []
        makeRequest({
            url: `${config.style.bright}${this.key}`,
            method: 'GET'
        }, (err, data) => {
            data = JSON.parse(data);
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
            makeRequest({
                url: `${config.reverse}?point.lat=${e.lngLat.lat}&point.lon=${e.lngLat.lng}&key=${this.key}`,
                method: 'GET'
            }, (err, data) => {
                if(err) rej(err)
                else {
                    data = JSON.parse(data);
                    res(data)
                }
            })
        })
    }
    /**
     * get reverse polygon when the first reverse returns distance > 20m
     * @param {*} e
     */
    getReversePolygonData(e){
        return new Promise((res, rej) => {
            makeRequest({
                url: `${config.reverse}?point.lat=${e.lngLat.lat}&point.lon=${e.lngLat.lng}&key=${this.key}&layers=locality`,
                method: 'GET'
            }, (err, data) => {
                if(err) rej(err)
                else {
                    data = JSON.parse(data);
                    res(data)
                }
            })
        })
    }
    getReverseStreetData(e){
        return new Promise((res, rej) => {
            makeRequest({
                url: `${config.reverse}?point.lat=${e.lngLat.lat}&point.lon=${e.lngLat.lng}&key=${this.key}&layers=street`,
                method: 'GET'
            }, (err, data) => {
                if(err) rej(err)
                else {
                    data = JSON.parse(data);
                    res(data)
                }
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
            let allPoints = data.features;
            let nPoints = allPoints.length;

            let notIconAndFarPoint = false;
            if(nPoints != 0 && !isIcon){
                let satisfied = this.checkDistance(allPoints[0], config.pointMaxDistance)
                if(!satisfied){
                    notIconAndFarPoint = true;
                }
            }

            if(nPoints == 0 || notIconAndFarPoint){
                // this.getReverseStreetData(e).then(streetData => {
                //     if(streetData.features.length === 0 || !this.checkDistance(streetData.features[0])){
                //         this.getReversePolygonData(e).then(polygonData => {
                //             if(polygonData.features.length === 0){
                //                 this.showUiNoData(e.lngLat.lat, e.lngLat.lng);
                //             }else{
                //                 this.receivedDataType = 'polygon'
                //                 this.clickoutIcon(polygonData.features[0]);
                //             }
                //         })
                //     }else{
                //         this.receivedDataType = 'street';
                //         this.clickoutIcon(streetData[0])
                //     }
                // })
                this.getReversePolygonData(e).then(polygonData => {
                    if(polygonData.features.length === 0){
                        this.showUiNoData(e.lngLat.lat, e.lngLat.lng);
                    }else{
                        this.receivedDataType = 'polygon'
                        this.clickoutIcon(polygonData.features[0]);
                    }
                })
            }else if(!isIcon){
                this.receivedDataType = 'point';
                this.clickoutIcon(allPoints[0]);
            }else{
                this.receivedDataType = 'point';
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
        this.displayUI('wemap-detail-feature', 'none')
        wemapgl.urlController.deleteParams('route')
        wemapgl.urlController.deleteParams('place')
        this.displayUI('wemap-place', 'block');  

        let address = this.listAddress(data)

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
    checkDistance(data, distance){
        let satisfied = false;
        if(data.properties.distance <= (distance/1000)){
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
        this.receivedDataType = 'point'
        this.removeMarkerAndHideUI()
        this.updateUrlDetailFeatures(data)
    }
    /**
     * update URL to showDetailFeature
     * @param {Object} data
     */
    updateUrlDetailFeatures(data){
        let address = this.listAddress(data)
        let name = address[0]
        address.splice(0,1)
        let urlParams = {
            name: name,
            type: data.type,
            lat: data.geometry.coordinates[1],
            lon: data.geometry.coordinates[0],
            address: address,
            osmid: data.properties.id.split('/')[1],
            osmtype: data.properties.osm_type
        }
        wemapgl.urlController.deleteParams('route')
        wemapgl.urlController.deleteParams('place')
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

            if(Object.keys(this.receivedData).length){
                WeGeocoder.hideAll()
                wemapgl.urlController.updateParams("route", {
                    dx: this.receivedData.geometry.coordinates[0],
                    dy: this.receivedData.geometry.coordinates[1],
                })
            }
        })
    }

    listAddress(data){
        let address = [data.properties.name, data.properties.street, data.properties.locality, data.properties.county, data.properties.region, data.properties.country]
        
        if(this.receivedDataType === 'polygon'){
            address.splice(1, 2)
        }else if(this.receivedDataType === 'street'){
            address.splice(1, 1)
        }
        return address;
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
