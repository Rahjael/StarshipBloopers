

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.size = Math.random() * 10;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;

    this.hue = 60;
    this.lightness = 100;
    this.color;
    this.updateColor();
    
    this.minSize = 0.06;
  }

  updateColor() {
    this.color = 'hsl(' + this.hue + ', 100%, ' + this.lightness +'%)'
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size -= this.minSize;

    if(this.size < 0) this.size = 0;

    // Transition color
    if(this.lightness > 50) {
      this.lightness -= 6;
    }
    else if(this.hue > 0) {
      this.hue -= 3;
    }
    else if(this.lightness > 5) {
      this.lightness -= 5;
    }
    this.updateColor();
    this.draw();

  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}