// This script runs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Where to put the lectures
    const container = document.getElementById('lecture-container');

    // 2. Fetch the data from the JSON file
    fetch('lectures.json')
        .then(response => {
            // Check if fetching was successful
            if (!response.ok) {
                throw new Error('Could not fetch lecture data');
            }
            // Parse the response as JSON
            return response.json();
        })
        .then(data => {
            // 3. Clear the loading message
            container.innerHTML = '';

            // 4. Loop through each lecture in the data array
            data.forEach(lecture => {
                // 5. Create elements for each lecture
                const card = document.createElement('div');
                card.className = 'lecture-card';

                const title = document.createElement('h2');
                title.className = 'lecture-title';
                title.textContent = lecture.title;

                const description = document.createElement('p');
                description.className = 'lecture-description';
                description.textContent = lecture.description;

                // Format the date nicely
                const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                const date = new Date(lecture.date);
                const dateString = date.toLocaleDateString('en-US', dateOptions);

                const dateDisplay = document.createElement('p');
                dateDisplay.className = 'lecture-date';
                dateDisplay.textContent = `Scheduled for: ${dateString}`;

                // 6. Put everything together (Assemble the card)
                card.appendChild(title);
                card.appendChild(description);
                card.appendChild(dateDisplay);

                // 7. Add the completed card to the page
                container.appendChild(card);
            });
        })
        .catch(error => {
            // Handle any errors that occurred during fetching or parsing
            console.error('Error loading lectures:', error);
            container.innerHTML = '<p>Error loading lecture schedule. Please try again later.</p>';
        });
});