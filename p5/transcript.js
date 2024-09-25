async function renderTranscript() {
    const response = await fetch('conversation.json');
    const data = await response.json();
    const transcript = document.getElementById('transcript');

    data.conversation.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.role);
        messageElement.textContent = `${message.role.charAt(0).toUpperCase() + message.role.slice(1)}: ${message.content}`;
        transcript.appendChild(messageElement);
    });
}

document.addEventListener('DOMContentLoaded', renderTranscript);
