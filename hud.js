

class HUD {
  constructor() {

  }


  update() {
    this.draw();
  }

  draw() {
    ctx.font = '20px Arial';
    ctx.fillText('F to fire', 50, 50);
    ctx.fillText('P to pause/play', 50, 70);
  }
}