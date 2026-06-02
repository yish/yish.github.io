document.addEventListener("DOMContentLoaded", () => {
    const jsonUrl = "data.json";
    let loadedData = null;

    // Translation Framework Context Object
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
            registerBtn: "Register for Event", mainZoomBtn: "Enter Plenary (Zoom)",
            keynoteHeading: "Keynote Opening", workshopsHeading: "Optional Workshops (15:30)",
            groupsHeading: "Mentorship & Practice Groups (17:00)", thHost: "Moderator",
            thGroup: "Track / Group", thAction: "Link & Connection",
            modalTitle: "AI Seminar Registration Form", modalSub: "Please fill out the registration form details below:",
            visitZoom: "Join Room &larr;", joinWorkshop: "Connect to Workshop Zoom", datePrefix: "Event Date:"
        }
    };

    // DOM Selection Handles
    const htmlNode = document.documentElement;
    const bodyNode = document.body;
    const mainTitle = document.getElementById("main-title");
    const eventDate = document.getElementById("event-date");
    const mainZoomBtn = document.getElementById("main-zoom-btn");
    const speakerName = document.getElementById("speaker-name");
    const speakerInst = document.getElementById("speaker-inst");
    const speakerBio = document.getElementById("speaker-bio");
    const timelineContainer = document.getElementById("timeline-container");
    const workshopsContainer = document.getElementById("workshops-container");
    const groupsTableBody = document.getElementById("groups-table-body");
    const dashGrid = document.querySelector(".dashboard-grid");

    // Interactive UI controls
    const langSelect = document.getElementById("lang-select");
    const themeSelect = document.getElementById("theme-select");
    const registerModal = document.getElementById("register-modal");
    const openRegisterBtn = document.getElementById("open-register-btn");
    const closeRegisterBtn = document.getElementById("close-register-btn");
    const regIframe = document.getElementById("registration-iframe");

    // Initialize Network Payload Engine
    fetch(jsonUrl)
        .then(res => { if (!res.ok) throw new Error("Could not fetch data map."); return res.json(); })
        .then(data => {
            loadedData = data;
            renderView("he"); // Default initialization inside Hebrew view
        })
        .catch(err => {
            console.error(err);
            mainTitle.textContent = "Error loading application context.";
        });

    // Translation Appender Framework Core Logic 
    function renderView(lang) {
        if (!loadedData) return;

        // Alignment & Structural Adaptation properties
        const isRtl = (lang === "he" || lang === "ar");
        htmlNode.setAttribute("lang", lang);
        htmlNode.setAttribute("dir", isRtl ? "rtl" : "ltr");
        bodyNode.setAttribute("dir", isRtl ? "rtl" : "ltr");
        dashGrid.setAttribute("dir", isRtl ? "rtl" : "ltr");

        // Translate Static Markup Tokens
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const token = element.getAttribute("data-i18n");
            if (i18n[lang][token]) element.textContent = i18n[lang][token];
        });

        // Set contextual global details
        mainTitle.textContent = (lang === "he") ? loadedData.eventTitle : (lang === "ar" ? "يوم الذكاء الاصطناعي - المسار فوق الابتدائي والمعهد الأكاديمي العربي" : "AI Day - Post-Primary Track & Arab Education Institute");
        eventDate.textContent = `${i18n[lang].datePrefix} ${loadedData.eventDate}`;
        mainZoomBtn.href = loadedData.mainPlenaryZoom;
        regIframe.src = loadedData.registrationLink;

        // Profile mapping logic variations
        speakerName.textContent = loadedData.keynote.speaker;
        speakerInst.textContent = (lang === "en") ? "Haifa University" : (lang === "ar" ? "جامعة حيفا" : loadedData.keynote.institution);
        speakerBio.textContent = (lang === "he") ? loadedData.keynote.bio : (lang === "ar" ? "خبير وباحث بارز في مجال الذكاء الاصطناعي التوليدي والدمج بين التكنولوجيا والتعليم وعلم النفس." : "Leading Israeli researcher specializing in Generative AI (GenAI), educational psychology, and clinical human-computer AI interactions.");

        // Dynamic schedule pipeline builder
        timelineContainer.innerHTML = loadedData.schedule.map(item => {
            let activityStr = item.activity;
            if (lang === "en") {
                if(item.activity.includes("פתיחה")) activityStr = "Opening & Greetings";
                else if(item.activity.includes("הרצאת מפתח")) activityStr = "Keynote Address: Prof. Zohar Elyoseph";
                else if(item.activity.includes("הפסקה")) activityStr = "Intermission Break";
                else if(item.activity.includes("סדנאות")) activityStr = "Elective Interactive Workshops";
                else if(item.activity.includes("התכנסות")) activityStr = "Practice Reflection Groups & Knowledge Synthesis";
                else if(item.activity.includes("מליאת")) activityStr = "Concluding Plenary Session";
                else if(item.activity.includes("פיזור")) activityStr = "Adjournment";
            } else if (lang === "ar") {
                if(item.activity.includes("פתיחה")) activityStr = "الافتتاح والترحيب";
                else if(item.activity.includes("הרצאת מפתח")) activityStr = "الكاملة الرئيسية: البروفيسور زوهر أليوسيف";
                else if(item.activity.includes("הפסקה")) activityStr = "استراحة";
                else if(item.activity.includes("סדנאות")) activityStr = "ورش عمل اختيارية";
                else if(item.activity.includes("התכנסות")) activityStr = "التجمع في مجموعات تجريبية وتلخيص الأفكار";
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

        // Dynamic Workshop loop configuration
        workshopsContainer.innerHTML = loadedData.workshops.map(shop => {
            return `
                <div class="workshop-block">
                    <div>
                        <h3>${shop.title}</h3>
                        <div class="workshop-host">${i18n[lang].thHost}: ${shop.host}</div>
                        <p class="workshop-desc">${shop.summary}</p>
                    </div>
                    <a href="${shop.zoom}" target="_blank" class="btn btn-secondary" style="font-size:0.85rem; padding:0.5rem 1rem; text-align:center;">${i18n[lang].joinWorkshop}</a>
                </div>
            `;
        }).join('');

        // Dynamic Reflection list builder
        groupsTableBody.innerHTML = loadedData.groups.map(group => `
            <tr>
                <td><strong>${group.host}</strong></td>
                <td>${group.name} ${group.notes ? `<br><small style="color:var(--text-muted)">(${group.notes})</small>` : ''}</td>
                <td><a href="${group.zoom}" target="_blank" class="table-link">${i18n[lang].visitZoom}</a></td>
            </tr>
        `).join('');
    }

    // Input Control State Event Handlers
    langSelect.addEventListener("change", (e) => renderView(e.target.value));
    
    themeSelect.addEventListener("change", (e) => {
        htmlNode.setAttribute("data-theme", e.target.value);
    });

    // Modal Display Management State machine
    openRegisterBtn.addEventListener("click", () => registerModal.classList.add("active"));
    closeRegisterBtn.addEventListener("click", () => registerModal.classList.remove("active"));
    window.addEventListener("click", (e) => { if (e.target === registerModal) registerModal.classList.remove("active"); });
});
