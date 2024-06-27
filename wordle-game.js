let targetWord = '';
let guesses = [];
let currentGuess = '';
let gameOver = false;

function loadDictionary() {
    fetch('wordle-dictionary.json')
        .then(response => response.json())
        .then(data => {
            const words = data.words;
            targetWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
            console.log("Target word:", targetWord);
            initializeGame();
        })
        .catch(error => console.error('Error loading dictionary:', error));
}

function initializeGame() {
    createGrid();
    createKeyboard();
}

function createGrid() {
    const grid = document.getElementById('grid');
    for (let i = 0; i < 30; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        grid.appendChild(cell);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    keys.split('').forEach(key => {
        const button = document.createElement('div');
        button.className = 'keyboard-key';
        button.textContent = key;
        button.addEventListener('click', () => handleKeyPress(key));
        keyboard.appendChild(button);
    });
    const enterKey = document.createElement('div');
    enterKey.className = 'keyboard-key';
    enterKey.textContent = 'Enter';
    enterKey.addEventListener('click', () => handleEnter());
    keyboard.appendChild(enterKey);
    const backspaceKey = document.createElement('div');
    backspaceKey.className = 'keyboard-key';
    backspaceKey.textContent = 'Backspace';
    backspaceKey.addEventListener('click', () => handleBackspace());
    keyboard.appendChild(backspaceKey);
}

function handleKeyPress(key) {
    if (gameOver || currentGuess.length >= 5) return;
    currentGuess += key;
    updateGrid();
}

function handleEnter() {
    if (gameOver || currentGuess.length !== 5) return;
    checkGuess();
    guesses.push(currentGuess);
    currentGuess = '';
    updateGrid();
    if (guesses.length === 6 || guesses[guesses.length - 1] === targetWord) {
        endGame();
    }
}

function handleBackspace() {
    if (gameOver || currentGuess.length === 0) return;
    currentGuess = currentGuess.slice(0, -1);
    updateGrid();
}

function updateGrid() {
    const cells = document.getElementsByClassName('grid-cell');
    for (let i = 0; i < 30; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        if (row < guesses.length) {
            cells[i].textContent = guesses[row][col];
        } else if (row === guesses.length) {
            cells[i].textContent = currentGuess[col] || '';
        } else {
            cells[i].textContent = '';
        }
    }
}

function checkGuess() {
    const cells = document.getElementsByClassName('grid-cell');
    const startIndex = guesses.length * 5;
    const guessArray = currentGuess.split('');
    const targetArray = targetWord.split('');
    
    for (let i = 0; i < 5; i++) {
        const cell = cells[startIndex + i];
        const keyboardKey = document.querySelector(`.keyboard-key:nth-child(${guessArray[i].charCodeAt(0) - 64})`);
        
        if (guessArray[i] === targetArray[i]) {
            cell.classList.add('correct');
            keyboardKey.classList.add('correct');
        } else if (targetArray.includes(guessArray[i])) {
            cell.classList.add('present');
            keyboardKey.classList.add('present');
        } else {
            cell.classList.add('absent');
            keyboardKey.classList.add('absent');
        }
    }
}

function endGame() {
    gameOver = true;
    const message = document.getElementById('message');
    if (guesses[guesses.length - 1] === targetWord) {
        message.textContent = 'Congratulations! You guessed the word!';
    } else {
        message.textContent = `Game over. The word was ${targetWord}.`;
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleEnter();
    } else if (event.key === 'Backspace') {
        handleBackspace();
    } else if (/^[A-Za-z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
    }
});

loadDictionary();
