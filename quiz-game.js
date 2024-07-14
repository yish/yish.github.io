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
    const showConversationButton = document.getElementById('show-conversation');
    const conversationModal = document.getElementById('conversation-modal');
    const closeModal = document.querySelector('.close');

    startButton.addEventListener('click', startGame);
    backgroundUpload.addEventListener('change', handleBackgroundUpload);
    questionsUpload.addEventListener('change', handleQuestionsUpload);
    playAgainButton.addEventListener('click', resetGame);
    continueButton.addEventListener('click', hideFeedbackAndQuestion);
    showConversationButton.addEventListener('click', showConversation);
    closeModal.addEventListener('click', () => {
        conversationModal.style.display = 'none';
    });

    // טען את תמונת הרקע כברירת מחדל
    document.body.style.backgroundImage = 'url("quiz-background.jpg")';

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
    document.getElementById('game-screen').style.display = 'flex';
    
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

    if (currentQuestion.correctAnswer === -2) {
        // שאלה פתוחה
        const showAnswerButton = document.createElement('button');
        showAnswerButton.textContent = 'הצג תשובה';
        showAnswerButton.classList.add('show-answer-button');
        showAnswerButton.addEventListener('click', () => showOpenAnswer(currentQuestion.answers[0]));
        answerOptions.appendChild(showAnswerButton);
    } else if (currentQuestion.answers.length === 0) {
        // שאלת נכון/לא נכון
        const trueButton = createAnswerButton('נכון', () => checkAnswer(1));
        const falseButton = createAnswerButton('לא נכון', () => checkAnswer(-1));
        answerOptions.appendChild(trueButton);
        answerOptions.appendChild(falseButton);
    } else {
        // שאלה רגילה עם מספר אפשרויות
        currentQuestion.answers.forEach((answer, index) => {
            if (answer.trim() !== '') {
                const button = createAnswerButton(answer, () => checkAnswer(index + 1));
                answerOptions.appendChild(button);
            }
        });

        if (currentQuestion.correctAnswer === 0) {
            const allButton = createAnswerButton('כולן', () => checkAnswer(0));
            answerOptions.appendChild(allButton);
        }
        if (currentQuestion.correctAnswer === -1) {
            const noneButton = createAnswerButton('אף אחת', () => checkAnswer(-1));
            answerOptions.appendChild(noneButton);
        }
    }

    questionCard.style.display = 'block';
}

function showOpenAnswer(answer) {
    const answerOptions = document.getElementById('answer-options');
    answerOptions.innerHTML = '';

    const answerText = document.createElement('p');
    answerText.textContent = `התשובה: ${answer}`;
    answerOptions.appendChild(answerText);

    const correctButton = createAnswerButton('נכון', () => checkOpenAnswer(1));
    const partiallyCorrectButton = createAnswerButton('בערך', () => checkOpenAnswer(0.5));
    const incorrectButton = createAnswerButton('לא נכון', () => checkOpenAnswer(0));

    answerOptions.appendChild(correctButton);
    answerOptions.appendChild(partiallyCorrectButton);
    answerOptions.appendChild(incorrectButton);
}

function checkOpenAnswer(points) {
    score += points;
    questionsAnswered++;

    showFeedback(points > 0);
    updateScore();

    if (questionsAnswered === gameData.questions.length) {
        setTimeout(endGame, 2000);
    } else {
        document.getElementById('continue-button').style.display = 'block';
    }
}

function createAnswerButton(text, onClick) {
    const button = document.createElement('button');
    button.classList.add('answer-option');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function checkAnswer(answer) {
    const isCorrect = answer === currentQuestion.correctAnswer;

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
    if (!isCorrect && currentQuestion.correctAnswer !== -2) {
        feedback.textContent += ' התשובה הנכונה היא: ' + getCorrectAnswerText();
    }
    feedback.className = isCorrect ? 'correct' : 'incorrect';
    feedback.style.display = 'block';
}

function getCorrectAnswerText() {
    if (currentQuestion.answers.length === 0) {
        return currentQuestion.correctAnswer === 1 ? 'נכון' : 'לא נכון';
    } else if (currentQuestion.correctAnswer === 0) {
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
    document.querySelector(`.grid-item:nth-child(${currentQuestion.id === 21 ? 21 : currentQuestion.id})`).style.visibility = 'hidden';
}

function endGame() {
    const gameEnd = document.getElementById('game-end');
    const endMessage = document.getElementById('end-message');
    gameEnd.style.display = 'block';
    document.getElementById('question-card').style.display = 'none';
    
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

function showConversation() {
    fetch('quiz-game-conversation.json')
        .then(response => response.json())
        .then(data => {
            const conversationContent = document.getElementById('conversation-content');
            conversationContent.innerHTML = '';
            data.conversation.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = `message ${message.sender.toLowerCase()}`;
                messageElement.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
                conversationContent.appendChild(messageElement);
            });
            document.getElementById('conversation-modal').style.display = 'block';
        })
        .catch(error => {
            console.error('שגיאה בטעינת השיחה:', error);
        });
}

function resetGame() {
    score = 0;
    questionsAnswered = 0;
    document.getElementById('game-end').style.display = 'none';
    document.getElementById('question-card').style.display = 'none';
    updateScore();
    startGame();
}
