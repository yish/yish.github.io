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
            groupsHeading: "مجموعات التوجيه والتدريب (17:00)", thHost: "مُوجِّه", // התיקון עודכן כאן
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
            renderView("he"); // Initial run
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

        // Title and Date adjustments
        if (lang === "he") {
            mainTitle.textContent = loadedData.eventTitle;
            eventBlurbNode.textContent = loadedData.eventBlurb;
        } else if (lang === "ar") {
            mainTitle.textContent = "يوم الذكاء الاصطناعي، مسار فوق الابتدائي في كلية التربية، السنة الأولى في المعهد الأكاديمي العربي للتربية";
            eventBlurbNode.textContent = "توسيع آفاق البيداغوجيا في عصر الذكاء الاصطناعي > ندعوكم للمشاركة في يوم دراسي ملهم يربط بين الابتكار التكنولوجي والممارسة التربوية في الميدان. سنكتشف معًا آفاق التدريس والتعلم، ونستمع إلى كبار الخبراء، ونخوض تجارب تطبيقية مع أدوات ذكاء اصطناعي ستغير وجه العملية التعليمية في صفوفكم غدًا.";
        } else {
            mainTitle.textContent = "AI Day, Post-Primary Track in the Faculty of Education, 1st Year in the Arab Academic Institute for Education";
            eventBlurbNode.textContent = "Expanding Pedagogical Horizons in the AI Era > We invite you to an engaging seminar where technological advancement meets educational field practice. Together, we will examine the future of pedagogy, learn from prominent researchers, and gain hands-on proficiency with AI agents set to revolutionize your classroom experience in the very near future.";
        }

        eventDate.textContent = `${i18n[lang].datePrefix} ${loadedData.eventDate}`;
        mainZoomBtn.href = loadedData.mainPlenaryZoom;
        regIframe.src = loadedData.registrationLink;

        // Speaker Bio updates
        speakerName.textContent = loadedData.keynote.speaker;
        speakerInst.textContent = (lang === "en") ? "Haifa University" : (lang === "ar" ? "جامعة حيفا" : loadedData.keynote.institution);
        speakerBio.textContent = loadedData.keynote.bio;

        // Timeline Schedule Builder
        timelineContainer.innerHTML = loadedData.schedule.map(item => {
            let activityStr = item.activity;
            if (lang === "en") {
                if(item.activity.includes("פתיחה")) activityStr = "Greetings & Welcome Address";
                else if(item.activity.includes("הרצאת מפתח")) activityStr = "Keynote Address: Prof. Zohar Elyoseph";
                else if(item.activity.includes("הפסקה")) activityStr = "Intermission Break";
                else if(item.activity.includes("סדנאות")) activityStr = "Workshops";
                else if(item.activity.includes("התכנסות")) activityStr = "Practice Reflection Clusters & Knowledge Synthesis";
                else if(item.activity.includes("מליאת")) activityStr = "Closing Synthesis Plenary";
                else if(item.activity.includes("פיזור")) activityStr = "Adjournment & Departure";
            } else if (lang === "ar") {
                if(item.activity.includes("פתיחה")) activityStr = "الافتتاح والترحيب";
                else if(item.activity.includes("הרצאת מפתח")) activityStr = "الكاملة الرئيسية: البروفيسور زوهر أليوسيف";
                else if(item.activity.includes("הפסקה")) activityStr = "استراحة";
                else if(item.activity.includes("סדנאות")) activityStr = "ورش عمل";
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

        // Carousel Workshops track engine build trigger
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
            workshopsContainer.querySelectorAll(".workshop-block .btn-secondary").forEach(btn => btn.textContent = i18n[lang].joinWorkshop);
            let hostIdx = 0;
            workshopsContainer.querySelectorAll(".workshop-block .workshop-host").forEach(label => {
                const shop = loadedData.workshops[hostIdx % loadedData.workshops.length];
                label.textContent = `${i18n[lang].thHost}: ${shop.host}`;
                hostIdx++;
            });
        }

        // Reflection/Mentorship Groups Track Table population
        groupsTableBody.innerHTML = loadedData.groups.map(group => `
            <tr>
                <td><strong>${group.host}</strong></td>
                <td>${group.name} ${group.notes ? `<br><small style="color:var(--text-muted)">(${group.notes})</small>` : ''}</td>
                <td><a href="${group.zoom}" target="_blank" class="table-link">${i18n[lang].visitZoom}</a></td>
            </tr>
        `).join('');
    }

    function initInfiniteCarousel(currentLang) {
        const originalCards = Array.from(workshopsContainer.children);
        if (originalCards.length === 0) return;

        originalCards.forEach(card => {
            workshopsContainer.appendChild(card.cloneNode(true));
            workshopsContainer.insertBefore(card.cloneNode(true), workshopsContainer.firstChild);
        });

        carouselInitialized = true;

        setTimeout(() => {
            const initialOffset = originalCards.length * scrollStep;
            carouselViewport.scrollLeft = (currentLang === "he" || currentLang === "ar") ? -initialOffset : initialOffset;
        }, 50);

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
        carouselViewport.addEventListener("mouseenter", stopAutoRotation);
        carouselViewport.addEventListener("mouseleave", startAutoRotation);
    }

    function rotateCarouselNext() {
        const directionFactor = htmlNode.getAttribute("dir") === "rtl" ? -1 : 1;
        carouselViewport.scrollBy({ left: scrollStep * directionFactor, behavior: "smooth" });
    }

    function startAutoRotation() { stopAutoRotation(); autoRotateTimer = setInterval(rotateCarouselNext, 10000); }
    function stopAutoRotation() { if (autoRotateTimer) clearInterval(autoRotateTimer); }

    nextBtn.addEventListener("click", () => { rotateCarouselNext(); startAutoRotation(); });
    prevBtn.addEventListener("click", () => {
        const directionFactor = htmlNode.getAttribute("dir") === "rtl" ? 1 : -1;
        carouselViewport.scrollBy({ left: scrollStep * directionFactor, behavior: "smooth" });
        startAutoRotation();
    });

    langSelect.addEventListener("change", (e) => {
        renderView(e.target.value);
        const offsetWidthValue = loadedData.workshops.length * scrollStep;
        carouselViewport.scrollLeft = e.target.value === "en" ? offsetWidthValue : -offsetWidthValue;
    });

    themeSelect.addEventListener("change", (e) => htmlNode.setAttribute("data-theme", e.target.value));

    openRegisterBtn.addEventListener("click", () => registerModal.classList.add("active"));
    closeRegisterBtn.addEventListener("click", () => registerModal.classList.remove("active"));
    window.addEventListener("click", (e) => { if (e.target === registerModal) registerModal.classList.remove("active"); });
});
