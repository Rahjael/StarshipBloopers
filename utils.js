
function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randColorAlpha() {
  let vals = [randInt(0, 255), randInt(0, 255), randInt(0, 255), randInt(0, 1000) / 1000];
  return `rgba(
          ${randInt(0, 255)}, 
          ${randInt(0, 255)}, 
          ${randInt(0, 255)}, 
          ${randInt(0, 100)/100})`;
}

function randColor() {
  return `rgb(
          ${randInt(0, 255)}, 
          ${randInt(0, 255)}, 
          ${randInt(0, 255)})`;
}