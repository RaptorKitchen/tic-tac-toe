console.log('start');
const gameTimeCounter = document.getElementById('gameTimeCounter');
let isBoardEnabled = false;
let opponent;
let timePerMove = 30;
let p1MoveTimerEl = document.getElementById('p1MoveTimer');
let p2MoveTimerEl = document.getElementById('p2MoveTimer');

let turn = {
    'turn': 0,
    'xPlayed': false,
    'oPlayed': false
}

let playerOne = {
    'isXPLayer' : false,
    'wins' : 0,
    'losses' : 0,
    'ties' : 0,
    'playTimer': 0
}

let playerTwo = {
    'isXPLayer' : false,
    'wins' : 0,
    'losses' : 0,
    'ties' : 0,
    'playTimer': 0
}

const miniboardArray = [
    'board_a1',
    'board_a2',
    'board_a3',
    'board_b1',
    'board_b2',
    'board_b3',
    'board_c1',
    'board_c2',
    'board_c3',
];

const winningCellsMap = {
    1: {
       'horizontal': [2,3],
       'vertical': [4,7],
       'cross': [5,9]
    },
    2: {
        'horizontal': [1,3],
        'vertical': [5,8],
        'cross': null
    },
    3: {
        'horizontal': [1,2],
        'vertical': [6,9],
        'cross': [5,7]
    },
    4: {
        'horizontal': [5,6],
        'vertical': [1,7],
        'cross': null
    },
    5: {
        'horizontal': [4,6],
        'vertical': [2,8],
        'cross': null
    },
    6: {
        'horizontal': [4,5],
        'vertical': [3,9],
        'cross': null
    },
    7: {
        'horizontal': [8,9],
        'vertical': [1,4],
        'cross': [5,3]
    },
    8: {
        'horizontal': [7,9],
        'vertical': [2,5],
        'cross': null
    },
    9: {
        'horizontal': [7,8],
        'vertical': [3,6],
        'cross': [1,5]
    },
}

function buildMiniboard(target) {
    let miniboard = document.querySelector(`#${target}`);
    miniboard.innerHTML = `<table><tbody><tr><td data-cell="{'table':'${target}','cell':1}"></td><td data-cell="{'table':'${target}','cell':2}"></td><td data-cell="{'table':'${target}','cell':3}"></td></tr><tr><td data-cell="{'table':'${target}','cell':4}"></td><td data-cell="{'table':'${target}','cell':5}"></td><td data-cell="{'table':'${target}','cell':6}"></td></tr><tr><td data-cell="{'table':'${target}','cell':7}"></td><td data-cell="{'table':'${target}','cell':8}"></td><td data-cell="{'table':'${target}','cell':9}"></td></tr></tbody></table>`;
}

function fillMiniboards() {
    miniboardArray.forEach(element => {
        buildMiniboard(element);
    });
}

fillMiniboards();

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom loaded');

    const singleBoardCells = document.querySelectorAll('#singleBoard td');
    //const megaBoardCells = document.querySelectorAll('#megaBoard td'); come back to this later if there's time and interest

    singleBoardCells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (isBoardEnabled) {
                console.log('board is enabled');
                const cellNumber = cell.getAttribute('data-cell');
                console.log('Clicked cell number:', cellNumber);
                // now check if move is valid and cell is unoccupied
                if (isCellEmpty(cellNumber, 'single')) {
                    console.log('cell is empty');
                    // TODO whose turn is it, X or O? add if here to determine X or O
                    let writeXOrO = xOrO(turn);
                    
                    document.querySelector(`#singleBoard td[data-cell="${cellNumber}"]`).innerHTML = writeXOrO;
                    isGameWon(cellNumber, "single");
                }
            } else {
                console.log('board is disabled');
            }
        });
    });
});

function isCellEmpty(cell, singleOrMega) {
    if (document.querySelector(`#${singleOrMega}Board td[data-cell="${cell}"]`).innerHTML != '') {
        return false;
    }
    return true;
}

function isGameWon(cell, singleOrMega, player) {
    if (singleOrMega == 'single') {
        horizontalCounter = 0;
        verticalCounter = 0;
        crossCounter = 0;

        winningCellsMap[cell]['horizontal'].forEach(winCell => {
            console.log(winCell);
            if (document.querySelector(`#${singleOrMega}Board td[data-cell="${winCell}"]`).innerHTML == '') {
                // TODO interpret if player is x or o, if winning cells are same as this player, game is won
                horizontalCounter++;
            } 
            
        });

        winningCellsMap[cell]['vertical'].forEach(winCell => {
            console.log(winCell);
            if (document.querySelector(`#${singleOrMega}Board td[data-cell="${winCell}"]`).innerHTML == '') {
                // TODO interpret if player is x or o, if winning cells are same as this player, game is won
                verticalCounter++;
            } 
            
        });

        if (winningCellsMap[cell]['cross']) {
            winningCellsMap[cell]['cross'].forEach(winCell => {
                console.log(winCell);
                if (document.querySelector(`#${singleOrMega}Board td[data-cell="${winCell}"]`).innerHTML == '') {
                    // TODO interpret if player is x or o, if winning cells are same as this player, game is won
                    crossCounter++;
                } 
                
            });
        }

        console.log(winningCellsMap[cell]['vertical']);
        console.log(winningCellsMap[cell]['cross']);

        if (horizontalCounter == 2 || verticalCounter == 2 || crossCounter == 2) {
            // TODO show winner content
            storeStats(player, turn['turn']);
            return true; // game is won
        }
    }
    // TODO if game not won, figure out if turn should be advanced or if it is next player's turn
    advanceTurn(turn['turn']++, opponent, playerOne, playerTwo, timePerMove);
}

function newGame(singleOrMega = 'single') {
    // clear board
    document.querySelectorAll("#singleBoard td").forEach(function(td) {
        td.innerHTML = "";
    });

    timePerMove = document.getElementById('timePerMove').value;

    // clear x o player assignment
    playerOne['isXPLayer'] = false;
    playerTwo['isXPLayer'] = false;

    // clear turn
    turn['turn'] = 0;

    let opponent = document.querySelector('input[name="opponent"]:checked').value;
    
    if (opponent == "Computer") {
        // opponent is cpu - check difficulty
        let difficulty = document.querySelector('input[name="cpuDifficulty"]:checked').value;
    
        if (difficulty == 'easy') {
            // TODO let the easy CPU take a few seconds before making first move
            // TODO if opponent is CPU and they move first, make a random available move
        } else {
            // TODO if opponent is CPU and they move first, make the best opening move
        }

    } else {
        // TODO opponent is human, the first move made goes to the X player
    }

    // randomize first player
    const randomInt = Math.floor(Math.random() * 10) + 1;
    console.log('randomInt: ',randomInt);
    randomInt % 2 === 0 ? playerOne['isXPLayer'] = true : playerTwo['isXPLayer'] = true;

    advanceTurn(1, opponent, playerOne, playerTwo, timePerMove);

    // show gameStats
    document.getElementById("gameStats").style.visibility = "visible";
    // show and start gameTimeCounter
    startGameTimer();
    (playerOne['ixXPlayer']) ? startPlayerTimer('p1', timePerMove) : startPlayerTimer('p2', timePerMove);
    isBoardEnabled = true;
    // turnIndicator
}

function xOrO(turn) {
    return (turn['xPlayed']) ? 'O' : 'X';
}

// TODO advance turn
function advanceTurn(turn, opponent, playerOne, playerTwo, timePerMove) {
    console.log('turn advanced');
    console.log(turn, timePerMove, opponent, playerOne, playerTwo);
    if (playerOne.isXPLayer) {
        console.log('P1 plays first');
    } else {
        console.log('P2 plays first');
    }

    turn['turn']++;
    // TODO display whose turn it is, update countdown timerPerMove to player whose turn it is
}

// TODO reset stats
function clearStats() {
    // TODO clear wins
    // TODO clear moves made
}

// TODO store stats on end of game
function storeStats(winner, turns) {
    
}

// TODO swap player timer countdowns
function swapPlayerTimers() {
    // TODO pause player timer that triggered move
    // TODO resume countdown of player to move now
}

let gameTimerInterval;

function startGameTimer() {
    let startTime = 0.0;

    // Clear any existing interval
    if (gameTimerInterval) {
        clearInterval(gameTimerInterval);
    }

    function updateTimer() {
        startTime += 0.1;
        gameTimeCounter.textContent = startTime.toFixed(1);
    }
    
    // Start a new interval
    gameTimerInterval = setInterval(updateTimer, 100);
}

function startPlayerTimer(player, timePerMove) {

    let timerToAdjust = document.getElementById(`${player}MoveTimer`);
    timerToAdjust.textContent = timePerMove;

    function updatePlayTimer() {
        timePerMove -= 0.1;
        //player['playTimer'].textContent = timePerMove.toFixed(1);
        timerToAdjust.textContent = timePerMove.toFixed(1);
    }
    
    // Start a new interval
    playTimerInterval = setInterval(updatePlayTimer, 100);
}

// TODO track any currently running player timer and if it reaches zero - end game and assign other player the winner
console.log('end');