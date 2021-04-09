

class Particle {
  constructor(x, y, maxRadius) { // TODO add dynamic transition selection
    this.x = x;
    this.y = y;

    this.radius = Math.random() * maxRadius;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;

    this.hue = 60;
    this.lightness = 100;
    this.color;
    this.updateColor();
    
    this.minRadius = 0.06;
  }

  updateColor() {
    this.color = 'hsl(' + this.hue + ', 100%, ' + this.lightness +'%)'
  }

  stillExists() {
    if(this.radius < this.minRadius) return false;
    return true;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.radius -= this.minRadius;

    if(this.radius < 0) this.radius = 0;

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
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}