export default class RightClick {
    constructor(map, key) {
        this.map = map;
        this.key = key;
        this.clickedPoi = {};
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
            let maxWidth = window.innerWidth;
            let maxHeight = window.innerHeight;
            let contextMenuWidth = document.getElementById("right-click-menu-container").clientWidth;
            let contextMenuHeight = document.getElementById("right-click-menu-container").clientHeight;
            let translateX = 0;
            let translateY = 0;

            if (mouseX + contextMenuWidth > maxWidth) {
                translateX = maxWidth - contextMenuWidth;
            } else {
                translateX = mouseX;
            }
            if (mouseY + contextMenuHeight > maxHeight) {
                translateY = maxHeight - contextMenuHeight;
            } else {
                translateY = mouseY;
            }
            this.displayUI('right-click-menu-container', 'block')
            document.getElementById("right-click-menu-container").style.transform = `translate(${translateX}px,${translateY}px)`
            this.clickedPoi = e;
        })
    }
    closeMenu(){
        this.map.on('click', (e) => {
            this.displayUI('right-click-menu-container', 'none')
        })
    }
    onReverse(){
        document.getElementById('right-click-reverse').addEventListener('click', (event) => {
            this.displayUI('right-click-menu-container', 'none')
            wemapgl.reverse.rightClick(this.clickedPoi)
        })
    }
    displayUI(id, text){
        document.getElementById(id).style.display = text;
    }
    static add(id, text){
        let newRightClickItem = document.createElement('div')
        newRightClickItem.setAttribute('id', id)
        newRightClickItem.setAttribute('class', 'right-click-menu-item')
        newRightClickItem.innerText = text

        document.getElementById('right-click-menu-container').appendChild(newRightClickItem)
    }
}
