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
        const questionCard = document.getElementById('question-card');
        questionCard.innerHTML = `<div id="question">${questions[currentQuestion].question}</div>`;
        document.getElementById('answer').style.display = 'none';
        document.getElementById('score-buttons').style.display = 'none';
    } else {
        endGame();
    }
}

function flipCard() {
    const answer = document.getElementById('answer');
    if (answer.style.display === 'none') {
        answer.textContent = questions[currentQuestion].answer;
        answer.style.display = 'block';
        document.getElementById('score-buttons').style.display = 'block';
    }
}

function updateScore(points) {
    score += points;
    document.getElementById('score-value').textContent = score;
    currentQuestion++;
    showQuestion();
}

function endGame() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    
    let encouragement;
    if (score === 20) {
        encouragement = "מושלם! ציון מדהים!";
    } else if (score >= 15) {
        encouragement = "כל הכבוד! תוצאה מצוינת!";
    } else if (score >= 10) {
        encouragement = "לא רע! יש מקום לשיפור.";
    } else {
        encouragement = "המשך להתאמן, בפעם הבאה תצליח יותר!";
    }
    document.getElementById('encouragement').textContent = encouragement;
}

function resetGame() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('score-value').textContent = '0';
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}
