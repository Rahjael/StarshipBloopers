

class AsteroidManager {
  constructor() {
    this.pieces = [];
    this.asteroids = [];
  }

  getPiece() {
    this.pieces.push(new AsteroidPiece());
  }

  update() {
    
    // Delete out of screen asteroid pieces
    this.pieces = this.pieces.filter(ast => {
      if(!(ast.x < -100 ||ast.x > canvas.width + 100 ||ast.y < -100 ||ast.y > canvas.height + 100)) {
        return true;
      }
      ast.attachedTo.attachedPieces--;
      return false;
    });

    // Delete empty asteroid entities
    this.asteroids = this.asteroids.filter(ast => ast.attachedPieces > 0);

    // DEBUGGING PURPOSES
    // this.pieces.forEach( a => {
    //   if((a.x < 2 || a.x > canvas.width - 2 || a.y < 2 || a.y > canvas.height - 2 )) {
    //     a.color = 'red';
    //   };
    // });

    this.pieces.forEach( piece => piece.update());
    this.asteroids.forEach( ast => ast.update());
  }

  composeAsteroid() {
    let asteroid = new Asteroid();

    asteroid.hookPoints.forEach( point => {
      let newPiece = new AsteroidPiece();

      newPiece.attachedTo = asteroid;
      newPiece.x = point.x;
      newPiece.y = point.y;
      newPiece.speedX = asteroid.speedX;
      newPiece.speedY = asteroid.speedY;

      this.pieces.push(newPiece);

      asteroid.attachedPieces++;

    })

    this.asteroids.push(asteroid);

  }

}








class Asteroid {
  constructor() {
    this.type = 'Asteroid';

    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;

    this.radius = 10;

    this.hookPoints = [];
    this.attachedPieces = 0;

    do {
      let newHook = {
        rad: this.radius, //randFloat(0.4, 1.2) * this.radius,
        theta: 0,
        x: 0,
        y: 0
      };
      let nextTheta;
      let previousTheta;
      
      if(this.hookPoints.length == 0) nextTheta = 0;
      else {
        previousTheta = this.hookPoints[this.hookPoints.length - 1].theta;
        nextTheta = Math.PI * 2 * randFloat(0.2, 0.4) + previousTheta;
      }
      if(nextTheta > Math.PI * 2) break;

      newHook.theta = nextTheta;
      newHook.x = this.x + newHook.rad * Math.cos(nextTheta);
      newHook.y = this.y + newHook.rad * Math.sin(nextTheta);

      this.hookPoints.push(newHook);
    } while(this.hookPoints[this.hookPoints.length - 1].theta < Math.PI * 2);



  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;


    this.draw();
  }


  draw() {
    //Reference circle
    if(debugMode) {
      ctx.beginPath();
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 1;
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
      ctx.stroke();
    }

    // this.hookPoints.forEach( (point, i) => {
    //   ctx.font = '10px Arial';
    //   ctx.fillText(i, point.x, point.y);
    // });
  }
}




class AsteroidPiece {
  constructor() {
    this.type = 'AsteroidPiece';

    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.radius = randInt(10, 40);
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.theta = Math.PI * 2 * Math.random();
    this.color = 'hsl(250, ' + randInt(0, 25) + '%, ' + randInt(0, 25) + '%)';
    this.vertices = [];

    this.attachedTo = false;


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

    if(this.attachedTo) {
      this.x += this.attachedTo.speedX;
      this.y += this.attachedTo.speedY;
    }
    else {
      this.x += this.speedX;
      this.y += this.speedY;
    }

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
    ctx.strokeStyle = 'grey';
    
    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    
    this.vertices.forEach( (v, i, vert) => {
      ctx.lineTo(vert[(i+1) % vert.length].x, vert[(i+1) % vert.length].y);

      if(debugMode) {
        ctx.font = '10px Arial';
        ctx.fillText(i, v.x, v.y);
      }

    });
    ctx.fill();
    ctx.stroke();

    if(debugMode) {
      //Reference circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
