import { Obstacle } from "./Obstacle.js"

export class Obstacles{
    constructor(stageWidth, stageHeight, max_num_obstacle, ball) {
        this.num_obstacle = max_num_obstacle;
        
        this.nth_child = [];
        for (let n_try = 0; this.nth_child.length < max_num_obstacle && n_try < max_num_obstacle*2; ++n_try){
            const width = stageHeight/10;
            const x = width + Math.random() * (stageWidth - 2 * width);
            const y = width + Math.random() * (stageHeight - 2 * width);
            const x_max = x + width;
            const y_max = y + width;

            if (ball.x + ball.radius + 0.5 * width > x && ball.x - ball.radius - 0.5 * width < x_max && ball.y + ball.radius + 0.5 * width > y && ball.y - ball.radius - 0.5 * width < y_max)
                continue;
            else{
                let overlay_w_others = false;
                for (let i = 0; i < this.nth_child.length; ++i){
                    if (x > this.nth_child[i].top_x - 1.5*width && x < this.nth_child[i].top_x_max + 0.5*width && y > this.nth_child[i].top_y - 1.5*width && y < this.nth_child[i].top_y_max + 0.5*width){
                        overlay_w_others = true;
                        break;
                    }
                }
                if (!overlay_w_others) this.nth_child.push(new Obstacle(x, y, x_max, y_max));
            }
        }
        this.num_obstacle = this.nth_child.length;

        this.viewer_x = 0.5 * stageWidth;
        this.viewer_y = 0.5 * stageHeight;
        this.delta_x = 0;
        this.delta_y = 0;
    }
    updateView(stageWidth, stageHeight, delta_x, delta_y){
        this.delta_x += delta_x;
        this.delta_y += delta_y;
        if (Math.abs(this.delta_x) > 200)
            this.delta_x = Math.sign(this.delta_x)*200;
        if (Math.abs(this.delta_y) > 200)
            this.delta_y = Math.sign(this.delta_y)*200;

        this.viewer_x = 0.5 * stageWidth + this.delta_x;
        this.viewer_y = 0.5 * stageHeight + this.delta_y;
        for (let i = 0; i < this.num_obstacle; ++i)
            this.nth_child[i].constructShadow(this.viewer_x, this.viewer_y);
    }
    drawShadow(ctx){
        for (let i = 0; i < this.num_obstacle; ++i)
            this.nth_child[i].drawShadow(ctx, this.viewer_x, this.viewer_y);
    }
    drawForeground(ctx){
        for (let i = 0; i < this.num_obstacle; ++i)
            this.nth_child[i].drawForeground(ctx);
    }
    intersect(pos){
        for (let i = 0; i < this.num_obstacle; ++i){
            if (this.nth_child[i].top_x < pos.x &&
                this.nth_child[i].top_x_max > pos.x &&
                this.nth_child[i].top_y < pos.y &&
                this.nth_child[i].top_y_max > pos.y)
                return i;
        }
        return -1;
    }
}
