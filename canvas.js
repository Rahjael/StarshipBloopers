const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let shipSize = Math.max(canvas.width, canvas.height)*0.02;


const mouse = {
  x: null,
  y: null,
  isDown: false
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  shipSize = Math.max(canvas.width, canvas.height)*0.01;
});

canvas.addEventListener('mousedown', (e) => {
  mouse.isDown = true;
});

canvas.addEventListener('mouseup', (e) => {
  mouse.isDown = false;
});

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

canvas.addEventListener('keydown', (e) => {  
  playerShip.fireLaser();
}, false);


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  playerShip.update();
  playerShip.draw();

  astManager.update();
  if(astManager.pieces.length < 8) astManager.getPiece();
  
  requestAnimationFrame(animate);
}


const universe = new Universe();
const astManager = new AsteroidManager();
const playerShip = new PlayerShip(canvas.width/2, canvas.height/2, shipSize);



animate();