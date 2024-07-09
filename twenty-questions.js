let questions = [];
let currentQuestion = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('predefined-questions').addEventListener('click', startGameWithPredefinedQuestions);
    document.getElementById('custom-questions').addEventListener('click', showCustomQuestionsForm);
    document.getElementById('submit-custom-questions').addEventListener('click', startGameWithCustomQuestions);
    document.getElementById('question-card').addEventListener('click', flipCard);
    document.getElementById('correct').addEventListener('click', () => updateScore(1));
    document.getElementById('half-correct').addEventListener('click', () => updateScore(0.5));
    document.getElementById('incorrect').addEventListener('click', () => updateScore(0));
    document.getElementById('play-again').addEventListener('click', resetGame);
});

function startGameWithPredefinedQuestions() {
    fetch('twenty-questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            startGame();
        });
}

function showCustomQuestionsForm() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('custom-questions-form').style.display = 'block';
}

function startGameWithCustomQuestions() {
    const input = document.getElementById('questions-input').value;
    questions = input.split('\n').map(line => {
        const [question, answer] = line.split(',');
        return { question, answer };
    });
    startGame();
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('custom-questions-form').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    if (currentQuestion < questions.length) {
        const questionElement = document.getElementById('question');
        const answerElement = document.getElementById('answer');
        const scoreButtons = document.getElementById('score-buttons');

        if (questionElement && answerElement && scoreButtons) {
            questionElement.textContent = questions[currentQuestion].question;
            answerElement.textContent = questions[currentQuestion].answer;
            answerElement.style.display = 'none';
            scoreButtons.style.display = 'none';
        } else {
            console.error('חלק מהאלמנטים הנדרשים חסרים ב-DOM');
        }
    } else {
        endGame();
    }
}

function flipCard() {
    const answerElement = document.getElementById('answer');
    const scoreButtons = document.getElementById('score-buttons');
    
    if (answerElement && scoreButtons) {
        if (answerElement.style.display === 'none') {
            answerElement.style.display = 'block';
            scoreButtons.style.display = 'block';
        }
    } else {
        console.error('אלמנט התשובה או כפתורי הניקוד חסרים ב-DOM');
    }
}

function updateScore(points) {
    score += points;
    const scoreValue = document.getElementById('score-value');
    if (scoreValue) {
        scoreValue.textContent = score;
    }
    currentQuestion++;
    showQuestion();
}

function endGame() {
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const finalScore = document.getElementById('final-score');
    const encouragement = document.getElementById('encouragement');

    if (gameScreen && endScreen && finalScore && encouragement) {
        gameScreen.style.display = 'none';
        endScreen.style.display = 'block';
        finalScore.textContent = score;
        
        let encouragementText;
        if (score === 20) {
            encouragementText = "מושלם! ציון מדהים!";
        } else if (score >= 15) {
            encouragementText = "כל הכבוד! תוצאה מצוינת!";
        } else if (score >= 10) {
            encouragementText = "לא רע! יש מקום לשיפור.";
        } else {
            encouragementText = "המשך להתאמן, בפעם הבאה תצליח יותר!";
        }
        encouragement.textContent = encouragementText;
    } else {
        console.error('חלק מהאלמנטים הנדרשים לסיום המשחק חסרים ב-DOM');
    }
}

function resetGame() {
    currentQuestion = 0;
    score = 0;
    const scoreValue = document.getElementById('score-value');
    const endScreen = document.getElementById('end-screen');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');

    if (scoreValue && endScreen && startScreen && gameScreen) {
        scoreValue.textContent = '0';
        endScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
    } else {
        console.error('חלק מהאלמנטים הנדרשים לאיפוס המשחק חסרים ב-DOM');
    }
}
