

class CollisionDetector {
  constructor() {
    // Get playerShip, asteroidPieces, laserShots

    this.allObjects = [];
    this.inProximity = [];


  }

  update() {
    this.detectProximity();
  }

  detectProximity() {
    this.inProximity = [];

    this.allObjects = astManager.pieces.concat(playerShip.laserShots, playerShip);


    for(let i = 0; i < this.allObjects.length; i++) {
      for(let j = i +1; j < this.allObjects.length; j++) {
        let obj1 = this.allObjects[i];
        let obj2 = this.allObjects[j];

        let dist = Math.hypot(obj2.x - obj1.x, obj2.y - obj1.y);
        let proxyDist = (obj1.radius + obj2.radius) * 1.1;
        
        
        if(dist < proxyDist) {
          console.log( dist, proxyDist)
          this.inProximity.push([obj1, obj2]);
        }

      }
    }
    

  }

}