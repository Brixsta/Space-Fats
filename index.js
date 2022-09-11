"use strict";
(function () {
  const fatsSplash = document.querySelector(".fats-splash");
  const fatsSplashContainer = document.querySelector(".fats-splash-container");
  const canvas = document.querySelector(".canvas");
  const metrics = document.querySelector(".metrics");
  const gameTitle = document.querySelector(".game-title");
  let thermal = new Audio("audio/thermal.wav");

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
    dog: [],
    cat: [],
    fleas: [],
    mice: [],
    foodSpeed: 5,
    fleaSpeed: 5,
    fleaDamage: 30,
    dogSpeed: 5,
    dogDamage: 60,
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
        moveMice();
        moveDog();
        moveFleas();

        incrementScore();
        const canvasRect = canvas.getBoundingClientRect();
        window.requestAnimationFrame(game.playGame);
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
      generateDog();
      generateMice();
      generateFleas();
      metrics.classList.remove("hidden");
      window.requestAnimationFrame(game.playGame);
      canvas.classList.remove("hidden");
      player.gameStarted = true;
      player.x = cat.offsetLeft;
      player.y = cat.offsetTop;
    },
  };

  let isCollide = (item) => {
    let cat = document.querySelector(".cat");
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
    const oldCat = game.cat[0];
    oldCat.remove();
    const lensFlares = document.querySelectorAll(".lens-flare");
    lensFlares.forEach((item) => {
      item.remove();
    });

    thermal.pause();
    thermal = null;
    let gameOverContainer = document.createElement("div");
    let gameOverTitle = document.createElement("h1");
    let gameOverScoreTitle = document.createElement("h1");
    let playAgainContainer = document.createElement("div");
    let playAgainButton = document.createElement("button");
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
    const cat = document.createElement("div");
    cat.classList.add("cat");
    game.cat.push(cat);
    cat.style.left = 200 + "px";
    cat.style.top = 610 + "px";
    player.gameStarted = true;
    score.innerHTML = 0;
    player.score = 0;

    player.girth = 100;
    meter.style.width = player.girth + "%";
    let mice = game.mice;
    let fleas = game.fleas;
    let dog = game.dog[0];
    let gameOverContainer = document.querySelector(".game-over-container");

    gameOverContainer.remove();
    mice.forEach((item) => {
      item.remove();
    });
    fleas.forEach((item) => {
      item.remove();
    });
    dog.remove();
    game.cat = [];
    game.mice = [];
    game.fleas = [];
    game.dog = [];
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

  let moveDog = () => {
    let bark = new Audio("audio/bark.wav");
    bark.volume = 0.1;
    let dog = game.dog[0];

    if (isCollide(dog)) {
      let cat = game.cat[0];
      dog.classList.add("hidden");
      cat.classList.add("take-damage");
      player.girth -= game.dogDamage;
      bark.play();
      bark = null;
      const takeDamage = setTimeout(() => {
        cat.classList.remove("take-damage");
      }, 400);
    }

    if (dog.x > 650) {
      dog.classList.remove("hidden");
      dog.x = -150;
      dog.y = Math.floor(Math.random() * 600);
    }

    dog.x += game.dogSpeed;

    dog.style.left = dog.x + "px";
    dog.style.top = dog.y + "px";
    bark = null;
  };

  let moveMice = () => {
    let munch = new Audio("audio/munch.m4a");
    munch.volume = 0.03;
    let mice = game.mice;
    mice.forEach((item) => {
      if (item.style.backgroundImage === "") {
        item.style.backgroundImage = `url(images/mouse.png)`;
      }

      if (isCollide(item)) {
        munch.play();
        item.classList.add("hidden");
        let girthIncrease = 10;

        if (player.girth + girthIncrease > 100) {
          player.girth = 100;
        } else {
          player.girth += girthIncrease;
        }
      }
      if (item.y >= 700) {
        item.style.backgroundImage = "";
        item.classList.remove("hidden");
        item.y = -150;
        item.style.left = Math.floor(Math.random() * 350) + "px";
      }

      item.y += game.foodSpeed;
      item.style.top = item.y + "px";
    });
    mice = null;
    munch = null;
  };

  let moveFleas = () => {
    let smack = new Audio("audio/smacked.wav");
    smack.volume = 0.1;
    let fleas = game.fleas;

    fleas.forEach((item) => {
      if (isCollide(item)) {
        let cat = game.cat[0];
        cat.classList.add("take-damage");
        smack.play();
        item.classList.add("hidden");
        player.girth -= game.fleaDamage;

        const takeDamage = setTimeout(() => {
          cat.classList.remove("take-damage");
        }, 400);
      }

      if (item.y >= 700) {
        item.classList.remove("hidden");
        item.y = -700;
      }

      item.y += game.fleaSpeed;
      item.style.top = item.y + "px";
    });

    fleas = null;
    smack = null;
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

  const generateMice = () => {
    for (let i = 1; i < 8; i++) {
      let mouse = document.createElement("div");
      mouse.classList.add("mouse");
      mouse.y = i * -100;
      mouse.x = Math.floor(Math.random() * 450);
      mouse.style.top = mouse.y + "px";
      mouse.style.left = mouse.x + "px";
      game.mice.push(mouse);
      canvas.appendChild(mouse);
    }
  };

  // const generateBirds = () => {
  //   for (let i = 1; i < 8; i++) {
  //     let bird = document.createElement("div");
  //     bird.classList.add("bird");
  //     canvas.appendChild(bird);
  //     bird.y = i * -400;
  //     bird.x = Math.floor(Math.random() * 450);
  //     bird.style.top = bird.y + "px";
  //     bird.style.left = bird.x + "px";
  //   }
  // };

  const generateFleas = () => {
    for (let i = 1; i < 6; i++) {
      let flea = document.createElement("div");
      flea.classList.add("flea");
      flea.y = -225 * i;
      flea.x = Math.floor(Math.random() * 300);
      flea.style.top = flea.y + "px";
      flea.style.left = flea.x + "px";
      game.fleas.push(flea);
      canvas.appendChild(flea);
    }
  };

  const generateDog = () => {
    let dog = document.createElement("div");
    dog.classList.add("dog");
    dog.x = -150;
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
