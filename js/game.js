console.log('start');
const gameTimeCounter = document.getElementById('gameTimeCounter');
let isBoardEnabled = false;
let opponent;

let playerOne = {
    'isXPLayer' : false,
    'wins' : 0,
    'losses' : 0,
    'ties' : 0
}

let playerTwo = {
    'isXPLayer' : false,
    'wins' : 0,
    'losses' : 0,
    'ties' : 0
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
    const megaBoardCells = document.querySelectorAll('#megaBoard td');
    let turn = 0;

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
                    let xOrO = xOrO();
                    
                    document.querySelector(`#singleBoard td[data-cell="${cellNumber}"]`).innerHTML = xOrO;
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
        // TODO read cell, check contents of surrounding win condition cells
        let winCell1 = false;
        let winCell2 = false;
        winningCellsMap[cell]['horizontal'].forEach(winCell => {
            console.log(winCell);
            document.querySelector(`#${singleOrMega}Board td[data-cell="${winCell}"]`).innerHTML == ''

        });

        console.log(winningCellsMap[cell]['vertical']);
        console.log(winningCellsMap[cell]['cross']);
        // TODO if game won, show winner content
        storeStats(winner, turns);
    }
    // TODO if game not won, advance turn
    advanceTurn(turn++,);
}

function newGame(singleOrMega, timePerMove = 60) {
    // clear board
    document.querySelectorAll("#singleBoard td").forEach(function(td) {
        td.innerHTML = "";
    });

    // clear x o player assignment
    playerOne['isXPLayer'] = false;
    playerTwo['isXPLayer'] = false;

    let opponent = document.querySelector('input[name="opponent"]:checked').value;
    
    if (opponent == "Computer") {
        // opponent is cpu - check difficulty
        let difficulty = document.querySelector('input[name="cpuDifficulty"]:checked').value;
    
        if (difficulty == 'easy') {

        } else {
            // difficulty is hard - cpu plays to win
        }

    } else {
        // opponent is human 
    }

    // randomize first player
    const randomInt = Math.floor(Math.random() * 10) + 1;
    console.log('randomInt: ',randomInt);
    randomInt % 2 === 0 ? playerOne['isXPLayer'] = true : playerTwo['isXPLayer'] = true;

    advanceTurn(1, opponent, playerOne, playerTwo);
    // show gameStats
    document.getElementById("gameStats").style.visibility = "visible";
    // show and start gameTimeCounter
    startGameTimer();
    isBoardEnabled = true;
    // turnIndicator
}

function xOrO() {
    // TODO is it first play of first turn?

    // TODO who played last?
}

// TODO advance turn
function advanceTurn(turn, opponent, playerOne, playerTwo) {
    console.log('turn advanced');
    console.log(turn, timePerMove, opponent, playerOne, playerTwo);
    if (playerOne.isXPLayer) {
        console.log('P1 plays first');
    } else {
        console.log('P2 plays first');
    }
    // TODO display whose turn it is, update countdown timerPerMove to player whose turn it is
}

// TODO reset stats
function clearStats() {

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

console.log('end');