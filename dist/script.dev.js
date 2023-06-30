"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.addEventListener('load', function () {
  console.log('Hello...');
  var canvas = document.getElementById('canvas1');
  var ctx = canvas.getContext('2d');
  canvas.width = 1400;
  canvas.height = 720;
  var enemies = [];
  var score = 0;
  var gameOver = false;

  var InputHandler = function InputHandler() {
    var _this = this;

    _classCallCheck(this, InputHandler);

    this.keys = [];
    this.touchY = '';
    this.touchTreshold = 30;
    window.addEventListener('keydown', function (e) {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && _this.keys.indexOf(e.key) === -1) {
        _this.keys.push(e.key);
      } else if (e.key === 'Enter' && gameOver) restartGame();
    });
    window.addEventListener('keyup', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        _this.keys.splice(_this.keys.indexOf(e.key), 1);
      }
    });
    window.addEventListener('touchstart', function (e) {
      _this.touchY = e.changedTouches[0].pageY;
    });
    window.addEventListener('touchmove', function (e) {
      var swipeDistance = e.changedTouches[0].pageY - _this.touchY;
      if (swipeDistance < -_this.touchTreshold && _this.keys.indexOf('swipe up') === -1) _this.keys.push('swipe up');else if (swipeDistance > _this.touchTreshold && _this.keys.indexOf('swipe down') === -1) {
        _this.keys.push('swipe down');

        if (gameOver) restartGame();
      }
    });
    window.addEventListener('touchend', function (e) {
      _this.keys.splice(_this.keys.indexOf('swipe up'), 1);

      _this.keys.splice(_this.keys.indexOf('swipe down'), 1);
    });
  };

  ;

  var Player =
  /*#__PURE__*/
  function () {
    function Player(gameWidth, gameHeight) {
      _classCallCheck(this, Player);

      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('playerImage');
      this.frameX = 0;
      this.maxFrame = 8;
      this.frameY = 0;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }

    _createClass(Player, [{
      key: "restart",
      value: function restart() {
        this.x = 100;
        this.y = this.gameHeight - this.gameHeight;
        this.maxFrame = 8;
        this.frameY = 0;
      }
    }, {
      key: "draw",
      value: function draw(context) {
        context.strokeStyle = 'white';
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = 'blue';
        context.beginPath();
        context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        context.stroke();
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
      }
    }, {
      key: "update",
      value: function update(input, deltaTime, enemies) {
        var _this2 = this;

        // Collision detection
        enemies.forEach(function (enemy) {
          var dx = enemy.x + enemy.width / 2 - (_this2.x + _this2.width / 2);
          var dy = enemy.y + enemy.height / 2 - (_this2.y + _this2.height / 2);
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < enemy.width / 2 + _this2.width / 2) {
            gameOver = true;
          }
        }); // sprite animation

        if (this.frameTimer > this.frameInterval) {
          if (this.frameX >= this.maxFrame) this.frameX = 0;else this.frameX++;
        } else {
          this.frameTimer += deltaTime;
        } // controls


        if (input.keys.indexOf('ArrowRight') > -1) {
          this.speed = 5;
        } else if (input.keys.indexOf('ArrowLeft') > -1) {
          this.speed = -5;
        } else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) {
          this.vy -= 32;
        } else {
          this.speed = 0;
        } // Horizontal movement


        this.x += this.speed;
        if (this.x < 0) this.x = 0;else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width; // Vertical movement

        this.y += this.vy;

        if (!this.onGround()) {
          this.vy += this.weight;
          this.maxFrame = 5;
          this.frameY = 1;
        } else {
          this.vy = 0;
          this.maxFrame = 8;
          this.frameY = 0;
        }

        if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
      }
    }, {
      key: "onGround",
      value: function onGround() {
        return this.y >= this.gameHeight - this.height;
      }
    }]);

    return Player;
  }();

  var Background =
  /*#__PURE__*/
  function () {
    function Background(gameWidth, gameHeight) {
      _classCallCheck(this, Background);

      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.x = 0;
      this.y = 0;
      this.image = document.getElementById('backgroundImage');
      this.width = 2400;
      this.height = 720;
      this.speed = 7;
    }

    _createClass(Background, [{
      key: "draw",
      value: function draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
      }
    }, {
      key: "update",
      value: function update() {
        this.x -= this.speed;
        if (this.x < 0 - this.width) this.x = 0;
      }
    }, {
      key: "restart",
      value: function restart() {
        this.x = 0;
      }
    }]);

    return Background;
  }();

  var Enemy =
  /*#__PURE__*/
  function () {
    function Enemy(gameWidth, gameHeight) {
      _classCallCheck(this, Enemy);

      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById('enemyImage');
      this.x = this.gameWidth - this.width;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 8;
      this.markedForDeletion = false;
    }

    _createClass(Enemy, [{
      key: "draw",
      value: function draw(context) {
        context.strokeStyle = 'white';
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.beginPath();
        context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = 'blue';
        context.beginPath();
        context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        context.stroke();
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
      }
    }, {
      key: "update",
      value: function update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
          if (this.frameX >= this.maxFrame) this.frameX = 0;else this.frameX++;
          this.frameTimer = 0;
        } else {
          this.frameTimer += deltaTime;
        }

        this.x -= this.speed;

        if (this.x < 0 - this.width) {
          this.markedForDeletion = true;
          score++;
        }
      }
    }]);

    return Enemy;
  }();

  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }

    enemies.forEach(function (enemy) {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter(function (enemy) {
      return !enemy.markedForDeletion;
    });
  }

  function displayStatusText(context) {
    context.textAlign = 'left';
    context.font = '40px Helvetica';
    context.fillStyle = 'black';
    context.fillText('Score: ' + score, 20, 50);
    context.fillStyle = 'white';
    context.fillText('Score: ' + score, 22, 52);

    if (gameOver) {
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.fillText('Game Over, press Enter to restart...', canvas.width / 2, 200);
      context.fillStyle = 'white';
      context.fillText('Game Over, press Enter to restart...', canvas.width / 2 + 2, 202);
    }
  }

  function restartGame() {
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  }

  var input = new InputHandler();
  var player = new Player(canvas.width, canvas.height);
  var background = new Background(canvas.width, canvas.height);
  var lastTime = 0;
  var enemyTimer = 0;
  var enemyInterval = 1000;
  var randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timestamp) {
    var deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }

  animate(0);
});