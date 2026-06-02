document.addEventListener("DOMContentLoaded", () => {
    const jsonUrl = "data.json";

    // Select DOM nodes
    const mainTitle = document.getElementById("main-title");
    const eventDate = document.getElementById("event-date");
    const mainZoomBtn = document.getElementById("main-zoom-btn");
    const speakerName = document.getElementById("speaker-name");
    const speakerInst = document.getElementById("speaker-inst");
    const speakerBio = document.getElementById("speaker-bio");
    const timelineContainer = document.getElementById("timeline-container");
    const workshopsContainer = document.getElementById("workshops-container");
    const groupsTableBody = document.getElementById("groups-table-body");

    // Modal elements
    const registerModal = document.getElementById("register-modal");
    const openRegisterBtn = document.getElementById("open-register-btn");
    const closeRegisterBtn = document.getElementById("close-register-btn");
    const regIframe = document.getElementById("registration-iframe");

    // Fetch configuration payload
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load event dataset.");
            }
            return response.json();
        })
        .then(data => {
            populateUI(data);
        })
        .catch(error => {
            console.error("Initialization Error:", error);
            mainTitle.textContent = "שגיאה בטעינת הפרטים. אנא נסה שנית מאוחר יותר.";
        });

    function populateUI(data) {
        // App Identity Setup
        mainTitle.textContent = data.eventTitle;
        eventDate.textContent = `תאריך האירוע: ${data.eventDate}`;
        mainZoomBtn.href = data.mainPlenaryZoom;
        regIframe.src = data.registrationLink;

        // Populate Keynote Details
        speakerName.textContent = data.keynote.speaker;
        speakerInst.textContent = data.keynote.institution;
        speakerBio.textContent = data.keynote.bio;

        // Render Timeline Schedule
        timelineContainer.innerHTML = data.schedule.map(item => `
            <li class="timeline-item">
                <div class="time-badge">${item.time}</div>
                <div class="activity-text">${item.activity}</div>
            </li>
        `).join('');

        // Render Workshop Modules
        workshopsContainer.innerHTML = data.workshops.map(shop => `
            <div class="workshop-block">
                <div>
                    <h3>${shop.title}</h3>
                    <div class="workshop-host">מנחה: ${shop.host}</div>
                    <p class="workshop-desc">${shop.summary}</p>
                </div>
                <a href="${shop.zoom}" target="_blank" class="btn btn-secondary style="font-size:0.85rem; padding:0.5rem 1rem;">התחברות לזום הסדנה</a>
            </div>
        `).join('');

        // Render Reflection Practice Groups
        groupsTableBody.innerHTML = data.groups.map(group => `
            <tr>
                <td><strong>${group.host}</strong></td>
                <td>${group.name} <br> <small style="color:var(--text-muted)">${group.notes}</small></td>
                <td>
                    <a href="${group.zoom}" target="_blank" class="table-link">הצטרפות לחדר &larr;</a>
                </td>
            </tr>
        `).join('');
    }

    // Modal Control System
    openRegisterBtn.addEventListener("click", () => {
        registerModal.classList.add("active");
    });

    closeRegisterBtn.addEventListener("click", () => {
        registerModal.classList.remove("active");
    });

    // Close on outside window click
    window.addEventListener("click", (e) => {
        if (e.target === registerModal) {
            registerModal.classList.remove("active");
        }
    });
});
