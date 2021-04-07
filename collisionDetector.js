

class CollisionDetector {
  constructor() {
    // Get playerShip, asteroidPieces, laserShots

    this.allObjects = [];
    this.inProximity = [];


  }

  update() {
    this.detectProximity();

    // DEBUGGING: show a line for proximity
    this.inProximity.forEach( objs => {

      ctx.beginPath();
      ctx.moveTo(objs[0].x, objs[0].y);
      ctx.strokeStyle = 'red';
      ctx.lineTo(objs[1].x, objs[1].y)
      ctx.stroke();
    })

    this.detectCollisions();




  }

  detectCollisions() {

    this.inProximity.forEach( (obj, i, arr) => {

      // If two asteroids
      if(obj[0] instanceof AsteroidPiece && obj[1] instanceof AsteroidPiece) {
        // Get line equation of every pair of connected vertices:
        // Reminder: every vertex of an asteroid has: x, y, rad, theta
        // but actually here I need only x and y
        // Vertices are stored in anticlockwise order
        let segmentsOf1 = obj[0].vertices.map( (vertex, i, arr) => {
          return {  x1: vertex.x,
                    y1: vertex.y, 
                    x2: arr[(i + 1) % arr.length].x,
                    y2: arr[(i + 1) % arr.length].y
                  }
        });

        let segmentsOf2 = obj[1].vertices.map( (vertex, i, arr) => {
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
            let coefficient1 = ((segmentsOf2[j].x2 - segmentsOf2[j].x1) * (segmentsOf1[i].y1 - segmentsOf2[j].y1) - (segmentsOf2[j].y2 - segmentsOf2[j].y1) * (segmentsOf1[i].x1 - segmentsOf2[j].x1))
                              /
                              ((segmentsOf2[j].y2 - segmentsOf2[j].y1) * (segmentsOf1[i].x2 - segmentsOf1[i].x1) - (segmentsOf2[j].x2 - segmentsOf2[j].x1) * (segmentsOf1[i].y2 - segmentsOf1[i].y1));

            let coefficient2 = ((segmentsOf1[i].x2 - segmentsOf1[i].x1) * (segmentsOf1[i].y1 - segmentsOf2[j].y1) - (segmentsOf1[i].y2 - segmentsOf1[i].y1) * (segmentsOf1[i].x1 - segmentsOf2[j].x1))
                              /
                              ((segmentsOf2[j].y2 - segmentsOf2[j].y1) * (segmentsOf1[i].x2 - segmentsOf1[i].x1) - (segmentsOf2[j].x2 - segmentsOf2[j].x1) * (segmentsOf1[i].y2 - segmentsOf1[i].y1));

            
            if(coefficient1 < 1 && coefficient1 > 0 && coefficient2 < 1 && coefficient2 > 0) {
              ctx.beginPath();
              ctx.strokeStyle = 'yellow';
              ctx.lineWidth = 3;
              ctx.moveTo(segmentsOf1[i].x1, segmentsOf1[i].y1);
              ctx.lineTo(segmentsOf1[i].x2, segmentsOf1[i].y2);
              ctx.moveTo(segmentsOf2[j].x1, segmentsOf2[j].y1);
              ctx.lineTo(segmentsOf2[j].x2, segmentsOf2[j].y2);
              ctx.stroke();
              //console.log("Collision found", coefficient1, coefficient2);
              stopAnimation = false;
            }
          }
        }

      }
      



    })

  }

  detectProximity() {
    // Make a list of objects close to each other
    // This helps avoiding too many unnecessary calculations
    this.inProximity = [];

    this.allObjects = astManager.pieces.concat(playerShip.laserShots, playerShip);

    for(let i = 0; i < this.allObjects.length; i++) {
      for(let j = i +1; j < this.allObjects.length; j++) {
        let obj1 = this.allObjects[i];
        let obj2 = this.allObjects[j];

        let dist = Math.hypot(obj2.x - obj1.x, obj2.y - obj1.y);
        let proxyDist = (obj1.radius + obj2.radius) * 1.3;        
        
        if(dist < proxyDist) {
          this.inProximity.push([obj1, obj2]);
        }
      }
    }
  }

}