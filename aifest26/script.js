let currentSlide = 0;
let projectsData = [];

async function initSite() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`שגיאה בטעינת הקובץ: ${response.status}`);
        }
        const data = await response.json();
        
        projectsData = data.projects || [];

        renderHero(data.event);
        renderRegistration(data.registration); // פונקציית טעינת רישום חדשה
        renderSchedule(data.schedule);
        renderCommunity(data.community);
        renderCarousel();
        setupModalEvents();

    } catch (error) {
        console.error("שגיאה באתחול האתר:", error);
    }
}

function renderHero(eventData) {
    if (!eventData) return;
    document.getElementById('event-title').textContent = eventData.title || '';
    document.getElementById('event-date').textContent = eventData.date || '';
    document.getElementById('event-location').textContent = eventData.location || '';
    
    const blurbContainer = document.getElementById('event-blurb');
    if (blurbContainer) {
        blurbContainer.innerHTML = eventData.blurb || '';
    }
}

// בניית אזור הרישום וה-NDA מתוך ה-JSON
function renderRegistration(regData) {
    if (!regData) return;
    
    document.getElementById('reg-note').textContent = regData.note || '';
    document.getElementById('nda-text').innerHTML = regData.nda_text || '';
    document.getElementById('nda-link').href = regData.nda_url || '#';
    
    const linksContainer = document.getElementById('reg-links-container');
    if (linksContainer && regData.links) {
        linksContainer.innerHTML = '';
        regData.links.forEach(link => {
            const aBtn = document.createElement('a');
            aBtn.className = 'reg-target-btn';
            aBtn.href = link.url;
            aBtn.target = '_blank';
            aBtn.rel = 'noopener noreferrer';
            aBtn.textContent = link.label;
            linksContainer.appendChild(aBtn);
        });
    }
}

function renderSchedule(scheduleData) {
    const timeline = document.getElementById('schedule-timeline');
    if (!timeline || !scheduleData) return;
    timeline.innerHTML = ''; 
    
    scheduleData.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'timeline-item';
        itemEl.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-time">${item.time}</div>
                <div class="timeline-title">${item.title}</div>
                ${item.desc ? `<div class="timeline-desc">${item.desc}</div>` : ''}
            </div>
        `;
        timeline.appendChild(itemEl);
    });
}

function renderCommunity(communityData) {
    if (!communityData) return;
    document.getElementById('community-brief').textContent = communityData.brief || '';
    
    const communityBtn = document.getElementById('read-more-community');
    if (communityBtn) {
        communityBtn.onclick = () => {
            openModal(communityData.full || 'אין מידע נוסף');
        };
    }
}

function renderCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    track.innerHTML = '';
    
    projectsData.forEach(project => {
        const slide = document.createElement('div');
        slide.className = 'project-slide';
        const lecturerName = project.lecturer || 'חבר.ת קהילה';
        
        slide.innerHTML = `
            <div>
                <h3>${lecturerName}</h3>
                <div class="project-course">${project.course || ''}</div>
                <p class="project-brief">${project.brief || ''}</p>
            </div>
            <span class="project-link" onclick="openProjectModal(${project.id})">לפירוט היוזמה והחדשנות ←</span>
        `;
        track.appendChild(slide);
    });
    updateCarouselPosition();
}

function moveCarousel(direction) {
    const track = document.getElementById('carousel-track');
    if (!track || projectsData.length === 0) return;
    
    let visibleSlides = 3;
    if (window.innerWidth <= 900) visibleSlides = 2;
    if (window.innerWidth <= 600) visibleSlides = 1;
    
    const maxSlide = projectsData.length - visibleSlides;
    currentSlide += direction;
    
    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide > maxSlide) currentSlide = maxSlide;
    
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const track = document.getElementById('carousel-track');
    if (!track || projectsData.length === 0) return;
    
    let slideWidth = 33.333; 
    if (window.innerWidth <= 900) slideWidth = 50;
    if (window.innerWidth <= 600) slideWidth = 100;
    
    const offset = currentSlide * slideWidth;
    track.style.transform = `translateX(${offset}%)`;
}

function openModal(htmlContent) {
    const modal = document.getElementById('custom-modal');
    const modalBody = document.getElementById('modal-body-content');
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = htmlContent;
    modal.classList.add('active');
}

function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    const content = `
        <h2>${project.lecturer}</h2>
        <p style="color: #1a73e8; margin-bottom: 12px; font-weight: 600;"><strong>קורס אקדמי:</strong> ${project.course || ''}</p>
        <hr style="margin-bottom:15px; border:0; border-top:1px solid #dadce0;">
        <div style="line-height: 1.7; font-size: 1.05rem; color:#202124;">
            ${project.full || project.brief}
        </div>
    `;
    openModal(content);
}

function setupModalEvents() {
    const modal = document.getElementById('custom-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (!modal) return;
    
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    };
}

window.addEventListener('resize', () => {
    currentSlide = 0;
    updateCarouselPosition();
});

document.addEventListener('DOMContentLoaded', initSite);
