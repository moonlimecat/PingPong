// https://youtu.be/AiFqApeurqI?si=54WFsBQafH9dPSbS

//gameBoard
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const resetBtn = document.querySelector("#resetBtn");
const scoreText = document.querySelector("#scoreText");
let player1Score = 0;
let player2Score = 0;

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "forestgreen";

//Paddle1 and Paddle2
const paddle1Color = "lightblue";
const paddle2Color = "orange";
const paddleBorder = "black";
const paddleSpeed = 50;

let paddle1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};
let paddle2 = {
  width: 25,
  height: 100,
  x: gameWidth - 25,
  y: gameHeight - 100,
};

//Ball
const ballColor = "yellow";
const ballBorder = "black";
const ballRadius = 12.5;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let ballSpeed;
let intervalID = 0;

window.addEventListener("keydown", moveDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
  createBall();
  nextTick();
}

function nextTick() {
  intervalID = setTimeout(() => {
    clearBoard();
    drawPaddles();
    moveBall();
    drawBall(ballX, ballY);
    checkCollision();
    nextTick();
  }, 10);
}

//Board
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
//Paddles
function drawPaddles() {
  ctx.strokeStyle = paddleBorder; // color of the border
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height); // location of the border
  ctx.fillStyle = paddle1Color; // color of the rectangle
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height); // location of the rectangle

  ctx.strokeStyle = paddleBorder;
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height); // location of the border
  ctx.fillStyle = paddle2Color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height); // location of the rectangle
}

function moveDirection(event) {
  const keyPressed = event.keyCode;
  console.log(keyPressed);
  const paddle1Up = 87;
  const paddle1Down = 83;
  const paddle2Up = 38;
  const paddle2Down = 40;

  switch (keyPressed) {
    case paddle1Up:
      if (paddle1.y > 0) {
        paddle1.y -= paddleSpeed;
      }
      break;
    case paddle1Down:
      if (paddle1.y < gameHeight - paddle1.height) {
        paddle1.y += paddleSpeed;
      }
      break;
    case paddle2Up:
      if (paddle2.y > 0) {
        paddle2.y -= paddleSpeed;
      }
      break;
    case paddle2Down:
      if (paddle2.y < gameHeight - paddle2.height) {
        paddle2.y += paddleSpeed;
      }
      break;
  }
}

//Ball
function drawBall(ballX, ballY) {
  ctx.fillStyle = ballColor;
  ctx.strokeStyle = ballBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

function createBall() {
  ballSpeed = 1;

  if (Math.round(Math.random()) == 1) {
    ballXDirection = 1;
  } else {
    ballXDirection = -1;
  }

  if (Math.round(Math.random()) == 1) {
    ballYDirection = Math.random() * 1;
  } else {
    ballYDirection = Math.random() * -1;
  }
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  drawBall(ballX, ballY);
}

function moveBall() {
  ballX += ballSpeed * ballXDirection;
  ballY += ballSpeed * ballYDirection;
}

function checkCollision() {
  if (ballY <= 0 + ballRadius) {
    ballYDirection *= -1;
  }
  if (ballY >= gameHeight - ballRadius) {
    ballYDirection *= -1;
  }
  if (ballX <= 0) {
    player2Score += 1;
    updateScore();
    createBall();
    return;
  }
  if (ballX >= gameWidth) {
    player1Score += 1;
    updateScore();
    createBall();
    return;
  }
  if (ballX <= paddle1.x + paddle1.width + ballRadius) {
    if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
      ballX = paddle1.x + paddle1.width + ballRadius; // if ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 1;
    }
  }
  if (ballX >= paddle2.x - ballRadius) {
    if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
      ballX = paddle2.x - ballRadius; // if ball gets stuck
      ballXDirection *= -1;
      ballSpeed += 1;
    }
  }
}

//Score
function updateScore() {
  scoreText.textContent = `${player1Score}:${player2Score}`;
}

//Reset
function resetGame() {
  player1Score = 0;
  player2Score = 0;

  paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };
  paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100,
  };

  ballSpeed = 1;
  ballX = 0;
  ballY = 0;
  ballXDirection = 0;
  ballYDirection = 0;
  updateScore();
  clearInterval(intervalID);
  gameStart();
}
