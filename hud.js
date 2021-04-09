

class HUD {
  constructor() {

  }


  update() {
    this.draw();
  }

  draw() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('F to fire', 50, 50);
    ctx.fillText('P to pause/play', 50, 70);
    ctx.fillText('V debug visuals on/off', 50, 90);


    if(debugMode) {
      ctx.font = '10px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('asteroidPieces: ' + astManager.pieces.length + ' in ' + astManager.asteroids.length + ' astroid entities', 50, 110);

      let particles = astManager.destroyAnimations.reduce( (acc, anim) => acc + anim.particles.length, 0)
                    + playerShip.engineParticles.length
                    + collisionDetector.particleAnimations.reduce( (acc, anim) => acc + anim.particles.length, 0);

      ctx.fillText('particles: ' + particles, 50, 130);

      ctx.fillText('collisionDetector.allObjects: ' + collisionDetector.allObjects.length, 50, 150);
      ctx.fillText('collisionDetector.inProximity: ' + collisionDetector.inProximity.length, 50, 170);
      ctx.fillText('laserShots: ' + playerShip.laserShots.length, 50, 190);

    }
  }
}