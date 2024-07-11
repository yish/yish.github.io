let questions = [];
let currentQuestion = 0;
let score = 0;
let conversation = [];

document.addEventListener('DOMContentLoaded', () => {
    // ... (previous event listeners remain unchanged) ...

    // Add event listeners for background image upload
    document.getElementById('background-image-input').addEventListener('change', handleBackgroundUpload);
    document.getElementById('reset-background').addEventListener('click', resetBackground);

    // Load the conversation
    loadConversation();
});

// ... (previous functions remain unchanged) ...

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
        alert('Please select a valid image file.');
    }
}

function resetBackground() {
    document.getElementById('background-container').style.backgroundImage = 'none';
    localStorage.removeItem('backgroundImage');
    document.getElementById('background-image-input').value = '';
}

// Function to load saved background on page load
function loadSavedBackground() {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        document.getElementById('background-container').style.backgroundImage = `url(${savedBackground})`;
    }
}

// Call this function when the page loads
loadSavedBackground();
