import axios from 'axios';
export default class Reverse{
    constructor(map, stt) {
        this.map = map;
        this.stt = stt;
        this.init();
    }
    init(){
        if(this.stt){
            console.log('chay reverse')
            this.map.on('load', (e) => {
                let point_layers = []
                
                let chosen_point_info = {}
                axios.get('https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=pk.eyJ1IjoidGhhb2d1bSIsImEiOiJjazJwbHI0eDIwNW82M210b2JnaTBneHY5In0.t4RveeJuHKVJt0RIgFOAGQ')
                .then((data, stt) => {
                    for(let i = 0; i < data.data.layers.length; i++){
                        let layer_id = data.data.layers[i].id
                        if(layer_id.includes('poi')){
                            point_layers.push(layer_id)
                        }
                    }
                    console.log('point_layer:', point_layers)
                    point_layers.forEach((label, index) => {
                        this.map.on('mouseover', label, (e) => {
                            this.map.getCanvas().style.cursor = 'pointer';
                        })
                        this.map.on('mouseleave', label, (e) => {
                            map.getCanvas().style.cursor = '';
                        })
                    })
                })
                this.map.on('click', (e) => {
                    if(this.stt){
                        var features = map.queryRenderedFeatures(e.point);
                        console.log(features)
                        
                        //addMarkder(e.lngLat, e.lngLat.lat)
    
                        axios.get(`https://apis.wemap.asia/we-tools/reverse?key=IqzJukzUWpWrcDHJeDpUPLSGndDx&lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`)
                        .then((data, stt) => {
                            console.log(data)
                            document.getElementById('place').style.display = 'block'
    
                            //kết qủa reverse được lấy để hiển thị
                            function choose_received_data(point, mapbox_point_name_en, mapbox_point_name_vi){
                                console.log('data reverse', data)
                                return data.data.features[0]
                            }
                            //ui cho reverse không phải icon trên map
                            function not_point_render_detail(info){
                                console.log('kp điểm:', info.name, info.street, info.district, info.city, info.country)
                                
                                // document.getElementById('detail-feature').style.display = "none"
                                document.getElementById('place').style.display ='block';
                                let address = [info.name, info.street, info.district, info.city, info.country]
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
                                document.getElementById('placelatlon').innerHTML = Number(e.lngLat.lat).toFixed(7)+' ,'+ Number(e.lngLat.lng).toFixed(7)
                            } 
                            //hiển thị ui reverse
                            if(features.length === 0){
                                let chosen_info = choose_received_data(false, null, null)
                                not_point_render_detail(chosen_info.properties)
                                chosen_point_info = chosen_info
                            } else {
                                let not_point_layer = 0
                                features.forEach((feature,index) => {
                                    if(point_layers.includes(feature.layer.id)){
                                        let place_name_vi = features[index].properties.name
                                        let place_name_en = features[index].properties.name_en
                                        
                                        
                                        let chosen_info = choose_received_data(true, place_name_en, place_name_vi)
            
                                        // chosen_info.properties.name = features[index].properties.name
                                        // showDetailFeature(features[index].properties.name, '', chosen_info.geometry.coordinates[0], chosen_info.geometry.coordinates[1], [chosen_info.properties.street, chosen_info.properties.district, chosen_info.properties.city, chosen_info.properties.country], chosen_info.properties.osm_id, null)
                                        
                                        not_point_layer += 1
                                        console.log('chính là điểm:', chosen_info.properties.name)
                                        console.log('gọi hàm của Quý')
                                    }
                                });
                                if(not_point_layer == 0){
                                    let chosen_info = choose_received_data(false, null, null)
                                    not_point_render_detail(chosen_info.properties)
                                    chosen_point_info = chosen_info
                                }
                            }
                         })
                    }
                })
            })
        }
    }
}