document.addEventListener("DOMContentLoaded", () => {
    const jsonUrl = "data.json";
    let loadedData = null;

    // Translation Framework Reference Dict
    const i18n = {
        he: {
            selectLang: "שפה / Language:", selectTheme: "מצב תצוגה:",
            registerBtn: "הרשמה לאירוע", mainZoomBtn: "כניסה למליאה (Zoom)",
            keynoteHeading: "הרצאת פתיחה", workshopsHeading: "סדנאות לבחירה (15:30)",
            groupsHeading: "קבוצות הדרכה והתנסות (17:00)", thHost: "מנחה",
            thGroup: "מסלול / קבוצה", thAction: "קישור ומפגש",
            modalTitle: "טופס רישום ליום עיון בינה מלאכותית", modalSub: "אנא מלאו את פרטי הרישום בטופס הבא:",
            visitZoom: "הצטרפות לחדר &larr;", joinWorkshop: "התחברות לזום הסדנה", datePrefix: "תאריך האירוע:"
        },
        ar: {
            selectLang: "اللغة / Language:", selectTheme: "عرض الوضع:",
            registerBtn: "التسجيل في الفعالية", mainZoomBtn: "دخول الجلسة العامة (Zoom)",
            keynoteHeading: "المحاضرة الافتتاحية", workshopsHeading: "ورش العمل الاختيارية (15:30)",
            groupsHeading: "مجموعات التوجيه والتدريب (17:00)", thHost: "الميسر",
            thGroup: "المسار / المجموعة", thAction: "الرابط والاجتماع",
            modalTitle: "نموذج التسجيل لندوة الذكاء الاصطناعي", modalSub: "يرجى ملء تفاصيل التسجيل في النموذج أدناه:",
            visitZoom: "الانضمام إلى الغرفة &larr;", joinWorkshop: "الانضمام إلى زوم الورشة", datePrefix: "تاريخ الفعالية:"
        },
        en: {
            selectLang: "Language / שפה:", selectTheme: "Theme Mode:",
            registerBtn: "Register Now", mainZoomBtn: "Enter Plenary (Zoom)",
            keynoteHeading: "Keynote Session", workshopsHeading: "Concurrent Workshops (15:30)",
            groupsHeading: "Reflection & Practice Groups (17:00)", thHost: "Facilitator",
            thGroup: "Track / Group", thAction: "Link & Join",
            modalTitle: "AI Seminar Registration Framework", modalSub: "Please fill out the form parameters beneath:",
            visitZoom: "Enter Room &larr;", joinWorkshop: "Join Workshop Zoom", datePrefix: "Date:"
        }
    };

    // Node Tree Pointers
    const htmlNode = document.documentElement;
    const bodyNode = document.body;
    const mainTitle = document.getElementById("main-title");
    const eventDate = document.getElementById("event-date");
    const eventBlurbNode = document.getElementById("event-blurb");
    const mainZoomBtn = document.getElementById("main-zoom-btn");
    const speakerName = document.getElementById("speaker-name");
    const speakerInst = document.getElementById("speaker-inst");
    const speakerBio = document.getElementById("speaker-bio");
    const timelineContainer = document.getElementById("timeline-container");
    const workshopsContainer = document.getElementById("workshops-container");
    const groupsTableBody = document.getElementById("groups-table-body");
    const carouselViewport = document.querySelector(".carousel-viewport");

    // Controls Handles
    const langSelect = document.getElementById("lang-select");
    const themeSelect = document.getElementById("theme-select");
    const registerModal = document.getElementById("register-modal");
    const openRegisterBtn = document.getElementById("open-register-btn");
    const closeRegisterBtn = document.getElementById("close-register-btn");
    const regIframe = document.getElementById("registration-iframe");
    const prevBtn = document.getElementById("prev-carousel-btn");
    const nextBtn = document.getElementById("next-carousel-btn");

    // Carousel Loop State Variables
    let autoRotateTimer = null;
    let carouselInitialized = false;
    const scrollStep = 374; // Width of card (350px) + gap (24px)

    // Data Load pipeline
    fetch(jsonUrl)
        .then(res => { if (!res.ok) throw new Error("Could not load payload data map."); return res.json(); })
        .then(data => {
            loadedData = data;
            renderView("he"); // Default initialization inside Hebrew view
        })
        .catch(err => {
            console.error(err);
            mainTitle.textContent = "Error setting context variables.";
        });

    function renderView(lang) {
        if (!loadedData) return;

        const isRtl = (lang === "he" || lang === "ar");
        htmlNode.setAttribute("lang", lang);
        htmlNode.setAttribute("dir", isRtl ? "rtl" : "ltr");
        bodyNode.setAttribute("dir", isRtl ? "rtl" : "ltr");

        // Translate Static Tokens
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const token = element.getAttribute("data-i18n");
            if (i18n[lang][token]) element.textContent = i18n[lang][token];
        });

        // Set global text components
        mainTitle.textContent = (lang === "he") ? loadedData.eventTitle : (lang === "ar" ? "يوم الذكاء الاصطناعي - المسار فوق الابتدائي والمعهد الأكاديمي العربي" : "AI Seminar - Secondary Track & Arab Educational Institute");
        eventDate.textContent = `${i18n[lang].datePrefix} ${loadedData.eventDate}`;
        mainZoomBtn.href = loadedData.mainPlenaryZoom;
        regIframe.src = loadedData.registrationLink;

        // Blurb Localization Logic
        if (lang === "he") {
            eventBlurbNode.textContent = loadedData.eventBlurb || "פריצת גבולות המעשה הפדגוגי בעידן הבינה המלאכותית > הנכן מוזמנות ליום עיון מעורר השראה המחבר בין חדשנות טכנולוגית לפרקטיקה החינוכית בשדה.";
        } else if (lang === "ar") {
            eventBlurbNode.textContent = "توسيع آفاق البيداغوجيا في عصر الذكاء الاصطناعي > ندعوكم للمشاركة في يوم دراسي ملهم يربط بين الابتكار التكنولوجي والممارسة التربوية في الميدان.";
        } else {
            eventBlurbNode.textContent = "Expanding Pedagogical Horizons in the AI Era > We invite you to an engaging seminar where technological advancement meets educational field practice.";
        }

        // Keynote Presenter Information Mapping
        speakerName.textContent = loadedData.keynote.speaker;
        speakerInst.textContent = (lang === "en") ? "Haifa University" : (lang === "ar" ? "جامعة حيفا" : loadedData.keynote.institution);
        speakerBio.textContent = (lang === "he") ? loadedData.keynote.bio : (lang === "ar" ? "خبير وباحث بارز في مجال الذكاء الاصطناعي التوليدي والدمج بين التكنولوجيا والتعليم." : "Leading Israeli researcher specializing in Generative AI (GenAI), educational psychology, and hybrid interactive software design inside school systems.");

        // Timeline Builder Engine
        timelineContainer.innerHTML = loadedData.schedule.map(item => {
            let activityStr = item.activity;
            if (lang === "en") {
                if(item.activity.includes("פתיחה")) activityStr = "Greetings & Welcome Address";
                else if(item.activity.includes("הרצאת מפתח")) activityStr = "Keynote Address: Prof. Zohar Elyoseph";
                else if(item.activity.includes("הפסקה")) activityStr = "Intermission Coffee Break";
                else if(item.activity.includes("סדנאות")) activityStr = "Parallel Elective Workshops";
                else if(item.activity.includes("התכנסות")) activityStr = "Practice Reflection Clusters";
                else if(item.activity.includes("מליאת")) activityStr = "Closing Synthesis Plenary Session";
                else if(item.activity.includes("פיזור")) activityStr = "Adjournment & Departure";
            } else if (lang === "ar") {
                if(item.activity.includes("פתיחה")) activityStr = "الافتتاح والترحيب";
                else if(item.activity.includes("הרצאת מפתח")) activityStr = "الكاملة الرئيسية: البروفيسور زوهر أليوسيف";
                else if(item.activity.includes("הפסקה")) activityStr = "استراحة קצירה";
                else if(item.activity.includes("סדנאות")) activityStr = "ورش عمل اختيارية";
                else if(item.activity.includes("התכנסות")) activityStr = "التجمع في مجموعات تجريبية";
                else if(item.activity.includes("מליאת")) activityStr = "الجلسة الختامية";
                else if(item.activity.includes("פיזור")) activityStr = "مغادرة";
            }
            return `
                <li class="timeline-item">
                    <div class="time-badge">${item.time}</div>
                    <div class="activity-text">${activityStr}</div>
                </li>
            `;
        }).join('');

        // Workshops rendering pipeline (Only generate if carousel elements haven't structural duplicates yet)
        if (!carouselInitialized) {
            workshopsContainer.innerHTML = loadedData.workshops.map(shop => `
                <div class="workshop-block">
                    <div>
                        <h3>${shop.title}</h3>
                        <div class="workshop-host">${i18n[lang].thHost}: ${shop.host}</div>
                        <p class="workshop-desc">${shop.summary}</p>
                    </div>
                    <a href="${shop.zoom}" target="_blank" class="btn btn-secondary" style="font-size:0.85rem; padding:0.6rem 1.2rem; text-align:center; justify-content:center; width:100%;">${i18n[lang].joinWorkshop}</a>
                </div>
            `).join('');
            
            initInfiniteCarousel(lang);
        } else {
            // If already initialized, update text components of visible buttons inside carousel tracks
            const actionButtons = workshopsContainer.querySelectorAll(".workshop-block .btn-secondary");
            actionButtons.forEach(btn => {
                btn.textContent = i18n[lang].joinWorkshop;
            });
            
            const hostLabels = workshopsContainer.querySelectorAll(".workshop-block .workshop-host");
            let hostIdx = 0;
            hostLabels.forEach(label => {
                const shop = loadedData.workshops[hostIdx % loadedData.workshops.length];
                label.textContent = `${i18n[lang].thHost}: ${shop.host}`;
                hostIdx++;
            });
        }

        // Groups rendering pipeline
        groupsTableBody.innerHTML = loadedData.groups.map(group => `
            <tr>
                <td><strong>${group.host}</strong></td>
                <td>${group.name} ${group.notes ? `<br><small style="color:var(--text-muted)">(${group.notes})</small>` : ''}</td>
                <td><a href="${group.zoom}" target="_blank" class="table-link">${i18n[lang].visitZoom}</a></td>
            </tr>
        `).join('');
    }

    // --- INFINITE LOOPING & AUTOROTATE TRACK SYSTEMS ---
    function initInfiniteCarousel(currentLang) {
        const originalCards = Array.from(workshopsContainer.children);
        if (originalCards.length === 0) return;

        // Clone nodes to both ends to enable infinite loop tracks
        originalCards.forEach(card => {
            const cloneAfter = card.cloneNode(true);
            const cloneBefore = card.cloneNode(true);
            workshopsContainer.appendChild(cloneAfter);
            workshopsContainer.insertBefore(cloneBefore, workshopsContainer.firstChild);
        });

        carouselInitialized = true;

        // Position initial viewport scroll bounds over middle active nodes segment
        setTimeout(() => {
            const initialOffset = originalCards.length * scrollStep;
            carouselViewport.scrollLeft = (currentLang === "he" || currentLang === "ar") ? -initialOffset : initialOffset;
        }, 50);

        // Frame wrapper boundary check logic loop appender
        carouselViewport.addEventListener("scroll", () => {
            const currentScroll = Math.abs(carouselViewport.scrollLeft);
            const totalWidth = originalCards.length * scrollStep;
            const currentDir = htmlNode.getAttribute("dir");

            if (currentScroll >= totalWidth * 2) {
                carouselViewport.scrollLeft = currentDir === "rtl" ? -totalWidth : totalWidth;
            } else if (currentScroll <= scrollStep) {
                carouselViewport.scrollLeft = currentDir === "rtl" ? -(totalWidth + currentScroll) : (totalWidth + currentScroll);
            }
        });

        startAutoRotation();

        // Pause rotation on pointer engagement loops
        carouselViewport.addEventListener("mouseenter", stopAutoRotation);
        carouselViewport.addEventListener("mouseleave", startAutoRotation);
    }

    function rotateCarouselNext() {
        const directionFactor = htmlNode.getAttribute("dir") === "rtl" ? -1 : 1;
        carouselViewport.scrollBy({ left: scrollStep * directionFactor, behavior: "smooth" });
    }

    function startAutoRotation() {
        stopAutoRotation();
        autoRotateTimer = setInterval(rotateCarouselNext, 10000);
    }

    function stopAutoRotation() {
        if (autoRotateTimer) clearInterval(autoRotateTimer);
    }

    // Controls Events
    nextBtn.addEventListener("click", () => {
        rotateCarouselNext();
        startAutoRotation();
    });

    prevBtn.addEventListener("click", () => {
        const directionFactor = htmlNode.getAttribute("dir") === "rtl" ? 1 : -1;
        carouselViewport.scrollBy({ left: scrollStep * directionFactor, behavior: "smooth" });
        startAutoRotation();
    });

    langSelect.addEventListener("change", (e) => {
        renderView(e.target.value);
        const totalCardsCount = loadedData.workshops.length;
        const offsetWidthValue = totalCardsCount * scrollStep;
        carouselViewport.scrollLeft = e.target.value === "en" ? offsetWidthValue : -offsetWidthValue;
    });

    themeSelect.addEventListener("change", (e) => htmlNode.setAttribute("data-theme", e.target.value));

    // Modal Operations
    openRegisterBtn.addEventListener("click", () => registerModal.classList.add("active"));
    closeRegisterBtn.addEventListener("click", () => registerModal.classList.remove("active"));
    window.addEventListener("click", (e) => { if (e.target === registerModal) registerModal.classList.remove("active"); });
});
