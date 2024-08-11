const board = document.getElementById('board');
const cells = [];
let currentPlayer = 'X';

for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => makeMove(cell, i));
    board.appendChild(cell);
    cells.push(cell);
}

function makeMove(cell, index) {
    if (cell.textContent === '') {
        cell.textContent = currentPlayer;
        if (checkWin()) {
            alert(`${currentPlayer} wins!`);
            resetBoard();
        } else if (cells.every(cell => cell.textContent !== '')) {
            alert('Draw!');
            resetBoard();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                aiMove();
            }
        }
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === '') {
            cells[i].textContent = 'O';
            let score = minimax(cells, 0, false);
            cells[i].textContent = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    cells[move].textContent = 'O';
    if (checkWin()) {
        alert('O wins!');
        resetBoard();
    } else if (cells.every(cell => cell.textContent !== '')) {
        alert('Draw!');
        resetBoard();
    } else {
        currentPlayer = 'X';
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWin()) {
        return isMaximizing ? -1 : 1;
    } else if (cells.every(cell => cell.textContent !== '')) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].textContent === '') {
                board[i].textContent = 'O';
                let score = minimax(board, depth + 1, false);
                board[i].textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].textContent === '') {
                board[i].textContent = 'X';
                let score = minimax(board, depth + 1, true);
                board[i].textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // rows
        [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // columns
        [0, 5, 10, 15], [3, 6, 9, 12] // diagonals
    ];

    return winPatterns.some(pattern => 
        pattern.every(index => cells[index].textContent === currentPlayer)
    );
}

function resetBoard() {
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
}
