let questions = [];
let currentQuestion = 0;
let score = 0;
let conversation = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('predefined-questions').addEventListener('click', startGameWithPredefinedQuestions);
    document.getElementById('custom-questions').addEventListener('click', showCustomQuestionsForm);
    document.getElementById('submit-custom-questions').addEventListener('click', startGameWithCustomQuestions);
    document.getElementById('question-card').addEventListener('click', flipCard);
    document.getElementById('correct').addEventListener('click', () => updateScore(1));
    document.getElementById('half-correct').addEventListener('click', () => updateScore(0.5));
    document.getElementById('incorrect').addEventListener('click', () => updateScore(0));
    document.getElementById('play-again').addEventListener('click', resetGame);
    document.getElementById('show-conversation').addEventListener('click', showConversation);
    document.getElementById('background-image-input').addEventListener('change', handleBackgroundUpload);
    document.getElementById('reset-background').addEventListener('click', resetBackground);

    loadConversation();
    loadSavedBackground();
});

function startGameWithPredefinedQuestions() {
    fetch('twenty-questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            startGame();
        })
        .catch(error => console.error('Error loading predefined questions:', error));
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
    
    // Hide background upload and show conversation controls
    document.getElementById('background-upload').style.display = 'none';
    document.getElementById('show-conversation').style.display = 'none';
    
    // Hide conversation if it's currently shown
    document.getElementById('conversation').style.display = 'none';
    
    currentQuestion = 0;
    score = 0;
    updateQuestionCounter();
    showQuestion();
}

function updateQuestionCounter() {
    const counter = document.getElementById('current-question');
    if (counter) {
        counter.textContent = currentQuestion + 1;
    }
}

function showQuestion() {
    if (currentQuestion < questions.length) {
        const questionElement = document.getElementById('question');
        const answerElement = document.getElementById('answer');
        const scoreButtons = document.getElementById('score-buttons');
        const hr = document.querySelector('#question-card hr');

        if (questionElement && answerElement && scoreButtons && hr) {
            questionElement.textContent = questions[currentQuestion].question;
            answerElement.textContent = questions[currentQuestion].answer;
            answerElement.style.display = 'none';
            hr.style.display = 'none';
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
    const hr = document.querySelector('#question-card hr');
    
    if (answerElement && scoreButtons && hr) {
        if (answerElement.style.display === 'none') {
            answerElement.style.display = 'block';
            hr.style.display = 'block';
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
    updateQuestionCounter();
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

        // הכפתורים נשארים מוסתרים בסוף המשחק
        document.getElementById('background-upload').style.display = 'none';
        document.getElementById('show-conversation').style.display = 'none';
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

        // מציג את הכפתורים רק כאשר לוחצים על "שחק שוב"
        document.getElementById('background-upload').style.display = 'block';
        document.getElementById('show-conversation').style.display = 'inline-block';
    } else {
        console.error('חלק מהאלמנטים הנדרשים לאיפוס המשחק חסרים ב-DOM');
    }
}


function loadConversation() {
    fetch('twenty-questions-conversation.json')
        .then(response => response.json())
        .then(data => {
            conversation = data.conversation;
        })
        .catch(error => console.error('Error loading conversation:', error));
}

function showConversation() {
    const conversationElement = document.getElementById('conversation');
    if (conversationElement) {
        if (conversationElement.style.display === 'none') {
            let conversationHTML = '<h3>השיחה שהובילה ליצירת המשחק:</h3>';
            conversation.forEach(message => {
                conversationHTML += `<p><strong>${message.role}:</strong> ${message.content}</p>`;
            });
            conversationElement.innerHTML = conversationHTML;
            conversationElement.style.display = 'block';
        } else {
            conversationElement.style.display = 'none';
        }
    } else {
        console.error('אלמנט השיחה חסר ב-DOM');
    }
}

function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('background-container').style.backgroundImage = `url(${e.target.result})`;
            localStorage.setItem('backgroundImage', e.target.result);
        }
        reader.readAsDataURL(file);
    } else {
        alert('אנא בחר קובץ תמונה תקין.');
    }
}

function resetBackground() {
    document.getElementById('background-container').style.backgroundImage = 'none';
    localStorage.removeItem('backgroundImage');
    document.getElementById('background-image-input').value = '';
}

function loadSavedBackground() {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        document.getElementById('background-container').style.backgroundImage = `url(${savedBackground})`;
    }
}
