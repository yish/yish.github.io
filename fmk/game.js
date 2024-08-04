let gameData;
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let canProceed = false;
let timeoutId;

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
    selectRandomQuestions();
    showQuestion();
    
    // הוספת מאזין אירועים לgame-container
    document.getElementById('game-container').addEventListener('click', handleContainerClick);
}

function selectRandomQuestions() {
    const allQuestions = [...gameData.questions];
    selectedQuestions = [];
    const numQuestions = Math.min(gameData.gameLength, allQuestions.length);
    
    for (let i = 0; i < numQuestions; i++) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        selectedQuestions.push(allQuestions.splice(randomIndex, 1)[0]);
    }
}

function showQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        endGame();
        return;
    }

    canProceed = false;
    const question = selectedQuestions[currentQuestionIndex];
    const img = document.getElementById('question-image');
    img.src = question.image;
    img.onload = adjustImageSize;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = (e) => {
            e.stopPropagation(); // מונע מהאירוע להתפשט לgame-container
            checkAnswer(option);
        };
        optionsContainer.appendChild(button);
    });

    document.getElementById('result-container').style.display = 'none';
}

function adjustImageSize() {
    const img = document.getElementById('question-image');
    const container = document.getElementById('question-container');
    const maxHeight = container.clientHeight * 0.6;
    const maxWidth = container.clientWidth * 0.9;

    if (img.naturalHeight > maxHeight || img.naturalWidth > maxWidth) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        if (maxHeight * aspectRatio > maxWidth) {
            img.style.width = `${maxWidth}px`;
            img.style.height = 'auto';
        } else {
            img.style.height = `${maxHeight}px`;
            img.style.width = 'auto';
        }
    } else {
        img.style.width = 'auto';
        img.style.height = 'auto';
    }
}

function checkAnswer(selectedOption) {
    const question = selectedQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    
    if (isCorrect) {
        score++;
        document.getElementById('score-value').textContent = score;
    }

    const resultText = isCorrect ? 'תשובה נכונה!' : 'תשובה שגויה.';
    document.getElementById('result-text').textContent = resultText;
    document.getElementById('explanation').textContent = question.explanation;
    document.getElementById('result-container').style.display = 'block';

    canProceed = true;

    const delay = calculateDelay(question.explanation);
    timeoutId = setTimeout(() => {
        proceedToNextQuestion();
    }, delay);
}

function calculateDelay(explanation) {
    const wordsCount = explanation.split(/\s+/).length;
    const baseDelay = Math.max(3000, Math.min(10000, wordsCount * 200));
    return baseDelay;
}

function handleContainerClick() {
    if (canProceed) {
        clearTimeout(timeoutId);
        proceedToNextQuestion();
    }
}

function proceedToNextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

function endGame() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('end-game-container').style.display = 'block';
    document.getElementById('final-score').textContent = `הציון הסופי שלך: ${score} מתוך ${selectedQuestions.length}`;
}

document.getElementById('play-again').onclick = () => {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score-value').textContent = '0';
    document.getElementById('end-game-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'flex';
    selectRandomQuestions();
    showQuestion();
};

document.getElementById('exit-game').onclick = () => {
    window.location.href = gameData.exitUrl;
};

window.onload = loadGame;
window.onresize = adjustImageSize;
