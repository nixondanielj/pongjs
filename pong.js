var ball, leftPaddle, rightPaddle, board, message;
var DEFAULT_BALL_SPEED = 5;
var DEFAULT_PADDLE_SPEED = 5;

var gameState = {
    pauseToggle: function () {
        message.toggle();
        gameState.paused = !gameState.paused;
        if (!gameState.paused) {
            gameLoop();
        } else {
            message.html("PAUSED");
        }
    },
    paused: false
};

$(document).ready(function () {
    initialize();
    gameLoop();
});

function initialize() {
    ball = $('.ball');
    leftPaddle = $('.left');
    rightPaddle = $('.right');
    leftPaddle.score = 0;
    rightPaddle.score = 0;
    board = $('.board');
    message = $('.message');
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
    handleCollisions();
}

function draw() {
    ball.css('top', ball.top + 'px');
    ball.css('left', ball.left + 'px');
    doToPaddles(function (p) {
        p.css('top', p.top + 'px');
        p.css('left', p.left + 'px');
    });
    $('.leftScore').html(leftPaddle.score);
    $('.rightScore').html(rightPaddle.score);
}

function handleCollisions() {
    if (limitVertically(ball)) {
        ball.ySpeed = -ball.ySpeed;
    }
    doToPaddles(limitVertically);
    handlePaddleCollision();
    handleScore();
}

function handleScore() {
    if (ball.left < 0) {
        restartGame();
        if (++rightPaddle.score > 10) {
            gameState.pauseToggle();
            message.html('RIGHT WINS!');
        }
    } else if (ball.left + ball.width() > board.width()) {
        restartGame();
        if (++leftPaddle.score > 10) {
            gameState.pauseToggle();
            message.html("LEFT WINS!");
        }
    }
}

function handlePaddleCollision() {
    var withinVerticalBounds = function (p) {
        // if we're below the top of the paddle
        if (ball.top + ball.height() >= p.top) {
            // if we're above the bottom of the paddle
            if (ball.top <= p.top + p.height()) {
                return true;
            }
        }
        return false;
    }
    // if the left edge of the ball is in the horizontal plane of the left paddle
    if (ball.left <= leftPaddle.left + leftPaddle.width()
        && ball.left >= leftPaddle.left) {
            if (withinVerticalBounds(leftPaddle)) {
                ball.xSpeed *= -1.01;
            }
    }
    // if the right edge of the ball is in the horizontal plane of the right paddle
    else if (ball.left + ball.width() > rightPaddle.left
        && ball.left + ball.width() < rightPaddle.left + rightPaddle.width()) {
        if (withinVerticalBounds(rightPaddle)) {
            ball.xSpeed *= -1.01;
        }
    }
}

function limitVertically(item) {
    if (item.top < 0) {
        item.top = 0;
        return true;
    } else if (item.top > board.height() - item.height()) {
        item.top = board.height() - item.height();
        return true;
    }
}

function setupInput() {
    $(document).keydown(function (e) {
        switch (e.which) {
            case 38: //up
                rightPaddle.ySpeed = -5;
                break;
            case 40: //down
                rightPaddle.ySpeed = 5;
                break;
            case 83:
                leftPaddle.ySpeed = 5;
                break;
            case 87:
                leftPaddle.ySpeed = -5;
                break;
            case 80:
                gameState.pauseToggle();
                break;
        }
    });
    $(document).keyup(function (e) {
        switch (e.which) {
            case 40:
            case 38:
                rightPaddle.ySpeed = 0;
                break;
            case 83: // s
            case 87: //w
                leftPaddle.ySpeed = 0;
                break;
        }
    });
}

function restartGame() {
    resetPositions();
    doToPaddles(function (p) {
        p.ySpeed = 0;
        p.xSpeed = 0;
    });
    randomizeVelocity(ball);
    if (gameState.paused) {
        gameState.pauseToggle();
    }
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
    item.ySpeed = random(max || 5, min || -5);
    item.xSpeed = random(max || 5, min || -5);
}

function random(max, min) {
    var rn = Math.random();
    var diff = Math.abs(max - min);
    return min + (rn * diff);
}

function doToPaddles(f) {
    f(leftPaddle);
    f(rightPaddle);
}

function centerVerticalOnBoard(item) {
    item.top = ((board.height() - item.height()) / 2);
}