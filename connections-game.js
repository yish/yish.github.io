let words = [];
let groups = [];
let selectedWords = [];
let solvedGroups = [];
let allSets = []; // Store all sets here
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#66AB8C'];

function loadGameData() {
    console.log("Loading game data...");
    fetch('game-resources.json')
        .then(response => response.json())
        .then(data => {
            console.log("Game data loaded:", data);
            allSets = data.sets; // Store all sets
            startNewGame();
        })
        .catch(error => console.error('Error loading game data:', error));
}

function startNewGame() {
    const randomSet = selectRandomSet(allSets);
    groups = randomSet.groups;
    words = groups.flat();
    shuffleArray(words);
    createGrid();
    resetGameState();
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
    console.log("Creating grid with words:", words);
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear existing grid
    words.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word';
        div.textContent = word;
        div.addEventListener('click', () => toggleWord(div));
        grid.appendChild(div);
    });
    console.log("Grid created. Number of word elements:", grid.children.length);
}

function toggleWord(div) {
    if (solvedGroups.flat().includes(div.textContent)) return;
    
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
            solvedGroups.push(group);
            markCorrect(group);
            updateGrid();
            if (solvedGroups.length === 4) {
                setMessage("Congratulations! You've solved all groups!");
                document.getElementById('submit').textContent = 'Play Again';
                document.getElementById('submit').removeEventListener('click', checkSelection);
                document.getElementById('submit').addEventListener('click', startNewGame);
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
    const solvedGroupsDiv = document.getElementById('solved-groups');
    const groupDiv = document.createElement('div');
    groupDiv.className = 'solved-group';
    
    group.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'solved-word';
        wordDiv.textContent = word;
        wordDiv.style.backgroundColor = colors[solvedGroups.length - 1];
        groupDiv.appendChild(wordDiv);
    });
    
    solvedGroupsDiv.appendChild(groupDiv);
    selectedWords = [];
}

function updateGrid() {
    console.log("Updating grid...");
    const grid = document.getElementById('grid');
    const remainingWords = words.filter(word => !solvedGroups.flat().includes(word));
    grid.innerHTML = '';
    remainingWords.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word';
        div.textContent = word;
        div.addEventListener('click', () => toggleWord(div));
        grid.appendChild(div);
    });
    console.log("Grid updated. Number of remaining words:", remainingWords.length);
}

function setMessage(msg) {
    document.getElementById('message').textContent = msg;
}

function resetGameState() {
    selectedWords = [];
    solvedGroups = [];
    setMessage('');
    document.getElementById('submit').textContent = 'Submit Selection';
    document.getElementById('submit').removeEventListener('click', startNewGame);
    document.getElementById('submit').addEventListener('click', checkSelection);
    document.getElementById('solved-groups').innerHTML = '';
}

document.getElementById('submit').addEventListener('click', checkSelection);

// Load game data when the script runs
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM fully loaded and parsed");
    loadGameData();
});
