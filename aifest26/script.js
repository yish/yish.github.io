// משתנים גלובליים לניהול הקרוסלה
let currentSlide = 0;
let projectsData = [];

// פונקציה ראשית להבאת הנתונים מקובץ ה-JSON
async function initSite() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`שגיאה בטעינת הקובץ: ${response.status}`);
        }
        const data = await response.json();
        
        // שמירת פרויקטים למשתנה גלובלי
        projectsData = data.projects || [];

        // רינדור רכיבי האתר
        renderHero(data.event);
        renderSchedule(data.schedule);
        renderCommunity(data.community);
        renderCarousel();
        setupModalEvents();

    } catch (error) {
        console.error("שגיאה באתחול האתר:", error);
    }
}

// רינדור אזור הכותרת (Hero) והבלרב (אודות)
function renderHero(eventData) {
    if (!eventData) return;
    document.getElementById('event-title').textContent = eventData.title || '';
    document.getElementById('event-date').textContent = eventData.date || '';
    document.getElementById('event-location').textContent = eventData.location || '';
    
    // תיקון: הזרקת הבלרב אל תוך כרטיס האודות בעמוד
    const blurbContainer = document.getElementById('event-blurb');
    if (blurbContainer) {
        blurbContainer.innerHTML = eventData.blurb || '';
    }
}

// רינדור הלו"ז (תוכנית האירוע) בסרגל הצדי
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

// רינדור תקציר הקהילה
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

// רינדור קרוסלת הפרויקטים
function renderCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    
    track.innerHTML = '';
    
    projectsData.forEach(project => {
        const slide = document.createElement('div');
        slide.className = 'project-slide';
        
        // שליפת שם המרצה גם אם נשמר תחת מפתח עם שגיאת כתיב מהמקור במרוכז
        const lecturerName = project.lecturer || project["נשם המרצה"] || 'חבר.ת קהילה';
        
        slide.innerHTML = `
            <div>
                <h3>${lecturerName}</h3>
                <div class="project-course">${project.course || ''}</div>
                <p class="project-brief">${project.brief || ''}</p>
            </div>
            <span class="project-link" onclick="openProjectModal(${project.id})">קראו עוד קורסים פדגוגיים ←</span>
        `;
        track.appendChild(slide);
    });
    
    updateCarouselPosition();
}

// ניווט בקרוסלה (חצים)
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

// ניהול מודל (פופאפ)
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
    
    const lecturerName = project.lecturer || project["נשם המרצה"] || 'חבר.ת קהילה';
    
    const content = `
        <h2>${lecturerName}</h2>
        <p style="color: #5f6368; margin-bottom: 15px;"><strong>קורס אקדמי:</strong> ${project.course || ''}</p>
        <div style="line-height: 1.7; font-size: 1.1rem;">
            ${project.full || project.brief || ''}
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

// עדכון רספונסיבי לקרוסלה בשינוי מסך
window.addEventListener('resize', () => {
    currentSlide = 0;
    updateCarouselPosition();
});

// הפעלת האתר ברגע שה-DOM מוכן
document.addEventListener('DOMContentLoaded', initSite);
