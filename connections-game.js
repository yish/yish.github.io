let words = [];
let groups = [];
let selectedWords = [];
let solvedGroups = [];
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#66AB8C']; // Different colors for each solved group

function loadGameData() {
    fetch('game-resources.json')
        .then(response => response.json())
        .then(data => {
            const randomSet = selectRandomSet(data.sets);
            groups = randomSet.groups;
            words = groups.flat();
            shuffleArray(words);
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
    words.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word';
        div.textContent = word;
        div.addEventListener('click', () => toggleWord(div));
        grid.appendChild(div);
    });
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
    const solvedGroupsDiv = document.getElementById('solved-groups');
    const groupDiv = document.createElement('div');
    groupDiv.className = 'solved-group';
    groupDiv.style.backgroundColor = colors[solvedGroups.length - 1];
    
    group.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'solved-word';
        wordDiv.textContent = word;
        groupDiv.appendChild(wordDiv);
    });
    
    solvedGroupsDiv.appendChild(groupDiv);
    selectedWords = [];
}

function updateGrid() {
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
}

function setMessage(msg) {
    document.getElementById('message').textContent = msg;
}

function resetGame() {
    words = [];
    groups = [];
    selectedWords = [];
    solvedGroups = [];
    setMessage('');
    document.getElementById('submit').textContent = 'Submit Selection';
    document.getElementById('submit').removeEventListener('click', resetGame);
    document.getElementById('submit').addEventListener('click', checkSelection);
    document.getElementById('solved-groups').innerHTML = '';
    loadGameData();
}

document.getElementById('submit').addEventListener('click', checkSelection);

// Load game data when the script runs
loadGameData();
