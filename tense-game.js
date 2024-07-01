let sentences = [];
let currentSentence = 0;
let score = 0;
let timer;
let currentRound = 1;
const totalRounds = 5;

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const sentence1El = document.getElementById('sentence1');
const sentence2El = document.getElementById('sentence2');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const explanationEl = document.getElementById('explanation');
const roundInfoEl = document.getElementById('round-info');
const choice1Btn = document.getElementById('choice1');
const choice2Btn = document.getElementById('choice2');
const playAgainBtn = document.getElementById('play-again');
const startGameBtn = document.getElementById('start-game');

function loadSentences() {
    fetch('tense-game.json')
        .then(response => response.json())
        .then(data => {
            sentences = data;
            startScreen.style.display = 'block';
            gameScreen.style.display = 'none';
        })
        .catch(error => console.error('Error loading sentences:', error));
}

function startGame() {
    currentSentence = 0;
    score = 0;
    currentRound = 1;
    scoreEl.textContent = `Score: ${score}`;
    roundInfoEl.textContent = `Round: ${currentRound} / ${totalRounds}`;
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    playAgainBtn.style.display = 'none';
    displaySentences();
}

function displaySentences() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const sentence = sentences[randomIndex];
    const isFirstCorrect = Math.random() < 0.5;
    sentence1El.textContent = isFirstCorrect ? sentence.correct : sentence.incorrect;
    sentence2El.textContent = isFirstCorrect ? sentence.incorrect : sentence.correct;
    explanationEl.className = '';
    explanationEl.textContent = '';
    startTimer();
}

function startTimer() {
    let timeLeft = 15;
    timerEl.textContent = `Time: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            checkAnswer('timeout');
        }
    }, 1000);
}

function checkAnswer(choice) {
    clearInterval(timer);
    const sentence = sentences.find(s => s.correct === sentence1El.textContent || s.correct === sentence2El.textContent);
    const isCorrect = (choice === 'choice1' && sentence1El.textContent === sentence.correct) ||
                      (choice === 'choice2' && sentence2El.textContent === sentence.correct);
    
    if (isCorrect) {
        score += 5;
        explanationEl.className = 'correct-feedback';
        explanationEl.textContent = "Correct! " + sentence.explanation;
    } else {
        score = Math.max(0, score - 3);
        explanationEl.className = 'incorrect-feedback';
        explanationEl.textContent = "Incorrect. " + sentence.explanation;
    }
    scoreEl.textContent = `Score: ${score}`;
    currentRound++;
    
    if (currentRound <= totalRounds) {
        roundInfoEl.textContent = `Round: ${currentRound} / ${totalRounds}`;
        setTimeout(displaySentences, 3000);
    } else {
        endGame();
    }
}

function endGame() {
    sentence1El.textContent = "Game Over!";
    sentence2El.textContent = `Final Score: ${score}`;
    gameScreen.style.display = 'none';
    playAgainBtn.style.display = 'block';
}

choice1Btn.addEventListener('click', () => checkAnswer('choice1'));
choice2Btn.addEventListener('click', () => checkAnswer('choice2'));
playAgainBtn.addEventListener('click', startGame);
startGameBtn.addEventListener('click', startGame);

loadSentences();

function loadTranscript() {
    fetch('tense-game-transcript.json')
        .then(response => response.json())
        .then(data => {
            renderTranscript(data);
        })
        .catch(error => {
            console.error('Error loading transcript:', error);
            document.getElementById('transcript').textContent = 'Error loading transcript.';
        });
}

function renderTranscript(transcript) {
    const transcriptEl = document.getElementById('transcript');
    transcriptEl.innerHTML = ''; // Clear any loading message
    transcript.forEach(entry => {
        const messageEl = document.createElement('div');
        messageEl.className = entry.role;
        messageEl.textContent = entry.content;
        transcriptEl.appendChild(messageEl);
    });
}

loadTranscript();
