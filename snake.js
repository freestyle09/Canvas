const COLORS = {
  BACKGROUND: "rgb(230,230,255)",
  SNAKE_BODY: "rgb(0,100,0)"
};

const MOVES = {
  RIGHT: "right",
  LEFT: "left",
  UP: "up",
  DOWN: "down"
};

class CanvasManager {
  constructor(ctx) {
    this.ctx = ctx;
  }

  eyesPosition = {
    [MOVES.RIGHT]: [[45, 20], [45, 45]],
    [MOVES.LEFT]: [[20, 20], [20, 45]],
    [MOVES.UP]: [[20, 20], [45, 20]],
    [MOVES.DOWN]: [[20, 45], [45, 45]]
  };

  createElement() {
    const canvasNotSupportedText =
      "here is a canvas element with the game snake if you can't see it your browser is OLD!";
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.height = map.scale * map.y;
    canvas.width = map.scale * map.x;
    canvas.innerHTML = canvasNotSupportedText;
    root.appendChild(canvas);
    this.ctx = canvas.getContext("2d");
  }

  drawSnakeBodyPart(position) {
    this.ctx.fillStyle = COLORS.SNAKE_BODY;
    // this.ctx.fillRect(
    //   position.x * map.scale + 1,
    //   position.y * map.scale + 1,
    //   map.scale - 2,
    //   map.scale - 2
    // );

    const image = new Image();
    image.src = "./body-right.svg";

    image.onload = () => {
      this.ctx.drawImage(
        image,
        position.x * map.scale + 1,
        position.y * map.scale + 1,
        70,
        70
      );
    };
  }

  drawEyes(snake) {
    const position1 = this.eyesPosition[snake.direction][0];
    const position2 = this.eyesPosition[snake.direction][1];

    this.ctx.fillStyle = "rgb(39,255,255)";
    const image = new Image();
    image.src = "./head-right.svg";

    let cx = snake.position[0].x * map.scale + 20;
    let cy = snake.position[0].y * map.scale + 20;
    image.onload = () => {
      this.ctx.save();
      // this.ctx.translate(cx, cy);
      // this.ctx.rotate((Math.PI / 180) * 90);
      // this.ctx.translate(-cx, -cy);
      this.ctx.drawImage(
        image,
        snake.position[0].x * map.scale,
        snake.position[0].y * map.scale,
        70,
        70
      );
      this.ctx.restore();
    };
    // this.ctx.fillRect(
    //   snake.position[0].x * map.scale + position1[0],
    //   snake.position[0].y * map.scale + position1[1],
    //   5,
    //   5
    // );

    // this.ctx.fillRect(
    //   snake.position[0].x * map.scale + position2[0],
    //   snake.position[0].y * map.scale + position2[1],
    //   5,
    //   5
    // );
  }

  drawFood(score, position) {
    this.ctx.fillStyle = score > 10 ? "rgb(210,214,27)" : "rgb(200,200,200)";
    this.ctx.fillRect(
      position.x * map.scale + 1,
      position.y * map.scale + 1,
      map.scale - 2,
      map.scale - 2
    );
  }

  cleanMap() {
    this.ctx.fillStyle = COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, map.x * map.scale, map.y * map.scale);
  }
}

class Position {
  constructor(obj) {
    Object.assign(this, obj);
  }

  add(pos) {
    return StaticPosition(this.x + pos.x, this.y + pos.y);
  }

  equals(pos) {
    return this.x === pos.x && this.y === pos.y;
  }
}

function RandomPosition() {
  return new Position({
    x: Math.floor(Math.random() * map.x),
    y: Math.floor(Math.random() * map.y)
  });
}

function StaticPosition(x, y) {
  return new Position({ x, y });
}

// canvas context
let gameContainer = document.getElementById("root");

const map = {
  scale: 70,
  x: 12,
  y: 8
};

const canvasManager = new CanvasManager();
canvasManager.createElement();

const initSnake = () => {
  return {
    speed: 500,
    fastSpeedUp: 25,
    position: [
      StaticPosition(3, 2),
      StaticPosition(2, 2),
      StaticPosition(1, 2)
    ],
    direction: MOVES.RIGHT,
    score: 0
  };
};

let snake;
let time;

restartGame();

function game() {
  canvasManager.cleanMap();

  moveSnake(snake);
  if (isCollision()) {
    restartGame();
  }

  snakeTeleportOnBorder(snake.position[0]);
  checkIfSnakeIsOnAnyFood();

  drawSnake();

  foodItems.map(food => drawFood(food));
  produceFood(foodItems);
}

const DirectionToMoveVector = {
  [MOVES.RIGHT]: StaticPosition(1, 0),
  [MOVES.LEFT]: StaticPosition(-1, 0),
  [MOVES.UP]: StaticPosition(0, -1),
  [MOVES.DOWN]: StaticPosition(0, 1)
};

function moveSnake(snake) {
  const vector = DirectionToMoveVector[snake.direction];
  const newHeadPosition = snake.position[0].add(vector);
  snake.position.unshift(newHeadPosition);
  snake.position.pop();
  return snake;
}

function drawSnake() {
  snake.position.map(position => {
    canvasManager.drawSnakeBodyPart(position);
  });
  canvasManager.drawEyes(snake);
}

function produceFood() {
  foodItems
    .filter(x => x.canProduce())
    .map(x => {
      do {
        x.position = RandomPosition();
      } while (foodInSnake(x.position));
    });

  console.log("XXX", foodItems);
}

function drawFood(food) {
  canvasManager.drawFood(food.score, food.position);
}

// keyboard support up down left right
window.addEventListener(
  "keydown",
  function(event) {
    const ArrowMapping = {
      ["ArrowLeft"]: MOVES.LEFT,
      ["ArrowUp"]: MOVES.UP,
      ["ArrowRight"]: MOVES.RIGHT,
      ["ArrowDown"]: MOVES.DOWN
    };

    const ASWDMapping = {
      ["KeyA"]: MOVES.LEFT,
      ["KeyW"]: MOVES.UP,
      ["KeyD"]: MOVES.RIGHT,
      ["KeyS"]: MOVES.DOWN
    };

    const KeyMapping = Object.assign({}, ArrowMapping, ASWDMapping);

    const isMoveAllowed = oppositDirection => direction =>
      direction !== oppositDirection;

    const allowedMoves = {
      [MOVES.LEFT]: isMoveAllowed(MOVES.RIGHT),
      [MOVES.UP]: isMoveAllowed(MOVES.DOWN),
      [MOVES.RIGHT]: isMoveAllowed(MOVES.LEFT),
      [MOVES.DOWN]: isMoveAllowed(MOVES.UP),
      undefined: () => {}
    };

    const keyDirection = { direction: KeyMapping[event.code] };
    const allowed = allowedMoves[keyDirection.direction](snake.direction);
    allowed && Object.assign(snake, keyDirection);
  },
  false
);

function snakeTeleportOnBorder(snakeHead) {
  if (snakeHead.x === -1) {
    snakeHead.x = map.x - 1;
  } else if (snakeHead.x === map.x) {
    snakeHead.x = 0;
  } else if (snakeHead.y === -1) {
    snakeHead.y = map.y - 1;
  } else if (snakeHead.y === map.y) {
    snakeHead.y = 0;
  }
}

function foodInSnake(foodPos) {
  return snake.position.find(position => position.equals(foodPos)) != undefined;
}

function checkIfSnakeIsOnAnyFood() {
  const snakeHead = snake.position[0];
  const currentFood = foodItems
    .map(x => x.position)
    .filter(x => x)
    .find(x => x.equals(snakeHead));

  if (currentFood) {
    scoreUp(currentFood.score);
    snakeEatFood(currentFood);
  }
}

function snakeEatFood(food) {
  food.position = undefined;
  snake.position.push({
    x: 1,
    y: 1
  });
}

function isCollision() {
  const snakeHead = snake.position[0];
  for (let i = 1; i < snake.position.length; i++) {
    if (
      snake.position[i].x === snakeHead.x &&
      snake.position[i].y === snakeHead.y
    ) {
      return true;
    }
  }
  return false;
}

class Food {
  constructor(obj) {
    Object.assign(this, obj);
  }
}

function restartGame() {
  snake = initSnake();
  foodItems = [
    {
      score: 10,
      position: undefined,
      timer: 0,
      canProduce: () => {
        return this.position === undefined;
      }
    },
    {
      score: 20,
      position: undefined,
      timer: 0,
      canProduce: () => {
        return this.position === undefined && this.timer < 16;
      }
    }
  ];

  produceFood(foodItems);

  setScore(snake.score);
  clearInterval(time);
  time = setInterval(game, snake.speed);
}

function scoreUp(howMany) {
  snake.score += howMany;
  acceleration();
  setScore(snake.score);
  clearInterval(time);
  time = setInterval(game, snake.speed);
}

function acceleration() {
  if (snake.fastSpeedUp > 0) {
    snake.speed -= snake.fastSpeedUp;
    snake.fastSpeedUp--;
  }
}

function setScore() {
  document.querySelector("h1").innerHTML = "Score: " + snake.score;
}
