const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let shipSize = Math.max(canvas.width, canvas.height)*0.02;

let FkeyDown = false;

// Debug stuff
let stopAnimation = false;
let debugMode = true;


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
  if(e.key == 'f') {
    FkeyDown = true;
    playerShip.fireLaser();
  }

  if(e.key == 'p') {
    if(!stopAnimation) {
      stopAnimation = true;
    }
    else {
      stopAnimation = false;
      requestAnimationFrame(animate);
    }
  }

  if(e.key == 'v') {
    debugMode = debugMode == true ? false : true;
  }
}, false);

canvas.addEventListener('keyup', (e) => {  
  if(e.key == 'f') {
    FkeyDown = false;
  }

}, false);


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  playerShip.update(mouse);
  playerShip.draw();

  if(astManager.asteroids.length < 3) {
    astManager.composeAsteroid();
  }
  
  astManager.update();
  collisionDetector.update();

  hud.update();
  
  
  if(!stopAnimation) {
    requestAnimationFrame(animate);
  }
}


const universe = new Universe();
const astManager = new AsteroidManager();
const playerShip = new PlayerShip(canvas.width/2, canvas.height/2, shipSize);
const collisionDetector = new CollisionDetector();
const hud = new HUD();


const mouse = {
  x: null,
  y: null,
  isDown: false
}


animate();