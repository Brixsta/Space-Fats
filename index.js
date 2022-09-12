"use strict";
(function () {
  const fatsSplash = document.querySelector(".fats-splash");
  const fatsSplashContainer = document.querySelector(".fats-splash-container");
  const canvas = document.querySelector(".canvas");
  const metrics = document.querySelector(".metrics");
  const gameTitle = document.querySelector(".game-title");
  let thermal = new Audio("audio/thermal.wav");

  // if (window.innerHeight < 730 || window.innerWidth < 1055) {
  //   alert("This is a browser only game Sorry ;P");
  //   return;
  // }

  const player = {
    x: 20,
    y: 220,
    speedX: 10,
    speedY: 10,
    gameStarted: false,
    girth: 100,
    score: 1,
  };

  const game = {
    animalId: 0,
    cat: [],
    dog: [],
    dogSpeed: 5,
    dogDamage: 35,
    birds: {},
    birdSpeed: 5,
    fleas: {},
    fleaSpeed: 6,
    fleaDamage: 25,
    birdGirthAmt: 10,
    fps: 100,
    playGame() {
      let cat = game.cat[0];
      document.addEventListener("keydown", keyPress);
      document.addEventListener("keyup", keyRelease);
      if (player.gameStarted) {
        if (player.girth <= 0) {
          const meter = document.querySelector(".meter");
          player.girth = 0;
          meter.style.width = player.girth + "%";
          gameOver();
          return;
        }
        decrementGirth();
        moveFleas();
        moveBirds();
        if (player.score >= 1000) {
          moveDog();
        }

        incrementScore();
        const canvasRect = canvas.getBoundingClientRect();

        setTimeout(() => {
          window.requestAnimationFrame(game.playGame);
        }, 1000 / game.fps);

        if (player.gameStarted) {
          if (keys.ArrowUp && player.y > -1) {
            player.y -= player.speedY;
          }
          if (keys.ArrowDown && player.y < canvasRect.height - 60) {
            player.y += player.speedY;
          }
          if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speedX;
          }
          if (keys.ArrowRight && player.x < canvasRect.width - 100) {
            player.x += player.speedX;
          }

          cat.style.left = player.x + "px";
          cat.style.top = player.y + "px";
        }
      }
    },
    startGame() {
      generateLensFlare();
      setTimeout(generateLensFlare, 500);
      const cat = document.createElement("div");
      cat.classList.add("cat");
      game.cat.push(cat);
      canvas.appendChild(cat);
      thermal = new Audio("audio/thermal.wav");
      thermal.play();
      thermal.loop = true;
      thermal.volume = 0.03;
      hideStartMenu();
      generateBirds(7);
      generateFleas(5);
      generateDog();
      metrics.classList.remove("hidden");
      window.requestAnimationFrame(game.playGame);
      canvas.classList.remove("hidden");
      player.gameStarted = true;
      player.x = cat.offsetLeft;
      player.y = cat.offsetTop;
    },
  };

  let isCollide = (item) => {
    let cat = game.cat[0];
    let catRect = cat.getBoundingClientRect();
    let itemRect = item.getBoundingClientRect();
    return !(
      catRect.bottom < itemRect.top ||
      catRect.top > itemRect.bottom ||
      catRect.right < itemRect.left ||
      catRect.left > itemRect.right
    );
  };

  const gameOver = () => {
    let cat = game.cat[0];
    let dog = game.dog[0];
    let birds = Object.values(game.birds);
    let fleas = Object.values(game.fleas);
    const lensFlares = document.querySelectorAll(".lens-flare");
    game.animalId = 0;
    game.cat = [];
    game.dog = [];
    game.birds = {};
    game.fleas = {};
    dog.remove();
    cat.remove();
    birds.forEach((item) => {
      item.remove();
    });
    fleas.forEach((item) => {
      item.remove();
    });
    lensFlares.forEach((item) => {
      item.remove();
    });

    thermal.pause();
    thermal = null;
    const gameOverContainer = document.createElement("div");
    const gameOverTitle = document.createElement("h1");
    const gameOverScoreTitle = document.createElement("h1");
    const playAgainContainer = document.createElement("div");
    const playAgainButton = document.createElement("button");
    playAgainButton.innerHTML = "Play Again";
    playAgainButton.classList.add("play-again-button");
    playAgainContainer.append(playAgainButton);
    playAgainContainer.classList.add("play-again-container");
    gameOverScoreTitle.classList.add("game-over-score-title");
    gameOverScoreTitle.innerHTML = `Score: ${player.score}`;
    gameOverTitle.classList.add("game-over-title");
    gameOverTitle.innerHTML = "Game Over";
    gameOverContainer.classList.add("game-over-container");
    gameOverContainer.append(gameOverTitle);
    gameOverContainer.append(gameOverScoreTitle);
    gameOverContainer.append(playAgainContainer);
    canvas.appendChild(gameOverContainer);

    playAgainButton.addEventListener("click", restartGame);
  };

  const restartGame = () => {
    const meter = document.querySelector(".meter");
    const score = document.querySelector(".score");
    player.gameStarted = true;
    score.innerHTML = 0;
    player.score = 0;
    player.girth = 90;
    meter.style.width = player.girth + "%";
    let gameOverContainer = document.querySelector(".game-over-container");
    gameOverContainer.remove();
    game.startGame();
  };

  const incrementScore = () => {
    if (player.girth > 0) {
      let score = document.querySelector(".score");
      player.score += 1;
      score.innerHTML = player.score;
    }
  };

  const decrementGirth = () => {
    const meter = document.querySelector(".meter");
    player.girth -= 0.25;
    meter.style.width = player.girth + "%";

    if (player.girth <= 0) {
    }
  };

  const moveBirds = () => {
    let collision = false;
    let offScreen = false;
    let birds = Object.values(game.birds);

    birds.forEach((item) => {
      item.y += game.birdSpeed;
      item.style.top = item.y + "px";

      if (isCollide(item)) {
        let munch = new Audio("audio/munch.m4a");
        munch.volume = 0.03;
        munch.play();

        if (player.girth >= 90) {
          player.girth = 90;
        }
        player.girth += game.birdGirthAmt;

        if (collision === false) {
          collision = true;
          item.remove();
          delete game.birds[item.id];
          generateBirds(1);
        }
      }

      if (item.y >= 700) {
        if (offScreen === false) {
          offScreen = true;
          item.remove();
          delete game.birds[item.id];
          generateBirds(1);
        }
      }
    });
  };

  const moveFleas = () => {
    let fleas = Object.values(game.fleas);
    let collision = false;
    let offScreen = false;
    fleas.forEach((item) => {
      item.y += game.fleaSpeed;
      item.style.top = item.y + "px";

      if (isCollide(item)) {
        let cat = game.cat[0];
        let smacked = new Audio("audio/smacked.wav");
        smacked.volume = 0.1;
        smacked.play();

        cat.classList.add("take-damage");

        setTimeout(() => {
          cat.classList.remove("take-damage");
        }, 400);

        if (player.girth >= 90) {
          player.girth = 90;
        }
        player.girth -= game.fleaDamage;

        if (collision === false) {
          collision = true;
          item.remove();
          delete game.fleas[item.id];
          generateFleas(1);
        }
      }

      if (item.y >= 700) {
        if (offScreen === false) {
          offScreen = true;
          item.remove();
          delete game.fleas[item.id];
          generateFleas(1);
        }
      }
    });
  };

  const moveDog = () => {
    let cat = game.cat[0];
    let dog = game.dog[0];
    let offScreen = false;
    let collision = false;
    const bark = new Audio("audio/bark.wav");

    dog.x += game.dogSpeed;

    if (isCollide(dog)) {
      if (collision === false) {
        cat.classList.add("take-damage");
        setTimeout(() => {
          cat.classList.remove("take-damage");
        }, 400);
        bark.volume = 0.1;
        bark.play();
        collision = true;
        player.girth -= game.dogDamage;
        dog.remove();
        game.dog = [];
        generateDog();
      }
    }

    if (dog.x >= 500) {
      if (offScreen === false) {
        offScreen = true;
        dog.remove();
        game.dog = [];
        generateDog();
      }
    }

    dog.style.left = dog.x + "px";
  };

  const generateLensFlare = () => {
    for (let i = 0; i < 10; i++) {
      let lensFlare = document.createElement("div");
      lensFlare.classList.add("lens-flare");
      canvas.appendChild(lensFlare);
      lensFlare.style.top = Math.floor(Math.random() * 650) + "px";
      lensFlare.style.left = Math.floor(Math.random() * 450) + "px";
    }
  };

  const generateBirds = (amt) => {
    for (let i = 1; i <= amt; i++) {
      let bird = document.createElement("div");
      bird.x = Math.floor(Math.random() * 430);
      bird.y = -150 * i;
      bird.id = game.animalId;
      game.animalId++;
      bird.classList.add("bird");
      bird.style.left = bird.x + "px";
      bird.style.top = bird.y + "px";
      game.birds[bird.id] = bird;
      canvas.appendChild(bird);
    }
  };

  const generateFleas = (amt) => {
    for (let i = 1; i <= amt; i++) {
      let flea = document.createElement("div");
      flea.x = Math.floor(Math.random() * 460);
      flea.y = -150 * i;
      flea.id = game.animalId;
      game.animalId++;
      flea.classList.add("flea");
      flea.style.left = flea.x + "px";
      flea.style.top = flea.y + "px";
      game.fleas[flea.id] = flea;
      canvas.appendChild(flea);
    }
  };

  const generateDog = () => {
    let dog = document.createElement("div");
    dog.classList.add("dog");
    dog.x = -500;
    dog.y = Math.floor(Math.random() * 500);
    dog.style.top = dog.y + "px";
    dog.style.left = dog.x + "px";
    game.dog.push(dog);
    canvas.appendChild(dog);
  };

  const hideStartMenu = () => {
    gameTitle.remove();
    fatsSplash.remove();
    fatsSplashContainer.remove();
  };

  gameTitle.addEventListener("click", game.startGame);
  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  const keyPress = (e) => {
    keys[e.key] = true;
  };

  const keyRelease = (e) => {
    keys[e.key] = false;
  };
})();
