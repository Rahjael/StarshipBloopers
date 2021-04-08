

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
    ctx.fillText('D debug visuals on/off', 50, 90);
  }
}