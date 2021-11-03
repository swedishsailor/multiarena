const canvasBackground = "url('https://i.postimg.cc/pyNC3nMt/background.png')";

const skill2 = new Image();
skill2.src = './images/skill2Anim.png';
const skill3 = new Image();
skill3.src = './images/skill3.png';
const skill4 = new Image();
skill4.src = './images/skill4.png';

/* Frame and looping vars */
let thisFrame = 0;
let frameTime = 0;
let thisFrame2 = 0;
let thisFrame3 = 0;
let frameTime3 = 0;
let frameTime2 = 0;
let thisFrame4 = 0;
let frameTime4 = 0;
let player;
let thisPlayer;
let playerImg = new Image();
let playerImg2 = new Image();
let skill1Used = false;
let increment = 0;

const exhaust = 1000;

/* Hotkeys */
const skill1Hotkey = 49;
const skill2Hotkey = 50;
const skill3Hotkey = 51;
const skill4Hotkey = 52;


const socket = io('https://multiarena-server.herokuapp.com/');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('skill1', drawSkill1);
socket.on('skill2', drawSkill2);
socket.on('minusHp', minusHP);

/* Important query selectors */
const gameScreen = document.getElementById('mainSection');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const exitButton = document.getElementById('exitButton');
const instructionsButton = document.getElementById('instructionsButton');
const yourGameCodeString = document.getElementById('header2');
const instructionsDiv = document.getElementById('instructionsDiv');
const border = document.querySelector('.box');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
exitButton.addEventListener('click', exit);
instructionsButton.addEventListener('click', instructions);


let ctx;
let canvas;
let playerNumber;
let gameActive = false;


function newGame() {
    socket.emit('newGame');
    init();
}

function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init();
}

function exit() {
    /*initialScreen.style.display = "block";
    gameScreen.style.display = "none";
    exitButton.style.display = "none";*/
    window.location.reload();
}

function instructions() {
    exitButton.style.display = "block";
    initialScreen.style.display = "none";
    instructionsButton.style.display = "none";
    instructionsDiv.style.display = "flex";
}

function init() {
    exitButton.style.display = "block";
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
    instructionsButton.style.display = "none";
    yourGameCodeString.style.display = "block";
    border.style.display = "block";

    canvas = document.getElementById('mainSection');
    ctx = canvas.getContext('2d');

    canvas.width = 1420;
    canvas.height = 760;

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    gameActive = true;
}

function keydown(e) {
    socket.emit('keydown', e.keyCode);

    if (e.keyCode === 65 || e.keyCode === 37) {
        skill2.src = './images/skill2Anim2.png';
    }
    if (e.keyCode === 68 || e.keyCode === 39) {
        skill2.src = './images/skill2Anim.png';
    }

    /*
     * When skill 1 is pressed, start counting to go on to next frames
     */
    if (e.keyCode === skill1Hotkey) {
        frameTime2 = 0;
        thisFrame2 = 0;
    }
    /*
     * When skill 2 is pressed, start counting to go on to next frames
     */
    if (e.keyCode === skill2Hotkey) {
        frameTime3 = 0;
        thisFrame3 = 0;
    }
}

function keyup(e) {
    socket.emit('keyup', e.keyCode);
}

function paintGame(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //
    //* Showing up players radius to see if hitboxes are fine
    //
    /* ctx.beginPath();
     ctx.arc(state.players[0].pos.x + 30, state.players[0].pos.y + 30, state.players[0].radius, 0 ,2*Math.PI);
     ctx.stroke();
     ctx.beginPath();
     ctx.arc(state.players[1].pos.x + 30, state.players[1].pos.y + 30, state.players[1].radius, 0 ,2*Math.PI);
     ctx.stroke();*/
    playerImg.src = state.players[0].img;
    playerImg2.src = state.players[1].img;
    /**
     * Skills drawing
     */
    const skill1 = new Image();
    skill1.src = './images/skill1.png';
    /* Count img animation frames every frame */
    frameTime3 += 2.15;
    frameTime4 += 2.15;
    frameTime2 += 1.45;

    state.skill1.forEach(object => {
        drawSkill1(object, skill1);
    });
    state.skill3.forEach(object => {
        drawSkill3(object, skill3);
    });
    state.skill2.forEach(object => {
        drawSkill2(object, skill2);
    });
    state.skill4.forEach(object => {
        drawSkill4(object, skill4);
    });


    /*
     * Players drawing
     */
    drawPlayer(state.players[0], playerImg);
    drawPlayer(state.players[1], playerImg2);
    //ctx.rotate(45 * Math.PI/180); Funny effect
    showCharacterStatus(state);
}

function drawPlayer(playerState, playerImage) {
    player = playerState;
    frameTime += 0.15;
    frameTime = frameTime % 15;
    thisFrame = Math.round(frameTime / 15);
    ctx.drawImage(playerImage, 128 * thisFrame, 0, 128, 96, player.pos.x - 64, player.pos.y - 48, 128, 96);
}

function drawSkill1(position, image) {
    frameTime2 = frameTime2 % 51;
    thisFrame2 = Math.round(frameTime2 / 15);
    ctx.drawImage(image, 320 * thisFrame2, 0, 320, 320, position.x - 160, position.y - 160, 320, 320);
}

function drawSkill2(position, image) {
    frameTime3 = frameTime3 % 51;
    thisFrame3 = Math.round(frameTime3 / 15);
    ctx.drawImage(image, 512 * thisFrame3, 0, 512, 512, position.x - 256 + 10, position.y - 256 + 208, 512, 512);
}

function drawSkill3(position, image) {
    frameTime4 = frameTime4 % 51;
    thisFrame4 = Math.round(frameTime4 / 15);
    ctx.drawImage(image, 256 * thisFrame4, 0, 256, 256, position.x - 128, position.y - 64, 256, 256);

}

function drawSkill4(position, image) {
    ctx.drawImage(image, position.x , position.y , 56, 192);

}

function showCharacterStatus(state) {
    ctx.font = '600 36px abaddon';
    ctx.fillStyle = "#ff3f34";
    ctx.fillRect(1210, 5, state.players[playerNumber - 1].hp * 2, 30);
    ctx.fillText('Health ', 1110, 30);
    ctx.fillStyle = "#fff";
    ctx.fillText(Math.floor(state.players[playerNumber - 1].hp), 1290, 30);
    ctx.fillStyle = "#0fbcf9";
    ctx.fillRect(1210, 45, state.players[playerNumber - 1].mana, 30);
    ctx.fillText('Mana ', 1115, 70);
    ctx.fillStyle = "#fff";
    ctx.fillText(Math.floor(state.players[playerNumber - 1].mana), 1290, 70);




    thisPlayer = state.players[playerNumber - 1];
}

function handleInit(number) {
    playerNumber = number;

}

function handleGameState(gameState) {
    /*
     * When both players are ready change the waiting screen to Background screen 
     */
    if (gameActive) {
        gameScreen.style.background = canvasBackground;
    }
    if (!gameActive) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState))
}

function handleGameOver(data) {
    if (!gameActive) {
        return;
    }
    data = JSON.parse(data);

    gameActive = false;

    if (data.winner === playerNumber) {
        alert("You win!");
    } else {
        alert("You lose!");
    }
    window.location.reload(true);
}

function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
}

function handleUnknownGame() {
    reset();
    alert("Unknown game code");
}

function handleTooManyPlayers() {
    reset();
    alert("This game is already in progress!");
}

function minusHP(state, value) {
    const displayDamage = setInterval(() => {
        increment += 0.3;
        ctx.font = '600 36px abaddon';
        ctx.fillStyle = "#ff3838";
        if (value !== 0) {
            ctx.fillText('-' + value, state.x - 30, state.y - 25 - increment);
        }
        //}, 1 / 3600);
    }, 1000 / 120); // This change determine if on "normal" server minusHp func should e better visible
    setTimeout(() => {
        clearInterval(displayDamage);
        increment = 0;
    }, 1000);
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = '';
    gameCodeDisplay.innerText - "block";
    gameScreen.style.display = "none";
}
