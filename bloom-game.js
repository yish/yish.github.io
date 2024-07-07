let bloomCategories, situations, currentSituation;

// Load JSON data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        bloomCategories = data.bloomCategories;
        situations = data.situations;
        displaySituation();
    });

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displaySituation() {
    shuffleArray(situations);
    currentSituation = situations[0];
    document.getElementById('situation').textContent = currentSituation.situation;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    bloomCategories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.onclick = () => checkAnswer(category.name);
        optionsContainer.appendChild(button);
    });

    document.getElementById('feedback').textContent = '';
}

function checkAnswer(selectedCategory) {
    const feedbackElement = document.getElementById('feedback');
    if (selectedCategory === currentSituation.category) {
        feedbackElement.textContent = 'נכון מאוד! זו אכן קטגוריית ' + selectedCategory + '. ' + bloomCategories.find(cat => cat.name === selectedCategory).description;
        feedbackElement.className = 'correct';
    } else {
        feedbackElement.textContent = 'לא מדויק. הקטגוריה הנכונה היא ' + currentSituation.category + '. ' + bloomCategories.find(cat => cat.name === currentSituation.category).description;
        feedbackElement.className = 'incorrect';
    }
    
    setTimeout(displaySituation, 3000);
}
