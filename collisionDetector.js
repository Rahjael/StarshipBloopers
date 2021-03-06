

class CollisionDetector {
  constructor() {
    // Get playerShip, asteroidPieces, laserShots

    this.allObjects = [];
    this.inProximity = [];

    this.particleAnimations = [];


  }

  update() {
    this.detectProximity();

    // DEBUGGING: show a line for proximity
    if(debugMode) {
      this.inProximity.forEach( objs => {

        ctx.beginPath();
        ctx.moveTo(objs[0].x, objs[0].y);
        ctx.strokeStyle = 'red';
        ctx.lineTo(objs[1].x, objs[1].y)
        ctx.stroke();
      })
    }
    this.detectCollisions();

    this.particleAnimations = this.particleAnimations.filter( anim => anim.stillHappening);
    this.particleAnimations.forEach( anim => anim.update());
  }


  detectCollisions() {

    this.inProximity.forEach( (obj, i, arr) => {

      let obj1 = obj[0];
      let obj2 = obj[1];

      let areBothAsteroids = obj1 instanceof AsteroidPiece && obj2 instanceof AsteroidPiece;
      let areShipAndAsteroid = (obj1 instanceof PlayerShip && obj2 instanceof AsteroidPiece) 
                            || (obj1 instanceof AsteroidPiece && obj2 instanceof PlayerShip);
      let isLaserShot = (obj1 instanceof LaserShot && obj2 instanceof AsteroidPiece) 
                    ||  (obj1 instanceof AsteroidPiece && obj2 instanceof LaserShot);

      // TODO I disabled asteroid to asteroid collisions at the moment while I implement
      // destruction with lasers
      if( /*areBothAsteroids || */ areShipAndAsteroid || isLaserShot) {
        // Get line equation of every pair of connected vertices:
        // Reminder: every vertex of an asteroid has: x, y, rad, theta
        // Vertices are stored in anticlockwise order
        let segmentsOf1 = obj1.vertices.map( (vertex, i, arr) => {
          return {  x1: vertex.x,
                    y1: vertex.y, 
                    x2: arr[(i + 1) % arr.length].x,
                    y2: arr[(i + 1) % arr.length].y
                  }
        });

        let segmentsOf2 = obj2.vertices.map( (vertex, i, arr) => {
          return {  x1: vertex.x,
                    y1: vertex.y, 
                    x2: arr[(i + 1) % arr.length].x,
                    y2: arr[(i + 1) % arr.length].y
                  }
        });

        let collisionFound = false;
        for(let i = 0; i < segmentsOf1.length; i++) {
          if(collisionFound) break;
          for(let j = 0; j < segmentsOf2.length; j++) {
            let coefficient1 =  ( (segmentsOf2[j].x2 - segmentsOf2[j].x1) * (segmentsOf1[i].y1 - segmentsOf2[j].y1)
                                - (segmentsOf2[j].y2 - segmentsOf2[j].y1) * (segmentsOf1[i].x1 - segmentsOf2[j].x1))
                                /
                                ( (segmentsOf2[j].y2 - segmentsOf2[j].y1) * (segmentsOf1[i].x2 - segmentsOf1[i].x1) 
                                - (segmentsOf2[j].x2 - segmentsOf2[j].x1) * (segmentsOf1[i].y2 - segmentsOf1[i].y1));

            let coefficient2 =  ( (segmentsOf1[i].x2 - segmentsOf1[i].x1) * (segmentsOf1[i].y1 - segmentsOf2[j].y1) 
                                - (segmentsOf1[i].y2 - segmentsOf1[i].y1) * (segmentsOf1[i].x1 - segmentsOf2[j].x1))
                                /
                                ( (segmentsOf2[j].y2 - segmentsOf2[j].y1) * (segmentsOf1[i].x2 - segmentsOf1[i].x1) 
                                - (segmentsOf2[j].x2 - segmentsOf2[j].x1) * (segmentsOf1[i].y2 - segmentsOf1[i].y1));

            
            // If both coefficients are between 0 and 1, the segments are intersecting
            if(coefficient1 < 1 && coefficient1 > 0 && coefficient2 < 1 && coefficient2 > 0) {

              collisionFound = true;

              // Intersection point
              let x = segmentsOf1[i].x1 + coefficient1*(segmentsOf1[i].x2 - segmentsOf1[i].x1);
              let y = segmentsOf1[i].y1 + coefficient1*(segmentsOf1[i].y2 - segmentsOf1[i].y1);

              if(this.particleAnimations.length < 100) this.particleAnimations.push(new StaticExplosionAnimation(x,y));


              // delete LaserShot
              // TODO this introduces a glitch when shooting holding F. 
              // The "stream" of lasers interrupts briefly when something hits the target.
              // If you don't hit anything the stream is fluid and constant
              // Understand why

              // if(isLaserShot) {
              //   let laserShot = obj1 instanceof LaserShot ? obj1 : obj2 instanceof LaserShot ? obj2 : undefined;
              //   let index = playerShip.laserShots.indexOf(laserShot);
              //   playerShip.laserShots.splice(index, 1);
              // }

              // Possible solution
              // It works.
              if(isLaserShot) {
                let laserShot = obj1 instanceof LaserShot ? obj1 : obj2 instanceof LaserShot ? obj2 : undefined;
                let asteroidPiece = obj1 instanceof AsteroidPiece ? obj1 : obj2 instanceof AsteroidPiece ? obj2 : undefined;

                laserShot.hasHitTarget = true;
                playerShip.laserShots = playerShip.laserShots.filter( laser => !laser.hasHitTarget);

                if(asteroidPiece.attachedTo) {
                  asteroidPiece.detach();
                }
                else {
                  asteroidPiece.gotHit(x, y);
                }
              }














              // Highlight contact surfaces during collision
              if(debugMode) {
                ctx.beginPath();
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3;
                ctx.moveTo(segmentsOf1[i].x1, segmentsOf1[i].y1);
                ctx.lineTo(segmentsOf1[i].x2, segmentsOf1[i].y2);
                ctx.moveTo(segmentsOf2[j].x1, segmentsOf2[j].y1);
                ctx.lineTo(segmentsOf2[j].x2, segmentsOf2[j].y2);
                ctx.stroke();
              }
            }
          }
        }
      }
    });
  }

  detectProximity() {
    // Make a list of objects close to each other
    // This helps avoiding too many unnecessary calculations

    // Empty previous proximities
    this.inProximity.splice(0, this.inProximity.length);

    this.allObjects = astManager.pieces.concat(playerShip.laserShots, playerShip);

    for(let i = 0; i < this.allObjects.length; i++) {
      for(let j = i +1; j < this.allObjects.length; j++) {
        let obj1 = this.allObjects[i];
        let obj2 = this.allObjects[j];

        // Don't consider proximity for pieces of same asteroid
        if([obj1,obj2].every( obj => obj.hasOwnProperty('attachedTo'))) {
          if(obj1.attachedTo == obj2.attachedTo) continue;
        }

        let dist = Math.hypot(obj2.x - obj1.x, obj2.y - obj1.y);
        let proxyDist = (obj1.radius + obj2.radius) * 1.3;        
        
        if(dist < proxyDist) {
          this.inProximity.push([obj1, obj2]);
        }
      }
    }
  }
}















class StaticExplosionAnimation {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.particles = [];
    this.stillHappening = true;
    this.explode();    
  }

  explode() {
    let maxNum = 1; //randInt(1, 2);
    let maxSize = randInt(3, 7);
    for(let i = 0; i < maxNum; i++) {
      this.particles.push(new Particle(this.x, this.y, maxSize, 'staticExplosion'));
    }
  }

  update() {
    this.particles.forEach( part => part.update());
    this.particles = this.particles.filter( part => part.stillExists());
    this.stillHappening = this.particles.length > 0 ? true : false;
  }
}
