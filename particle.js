

class Particle {
  constructor(x, y, maxRadius, particleType) { // TODO add dynamic transition selection
    this.x = x;
    this.y = y;
    this.particleType = particleType;

    this.radius = Math.random() * maxRadius;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
    
    
    switch(this.particleType) {
      case 'staticExplosion': 
        this.hue = 60;
        this.lightness = 100;
        this.saturation = 100;
      break;
      case 'asteroidPieceDestruction':
        this.hue = 20;
        this.lightness = 80;
        this.saturation = 30;
        break;        
      default:
        this.hue = 60;
        this.lightness = 100;
        this.saturation = 100;
          
    }
        
    this.color;
    this.minRadius = 0.06;

    this.updateColor();
  }

  updateColor() {
    this.color = 'hsl(' + this.hue + ', ' + this.saturation + '%, ' + this.lightness +'%)'
  }

  transitionColor() {
    switch(this.particleType) {
      case 'staticExplosion': 
        if(this.lightness > 50) {
          this.lightness -= 6;
        }
        else if(this.hue > 0) {
          this.hue -= 3;
        }
        else if(this.lightness > 5) {
          this.lightness -= 5;
        }
        break;
      case 'asteroidPieceDestruction':
        if(this.lightness > 5) {
          this.lightness -= 5;
        }      
        break;
      default: 
        if(this.lightness > 50) {
          this.lightness -= 6;
        }
        else if(this.hue > 0) {
          this.hue -= 3;
        }
        else if(this.lightness > 5) {
          this.lightness -= 5;
        }
    }
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

    this.transitionColor();
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