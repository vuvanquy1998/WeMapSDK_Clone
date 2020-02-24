import { getJSON } from '../util/ajax'
import { default as config } from '../config.json';
import PlaceDetail from './placeDetail'
import Reverse from './reverse'

export default class RightClick {
    constructor(map, key) {
        this.map = map;
        this.key = key;
        this.clicked_poi = {};
        this.initView();
        this.showMenu();
        this.closeMenu();
        this.onReverse();
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
    showMenu() {
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
            this.display_ui('right-click-menu-container', 'block')
            document.getElementById("right-click-menu-container").style.transform = `translate(${translateX}px,${translateY}px)`
            this.clicked_poi = e;
        })
    }
    closeMenu(){
        this.map.on('click', (e) => {
            this.display_ui('right-click-menu-container', 'none')
        })
    }
    onReverse(){
        document.getElementById('right-click-reverse').addEventListener('click', (event) => {
           // wemapgl.reverse.rightClick(event)
        })
    }
    display_ui(id, text){
        document.getElementById(id).style.display = text;
    }
    static add(id, text){
        let new_right_click_item = document.createElement('div')
        new_right_click_item.setAttribute('id', id)
        new_right_click_item.setAttribute('class', 'right-click-menu-item')
        new_right_click_item.innerText = text

        document.getElementById('right-click-menu-container').appendChild(new_right_click_item)
    }
    rightClickCoordinates(){
        map.on('contextmenu', (e) => {
            const coords = [e.lngLat.lng, e.lngLat.lat]
            return coords
        })
    }
}
