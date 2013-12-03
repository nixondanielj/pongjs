var ball, leftPaddle, rightPaddle, board;
var DEFAULT_BALL_SPEED = 5;
var DEFAULT_PADDLE_SPEED = 5;

var gameState = {
    pauseToggle: function () {
        if (gameState.paused) {
            gameLoop();
        }
        gameState.paused = !gameState.paused;
    },
    paused: false
};

$(document).ready(function () {
    initialize();
});

function initialize() {
    ball = $('.ball');
    leftPaddle = $('.left');
    rightPaddle = $('.right');
    board = $('.board');
    setSizes();
    setupInput();
    restartGame();
}

function setSizes() {
    ball.height(board.height() * .03);
    ball.width(ball.height());
    doToPaddles(function (p) {
        p.height(board.height() * .2);
        p.width(board.width() * .02);
    });
}

function gameLoop() {
    update();
    draw();
    if (!gameState.paused) {
        setTimeout(gameLoop, 17);
    }
}

function update() {
    ball.top += ball.ySpeed;
    ball.left += ball.xSpeed;
    doToPaddles(function (p) {
        p.top += p.ySpeed;
    });
}

function draw() {
    ball.css('top', ball.top + 'px');
    ball.css('left', ball.left + 'px');
    doToPaddles(function (p) {
        p.css('top', p.top + 'px');
        p.css('left', p.left + 'px');
    });
}

function setupInput() {
    $(document).keydown(function (e) {
        switch (e.which) {
            case 38: //up
                leftPaddle.ySpeed = -5;
                break;
            case 40: //down
                leftPaddle.ySpeed = 5;
                break;
        }
    });
    $(document).keyup(function (e) {
        switch (e.which) {
            case 40:
            case 38:
                leftPaddle.ySpeed = 0;
                break;
        }
    });
}

function restartGame() {
    resetPositions();
    randomizeVelocity(ball);
}

function resetPositions() {
    centerVerticalOnBoard(ball);
    doToPaddles(centerVerticalOnBoard);
    // center ball horizontally on board
    ball.left = ((board.width() - ball.width()) / 2);
    leftPaddle.left = board.width() * .05;
    rightPaddle.left = board.width() * .95 - rightPaddle.width();
    draw();
}

function randomizeVelocity(item, min, max) {
    item.ySpeed = random((min || -5), (max || 5));
    item.xSpeed = random((min || -5), (max || 5));
}

function random(min, max) {
    return Math.random() * (max || 1) + (min || 0);
}

function doToPaddles(f) {
    f(leftPaddle);
    f(rightPaddle);
}

function centerVerticalOnBoard(item) {
    item.top = ((board.height() - item.height()) / 2);
}