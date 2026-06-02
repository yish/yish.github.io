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
            registerBtn: "التسجيل في الفעالية", mainZoomBtn: "דכול אלמליאה (Zoom)",
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

    // Data Load pipeline
    fetch(jsonUrl)
        .then(res => { if (!res.ok) throw new Error("Could not load payload data map."); return res.json(); })
        .then(data => {
            loadedData = data;
            renderView("he"); // default initialization state
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

        // Set contextual global details
        mainTitle.textContent = (lang === "he") ? loadedData.eventTitle : (lang === "ar" ? "يوم الذكاء الاصطناعي - المسار فوق الابتدائي والمعهد الأكاديمي العربي" : "AI Seminar - Secondary Track & Arab Educational Institute");
        eventDate.textContent = `${i18n[lang].datePrefix} ${loadedData.eventDate}`;
        mainZoomBtn.href = loadedData.mainPlenaryZoom;
        regIframe.src = loadedData.registrationLink;

        // Keynote Presenter Information Mapping
        speakerName.textContent = loadedData.keynote.speaker;
        speakerInst.textContent = (lang === "en") ? "Haifa University" : (lang === "ar" ? "جامعة حيفا" : loadedData.keynote.institution);
        speakerBio.textContent = (lang === "he") ? loadedData.keynote.bio : (lang === "ar" ? "خبير وباحث بارز في مجال الذكاء الاصطناعي التوليدي والدمج بين التكنولوجيا والتعليم ועלם הנפס." : "Leading Israeli researcher specializing in Generative AI (GenAI), educational psychology, and hybrid interactive software design elements inside school systems.");

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
                else if(item.activity.includes("סדנאות")) activityStr = "ورش عمل اختيارية מתקדמת";
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

        // Workshops rendering pipeline
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

        // Groups rendering pipeline
        groupsTableBody.innerHTML = loadedData.groups.map(group => `
            <tr>
                <td><strong>${group.host}</strong></td>
                <td>${group.name} ${group.notes ? `<br><small style="color:var(--text-muted)">(${group.notes})</small>` : ''}</td>
                <td><a href="${group.zoom}" target="_blank" class="table-link">${i18n[lang].visitZoom}</a></td>
            </tr>
        `).join('');
    }

    // Carousel Navigation Engine Interactivity logic (Scroll actions offset by card parameters)
    nextBtn.addEventListener("click", () => {
        const scrollAmount = htmlNode.getAttribute("dir") === "rtl" ? -360 : 360;
        carouselViewport.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
        const scrollAmount = htmlNode.getAttribute("dir") === "rtl" ? 360 : -360;
        carouselViewport.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Control configuration updates
    langSelect.addEventListener("change", (e) => renderView(e.target.value));
    themeSelect.addEventListener("change", (e) => htmlNode.setAttribute("data-theme", e.target.value));

    // Modal Control System toggles
    openRegisterBtn.addEventListener("click", () => registerModal.classList.add("active"));
    closeRegisterBtn.addEventListener("click", () => registerModal.classList.remove("active"));
    window.addEventListener("click", (e) => { if (e.target === registerModal) registerModal.classList.remove("active"); });
});
