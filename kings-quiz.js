let allKingsData = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;

// Load the kings data from the JSON file
fetch('kings_data.json')
    .then(response => response.json())
    .then(data => {
        allKingsData = data;
        startNewGame();
    })
    .catch(error => console.error('Error loading kings data:', error));

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startNewGame() {
    shuffleArray(allKingsData);
    currentQuestions = allKingsData.slice(0, 5);
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    showQuestion();
}

function showQuestion() {
    const currentKing = currentQuestions[currentQuestionIndex];
    document.getElementById('question').textContent = `מי בת הזוג של ${currentKing.name}?`;
    
    const options = [currentKing.spouse, currentKing.wrong1, currentKing.wrong2];
    shuffleArray(options);
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('feedback').textContent = '';
    timeLeft = 15;
    document.getElementById('timer').textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function checkAnswer(selectedAnswer) {
    clearInterval(timerInterval);
    const currentKing = currentQuestions[currentQuestionIndex];
    const feedbackElement = document.getElementById('feedback');
    
    if (selectedAnswer === currentKing.spouse) {
        score += 5;
        feedbackElement.textContent = 'נכון! כל הכבוד!';
        feedbackElement.className = 'correct';
    } else {
        score = Math.max(0, score - 2);
        feedbackElement.textContent = `טעות. התשובה הנכונה היא: ${currentKing.spouse}`;
        feedbackElement.className = 'incorrect';
    }
    
    document.getElementById('score').textContent = score;
    
    document.querySelectorAll('#options button').forEach(button => button.disabled = true);
    
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            showQuestion();
        } else {
            endGame();
        }
    }, 2000);
}

function updateTimer() {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 0) {
        checkAnswer(null);
    }
}

function endGame() {
    document.getElementById('question').textContent = 'המשחק הסתיים!';
    document.getElementById('options').innerHTML = '';
    document.getElementById('feedback').textContent = `הניקוד הסופי שלך: ${score}`;
    const restartButton = document.createElement('button');
    restartButton.textContent = 'שחק שוב';
    restartButton.onclick = startNewGame;
    document.getElementById('options').appendChild(restartButton);
}
