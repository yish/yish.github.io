let targetWord = '';
let guesses = [];
let currentGuess = '';
let gameOver = false;
let currentLanguage = 'en';

const keyboards = {
    en: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    he: 'קראטוןםפשדגכעיחלךףזסבהנמצתץ',
    ar: 'ضصثقفغعهخحجدشسيبلاتنمكطئءؤرلاىةوزظ'
};

function loadDictionary(lang) {
    fetch(`wordle-dictionary-${lang}.json`)
        .then(response => response.json())
        .then(data => {
            const words = data.words;
            targetWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
            // Pad the word with spaces if it's shorter than 5 characters
            targetWord = targetWord.padEnd(5, ' ');
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
    grid.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        grid.appendChild(cell);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    const keys = keyboards[currentLanguage];
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
    if (gameOver || currentGuess.length > 5) return;
    // Pad the current guess with spaces if it's shorter than 5 characters
    const paddedGuess = currentGuess.padEnd(5, ' ');
    checkGuess(paddedGuess);
    guesses.push(paddedGuess);
    currentGuess = '';
    updateGrid();
    if (guesses.length === 6 || guesses[guesses.length - 1] === targetWord) {
        endGame();
    }
}

function checkGuess(paddedGuess) {
    const cells = document.getElementsByClassName('grid-cell');
    const startIndex = guesses.length * 5;
    const guessArray = paddedGuess.split('');
    const targetArray = targetWord.split('');
    
    for (let i = 0; i < 5; i++) {
        const cell = cells[startIndex + i];
        if (guessArray[i] !== ' ') {
            const keyboardKey = document.querySelector(`.keyboard-key:nth-child(${keyboards[currentLanguage].indexOf(guessArray[i]) + 1})`);
            
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
        } else {
            cell.classList.add('empty');
        }
    }
}

function updateGrid() {
    const cells = document.getElementsByClassName('grid-cell');
    for (let i = 0; i < 30; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        if (row < guesses.length) {
            cells[i].textContent = guesses[row][col] === ' ' ? '' : guesses[row][col];
        } else if (row === guesses.length) {
            cells[i].textContent = currentGuess[col] || '';
        } else {
            cells[i].textContent = '';
        }
    }
}
function handleBackspace() {
    if (gameOver || currentGuess.length === 0) return;
    currentGuess = currentGuess.slice(0, -1);
    updateGrid();
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

function setLanguage(lang) {
    currentLanguage = lang;
    document.body.className = lang === 'en' ? '' : 'rtl';
    resetGame();
    loadDictionary(lang);
}

function resetGame() {
    targetWord = '';
    guesses = [];
    currentGuess = '';
    gameOver = false;
    document.getElementById('message').textContent = '';
    document.getElementById('grid').innerHTML = '';
    document.getElementById('keyboard').innerHTML = '';
}

document.getElementById('en-btn').addEventListener('click', () => setLanguage('en'));
document.getElementById('he-btn').addEventListener('click', () => setLanguage('he'));
document.getElementById('ar-btn').addEventListener('click', () => setLanguage('ar'));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleEnter();
    } else if (event.key === 'Backspace') {
        handleBackspace();
    } else if (keyboards[currentLanguage].includes(event.key.toUpperCase())) {
        handleKeyPress(event.key.toUpperCase());
    }
});

// Start with English
setLanguage('en');
