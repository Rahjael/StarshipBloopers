

class HUD {
  constructor() {

    this.enginesBar = {
      x: canvas.width - 40,
      y: 0,
      width: 40,
      height: canvas.height
    }

    this.laserBar = {
      x: 0,
      y: 0,
      width: 40,
      height: canvas.height
    }


  }


  update() {
    this.draw();
    this.drawLaserEnergyBar();
    this.drawEnginesEnergyBar();

    
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


  drawLaserEnergyBar() {
    let height = this.laserBar.height * playerShip.laserEnergy / 100;
    let y = this.laserBar.y + (canvas.height - height);

    let grad = ctx.createLinearGradient(0, 0, this.laserBar.width, canvas.height);
    grad.addColorStop(0, '#fa05e6');
    grad.addColorStop(1, 'white');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.rect(this.laserBar.x, y, this.laserBar.width, height);
    ctx.fill();    

  }

  drawEnginesEnergyBar() {
    let height = this.enginesBar.height * playerShip.engineEnergy / 100;
    let y = this.enginesBar.y + (canvas.height - height);

    let grad = ctx.createLinearGradient(0, 0, this.enginesBar.width, canvas.height);
    grad.addColorStop(0, '#0000ff');
    grad.addColorStop(1, 'white');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.rect(this.enginesBar.x, y, this.enginesBar.width, height);
    ctx.fill();    

  }
}