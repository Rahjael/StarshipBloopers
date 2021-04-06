



class AsteroidManager {
  constructor() {
    this.pieces = [];

  }

  getPiece() {
    this.pieces.push(new AsteroidPiece());
  }

  update() {
    this.pieces.forEach( a => a.update());

    // Delete out of screen asteroids
    this.pieces = this.pieces.filter( a => !(a.x < -100 || a.x > canvas.width + 100 || a.y < -100 || a.y > canvas.height + 100));
  }
}












class Asteroid {
  constructor() {
    this.pieces = [];



  }
}




class AsteroidPiece {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.radius = randInt(20, 70);
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.theta = Math.PI * 2 * Math.random();
    //this.color = 'black';
    this.color = 'hsl(250, ' + randInt(0, 25) + '%, ' + randInt(0, 25) + '%)';
    this.vertices = [];

    do {
      let newVertex = {
        rad: randFloat(0.4, 1.2) * this.radius
      };      
      let nextTheta;
      let previousTheta;
      
      if(this.vertices.length == 0) nextTheta = 0;
      else {
        previousTheta = this.vertices[this.vertices.length - 1].theta;
        nextTheta = Math.PI * 2 * randFloat(0.02, 0.15) + previousTheta;
      }
      if(nextTheta > Math.PI * 2) break;

      newVertex.theta = nextTheta;
      newVertex.x = this.x + newVertex.rad * Math.cos(nextTheta);
      newVertex.y = this.y + newVertex.rad * Math.sin(nextTheta);

      this.vertices.push(newVertex);
    } while(this.vertices[this.vertices.length - 1].theta < Math.PI * 2);

  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.vertices.forEach( v => {
      v.x = this.x + v.rad * Math.cos(v.theta);
      v.y = this.y + v.rad * Math.sin(v.theta);
    })

    this.draw();
  }

  draw() {    
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'grey';
    ctx.moveTo(this.vertices[0].x * Math.cos(this.theta), this.vertices[0].y * Math.cos(this.theta));
    
    this.vertices.forEach( (v, i, vert) => {
      ctx.lineTo(vert[(i+1) % vert.length].x * Math.cos(this.theta), vert[(i+1) % vert.length].y * Math.cos(this.theta));
      //ctx.fillText(i, v.x * Math.cos(this.theta), v.y * Math.cos(this.theta))
    });
    ctx.fill();
    ctx.stroke();

    // Reference circle
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
    // ctx.strokeStyle = 'red';
    // ctx.stroke();
  }
}
