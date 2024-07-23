console.log('start');
const gameTimeCounter = document.getElementById('gameTimeCounter');
let isBoardEnabled = false;
let opponent;
let timePerMove = 30;
let p1MoveTimerEl = document.getElementById('p1MoveTimer');
let p2MoveTimerEl = document.getElementById('p2MoveTimer');
let newGameButton = document.getElementById('newGameButton');
let difficulty;
let cpuSymbol;
let symbolToWrite;
let gameWon = false;

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
    'playTimer': 0,
    'isPlayerOne': true
}

let playerTwo = {
    'isXPLayer' : false,
    'wins' : 0,
    'losses' : 0,
    'ties' : 0,
    'playTimer': 0,
    'isPlayerOne': false
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
                    let writeXOrO = xOrO(turn);
                    turn[`${writeXOrO.toLowerCase}Played`] = true;
                    document.querySelector(`#singleBoard td[data-cell="${cellNumber}"]`).innerHTML = writeXOrO;
                    isGameWon(cellNumber, "single", writeXOrO);
                    let next_player = (writeXOrO == 'X') ? 'O' : 'X';
                    console.log(next_player, 'next player check');
                    document.getElementById('playerTurnLabel').innerHTML = `${next_player}'s turn!`;
                    // if game is not won, make cpu move now
                    if (opponent == 'Computer' && !gameWon) {
                        makeCpuMove(difficulty, cpuSymbol);
                    }
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

function isGameWon(cell, singleOrMega, playerSymbol) {
    if (singleOrMega == 'single') {
        horizontalCounter = 0;
        verticalCounter = 0;
        crossCounter = 0;

        // TODO these winning cell matches need to check if the innerHTML is full of winning letter
        winningCellsMap[cell]['horizontal'].forEach(winCell => {
            if (document.querySelector(`#${singleOrMega}Board td[data-cell="${winCell}"]`).innerHTML == playerSymbol) {
                horizontalCounter++;
            } 
            
        });

        winningCellsMap[cell]['vertical'].forEach(winCell => {
            if (document.querySelector(`#${singleOrMega}Board td[data-cell="${winCell}"]`).innerHTML == playerSymbol) {
                verticalCounter++;
            } 
            
        });

        if (winningCellsMap[cell]['cross']) {
            winningCellsMap[cell]['cross'].forEach(winCell => {
                if (document.querySelector(`#${singleOrMega}Board td[data-cell="${winCell}"]`).innerHTML == playerSymbol) {
                    crossCounter++;
                } 
                
            });
        }

        console.log(winningCellsMap[cell]['horizontal']);
        console.log(winningCellsMap[cell]['vertical']);
        console.log(winningCellsMap[cell]['cross']);

        if (horizontalCounter == 2 || verticalCounter == 2 || crossCounter == 2) {
            let player = winningPlayer(playerSymbol);
            console.log(playerSymbol, player);
            clearInterval(gameTimerInterval);
            isBoardEnabled = false;
            document.getElementById('playerTurnLabel').innerHTML = `${playerSymbol} wins!`;
            gameWon = true;
            alert(`${playerSymbol} wins!`);
            newGameButton.innerHTML = "Play Again?";
            newGameButton.onclick = () => newGame('single', false);
            storeStats(player, 'wins');
            storeStats(getOppositePlayer(player), 'losses');
            return true; // game is won
        }
    }

    let board = {};
    document.querySelectorAll("#singleBoard td").forEach(function(td) {
        let cell = td.getAttribute('data-cell');
        board[cell] = td.innerHTML;
    });

    if (getAvailableMoves(board).length === 0) {
        storeStats(playerOne, 'ties');
        storeStats(playerTwo, 'ties');
        stopGameTimer();
        document.getElementById('playerTurnLabel').innerHTML = 'Draw - nobody wins';
        alert(`Draw! Nobody wins.`);
        newGameButton.innerHTML = "Play Again?";
        newGameButton.onclick = () => newGame('single', false);
    }

    advanceTurn(turn, opponent, playerOne, playerTwo, timePerMove);
    return false;
}

function newGame(singleOrMega = 'single', confirmation = false) {
    newGameButton.innerHTML = "Restart?";
    newGameButton.onclick = () => newGame('single', true);
    gameWon = false;
    if (confirmation) {
        // Show the confirmation dialog
        document.getElementById('confirmationDialog').style.display = 'block';
        return; // Exit the function to wait for user confirmation
    }

    // clear board
    document.querySelectorAll("#singleBoard td").forEach(function(td) {
        td.innerHTML = "";
    });

    // future feature - assign time allotment per player
    timePerMove = document.getElementById('timePerMove').value;

    // clear x o player assignment
    playerOne['isXPLayer'] = false;
    playerTwo['isXPLayer'] = false;

    // clear turn
    turn['turn'] = 0;
    p1MoveTimerEl.textContent = timePerMove;
    p2MoveTimerEl.textContent = timePerMove;

    // show pause button
    document.getElementById('pauseButton').style.visibility = "visible";

    opponent = document.querySelector('input[name="opponent"]:checked').value;

    // randomize x player
    const randomInt = Math.floor(Math.random() * 10) + 1;
    randomInt % 2 === 0 ? playerOne['isXPLayer'] = true : playerTwo['isXPLayer'] = true;

    if (playerOne['isXPLayer']) {
        document.getElementById('p1Assignment').innerHTML = "Plays X";
        document.getElementById('p2Assignment').innerHTML = "Plays O";
    } else {
        document.getElementById('p1Assignment').innerHTML = "Plays O";
        document.getElementById('p2Assignment').innerHTML = "Plays X";
    }

    // set initial turn
    turn['turn'] = 1;

    if (opponent == "Computer") {
        difficulty = document.querySelector('input[name="cpuDifficulty"]:checked').value;
        cpuSymbol = getPlayerSymbol(playerTwo);
    }

    // if CPU is the X player, make its move
    if (opponent == "Computer" && playerTwo['isXPLayer']) {
        makeCpuMove(difficulty, cpuSymbol);
        // now enable board for human player
        isBoardEnabled = true;
    } else {
        // enable board for humans
        isBoardEnabled = true;
        // update turn label 
        document.getElementById('playerTurnLabel').innerHTML = `X's turn!`;
    }

    // show gameStats
    document.getElementById("gameStats").style.visibility = "visible";
    // show and start gameTimeCounter, enable board
    startGameTimer();
    startPlayerTimer('X', timePerMove);
}

function xOrO(turn) {
    var isOsTurn = document.getElementById('playerTurnLabel').innerHTML == "O's turn!";

    if (isOsTurn) {
        return 'O';
    } else {
        return 'X';
    }
}

function advanceTurn(turn, opponent, playerOne, playerTwo, timePerMove) {
    console.log('turn advanced');
    console.log(turn, timePerMove, opponent, playerOne, playerTwo);

    if (turn['xPlayed'] && turn['oPlayed']) turn['turn']++;
}

function clearStats() {
    playerOne['wins'] = 0;
    playerOne['losses'] = 0;
    playerOne['ties'] = 0;
    playerTwo['wins'] = 0;
    playerTwo['losses'] = 0;
    playerTwo['ties'] = 0;
}

function storeStats(winner, winType) {
    console.log(winner);
    if (winner['isPlayerOne']) {
        playerOne[`${winType}`]++;
        if (winType == 'wins') {
            document.getElementById('p1WinCounter').innerHTML = playerOne['wins'];    
        }
    } else if (!winner['isPlayerOne']) {
        playerTwo[`${winType}`]++;
        if (winType == 'wins') {
            document.getElementById('p2WinCounter').innerHTML = playerTwo['wins'];    
        }
    }
}

// future feature for managing player timers (not used)
function swapPlayerTimers() {
    if (playerOne['isXPLayer']) {
        clearInterval(p1MoveTimerEl);
        startPlayerTimer('O', timePerMove);
    } else {
        clearInterval(p2MoveTimerEl);
        startPlayerTimer('X', timePerMove);
    }
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

function stopGameTimer() {
    clearInterval(gameTimerInterval);
}

// future feature for player timers that countdown
function startPlayerTimer(player, timePerMove) {
    //let timerToAdjust = document.getElementById(`${player}MoveTimer`);
    //timerToAdjust.textContent = timePerMove;

    function updatePlayTimer() {
        timePerMove -= 0.1;
        //timerToAdjust.textContent = timePerMove.toFixed(1);
    }
    
    //playTimerInterval = setInterval(updatePlayTimer, 100);
}

// helper function to fetch proper player symbol
function getPlayerSymbol(player) {
    return player['isXPLayer'] ? 'X' : 'O';
}

// helper function to return opposite player
function getOppositePlayer(player) {
    if (player['isPlayerOne']) {
        return playerTwo;
    }
    
    return playerOne;
}
// Helper function to check for a winner
function checkWinner(board, player) {
    const winPatterns = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], // horizontal
        [1, 4, 7], [2, 5, 8], [3, 6, 9], // vertical
        [1, 5, 9], [3, 5, 7]  // cross
    ];

    return winPatterns.some(pattern => pattern.every(cell => board[cell] === player));
}

// Helper function to get available moves
function getAvailableMoves(board) {
    return Object.keys(board).filter(cell => board[cell] === '');
}

// Minimax function for hard CPU
function minimax(board, depth, isMaximizing, player, opponent) {
    if (checkWinner(board, player)) return { score: 10 - depth };
    if (checkWinner(board, opponent)) return { score: depth - 10 };
    if (getAvailableMoves(board).length === 0) return { score: 0 };

    const availableMoves = getAvailableMoves(board);
    let bestMove = { score: isMaximizing ? -Infinity : Infinity };

    availableMoves.forEach(move => {
        board[move] = isMaximizing ? player : opponent;
        let result = minimax(board, depth + 1, !isMaximizing, player, opponent);
        board[move] = '';
        result.move = move;

        if (isMaximizing) {
            if (result.score > bestMove.score) {
                bestMove = result;
            }
        } else {
            if (result.score < bestMove.score) {
                bestMove = result;
            }
        }
    });

    return bestMove;
}

function makeCpuMove(difficulty, cpuSymbol) {
    const playerSymbol = cpuSymbol;
    const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
    console.log(opponentSymbol);
    setTimeout(() => {
        if (difficulty === 'easy') {
            console.log('easy cpu move');
            let availableCells = [];
            document.querySelectorAll("#singleBoard td").forEach(function(td) {
                if (td.innerHTML === '') {
                    availableCells.push(td);
                }
            });
    
            let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
            randomCell.innerHTML = playerSymbol;
            isGameWon(randomCell.getAttribute('data-cell'), "single", playerSymbol);
        } else {
            console.log('hard cpu move');
            let board = {};
            document.querySelectorAll("#singleBoard td").forEach(function(td) {
                let cell = td.getAttribute('data-cell');
                board[cell] = td.innerHTML;
            });
    
            let bestMove = minimax(board, 0, true, playerSymbol, opponentSymbol);
            let cellToPlay = document.querySelector(`#singleBoard td[data-cell="${bestMove.move}"]`);
            cellToPlay.innerHTML = playerSymbol;
            isGameWon(bestMove.move, "single", playerSymbol);
        }

        if (playerSymbol == 'X') {
            turn['xPlayed'] = true;
        } else {
            turn['oPlayed'] = true;
        }

        console.log(turn, 'cpu turn made');

        if (turn['oPlayed'] && turn['xPlayed']) {
            console.log('both played');
        }

        // update turn indicator
        document.getElementById('playerTurnLabel').innerHTML = `${opponentSymbol}'s turn!`;
    }, 2000);
}

function winningPlayer(playerSymbol) {
    console.log(playerSymbol, playerOne['isXPLayer'], playerTwo['isXPLayer']);
    if (playerSymbol == 'X' && playerOne['isXPLayer']) {
        console.log('P1 wins as X');
        return playerOne;
    } else if (playerSymbol == 'O' && playerTwo['isXPlayer']) {
        console.log('P1 wins as O')
        return playerOne;
    } else if (playerSymbol == 'X' && playerTwo['isXPLayer']) {
        console.log('P2 wins as X');
        return playerTwo;
    } else if (playerSymbol == 'O' && playerOne['isXPlayer']) {
        console.log('P2 wins as O');
        return playerTwo;
    } else {
        console.log('no winner');
    }
}

function dismissDialogue() {
    document.getElementById('confirmationDialog').style.display = 'none';
}

/* stretch feature
function pauseTimer(resume = false) {
    // take current value of gameTimer and both player timers
    gameTimerValue = parseFloat(gameTimeCounter.textContent);
    player1TimerValue = parseFloat(p1MoveTimerEl.textContent);
    player2TimerValue = parseFloat(p2MoveTimerEl.textContent);

    // clear intervals
    clearInterval(gameTimerInterval);
    clearInterval(p1TimerInterval);
    clearInterval(p2TimerInterval);

    if (!resume) {
        // Update pauseButton onclick to include resume true
        document.getElementById('pauseButton').onclick = () => pauseTimer(true);
    } else {
        // take gameTimer and active player timer stored and resume them

        // Resume game timer
        gameTimerInterval = setInterval(() => {
            gameTimerValue += 0.1;
            gameTimeCounter.textContent = gameTimerValue.toFixed(1);
        }, 100);

        // Resume the active player timer
        if (playerOne['isXPLayer']) {
            p1TimerInterval = setInterval(() => {
                player1TimerValue -= 0.1;
                p1MoveTimerEl.textContent = player1TimerValue.toFixed(1);
                if (player1TimerValue <= 0) {
                    clearInterval(p1TimerInterval);
                    alert('Player 2 wins due to time out!');
                    // TODO handle end game logic
                }
            }, 100);
        } else {
            p2TimerInterval = setInterval(() => {
                player2TimerValue -= 0.1;
                p2MoveTimerEl.textContent = player2TimerValue.toFixed(1);
                if (player2TimerValue <= 0) {
                    clearInterval(p2TimerInterval);
                    alert('Player 1 wins due to time out!');
                    // TODO handle end game logic
                }
            }, 100);
        }

        // Update pauseButton onclick to include resume false
        document.getElementById('pauseButton').onclick = () => pauseTimer(false);
    }
}
*/

console.log('end');