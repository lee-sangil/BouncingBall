export class Obstacle{
    constructor(x, y, x_max, y_max) {
        this.top_x = x;
        this.top_y = y;
        this.top_x_max = x_max;
        this.top_y_max = y_max;
        this.color_red = 253;
        this.color_green = 23;
        this.color_blue = 32;

        this.shadow_ratio = 0.9;
        this.eff_ratio = 1;
    }
    constructShadow(viewer_x, viewer_y){
        this.base_x = this.shadow_ratio * (this.top_x - viewer_x) + viewer_x;
        this.base_y = this.shadow_ratio * (this.top_y - viewer_y) + viewer_y;
        this.base_x_max = this.shadow_ratio * (this.top_x_max - viewer_x) + viewer_x;
        this.base_y_max = this.shadow_ratio * (this.top_y_max - viewer_y) + viewer_y;

        this.eff_x = this.eff_ratio * this.top_x + (1-this.eff_ratio) * this.base_x;
        this.eff_y = this.eff_ratio * this.top_y + (1-this.eff_ratio) * this.base_y;
        this.eff_x_max = this.eff_ratio * this.top_x_max + (1-this.eff_ratio) * this.base_x_max;
        this.eff_y_max = this.eff_ratio * this.top_y_max + (1-this.eff_ratio) * this.base_y_max;
    }
    drawForeground(ctx){
        ctx.fillStyle = 'rgb(' + (this.color_red) + ', ' + (this.color_green) + ', ' + (this.color_blue) + ')';
        ctx.beginPath();
        ctx.moveTo(this.top_x, this.top_y);
        ctx.lineTo(this.top_x, this.top_y_max);
        ctx.lineTo(this.top_x_max, this.top_y_max);
        ctx.lineTo(this.top_x_max, this.top_y);
        ctx.closePath();
        ctx.fill();
    }
    drawShadow(ctx, viewer_x, viewer_y){
        const midX = 0.5 * (this.base_x + this.base_x_max);
        const midY = 0.5 * (this.base_y + this.base_y_max);
        let x = viewer_x - midX;
        let y = viewer_y - midY;

        if (y >= x && y >= -x){
            this.drawUpperShadow(ctx);
            this.drawRightShadow(ctx);
            this.drawLeftShadow(ctx);
            this.drawLowerShadow(ctx);
        }else if (y >= x && y < -x){
            this.drawRightShadow(ctx);
            this.drawLowerShadow(ctx);
            this.drawUpperShadow(ctx);
            this.drawLeftShadow(ctx);
        }else if (y < x && y < -x){
            this.drawLowerShadow(ctx);
            this.drawLeftShadow(ctx);
            this.drawRightShadow(ctx);
            this.drawUpperShadow(ctx);
        }else if (y < x && y >= -x){
            this.drawLeftShadow(ctx);
            this.drawUpperShadow(ctx);
            this.drawLowerShadow(ctx);
            this.drawRightShadow(ctx);
        }
    }
    drawUpperShadow(ctx){
        ctx.fillStyle = 'rgb(' + (0.6*this.color_red) + ', ' + (0.6*this.color_green) + ', ' + (0.6*this.color_blue) + ')';
        ctx.beginPath();
        ctx.moveTo(this.top_x, this.top_y);
        ctx.lineTo(this.base_x, this.base_y);
        ctx.lineTo(this.base_x_max, this.base_y);
        ctx.lineTo(this.top_x_max, this.top_y);
        ctx.closePath();
        ctx.fill();
    }
    drawLowerShadow(ctx){
        ctx.fillStyle = 'rgb(' + (0.8*this.color_red) + ', ' + (0.8*this.color_green) + ', ' + (0.8*this.color_blue) + ')';
        ctx.beginPath();
        ctx.moveTo(this.top_x_max, this.top_y_max);
        ctx.lineTo(this.base_x_max, this.base_y_max);
        ctx.lineTo(this.base_x, this.base_y_max);
        ctx.lineTo(this.top_x, this.top_y_max);
        ctx.closePath();
        ctx.fill();
    }
    drawLeftShadow(ctx){
        ctx.fillStyle = 'rgb(' + (0.9*this.color_red) + ', ' + (0.9*this.color_green) + ', ' + (0.9*this.color_blue) + ')';
        ctx.beginPath();
        ctx.moveTo(this.top_x, this.top_y_max);
        ctx.lineTo(this.base_x, this.base_y_max);
        ctx.lineTo(this.base_x, this.base_y);
        ctx.lineTo(this.top_x, this.top_y);
        ctx.closePath();
        ctx.fill();
    }
    drawRightShadow(ctx){
        ctx.fillStyle = 'rgb(' + (0.5*this.color_red) + ', ' + (0.5*this.color_green) + ', ' + (0.5*this.color_blue) + ')';
        ctx.beginPath();
        ctx.moveTo(this.top_x_max, this.top_y);
        ctx.lineTo(this.base_x_max, this.base_y);
        ctx.lineTo(this.base_x_max, this.base_y_max);
        ctx.lineTo(this.top_x_max, this.top_y_max);
        ctx.closePath();
        ctx.fill();
    }
    updatePosition(dx, dy){
        this.top_x = this.top_x + dx;
        this.top_y = this.top_y + dy;
        this.top_x_max = this.top_x_max + dx;
        this.top_y_max = this.top_y_max + dy;
    }
    changeColor(){
        this.color_red = Math.floor(Math.random()*256);
        this.color_green = Math.floor(Math.random()*256);
        this.color_blue = Math.floor(Math.random()*256);
    }
}
