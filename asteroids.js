

class AsteroidManager {
  constructor() {
    this.pieces = [];
  }

  getPiece() {
    this.pieces.push(new AsteroidPiece());
  }

  update() {
    
    // Delete out of screen asteroids
    this.pieces = this.pieces.filter( a => {
      if(!(a.x < -100 || a.x > canvas.width + 100 || a.y < -100 || a.y > canvas.height + 100)) {
          return true;
        };
    });


    // DEBUGGING PURPOSES
    // this.pieces.forEach( a => {
    //   if((a.x < 2 || a.x > canvas.width - 2 || a.y < 2 || a.y > canvas.height - 2 )) {
    //     a.color = 'red';
    //   };
    // });

    this.pieces.forEach( a => a.update());
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

    this.radius = randInt(50, 70);
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.theta = Math.PI * 2 * Math.random();
    // this.color = 'black';
    this.color = 'hsl(250, ' + randInt(0, 25) + '%, ' + randInt(0, 25) + '%)';
    this.vertices = [];


    // for(let i = 0; i < 4; i++) {
    //     let newVertex = {
    //       theta: i * -Math.PI/4,
    //       rad: this.radius
    //     };

    //     newVertex.x = this.x + this.radius * Math.cos(newVertex.theta);
    //     newVertex.y = this.y + this.radius * Math.sin(newVertex.theta);
  
    //     this.vertices.push(newVertex);

    // }


    do {
      let newVertex = {
        rad: randFloat(0.4, 1.2) * this.radius,
        theta: 0,
        x: 0,
        y: 0
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

    // INFINITE PLANE currently disabled
    // if(this.x < 0) this.x += canvas.width;
    // if(this.x > canvas.width) this.x -= canvas.width;
    // if(this.y < 0) this.y += canvas.height;
    // if(this.y > canvas.height) this.y -= canvas.height;

    this.vertices.forEach( v => {
      v.x = this.x + v.rad * Math.cos(v.theta);
      v.y = this.y + v.rad * -Math.sin(v.theta);
    })

    this.draw();
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'black';
    
    // ctx.moveTo(this.vertices[0].x * Math.cos(this.theta), this.vertices[0].y * Math.cos(this.theta));
    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    
    this.vertices.forEach( (v, i, vert) => {
      // ctx.lineTo(vert[(i+1) % vert.length].x * Math.cos(this.theta), vert[(i+1) % vert.length].y * Math.cos(this.theta));
      ctx.lineTo(vert[(i+1) % vert.length].x, vert[(i+1) % vert.length].y);
      // ctx.fillText(i, v.x * Math.cos(this.theta), v.y * Math.cos(this.theta))
      ctx.font = '20px Arial';
      ctx.fillText(i, v.x, v.y);
    });
    ctx.fill();
    ctx.stroke();

    // Reference circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }
}
