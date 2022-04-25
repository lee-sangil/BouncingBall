export class Ball{
    constructor(stageWidth, stageHeight, radius, speed) {
        this.radius = radius;
        this.vx = speed;
        this.vy = speed;

        const diameter = this.radius * 2;
        this.x = this.radius + Math.random() * (stageWidth - diameter);
        this.y = this.radius + Math.random() * (stageHeight - diameter);
    }

    draw(ctx, stageWidth, stageHeight, obstacles){
        this.x += this.vx;
        this.y += this.vy;

        this.bounceWindow(stageWidth, stageHeight);
        for (let i = 0; i < obstacles.num_obstacle; ++i)
            this.bounceObstacle(obstacles.nth_child[i]);

        ctx.fillStyle = "#fdd700";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    bounceWindow(stageWidth, stageHeight){
        if (this.x < this.radius || this.x > stageWidth - this.radius){
            this.vx = Math.sign(0.5*stageWidth - this.x) * Math.abs(this.vx);
            this.x += this.vx;
            // window.navigator.vibrate(5); // iOS does not support this function.
        }
        if (this.y < this.radius || this.y > stageHeight - this.radius){
            this.vy = Math.sign(0.5*stageHeight - this.y) * Math.abs(this.vy);
            this.y += this.vy;
            // window.navigator.vibrate(5); // iOS does not support this function.
        }
    }

    bounceObstacle(obstacle){
        const minX = obstacle.eff_x - this.radius;
        const maxX = obstacle.eff_x_max + this.radius;
        const minY = obstacle.eff_y - this.radius;
        const maxY = obstacle.eff_y_max + this.radius;
        
        if ((this.x > obstacle.eff_x && this.x < obstacle.eff_x_max) && (this.y > minY && this.y < maxY) ){ // collide with horizontal edge
            this.vy = Math.sign(this.y - obstacle.eff_y) * Math.abs(this.vy);
            this.y += this.vy;
            // window.navigator.vibrate(5); // iOS does not support this function.
            obstacle.changeColor();
        }else if ((this.x > minX && this.x < maxX) && (this.y > obstacle.eff_y && this.y < obstacle.eff_y_max) ){ // collide with vertical edge
            this.vx = Math.sign(this.x - obstacle.eff_x) * Math.abs(this.vx);
            this.x += this.vx;
            // window.navigator.vibrate(5); // iOS does not support this function.
            obstacle.changeColor();
        }else{ 
            if (Math.pow(this.x - obstacle.eff_x,2) + Math.pow(this.y - obstacle.eff_y,2) < Math.pow(this.radius,2)){ // collide with top-left corner
                let v_reflect_norm2 = Math.pow(this.x - obstacle.eff_x,2) + Math.pow(this.y - obstacle.eff_y,2);
                let inner_product = this.vx * (this.x - obstacle.eff_x) + this.vy * (this.y - obstacle.eff_y);
                this.vx -= 2 * inner_product * (this.x - obstacle.eff_x) / v_reflect_norm2;
                this.vy -= 2 * inner_product * (this.y - obstacle.eff_y) / v_reflect_norm2;
                this.x += this.vx;
                this.y += this.vy;
                // window.navigator.vibrate(5); // iOS does not support this function.
                obstacle.changeColor();
            }
            if (Math.pow(this.x - obstacle.eff_x_max,2) + Math.pow(this.y - obstacle.eff_y,2) < Math.pow(this.radius,2)){ // collide with top-right corner
                let v_reflect_norm2 = Math.pow(this.x - obstacle.eff_x_max,2) + Math.pow(this.y - obstacle.eff_y,2);
                let inner_product = this.vx * (this.x - obstacle.eff_x_max) + this.vy * (this.y - obstacle.eff_y);
                this.vx -= 2 * inner_product * (this.x - obstacle.eff_x_max) / v_reflect_norm2;
                this.vy -= 2 * inner_product * (this.y - obstacle.eff_y) / v_reflect_norm2;
                this.x += this.vx;
                this.y += this.vy;
                // window.navigator.vibrate(5); // iOS does not support this function.
                obstacle.changeColor();
            }
            if (Math.pow(this.x - obstacle.eff_x,2) + Math.pow(this.y - obstacle.eff_y_max,2) < Math.pow(this.radius,2)){ // collide with bottom-left corner
                let v_reflect_norm2 = Math.pow(this.x - obstacle.eff_x,2) + Math.pow(this.y - obstacle.eff_y_max,2);
                let inner_product = this.vx * (this.x - obstacle.eff_x) + this.vy * (this.y - obstacle.eff_y_max);
                this.vx -= 2 * inner_product * (this.x - obstacle.eff_x) / v_reflect_norm2;
                this.vy -= 2 * inner_product * (this.y - obstacle.eff_y_max) / v_reflect_norm2;
                this.x += this.vx;
                this.y += this.vy;
                // window.navigator.vibrate(5); // iOS does not support this function.
                obstacle.changeColor();
            }
            if (Math.pow(this.x - obstacle.eff_x_max,2) + Math.pow(this.y - obstacle.eff_y_max,2) < Math.pow(this.radius,2)){ // collide with bottom-right corner
                let v_reflect_norm2 = Math.pow(this.x - obstacle.eff_x_max,2) + Math.pow(this.y - obstacle.eff_y_max,2);
                let inner_product = this.vx * (this.x - obstacle.eff_x_max) + this.vy * (this.y - obstacle.eff_y_max);
                this.vx -= 2 * inner_product * (this.x - obstacle.eff_x_max) / v_reflect_norm2;
                this.vy -= 2 * inner_product * (this.y - obstacle.eff_y_max) / v_reflect_norm2;
                this.x += this.vx;
                this.y += this.vy;
                // window.navigator.vibrate(5); // iOS does not support this function.
                obstacle.changeColor();
            }
        }
    }
}
