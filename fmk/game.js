let gameData;
let currentQuestionIndex = 0;
let score = 0;

function loadGame() {
    fetch('game-data.json')
        .then(response => response.json())
        .then(data => {
            gameData = data;
            initializeGame();
        })
        .catch(error => console.error('Error loading game data:', error));
}

function initializeGame() {
    document.getElementById('game-title').textContent = gameData.gameName;
    document.getElementById('game-description').textContent = gameData.gameDescription;
    document.body.style.backgroundImage = `url(${gameData.backgroundImage})`;
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= gameData.questions.length) {
        endGame();
        return;
    }

    const question = gameData.questions[currentQuestionIndex];
    document.getElementById('question-image').src = question.image;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });

    document.getElementById('result-container').style.display = 'none';
}

function checkAnswer(selectedOption) {
    const question = gameData.questions[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    
    if (isCorrect) {
        score++;
        document.getElementById('score-value').textContent = score;
    }

    const resultText = isCorrect ? 'תשובה נכונה!' : 'תשובה שגויה.';
    document.getElementById('result-text').textContent = resultText;
    document.getElementById('explanation').textContent = question.explanation;
    document.getElementById('result-container').style.display = 'block';

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 3000);
}

function endGame() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('end-game-container').style.display = 'block';
}

document.getElementById('play-again').onclick = () => {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score-value').textContent = '0';
    document.getElementById('end-game-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    showQuestion();
};

document.getElementById('exit-game').onclick = () => {
    window.location.href = gameData.exitUrl;
};

window.onload = loadGame;
