let gameData = null;
let currentQuestion = null;
let score = 0;
let questionsAnswered = 0;

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const backgroundUpload = document.getElementById('background-upload');
    const questionsUpload = document.getElementById('questions-upload');

    startButton.addEventListener('click', startGame);
    backgroundUpload.addEventListener('change', handleBackgroundUpload);
    questionsUpload.addEventListener('change', handleQuestionsUpload);

    // טען את הנתונים מקובץ JSON מקומי אם לא הועלה קובץ
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
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
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
            answers
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
    grid.innerHTML = ''; // נקה את הגריד לפני הוספת כפתורים חדשים
    for (let i = 1; i <= 21; i++) {
        const button = document.createElement('button');
        button.classList.add('grid-item');
        button.textContent = i === 21 ? '*' : i;
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

    questionText.textContent = currentQuestion.question;
    answerOptions.innerHTML = '';

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.classList.add('answer-option');
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(index));
        answerOptions.appendChild(button);
    });

    const allButton = document.createElement('button');
    allButton.classList.add('answer-option');
    allButton.textContent = 'כולן';
    allButton.addEventListener('click', () => checkAnswer(currentQuestion.answers.length));
    answerOptions.appendChild(allButton);

    const noneButton = document.createElement('button');
    noneButton.classList.add('answer-option');
    noneButton.textContent = 'אף אחת';
    noneButton.addEventListener('click', () => checkAnswer(currentQuestion.answers.length + 1));
    answerOptions.appendChild(noneButton);

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

    setTimeout(() => {
        hideFeedbackAndQuestion();
    }, 2000);
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = isCorrect ? 'תשובה נכונה!' : 'תשובה שגויה';
    feedback.className = isCorrect ? 'correct' : 'incorrect';
    feedback.style.display = 'block';
}

function updateScore() {
    document.getElementById('correct-answers').textContent = score;
    document.getElementById('total-questions').textContent = questionsAnswered;
}

function hideFeedbackAndQuestion() {
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('question-card').style.display = 'none';
    document.querySelector(`.grid-item:nth-child(${currentQuestion.id})`).style.visibility = 'hidden';
}
