import { getJSON } from '../util/ajax'
import { default as config } from '../config.json';

export default class RightClick {
    constructor(map, stt, key) {
        this.map = map;
        this.stt = stt;
        this.key = key;
        this.initView();
        this.init();
        this.clicked_poi = {};
    }
    initView() {
        let rightClick = document.createElement('div')
        rightClick.innerHTML = '<div id = "right-click-menu-container"' + "style = 'display: none'>" +
            '<div class = "right-click-menu-item" style = "display: none">Điểm bắt đầu</div>' +
            '<div class = "right-click-menu-item" style = "display: none">Điểm kết thúc</div>' +
            '<div class = "right-click-menu-item" id ="right-click-reverse">Đây là đâu ?</div>' +
            '</div>'
        document.body.appendChild(rightClick)
        let showBottomDetail = document.createElement('div')
        showBottomDetail.innerHTML = '<div id="place">' +
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
        if (this.stt) {
            let chosen_point_info = {}
            this.map.on('contextmenu', (e) => {
                let mouseX = e.point.x;
                let mouseY = e.point.y;
                // let max_width = $(window).width();
                let max_width = window.innerWidth;
                // let max_height = $(window).height();
                let max_height = window.innerHeight;
                // let context_menu_width = $('#right-click-menu-container').width();
                let context_menu_width = document.getElementById("right-click-menu-container").clientWidth;
                //let context_menu_height = $('#right-click-menu-container').height();
                let context_menu_height = document.getElementById("right-click-menu-container").clientHeight;
                let translateX = 0;
                let translateY = 0;

                if (mouseX + context_menu_width > max_width) {
                    console.log('qua dai ngang')
                    translateX = max_width - context_menu_width;
                } else {
                    translateX = mouseX;
                }
                if (mouseY + context_menu_height > max_height) {
                    console.log('qua dai doc')
                    translateY = max_height - context_menu_height;
                } else {
                    translateY = mouseY;
                }
                // $('#right-click-menu-container').css({ 'display': "block" })
                document.getElementById("right-click-menu-container").style.display = "block"
                //$('#right-click-menu-container').css({ "transform": `translate(${translateX}px,${translateY}px)` })
                document.getElementById("right-click-menu-container").style.transform = `translate(${translateX}px,${translateY}px)`
                this.clicked_poi = e;
            })

            this.map.on('click', (e) => {
                // $('#right-click-menu-container').css({ 'display': "none" })
                document.getElementById("right-click-menu-container").style.display = "none";
            })
             
            document.getElementById('right-click-reverse').addEventListener('click', (event) => {
                let features = this.map.queryRenderedFeatures(this.clicked_poi.point);
                console.log('feature', features)

                //addMarkder(e.lngLat, e.lngLat.lat)

                let point_layers = ['poi-level-1', 'poi-level-2', 'poi-level-3', 'poi-level-4']
          
                getJSON({
                    url: `${config.reverse}${this.key}&lat=${this.clicked_poi.lngLat.lat}&lon=${this.clicked_poi.lngLat.lng}`,
                    method: 'GET'
                }, (err, data) => {
                    console.log('ajax data', data)

                    //kết qủa reverse được lấy để hiển thị
                    function choose_received_data(point, mapbox_point_name_en, mapbox_point_name_vi) {
                        return data.features[0]
                    }

                    //ui cho reverse không phải icon trên map
                    function not_point_render_detail(info, geometry) {
                        console.log('kp điểm:', info.name, info.street, info.district, info.city, info.country)

                        // document.getElementById('detail-feature').style.display = "none"

                        document.getElementById('place').style.display = 'block';
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

                    //hiển thị ui reverse

                    if (features.length === 0) {
                        console.log('van dung ne')
                        let chosen_info = choose_received_data(false, null, null)
                        not_point_render_detail(chosen_info.properties, chosen_info.geometry)
                        chosen_point_info = chosen_info
                        // $('#right-click-menu-container').css({ 'display': "none" })
                        document.getElementById('right-click-menu-container').style.display = "none"
                    }
                    else {
                        let not_point_layer = 0
                        features.forEach((feature, index) => {
                            if (point_layers.includes(feature.layer.id)) {
                                let place_name_vi = features[index].properties.name
                                let place_name_en = features[index].properties.name_en


                                let chosen_info = choose_received_data(true, place_name_en, place_name_vi)

                                not_point_layer += 1
                                console.log('chính là điểm:', chosen_info.properties.name)
                                console.log('gọi hàm của Quý')
                            }
                        });
                        if (not_point_layer == 0) {
                            let chosen_info = choose_received_data(false, null, null)
                            not_point_render_detail(chosen_info.properties, chosen_info.geometry)
                            chosen_point_info = chosen_info
                        }
                        // $('#right-click-menu-container').css({ 'display': "none" })
                        document.getElementById("right-click-menu-container").style.display = "none"
                    }
                })
            })
            document.getElementById('click-detail').addEventListener('click', (e) => {
                // let place = new PlaceDetail({name: chosen_point_info.properties.name, type: chosen_point_info.type, lat: chosen_point_info.geometry.coordinates[1], lon: chosen_point_info.geometry.coordinates[0],address: [chosen_point_info.properties.housenumber,chosen_point_info.properties.street, chosen_point_info.properties.district, chosen_point_info.properties.city, chosen_point_info.properties.country],osm_id: chosen_point_info.properties.osm_id, osm_type: chosen_point_info.properties.osm_type});
                // place.showDetailFeature()
                document.getElementById('place').style.display = 'none'
            })
            
            document.getElementById('placeclose').addEventListener('click', (e) => {
                // deleteUrlParam('rx');
                // deleteUrlParam('ry');
                document.getElementById('place').style.display = "none"
            })
        }
    }
}