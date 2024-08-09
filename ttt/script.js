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
        }
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
