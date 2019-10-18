import Snake from "./snake.js";

const canvas = document.getElementById("gameScreen");
const gameWidth = 640;
const gameHeight = 640;

canvas.width = gameWidth;
canvas.height = gameHeight;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "#f00";
ctx.fillRect(10, 10, 200, 200);
