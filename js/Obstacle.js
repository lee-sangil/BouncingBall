function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

export class Obstacle{
    constructor(x, y, x_max, y_max) {
        this.top_x = x;
        this.top_y = y;
        this.top_x_max = x_max;
        this.top_y_max = y_max;

        const rgb = HSVtoRGB(Obstacle.count++ / 8., 0.8, 1.0);
        this.color_red = rgb.r;
        this.color_green = rgb.g;
        this.color_blue = rgb.b;

        this.audio = new Audio('./assets/' + Obstacle.count + '.wav');
        this.audio.preload = 'auto';

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
    playSound(){
        this.audio.currentTime = 0;
        this.audio.play();
    }
}
Obstacle.count = 0;