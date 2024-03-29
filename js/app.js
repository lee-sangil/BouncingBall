const base_dir = '/apps/bounce'

import { AppTemplate } from "/apps/addon/template/app_template.js";
import { Ball } from "./Ball.js"
import { Obstacles } from "./Obstacles.js"

export class App extends AppTemplate {
    constructor(app_container){
        super();
        this.launch(app_container, `${base_dir}/static/index.html`, `${base_dir}/static/style.css`);
    }

    run() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.body.addEventListener("touchstart", this.touchstart.bind(this), false);
        this.body.addEventListener("touchmove", this.touchmove.bind(this), false);
        this.body.addEventListener("mousedown", this.mousedown.bind(this), false);
        this.body.addEventListener("mouseup", this.mouseup.bind(this), false);

        this.resize = this.resize.bind(this);
        window.addEventListener("resize", this.resize, false);
        this.resize();

        this.window_event_listener = [];
        this.window_event_listener.push({'key': 'resize', 'callback': this.resize});

        this.ball = new Ball(this.stageWidth, this.stageHeight, this.stageHeight*0.04, this.stageHeight*0.006); // width, height, radius, initial speed
        this.obstacles = new Obstacles(this.stageWidth, this.stageHeight, 8, this.ball, base_dir); // width, height, the maximum number of obstacles, exclusion region(=ball)
        this.obstacles.updateView(this.stageWidth, this.stageHeight, 0, 0);

        this.animate();
    }

    getTotalNumAssets() {
        return this.obstacles.num_obstacle;
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
        this.requestID = window.requestAnimationFrame(this.animate.bind(this));
    }
}