import { getJSON } from '../util/ajax'
import { default as config } from '../config.json';
import PlaceDetail from './placeDetail'

export default class RightClick {
    constructor(map, key) {
        this.map = map;
        this.key = key;
        this.initView();
        this.init();
        this.clicked_poi = {};
    }
    initView() {
        let rightClick = document.createElement('div')
        rightClick.innerHTML = '<div id = "right-click-menu-container"' + "style = 'display: none'>" +
            '<div class = "right-click-menu-item" id = "start" style = "display: none">Điểm bắt đầu</div>' +
            '<div class = "right-click-menu-item" id = "end" style = "display: none">Điểm kết thúc</div>' +
            '<div class = "right-click-menu-item" id ="right-click-reverse">Đây là đâu ?</div>' +
            '</div>'
        document.body.appendChild(rightClick)
        let showBottomDetail = document.createElement('div')
        showBottomDetail.innerHTML = '<div id="place" style="display: none">' +
            '<div class="class-pl">' +
            '<div class="image-place">' +
            '<img class="placeicon" id="preview-image" src="https://map.fimo.com.vn/assets/images/no_street.png">' +
            '</div>' +
            '<div class="add-place">' +
            '<button class="click-detail" id="click-detail">' +
            '<a class="placename" id="placename">a</a>' +
            '<a class="placeadd" id="placeadd">a</a>' +
            '</button>' +

            '<div class="placelatlon"><a href="#" id="placelatlon"></a></div>' +
            '</div>' +
            '<div class="image-direc">' +
            '<img src="http://maps.gstatic.com/tactile/reveal/directions-1x-20150909.png">' +
            '</div>' +
            '<div class="close-place">' +
            '<div id="placeclose" style="color: black;"><i class="fa fa-times"></i></div>' +
            '</div>' +
            '</div>' +
            '</div>'
        document.body.appendChild(showBottomDetail)
    }
    init() {
        let received_data = {}
        let point_layers = []

        this.map.on('load', (e) => {
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
            })
        })
        this.map.on('click', (e) => {
            display_ui('right-click-menu-container', 'none')
        })
        this.map.on('contextmenu', (e) => {
            let mouseX = e.point.x;
            let mouseY = e.point.y;
            let max_width = window.innerWidth;
            let max_height = window.innerHeight;
            let context_menu_width = document.getElementById("right-click-menu-container").clientWidth;
            let context_menu_height = document.getElementById("right-click-menu-container").clientHeight;
            let translateX = 0;
            let translateY = 0;

            if (mouseX + context_menu_width > max_width) {
                translateX = max_width - context_menu_width;
            } else {
                translateX = mouseX;
            }
            if (mouseY + context_menu_height > max_height) {
                translateY = max_height - context_menu_height;
            } else {
                translateY = mouseY;
            }
            display_ui('right-click-menu-container', 'block')
            document.getElementById("right-click-menu-container").style.transform = `translate(${translateX}px,${translateY}px)`
            this.clicked_poi = e;
        })
        document.getElementById('right-click-reverse').addEventListener('click', (event) => {
            let features = this.map.queryRenderedFeatures(this.clicked_poi.point)

            getJSON({
                url: `${config.reverse}${this.key}&lat=${this.clicked_poi.lngLat.lat}&lon=${this.clicked_poi.lngLat.lng}`,
                method: 'GET'
            }, (err, data) => {
                received_data = data.features[0]
            
                function not_point_render_detail(info, geometry) {
                    display_ui('place', 'block')
                    let address = [info.name, info.street, info.district, info.city, info.country]
                    let second_line = []
                    let last_i = 0
                    for (let i = 0; i < 5; i++) {
                        let unit = address[i]
                        if (unit) {
                            document.getElementById('placename').innerHTML = unit
                            last_i = i
                            break
                        }
                    }
                    for (let j = last_i + 1; j < 5; j++) {
                        let unit = address[j]
                        if (unit) {
                            second_line.push(unit)
                        }
                    }
                    document.getElementById('placeadd').innerHTML = second_line.join(', ')
                    document.getElementById('placelatlon').innerHTML = Number(geometry.coordinates[1]).toFixed(7) + ' ,' + Number(geometry.coordinates[0]).toFixed(7)
                }

    
                if (features.length === 0) {
                    not_point_render_detail(received_data.properties, received_data.geometry)
                    display_ui('right-click-menu-container', 'none')
                }
                else {
                    let not_point_layer = 0
                    features.forEach((feature, index) => {
                        if (point_layers.includes(feature.layer.id)) {
                            showDetailFeature();
                            display_ui('place', 'none')
                            not_point_layer += 1
                        }
                    });
                    if (not_point_layer == 0) {
                        not_point_render_detail(received_data.properties, received_data.geometry)
                    }
                    display_ui('right-click-menu-container', 'none')
                }
            })
        })
        document.getElementById('click-detail').addEventListener('click', (e) => {
            showDetailFeature()
            display_ui('place', 'none')
        })

        document.getElementById('placeclose').addEventListener('click', (e) => {
            display_ui('place', 'none')
        })
        function showDetailFeature(){
            // let place = new PlaceDetail({
            //     name: received_data.properties.name, 
            //     type: received_data.type, 
            //     lat: received_data.geometry.coordinates[1], 
            //     lon: received_data.geometry.coordinates[0],
            //     address: [
            //         received_data.properties.housenumber,
            //         received_data.properties.street, 
            //         received_data.properties.district, 
            //         received_data.properties.city, 
            //         received_data.properties.country
            //     ],
            //     osm_id: received_data.properties.osm_id, 
            //     osm_type: received_data.properties.osm_type
            // });
            // place.showDetailFeature()
        }
        function display_ui(id, action){
            document.getElementById(id).style.display = action;
        }
    }
    static add(id, text){
        let new_right_click_item = document.createElement('div')
        new_right_click_item.setAttribute('id', id)
        new_right_click_item.setAttribute('class', 'right-click-menu-item')
        new_right_click_item.innerText = text

        document.getElementById('right-click-menu-container').appendChild(new_right_click_item)
    }
    static rightClickCoordinates(){
        map.on('contextmenu', (e) => {
            console.log(e.lngLat.lng, e.lngLat.lat)
        })
    }
}
