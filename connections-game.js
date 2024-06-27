let words = [];
let groups = [];
let selectedWords = [];
let solvedGroups = 0;

function loadGameData() {
    fetch('game-resources.json')
        .then(response => response.json())
        .then(data => {
            const randomSet = selectRandomSet(data.sets);
            words = randomSet.words;
            groups = randomSet.groups;
            createGrid();
        })
        .catch(error => console.error('Error loading game data:', error));
}

function selectRandomSet(sets) {
    const randomIndex = Math.floor(Math.random() * sets.length);
    return sets[randomIndex];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear existing grid
    shuffleArray(words);
    words.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word';
        div.textContent = word;
        div.addEventListener('click', () => toggleWord(div));
        grid.appendChild(div);
    });
}

function toggleWord(div) {
    if (div.classList.contains('correct')) return;
    
    div.classList.toggle('selected');
    const word = div.textContent;
    
    if (selectedWords.includes(word)) {
        selectedWords = selectedWords.filter(w => w !== word);
    } else {
        selectedWords.push(word);
    }
}

function checkSelection() {
    if (selectedWords.length !== 4) {
        setMessage("Please select exactly 4 words.");
        return;
    }

    for (const group of groups) {
        if (group.every(word => selectedWords.includes(word))) {
            markCorrect(group);
            solvedGroups++;
            if (solvedGroups === 4) {
                setMessage("Congratulations! You've solved all groups!");
                document.getElementById('submit').textContent = 'Play Again';
                document.getElementById('submit').removeEventListener('click', checkSelection);
                document.getElementById('submit').addEventListener('click', resetGame);
            } else {
                setMessage("Correct! Keep going!");
            }
            return;
        }
    }

    setMessage("Incorrect. Try again!");
    selectedWords.forEach(word => {
        const div = Array.from(document.querySelectorAll('.word'))
            .find(el => el.textContent === word);
        div.classList.remove('selected');
    });
    selectedWords = [];
}

function markCorrect(group) {
    group.forEach(word => {
        const div = Array.from(document.querySelectorAll('.word'))
            .find(el => el.textContent === word);
        div.classList.remove('selected');
        div.classList.add('correct');
    });
    selectedWords = [];
}

function setMessage(msg) {
    document.getElementById('message').textContent = msg;
}

function resetGame() {
    words = [];
    groups = [];
    selectedWords = [];
    solvedGroups = 0;
    setMessage('');
    document.getElementById('submit').textContent = 'Submit Selection';
    document.getElementById('submit').removeEventListener('click', resetGame);
    document.getElementById('submit').addEventListener('click', checkSelection);
    loadGameData();
}

document.getElementById('submit').addEventListener('click', checkSelection);

// Load game data when the script runs
loadGameData();
