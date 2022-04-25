import { Ball } from "./Ball.js"
import { Obstacles } from "./Obstacles.js"

class App{
    constructor(){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        document.body.appendChild(this.canvas);

        window.addEventListener("touchstart", this.touchstart.bind(this), false);
        window.addEventListener("touchmove", this.touchmove.bind(this), false);
        window.addEventListener("mousedown", this.mousedown.bind(this), false);
        window.addEventListener("mouseup", this.mouseup.bind(this), false);
        window.addEventListener("resize", this.resize.bind(this), false);

        this.resize();

        this.ball = new Ball(this.stageWidth, this.stageHeight, this.stageHeight*0.04, this.stageHeight*0.006); // width, height, radius, initial speed
        this.obstacles = new Obstacles(this.stageWidth, this.stageHeight, 8, this.ball); // width, height, the maximum number of obstacles, exclusion region(=ball)
        this.obstacles.updateView(this.stageWidth, this.stageHeight, 0, 0);

        window.requestAnimationFrame(this.animate.bind(this));
    }
    touchstart(evt){
        this.touch_x = evt.touches[0].pageX;
        this.touch_y = evt.touches[0].pageY;

        this.id_drag = this.obstacles.intersect({x:this.touch_x, y:this.touch_y});
    }
    touchmove(evt){
        // Calculate touch distance
        const delta_x = evt.touches[0].pageX - this.touch_x;
        const delta_y = evt.touches[0].pageY - this.touch_y;
        this.touch_x = evt.touches[0].pageX;
        this.touch_y = evt.touches[0].pageY;

        if (this.id_drag == -1)
            this.obstacles.updateView(this.stageWidth, this.stageHeight, delta_x, delta_y);
        else{
            this.obstacles.nth_child[this.id_drag].updatePosition(delta_x, delta_y);
            this.obstacles.updateView(this.stageWidth, this.stageHeight, 0, 0);
        }
    }
    mousedown(evt){
        this.touch_x = evt.pageX;
        this.touch_y = evt.pageY;
        window.onmousemove = ((evt)=>{this.mousemove(evt);}).bind(this);

        this.id_drag = this.obstacles.intersect({x:this.touch_x, y:this.touch_y});
    }
    mousemove(evt){
        // Calculate touch distance
        const delta_x = evt.pageX - this.touch_x;
        const delta_y = evt.pageY - this.touch_y;
        this.touch_x = evt.pageX;
        this.touch_y = evt.pageY;

        if (this.id_drag == -1)
            this.obstacles.updateView(this.stageWidth, this.stageHeight, delta_x, delta_y);
        else{
            this.obstacles.nth_child[this.id_drag].updatePosition(delta_x, delta_y);
            this.obstacles.updateView(this.stageWidth, this.stageHeight, 0, 0);
        }
    }
    mouseup(evt){
        window.onmousemove = null;
    }
    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;
        this.ctx.scale(2, 2);

        if (this.obstacles)
            this.obstacles.updateView(this.stageWidth, this.stageHeight, 0, 0);
    }

    animate(t) {
        this.ctx.clearRect(0,0,this.stageWidth, this.stageHeight);
        this.obstacles.drawShadow(this.ctx);
        this.ball.draw(this.ctx, this.stageWidth, this.stageHeight, this.obstacles);
        this.obstacles.drawForeground(this.ctx);
        window.requestAnimationFrame(this.animate.bind(this));
    }
}

window.onload = () => {
    $(window.document).on("contextmenu", function(event){ return false; }); // lock right click
    
    if (getComputedStyle(document.documentElement).getPropertyValue('--debug-mode') != 1){
        $(window.document).on("keydown", function(event){
            if(event.keyCode==123){ // Prevent from <F12> key
                return false;
            }
            else if(event.ctrlKey && event.shiftKey && event.keyCode==73){
                return false;  // Prevent from ctrl+shift+i
            }
            else if(event.ctrlKey){
                return false;  // Prevent from ctrl
            }
        });
    }
    
    new App();
}
