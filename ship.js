
class PlayerShip {
  constructor(x, y, radius) {
    this.objtype = 'PlayerShip';
    
    this.x = x;
    this.y = y;
    this.theta = 0;
    
    this.vertices = [];

    this.radius = radius;
    this.color = 'white';

    this.maxSpeed = 6;
    this.acceleration = 0.3;
    this.speedX = 0;
    this.speedY = 0;

    this.maxWingSpan = Math.PI * 0.8;
    this.minWingSpan = Math.PI * 0.2;

    this.engineParticles = [];
    this.laserShots = [];

    this.rotate({x: this.x, y: this.y + this.radius});
  }



  /*
  *
  * COMPUTATION FUNCTIONS
  * 
  */
  
  update(pointer) {
    let speedX = this.speedX;
    let speedY = this.speedY;

    this.x += speedX;
    this.y += speedY;

    // Out of screen adjustments for infinite plane
    if(this.x < 0) this.x += canvas.width;
    if(this.x > canvas.width) this.x -= canvas.width;
    if(this.y < 0) this.y += canvas.height;
    if(this.y > canvas.height) this.y -= canvas.height;

    this.rotate(pointer);
    this.operateEngines();
    this.engineParticles.forEach( part => part.update());
    this.engineParticles = this.engineParticles.filter( part => part.size > part.minSize);


    let wingSpan = this.maxWingSpan - (this.maxWingSpan - this.minWingSpan) * Math.hypot(this.speedX, this.speedY) / this.maxSpeed;

    this.vertices[0] = {  x: this.x + this.radius * Math.cos(this.theta),
                y: this.y + this.radius * Math.sin(this.theta)
    };
    this.vertices[1] = {  x: this.x + this.radius * Math.cos(this.theta + (2*Math.PI - wingSpan)/2), 
                y: this.y + this.radius * Math.sin(this.theta + (2*Math.PI - wingSpan)/2)
    };
    // Ship's center
    this.vertices[2] = {  x: this.x, 
                          y: this.y
    };
    this.vertices[3] = {  x: this.x + this.radius * Math.cos(this.theta - (2*Math.PI - wingSpan)/2), 
                y: this.y + this.radius * Math.sin(this.theta - (2*Math.PI - wingSpan)/2)
    };


    // Apply drag
    // Remember: dragFactor is always negative
    if(speedX != 0 && speedY != 0) {
      this.speedX += universe.dragFactor * Math.sign(speedX);
      this.speedY += universe.dragFactor * Math.sign(speedY);
    }

    this.laserShots.forEach( shot => shot.update());
  }

  rotate(target = {x: 0, y: 0}) {
    this.theta = Math.atan2(target.y - this.y, target.x - this.x);
  }

  operateEngines() {
    if(!mouse.isDown) return;
    let newSpeedX = this.speedX + this.acceleration * Math.cos(this.theta);
    let newSpeedY = this.speedY + this.acceleration * Math.sin(this.theta);

    if(Math.abs(newSpeedX) <= this.maxSpeed) {
      this.speedX = newSpeedX;
    }
    if(Math.abs(newSpeedY) <= this.maxSpeed) {
      this.speedY = newSpeedY;
    }


    this.engineParticles.push(new EngineParticle(this.x, this.y, this.radius, this.theta));

  }

  fireLaser() {
    this.laserShots.push(new LaserShot(this.x, this.y, this.radius, this.theta));
  }

  /*
  *
  * DRAWING FUNCTIONS
  * 
  */

  draw() {
    this.drawChassis();
    this.engineParticles.forEach( part => part.draw());
  }

  drawChassis() {

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);    
    ctx.lineTo(this.vertices[1].x, this.vertices[1].y);
    ctx.lineTo(this.vertices[2].x, this.vertices[2].y); // Ship's center
    ctx.lineTo(this.vertices[3].x, this.vertices[3].y);
    ctx.closePath();
    ctx.fill();
  }
}



class EngineParticle {
  constructor(shipX, shipY, shipRadius, shipTheta) {
    this.x = shipX;
    this.y = shipY;

    this.theta = shipTheta; // TODO not using this atm. Use it with some random offset to better visualize thrust

    this.size = Math.random() * shipRadius * 0.2;
    this.speedX = (Math.random() * 4 - 2);
    this.speedY = (Math.random() * 4 - 2);

    this.hue = 60;
    this.lightness = 100;
    this.color;
    this.updateColor();
    
    this.minSize = 0.06;
    this.decayingSpeed = 0.1;
    
  }

  updateColor() {
    this.color = 'hsl(' + this.hue + ', 100%, ' + this.lightness +'%)'
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size -= this.decayingSpeed;

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
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}





class LaserShot {
  constructor(shipX, shipY, shipRadius, shipTheta) {

    this.x = shipX;
    this.y = shipY;

    this.radius = shipRadius * 0.5;
    this.color = '#fa05e6';

    this.theta = shipTheta;

    this.speed = 30;

    this.vertices = [];

    this.speedX = this.speed * Math.cos(this.theta);
    this.speedY = this.speed * Math.sin(this.theta);

  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.vertices = [ {x: this.x, y: this.y},
                      {x: this.x + this.radius * Math.cos(this.theta),
                        y: this.y + this.radius * Math.sin(this.theta)
                      }]

    this.draw();
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.lineTo(this.vertices[1].x, this.vertices[1].y);
    ctx.stroke();
  }
}