import { getJSON } from '../util/ajax'
import { default as config } from '../config.json'; 
import PlaceDetail from './placeDetail'
import RightClick from './rightclick'

export default class Reverse{
    /**
     * create new class
     * @param {Object} map 
     * @param {String} key 
     */
    constructor(map, key) {
        this.map = map;
        this.key = key;
        this.on = true;
        this.pointLayers = [];
        this.receivedData = {};
  
        this.getStyle();
        this.leftClick();
        this.clickPlace();
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

            if(features.length == 0){
                this.clickoutIcon(data.features[0])
            }else{
                let notPointLayer = 0

                features.forEach((feature,index) => {
                    if(this.pointLayers.includes(feature.layer.id)){
                        this.clickonIcon(data.features[0]);
                        notPointLayer += 1
                    }
                });

                if(notPointLayer == 0){
                    this.clickoutIcon(data.features[0])
                }
            }
        })
        .catch(err => console.log(err))
    }
    /**
     * render ui when clicked point is not an icon
     * @param {Object} data 
     */
    clickoutIcon(data){
        this.displayUI('detail-feature', 'none')                
        this.displayUI('place', 'block')    
        let address = [data.properties.name, data.properties.street, data.properties.district, data.properties.city, data.properties.country]
        let secondLine = []
        let lastI = 0
        for(let i = 0; i < 5; i++){
            let unit = address[i]
            if(unit){
                document.getElementById('placename').innerHTML = unit
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
        document.getElementById('placeadd').innerHTML = secondLine.join(', ')
        document.getElementById('placelatlon').innerHTML = Number(data.geometry.coordinates[0]).toFixed(7)+' ,'+ Number(data.geometry.coordinates[1]).toFixed(7)    
        this.receivedData = data                          
    }
    /**
     * render ui when a icon is clicked
     * @param {Object} data 
     */
    clickonIcon(data){
        this.displayUI('place', 'none')
        this.showDetailFeatures(data)
    }
    /**
     * show UI of icon
     * @param {Object} data 
     */
    showDetailFeatures(data){     
        let place = new PlaceDetail({
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
        });
        place.showDetailFeature()
    }
    /**
     * show feature detail when click reverse bottom card
     */
    clickPlace(){
        document.getElementById('click-detail').addEventListener('click', (e) => {
            this.displayUI('place', 'none')
            this.showDetailFeatures(this.receivedData)
        })  
    }
    /**
     * close reverse bottom card
     */
    closeBottomCard(){
        document.getElementById('placeclose').addEventListener('click', (e) => {
            this.displayUI('place', 'none')
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