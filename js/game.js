Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	times: []
};
var monster = {
	speed: hero.speed*.95,
	times: []
};
var timeAlive = 0;
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	
	var record = Math.round(timeAlive/100)/10;
	monster.times.push(record);
	then = Date.now();
	timeOfDeath = then;
};

// Update game objects
var update = function (modifier) {
  // hero movement
  if (38 in keysDown && hero.y >= 0) { // holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown && hero.y <= canvas.height - 32) { // down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown && hero.x >= 0) { // left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown && hero.x <= canvas.width - 32) { // right
    hero.x += hero.speed * modifier;
  }

// monster movement
  if (87 in keysDown && monster.y >= 0) { // holding up
    monster.y -= monster.speed * modifier;
  }
  if (83 in keysDown && monster.y <= canvas.height - 32) { // down
    monster.y += monster.speed * modifier;
  }
  if (65 in keysDown && monster.x >= 0) { // left
    monster.x -= monster.speed * modifier;
  }
  if (68 in keysDown && monster.x <= canvas.width - 32) { // right
    monster.x += monster.speed * modifier;
  }
  console.log(monster.times)

  // speed hacks
  if (219 in keysDown) {
  	monster.speed = 256*.95
  }
  if (221 in keysDown) {
  	monster.speed = 256*1.05
  }


	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Best Time: " + monster.times.max() + " (" + monster.times[monster.times.length - 1] + ")", 32, 32);
	ctx.fillText("Current: " + Math.floor(timeAlive/100)/10, 32, 64);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	timeAlive = then-timeOfDeath;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var timeAlive = 0;
// Let's play this game!
var then = Date.now();
var timeOfDeath = then;
monster.times.push(0);
reset();
main();
