let gameData = null;
let currentQuestion = null;
let score = 0;
let questionsAnswered = 0;

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const backgroundUpload = document.getElementById('background-upload');
    const questionsUpload = document.getElementById('questions-upload');
    const playAgainButton = document.getElementById('play-again');
    const continueButton = document.getElementById('continue-button');

    startButton.addEventListener('click', startGame);
    backgroundUpload.addEventListener('change', handleBackgroundUpload);
    questionsUpload.addEventListener('change', handleQuestionsUpload);
    playAgainButton.addEventListener('click', resetGame);
    continueButton.addEventListener('click', hideFeedbackAndQuestion);

    if (!gameData) {
        loadDefaultGameData();
    }
});

function loadDefaultGameData() {
    fetch('quiz-game.json')
        .then(response => response.json())
        .then(data => {
            gameData = data;
            console.log('נטענו נתוני ברירת מחדל');
        })
        .catch(error => {
            console.error('שגיאה בטעינת נתוני ברירת המחדל:', error);
        });
}

function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}

function handleQuestionsUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (file.name.endsWith('.csv')) {
                gameData = parseCSV(e.target.result);
            } else if (file.name.endsWith('.json')) {
                gameData = JSON.parse(e.target.result);
            }
            console.log('נטענו נתונים מקובץ שהועלה');
        };
        reader.readAsText(file);
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const questions = lines.map(line => {
        const [id, correctAnswer, question, ...answers] = line.split(',');
        return {
            id: parseInt(id),
            correctAnswer: parseInt(correctAnswer),
            question,
            answers: answers.filter(answer => answer.trim() !== '')
        };
    });
    return { questions };
}

function startGame() {
    if (!gameData) {
        alert('מחכה לטעינת נתוני המשחק. נסה שוב בעוד רגע.');
        return;
    }
    
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    const grid = document.getElementById('question-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= 21; i++) {
        const button = document.createElement('button');
        button.classList.add('grid-item');
        if (i === 21) {
            button.textContent = '*';
            button.classList.add('star');
        } else {
            button.textContent = i;
        }
        button.addEventListener('click', () => showQuestion(i));
        grid.appendChild(button);
    }
}

function showQuestion(id) {
    currentQuestion = gameData.questions.find(q => q.id === id);
    if (!currentQuestion) return;

    const questionCard = document.getElementById('question-card');
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const feedback = document.getElementById('feedback');

    questionText.textContent = currentQuestion.question;
    answerOptions.innerHTML = '';
    feedback.style.display = 'none';

    currentQuestion.answers.forEach((answer, index) => {
        if (answer.trim() !== '') {
            const button = document.createElement('button');
            button.classList.add('answer-option');
            button.textContent = answer;
            button.addEventListener('click', () => checkAnswer(index));
            answerOptions.appendChild(button);
        }
    });

    if (currentQuestion.correctAnswer === 0 || currentQuestion.answers.some(answer => answer.trim() === '')) {
        const allButton = document.createElement('button');
        allButton.classList.add('answer-option');
        allButton.textContent = 'כולן';
        allButton.addEventListener('click', () => checkAnswer(currentQuestion.answers.length));
        answerOptions.appendChild(allButton);
    }

    if (currentQuestion.correctAnswer === -1 || currentQuestion.answers.some(answer => answer.trim() === '')) {
        const noneButton = document.createElement('button');
        noneButton.classList.add('answer-option');
        noneButton.textContent = 'אף אחת';
        noneButton.addEventListener('click', () => checkAnswer(currentQuestion.answers.length + 1));
        answerOptions.appendChild(noneButton);
    }

    questionCard.style.display = 'block';
}

function checkAnswer(answerIndex) {
    const isCorrect = (
        (currentQuestion.correctAnswer === 0 && answerIndex === currentQuestion.answers.length) ||
        (currentQuestion.correctAnswer === -1 && answerIndex === currentQuestion.answers.length + 1) ||
        (currentQuestion.correctAnswer === answerIndex + 1)
    );

    if (isCorrect) {
        score++;
    }
    questionsAnswered++;

    showFeedback(isCorrect);
    updateScore();

    if (questionsAnswered === gameData.questions.length) {
        setTimeout(endGame, 2000);
    } else {
        document.getElementById('continue-button').style.display = 'block';
    }
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = isCorrect ? 'תשובה נכונה!' : 'תשובה שגויה';
    if (!isCorrect) {
        feedback.textContent += ' התשובה הנכונה היא: ' + getCorrectAnswerText();
    }
    feedback.className = isCorrect ? 'correct' : 'incorrect';
    feedback.style.display = 'block';
}

function getCorrectAnswerText() {
    if (currentQuestion.correctAnswer === 0) {
        return 'כולן';
    } else if (currentQuestion.correctAnswer === -1) {
        return 'אף אחת';
    } else {
        return currentQuestion.answers[currentQuestion.correctAnswer - 1];
    }
}

function updateScore() {
    document.getElementById('correct-answers').textContent = score;
    document.getElementById('total-questions').textContent = questionsAnswered;
}

function hideFeedbackAndQuestion() {
    document.getElementById('question-card').style.display = 'none';
    document.getElementById('continue-button').style.display = 'none';
    document.querySelector(`.grid-item:nth-child(${currentQuestion.id})`).style.visibility = 'hidden';
}

function endGame() {
    const gameEnd = document.getElementById('game-end');
    const endMessage = document.getElementById('end-message');
    gameEnd.style.display = 'block';
    
    const percentage = (score / gameData.questions.length) * 100;
    let message = `סיימת את המשחק עם ${score} תשובות נכונות מתוך ${gameData.questions.length}!`;
    
    if (percentage === 100) {
        message += ' מדהים! השגת ציון מושלם!';
    } else if (percentage >= 80) {
        message += ' כל הכבוד! תוצאה מצוינת!';
    } else if (percentage >= 60) {
        message += ' עבודה טובה! יש מקום לשיפור.';
    } else {
        message += ' אל תתייאש, נסה שוב ותשתפר!';
    }
    
    endMessage.textContent = message;
}

function resetGame() {
    score = 0;
    questionsAnswered = 0;
    document.getElementById('game-end').style.display = 'none';
    document.getElementById('question-card').style.display = 'none';
    updateScore();
    startGame();
}
