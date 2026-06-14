let appData = {};
let currentSlideIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Graceful asynchronous fetch handling local asset resources safely
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            appData = data;
            initializeSite();
        })
        .catch(error => console.error('Error importing dataset structure:', error));

    // Modal Lifecycle Listeners
    const modal = document.getElementById('custom-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
});

function initializeSite() {
    // Populate Core Meta Elements
    document.getElementById('event-title').innerText = appData.event.title;
    document.getElementById('event-date').innerText = appData.event.date;
    document.getElementById('event-location').innerText = appData.event.location;
    document.getElementById('event-blurb').innerHTML = appData.event.blurb;

    // Populate Community Highlight Box Elements
    document.getElementById('community-brief').innerText = appData.community.brief;
    document.getElementById('read-more-community').addEventListener('click', openCommunityModal);

    // Build Chronological Event Schedule Timeline Nodes
    const scheduleTimeline = document.getElementById('schedule-timeline');
    appData.schedule.forEach(item => {
        const itemHtml = `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-time">${item.time}</div>
                    <div class="timeline-title">${item.title}</div>
                    ${item.desc ? `<p class="timeline-desc">${item.desc}</p>` : ''}
                </div>
            </div>
        `;
        scheduleTimeline.insertAdjacentHTML('beforeend', itemHtml);
    });

    // Populate Dynamic Project Slides Inside Track Elements
    const carouselTrack = document.getElementById('carousel-track');
    appData.projects.forEach((proj, idx) => {
        const slideHtml = `
            <div class="project-slide">
                <div>
                    <h3>${proj.lecturer}</h3>
                    <div class="project-course">${proj.course}</div>
                    <p class="project-brief">${proj.brief}</p>
                </div>
                <span class="project-link" onclick="openProjectModal(${idx})">קראו עוד קצת..</span>
            </div>
        `;
        carouselTrack.insertAdjacentHTML('beforeend', slideHtml);
    });
    
    updateCarouselPosition();
}

/* Modal Routing Controls */
function openModal(contentHtml) {
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-body-content').innerHTML = contentHtml;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
    const modal = document.getElementById('custom-modal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

function openCommunityModal() {
    const content = `
        <h2>קהילת סוכני שינוי</h2>
        <p style="font-weight:600; margin-top:10px; color:var(--primary-color);">${appData.community.brief}</p>
        <hr style="margin:15px 0; border:0; border-top:1px solid #dadce0;">
        <div>${appData.community.full}</div>
    `;
    openModal(content);
}

function openProjectModal(index) {
    const proj = appData.projects[index];
    const tagsHtml = proj.tags.map(t => `<span style="background:#e8f0fe; color:var(--primary-color); padding:4px 8px; border-radius:4px; font-size:0.85rem; font-weight:600; margin-left:6px;">${t}</span>`).join('');
    
    const content = `
        <h2>${proj.lecturer}</h2>
        <p style="font-size:1.1rem; color:#5f6368; margin-bottom:5px;"><strong>קורס:</strong> ${proj.course}</p>
        <div style="margin-bottom:15px;">${tagsHtml}</div>
        <hr style="margin:15px 0; border:0; border-top:1px solid #dadce0;">
        <h4 style="margin-bottom:5px; font-weight:800;">תקציר היוזמה:</h4>
        <p>${proj.brief}</p>
        <h4 style="margin-bottom:5px; font-weight:800;">פירוט הפרויקט והחדשנות:</h4>
        <p>${proj.full}</p>
    `;
    openModal(content);
}

/* Sliding Carousel Controls */
function getVisibleSlidesCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
}

function moveCarousel(direction) {
    const totalSlides = appData.projects.length;
    const visibleSlides = getVisibleSlidesCount();
    const maxIndex = totalSlides - visibleSlides;

    currentSlideIndex += direction;

    // Boundary constraints safeguarding loops smoothly
    if (currentSlideIndex < 0) currentSlideIndex = 0;
    if (currentSlideIndex > maxIndex) currentSlideIndex = maxIndex;

    updateCarouselPosition();
}

function updateCarouselPosition() {
    const track = document.getElementById('carousel-track');
    if (!track || !track.firstElementChild) return;
    
    const slideWidth = track.firstElementChild.getBoundingClientRect().width;
    const gap = 20; 
    
    // Smooth transformations working uniformly across RTL platforms
    const amountToMove = currentSlideIndex * (slideWidth + gap);
    track.style.transform = `translateX(${amountToMove}px)`;
}

// Ensure resize events re-evaluate container layout cleanly
window.addEventListener('resize', updateCarouselPosition);
