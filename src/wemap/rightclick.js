export default class RightClick {
    /**
     * Create right click
     * @param {Object} map 
     */
    constructor(map) {
        this.map = map;
        this.lat = 0;
        this.lon = 0;
        this.clickedPoi = {};
        this.initView();
        this.addMenuItemStart();
        this.addMenuItemEnd();
        this.addMenuItemReverse();
        this.showMenu();
        this.updateUrlStart();
        this.updateUrlEnd();
        this.closeMenu();
        this.onReverse();
        this.getLocation();
    }
    /**
     * render initial view: hidden right click menu and reverse bottom card
     */
    initView() {
        let rightClick = document.createElement('div')
        rightClick.innerHTML = '<div id = "wemap-right-click-menu-container"' + "style = 'display: none'>" +
            '</div>'
        document.body.appendChild(rightClick)
        let showBottomDetail = document.createElement('div')
        showBottomDetail.innerHTML = '<div id="wemap-place" style="display: none">' +
            '<div class="wemap-class-pl">' +
            '<div class="wemap-image-place">' +
            '<img class="wemap-placeicon" id="wemap-preview-image">' +
            '</div>' +
            '<div class="wemap-add-place">' +
            '<button class="wemap-click-detail" id="wemap-click-detail">' +
            '<a class="wemap-placename" id="wemap-placename">a</a>' +
            '<a class="wemap-placeadd" id="wemap-placeadd">a</a>' +
            '</button>' +

            '<div class="wemap-placelatlon"><a href="#" id="wemap-placelatlon"></a></div>' +
            '</div>' +
            '<div class="wemap-image-direc">' +
            '<a id="wemap-direction-icon">'+
            '<img src="http://maps.gstatic.com/tactile/reveal/directions-1x-20150909.png">' +
            '</a>'+
            '</div>' +
            '<div class="wemap-close-place">' +
            '<div id="wemap-placeclose" style="color: black;"><i class="fa fa-times"></i></div>' +
            '</div>' +
            '</div>' +
            '</div>'
        document.body.appendChild(showBottomDetail)
    }
    /**
     * render right click menu
     */
    showMenu() {
        this.map.on('contextmenu', (e) => {
            let mouseX = e.point.x;
            let mouseY = e.point.y;
            let maxWidth = window.innerWidth;
            let maxHeight = window.innerHeight;
            let contextMenuWidth = document.getElementById("wemap-right-click-menu-container").clientWidth;
            let contextMenuHeight = document.getElementById("wemap-right-click-menu-container").clientHeight;
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
            this.displayUI('wemap-right-click-menu-container', 'block')
            document.getElementById("wemap-right-click-menu-container").style.transform = `translate(${translateX}px,${translateY}px)`
            this.clickedPoi = e;
        })
    }
    /**
     * close right click menu when left click map
     */
    closeMenu(){
        this.map.on('click', (e) => {
            this.displayUI('wemap-right-click-menu-container', 'none')
        })
    }
    /**
     * close right click menu ui
     */
    closeMenuUI(){
        this.displayUI('wemap-right-click-menu-container', 'none')
    }
    /**
     * reverse when click 'Đây là đâu?' option in right click menu
     */
    onReverse(){
        document.getElementById('wemap-right-click-reverse').addEventListener('click', (event) => {
            this.displayUI('wemap-right-click-menu-container', 'none')
            wemapgl.reverse.rightClick(this.clickedPoi)
        })
    }
    /**
     * change style of html element by id
     * @param {String} id 
     * @param {String} text 
     */
    displayUI(id, text){
        document.getElementById(id).style.display = text;
    }
    /**
     * add new option in right click menu
     * @param {String} id 
     * @param {String} text 
     */
    addMenuItem(id, text){
        let newRightClickItem = document.createElement('div')
        newRightClickItem.setAttribute('id', id)
        newRightClickItem.setAttribute('class', 'wemap-right-click-menu-item')
        newRightClickItem.innerText = text

        document.getElementById('wemap-right-click-menu-container').appendChild(newRightClickItem)
    }
    addMenuItemStart(){
        this.addMenuItem('wemap-right-click-start', 'Điểm bắt đầu')
    }
    addMenuItemEnd(){
        this.addMenuItem('wemap-right-click-end', 'Điểm kết thúc')
    }
    addMenuItemReverse(){
        this.addMenuItem('wemap-right-click-reverse', 'Đây là đâu ?')
    }
    updateUrlStart(){
        document.getElementById('wemap-right-click-start').addEventListener('click', (e)=> {
            wemapgl.urlController.updateParams("route", {
                ox: this.clickedPoi.lngLat.lng,
                oy: this.clickedPoi.lngLat.lat,
                action: true
            })
        })
    }
    updateUrlEnd(){
        document.getElementById('wemap-right-click-end').addEventListener('click', (e)=> {
            wemapgl.urlController.updateParams("route", {
                dx: this.clickedPoi.lngLat.lng,
                dy: this.clickedPoi.lngLat.lat,
                action: true
            })
        })
    }
    /**
     * update lat lon right click
     */
    getLocation(){
        this.map.on('contextmenu', (e) => {
            this.lat = e.lngLat.lat;
            this.lon = e.lngLat.lng;
        })
    }
}
