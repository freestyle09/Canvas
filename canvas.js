// console.log("Hello world");

const canvas = document.querySelector("canvas");

// // Context
const c = canvas.getContext("2d");

// c.fillStyle = "rgba(200,100,5,.7)";
// c.fillRect(100, 100, 50, 100);
// c.fillStyle = "rgba(100,200,5,.7)";
// c.fillRect(300, 200, 50, 100);
// // Line
// c.beginPath();
// c.moveTo(300, 100);
// c.lineTo(100, 300);
// c.lineTo(400, 300);
// c.lineTo(400, 100);
// c.strokeStyle = "#f00a0c";
// c.stroke();
// // Arc / Circle
// for (let i = 0; i <= 100; i++) {
//   let x = Math.random() * window.innerHeight;
//   let y = Math.random() * window.innerWidth;
//   c.beginPath();
//   c.arc(x, y, 30, 0, Math.PI * 2, false);
//   //   Randomize colors
//   c.strokeStyle =
//     "#" +
//     Math.random()
//       .toString(16)
//       .slice(2, 8);
//   c.stroke();
// }

const mouseObj = {
  x: undefined,
  y: undefined
};

const mouse = e => {
  mouseObj.x = e.x;
  mouseObj.y = e.y;
};

// const minRadius = 10;
const maxRadius = 100;

const colorArray = ["#4F484B", "#68A9B2", "yellow", "#FFAD6F", "#FF3F63"];
const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
};

window.addEventListener("mousemove", mouse);

window.addEventListener("resize", resize);

class Circle {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  }
  draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = "white";
    c.direction = "left";
    c.fillStyle = this.color;
    c.stroke();
    c.fill();
  };
  update = () => {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    // Interactivity
    if (
      mouseObj.x - this.x < 50 &&
      mouseObj.x - this.x > -50 &&
      mouseObj.y - this.y < 50 &&
      mouseObj.y - this.y > -50
    ) {
      if (this.radius < maxRadius) {
        this.radius += 1;
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }

    this.draw();
  };
}
let circleArray = [];
function init() {
  circleArray = [];
  for (let i = 0; i < 2000; i++) {
    let radius = Math.random() * 10 + 1;
    let x = Math.random() * (innerWidth - radius * 2) + radius;
    let y = Math.random() * (innerHeight - radius * 2) + radius;
    let dx = (Math.random() - 0.5) * 1;
    let dy = (Math.random() - 0.5) * 1;

    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
}

animate();
