import { getJSON } from '../util/ajax'
import { default as config } from '../config.json'; 
import PlaceDetail from './placeDetail'

export default class Reverse{
    constructor(map, key) {
        this.map = map;
        this.key = key;
        this.on = true;
        this.point_layers = [];
        this.received_data = {};
  
        this.getStyle();
        this.onClick();
    }   
    onReverse(){
        this.on = true;
    }
    offReverse(){
        this.on = false;
    }
    getStyle(){
        let point_layers = []
        getJSON({
            url: `${config.style.bright}${this.key}`,
            method: 'GET'
        }, (err, data) => {
            for(let i = 0; i < data.layers.length; i++){
                let layer_id = data.layers[i].id
                if(layer_id.includes('poi')){
                    point_layers.push(layer_id)
                }
            }
            this.point_layers = point_layers
            this.hoverIcon()
        })
    }
    hoverIcon(){
        this.point_layers.forEach((label, index) => {
            this.map.on('mouseover', label, (e) => {
                this.map.getCanvas().style.cursor = 'pointer';
            })
            this.map.on('mouseleave', label, (e) => {
                this.map.getCanvas().style.cursor = '';
            })
        })
    }
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
    onClick(){
        if(this.on){
            this.map.on('click', (e) => {
                let features = this.map.queryRenderedFeatures(e.point);
                this.getReverseData(e).then(data => {

                    if(features.length == 0){
                        this.clickoutIcon(data.features[0])
                    }else{
                        let not_point_layer = 0
    
                        features.forEach((feature,index) => {
                            if(this.point_layers.includes(feature.layer.id)){
                                this.clickonIcon(data.features[0]);
                                not_point_layer += 1
                            }
                        });

                        if(not_point_layer == 0){
                            this.clickoutIcon(data.features[0])
                        }
                    }

                })
                .catch(err => console.log(err))
            })
        }
    }
    clickoutIcon(data){
        this.display_ui('detail-feature', 'none')                
        this.display_ui('place', 'block')    
        let address = [data.properties.name, data.properties.street, data.properties.district, data.properties.city, data.properties.country]
        let second_line = []
        let last_i = 0
        for(let i = 0; i < 5; i++){
            let unit = address[i]
            if(unit){
                document.getElementById('placename').innerHTML = unit
                last_i = i
                break
            }
        }
        for(let j = last_i + 1; j < 5; j++){
            let unit = address[j]
            if(unit){
                second_line.push(unit)
            }
        }
        document.getElementById('placeadd').innerHTML = second_line.join(', ')
        document.getElementById('placelatlon').innerHTML = Number(data.geometry.coordinates[0]).toFixed(7)+' ,'+ Number(data.geometry.coordinates[1]).toFixed(7)       
        document.getElementById('click-detail').addEventListener('click', (e) => {
            this.display_ui('place', 'none')
            this.showDetailFeatures(data)
        })                         
    }
    clickonIcon(data){
        this.display_ui('place', 'none')
        this.showDetailFeatures(data)
    }
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
    display_ui(id, text){
        document.getElementById(id).style.display = text;
    }

}