import { getJSON } from '../util/ajax'
export default class Reverse{
    constructor(map) {
        this.map = map;
        this.initView();
        this.init();
    }
    initView(){
        let showBottomDetail = document.createElement('div')
        showBottomDetail.innerHTML = '<div id="place">'+
            '<div class="class-pl">'+
                '<div class="image-place">'+
                    '<img class="placeicon" id="preview-image" src="https://map.fimo.com.vn/assets/images/no_street.png">'+
                '</div>'+
                '<div class="add-place">'+
                    '<button class="click-detail" id="click-detail">'+
                        '<a class="placename" id="placename">a</a>'+
                        '<a class="placeadd" id="placeadd">a</a>'+
                    '</button>'+

                    '<div class="placelatlon"><a href="#" id="placelatlon"></a></div>'+
                '</div>'+
                '<div class="image-direc">'+
                    '<img src="http://maps.gstatic.com/tactile/reveal/directions-1x-20150909.png">'+
                '</div>'+
                '<div class="close-place">'+
                    '<div id="placeclose" style="color: black;"><i class="fa fa-times"></i></div>'+
                '</div>'+
            '</div>'+
        '</div>'
        document.body.appendChild(showBottomDetail)
    }

    init(){
        this.map.on('load', (e) => {
            let point_layers = []

            getJSON({
                url: 'https://apis.wemap.asia/vector-tiles/styles/osm-bright/style.json?key=vpstPRxkBBTLaZkOaCfAHlqXtCR',
                method: 'GET'
            }, (err, data) => {
                console.log('test ajax style',data)
                for(let i = 0; i < data.layers.length; i++){
                    let layer_id = data.layers[i].id
                    if(layer_id.includes('poi')){
                        point_layers.push(layer_id)
                    }
                }

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
                if(stt){
                    let chosen_point_info = {}
                    let features = map.queryRenderedFeatures(e.point);
                    console.log(features)
                    
                    //addMarkder(e.lngLat, e.lngLat.lat)

                    getJSON({
                        url:`https://apis.wemap.asia/we-tools/reverse?key=vpstPRxkBBTLaZkOaCfAHlqXtCR&lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`,
                        method: 'GET'
                    }, (err, data) => {
                        console.log('test ajax reverse', data)
                        document.getElementById('place').style.display = 'block'

                        //kết qủa reverse được lấy để hiển thị
                        function choose_received_data(point, mapbox_point_name_en, mapbox_point_name_vi){
                            console.log('data reverse', data)
                            return data.features[0]
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
                                    $('#place').css({'display':"none"})
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
            
            document.getElementById('click-detail').addEventListener('click', (e) => {
                showDetailFeature(chosen_point_info.properties.name, '', chosen_point_info.geometry.coordinates[0], chosen_point_info.geometry.coordinates[1], [chosen_point_info.properties.county, chosen_point_info.properties.region, chosen_point_info.properties.country], chosen_point_info.properties.id.split("/")[1], convert_to_osm_type(chosen_point_info.properties.id.split("/")[0]))
            })
            
            document.getElementById('placeclose').addEventListener('click', (e) => {
                // deleteUrlParam('rx');
                // deleteUrlParam('ry');
                document.getElementById('place').style.display = "none"
            })
        })
    }
}
