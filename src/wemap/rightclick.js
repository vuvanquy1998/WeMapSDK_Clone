export default class RightClick{
    constructor(map, stt) {
        this.map = map;
        this.stt = stt
        this.init();
    }
    init(){
        if(this.stt){
            this.map.on('contextmenu', (e) => {
                let mouseX = e.point.x;
                let mouseY= e.point.y;
                let max_width = $(window).width();
                let max_height = $(window).height();
                let context_menu_width = $('#right-click-menu-container').width();
                let context_menu_height = $('#right-click-menu-container').height();
                let translateX = 0;
                let translateY = 0;
        
                if(mouseX + context_menu_width > max_width){
                    console.log('qua dai ngang')
                    translateX = max_width - context_menu_width;
                }else{
                    translateX = mouseX;
                }
                if(mouseY + context_menu_height > max_height){
                    console.log('qua dai doc')
                    translateY = max_height - context_menu_height;
                }else{
                    translateY = mouseY;
                }
                $('#right-click-menu-container').css({'display':"block"})
                $('#right-click-menu-container').css({"transform":`translate(${translateX}px,${translateY}px)`})
            })
            map.on('click', (e) => {
                $('#right-click-menu-container').css({'display':"none"})
            })
        }
    }
}