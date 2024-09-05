// Global variables
let board, cells, status, resetBtn, playerScoreElement, aiScoreElement;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerScore = 0;
let aiScore = 0;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Functions
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkWin();
}

function updateCell(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

function checkWin() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        status.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        updateScore();
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        status.textContent = 'Game ended in a draw!';
        gameActive = false;
        return;
    }

    changePlayer();
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
    
    if (currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

function updateScore() {
    if (currentPlayer === 'X') {
        playerScore++;
        playerScoreElement.textContent = playerScore;
    } else {
        aiScore++;
        aiScoreElement.textContent = aiScore;
    }
}

function aiMove() {
    const bestMove = findBestMove();
    const cell = cells[bestMove];
    
    updateCell(cell, bestMove);
    checkWin();
}

function findBestMove() {
    // Check for winning move
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            if (checkWinningMove('O')) {
                gameState[i] = '';
                return i;
            }
            gameState[i] = '';
        }
    }

    // Check for blocking player's winning move
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'X';
            if (checkWinningMove('X')) {
                gameState[i] = '';
                return i;
            }
            gameState[i] = '';
        }
    }

    // Take center if available
    if (gameState[4] === '') {
        return 4;
    }

    // Take corners if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => gameState[i] === '');
    if (availableEdges.length > 0) {
        return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    // If we get here, there are no moves available (shouldn't happen)
    return -1;
}

function checkWinningMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === player && gameState[b] === player && gameState[c] === player) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
    });
    status.textContent = `Player ${currentPlayer}'s turn`;
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    board = document.getElementById('board');
    cells = document.querySelectorAll('.cell');
    status = document.getElementById('status');
    resetBtn = document.getElementById('resetBtn');
    playerScoreElement = document.getElementById('playerScore');
    aiScoreElement = document.getElementById('aiScore');

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);

    status.textContent = `Player ${currentPlayer}'s turn`;
});