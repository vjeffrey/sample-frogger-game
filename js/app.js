// Global variables. userSelections and renderFlag will be used to start the game once selections are made.
// Load avatarImages; avatarIndex will be used to keep track of avatar selection.
// Set the enemy speed multiplication factor and collision factor. Set lives variable.
// Load gem images, gemIndex, and pointsPerGem.
// Set star image and points per star. Initialize points at 0, establish minutes variable.
// Set X and Y coordinates to be used later.

var userSelections = [false, false, false];
var renderFlag = false;
var avatarImages = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];
var avatarIndex;
var enemySpeedMult = 200;
var collisionProx = 20;
var lives;
var gemImages = [
    'images/Gem-Green.png',
    'images/Gem-Blue.png',
    'images/Gem-Orange.png'
];
var gemIndex;
var pointsPerGem;
var starImage = 'images/Star.png';
var pointsPerStar = 50;
var totalPoints = 0;
var minutes;
var allX = [0, 100, 200, 300, 400];
var allY = [60, 143, 226];

// Enemies our player must avoid. Set enemy bug picture, x and y coordinates, speed.
var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = allY[Math.floor(Math.random() * 3)];
    this.speed = Math.floor(100 + (Math.random() * enemySpeedMult));
};

// Update enemy's position, ensure enemy bugs move across screen, check for collision.
Enemy.prototype.update = function (dt) {
    this.x = this.x + (this.speed * dt);
    if (this.x > 550) {
        this.x = -100;
        this.y = this.y + 83;
        this.speed = Math.floor(100 + (Math.random() * enemySpeedMult));
        if (this.y > 226) {
            this.y = 60;
        }
    }
    if (player.y >= this.y - collisionProx && player.y <= this.y + collisionProx) {
        if (player.x >= this.x - collisionProx && player.x <= this.x + collisionProx) {
        player.reset();
        }
    }
};

// Draw the enemy on the screen.
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player (user) class. Set initial x and y coordinates.
var Player = function () {
    this.x = 200;
    this.y = 400;
};

// Set key functions for player
Player.prototype.update = function () {
    if (this.ctlKey === 'left' && this.x > 0) {
        this.x = this.x - 100;
    } else if (this.ctlKey === 'right' && this.x != 400) {
        this.x = this.x + 100;
    } else if (this.ctlKey === 'up') {
        this.y = this.y - 83;
    } else if (this.ctlKey === 'down' && this.y != 400) {
        this.y = this.y + 83;
    }
    this.ctlKey = null;
    if (this.y < 60){
        this.reset();
    }
};

// Draw the player on the screen!
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(avatarImages[avatarIndex]), this.x, this.y);
};

// Set the keys
Player.prototype.handleInput = function (key) {
    this.ctlKey = key;
};

// On reset, put player back in initial position, minus a life
Player.prototype.reset = function () {
    player.x = 200;
    player.y = 400;
    lives--;
    document.getElementById('lives').innerHTML = 'Lives: ' + lives;
    if (lives < 0) {
        endGame();
  }
};

// Gem class, set x and y coordinates.
var Gem = function () {
    this.x = allX[Math.floor(Math.random() * 5)];
    this.y = allY[Math.floor(Math.random() * 3)];
};

// If player gets gem, and points, new random location for gem.
Gem.prototype.update = function () {
    if (player.y === this.y + 8 && player.y === this.y + 8) {
        if (player.x === this.x && player.x === this.x) {
            totalPoints = totalPoints + pointsPerGem;
            this.x = allX[Math.floor(Math.random() * 5)];
            this.y = allY[Math.floor(Math.random() * 3)];
        }
    }
    document.getElementById('points').innerHTML = 'Points: ' + totalPoints;
};

// Draw the gem on the screen.
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(gemImages[gemIndex]), this.x, this.y);
};

// Star class, set x and y coordinates
var Star = function () {
    this.x = allX[Math.floor(Math.random() * 5)];
    this.y = allY[Math.floor(Math.random() * 3)];
};

// If player gets star, add points, new random location for star.
Star.prototype.update = function () {
    if (player.y === this.y + 8 && player.y === this.y + 8) {
        if (player.x === this.x && player.x === this.x) {
            totalPoints = totalPoints + pointsPerStar;
            this.x = allX[Math.floor(Math.random() * 5)];
            this.y = allY[Math.floor(Math.random() * 3)];
        }
    }
    document.getElementById('points').innerHTML = 'Points: ' + totalPoints;
};

// Draw the star on the screen.
Star.prototype.render = function () {
    ctx.drawImage(Resources.get(starImage), this.x, this.y);
};

// Now instantiating objects.
// Place all enemy objects in an array called allEnemies.
// Place the player object in a variable called player.
// Place gem object in variable called gem.
// Place star obect in variable called star.
var enemyA = new Enemy();
var enemyB = new Enemy();
var enemyC = new Enemy();
var enemyD = new Enemy();
var allEnemies = [enemyA, enemyB, enemyC, enemyD];

var player = new Player();

var gem = new Gem();

var star = new Star();

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Avatar selection button
function avatarClick (imgId, imgIndex) {
    avatarIndex = imgIndex;
    var buttons = document.getElementsByClassName('avatarImg');
    for (var i = 0, length = buttons.length; i < length; i++) {
       buttons[i].style.border = '3px solid white';
    }
    document.getElementById(imgId).style.border = '3px solid red';
    userSelections[0] = true;
}

// Difficulty selection button. Set different levels of ease.
function difficultyClick (buttonID, rating) {
    switch (rating) {
    case 'Easy':
        enemySpeedMult = 200;
        collisionProx = 20;
        lives = 3;
        gemIndex = 0;
        pointsPerGem = 20;
        break;
    case 'Medium':
        enemySpeedMult = 400;
        collisionProx = 40;
        lives = 5;
        gemIndex = 1;
        pointsPerGem = 40;
        break;
    case 'Hard':
        enemySpeedMult = 600;
        collisionProx = 60;
        lives = 7;
        gemIndex = 2;
        pointsPerGem = 60;
    }
    var buttons = document.getElementsByClassName('difficultyButton');
    for(var i = 0, length = buttons.length; i < length; i++) {
       buttons[i].style.border = '1px solid #333333';
    }
    document.getElementById(buttonID).style.border = '3px solid red';
    document.getElementById('lives').innerHTML = 'Lives: ' + lives;
    document.getElementById('dificultyText').innerHTML = 'Difficulty: ' + rating;
    userSelections[1] = true;
}

// Game duration selection button.
function timeClick (buttonID, duration) {
    switch (duration) {
    case 'one':
        minutes = 1;
        break;
    case 'two':
        minutes = 2;
        break;
    case 'three':
        minutes = 3;
    }
    var buttons = document.getElementsByClassName('durationButton');
    for (var i = 0, length = buttons.length; i < length; i++) {
       buttons[i].style.border = '1px solid #333333';
    }
    document.getElementById(buttonID).style.border = '3px solid red';
    userSelections[2] = true;
}

// Start button. Make sure all three categories were selected.
function startClick () {
    var selectionCount = 0;
    for (var i = 0, length = userSelections.length; i < length; i++) {
        if(userSelections[i] === true) {
           selectionCount++;
        }
    }
    if (selectionCount === 3) {
        document.getElementById('selectionPopup').style.display = 'none';
        renderFlag = true;
        countdown(minutes);
    } else {
        alert('Please make all selections before starting the game.');
    }
}

// Countdown timer.
function countdown (minutes) {
    var seconds = 60;
    var mins = minutes;
    function tick() {
        var counter = document.getElementById("timer");
        var current_minutes = mins-1;
        seconds--;
        counter.innerHTML =
        current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
        if ( seconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
            if (mins > 1){
               setTimeout(function () { countdown(mins - 1); }, 1000);
            }
        }
        if (current_minutes === 0 && seconds === 0) {
            endGame();
        }
    }
    tick();
}

// At end of game, give points summary.
function endGame () {
    renderFlag = false;
    document.getElementById('pointsSummary').innerHTML = totalPoints;
    document.getElementById('gameOverPopup').style.display = 'block';
}