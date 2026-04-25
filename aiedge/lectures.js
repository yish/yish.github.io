// --- DATA MANAGEMENT ---
let talksData = []; 
let currentLang = 'he';
const googleFormsEmbed = "[https://docs.google.com/forms/d/e/1FAIpQLSdXwZg50NkkH7V-gV65_Lovijs8FzNS5/viewform?embedded=true](https://docs.google.com/forms/d/e/1FAIpQLSdXwZg50NkkH7V-gV65_Lovijs8FzNS5/viewform?embedded=true)";

const translations = {
  he: {
    dir: 'rtl', logoText: 'מכללת בית ברל', title: 'על קצה הבינה', subtitle: 'סדרת הרצאות אורח על בינה מלאכותית בחינוך', aboutBtn: 'אודות הסדרה', registerBtn: 'הרשמה להרצאות', contactBtn: 'צור קשר', mailYishay: 'שלח דוא"ל לישי מור', whatsappYishay: 'וואטסאפ לישי מור', talksTitle: 'הרצאות האורח שלנו', readMore: 'קרא עוד', close: 'סגור', timeLabel: 'ימי שלישי בשעה 18:30-19:30', locationLabel: 'מפגשי זום (Zoom)', aboutModalTitle: 'אודות קורס פיתוח ושימוש ביישומי בינה מלאכותית',
    aboutModalContent: `קורס ״פיתוח ושימוש ביישומי בינה מלאכותית בחינוך״ ניתן במכללת בית ברל במסגרת הסמכת מורים למגמת תקשוב. מגמת מערכות תקשוב היא מגמה צעירה בתיכון, הפונה לתלמידים מגוונים, וחסרים בה מורים בעלי ידע תוכן ומיומנויות הוראה הולמות. התוכנית כוללת לימודי תשתית בתחומים: תשתיות ורשתות תקשורת, אבטחת מידע וסייבר, מערכות הפעלה ותכנות.\n\nקורס זה מקנה לסטודנטים כשירות מתקדמת בבינה מלאכותית (AI) בדגש על פיתוח יישומים חינוכיים בגישת ה-Vibe Coding.\nהקורס כולל סדרה של הרצאות אורח, והמכללה מזמינה את המתעניינים להצטרף כשומעים. מס' המקומות מוגבל!`,
    registerModalTitle: 'הרשמה לסדרת ההרצאות', abstractLabel: 'תקציר ההרצאה', aboutSpeakerLabel: 'על המרצה'
  },
  en: {
    dir: 'ltr', logoText: 'Beit Berl College', title: 'On the Edge of Intelligence', subtitle: 'Guest Lecture Series on Artificial Intelligence in Education', aboutBtn: 'About the Series', registerBtn: 'Register Now', contactBtn: 'Contact Us', mailYishay: 'Email Yishay Mor', whatsappYishay: 'WhatsApp Yishay Mor', talksTitle: 'Our Guest Lectures', readMore: 'Read More', close: 'Close', timeLabel: 'Tuesdays, 18:30-19:30', locationLabel: 'Zoom Meetings', aboutModalTitle: 'About the AI Applications Course',
    aboutModalContent: `The "Developing and Using AI Applications in Education" course is offered at Beit Berl College as part of the teacher certification for the ICT track. The program provides infrastructure studies in communications, cyber security, and programming.\n\nThe course provides students with advanced AI competency with an emphasis on developing educational applications using Vibe Coding.\nThe course includes a series of guest lectures, and the college invites interested parties to join as listeners. Spaces are limited!`,
    registerModalTitle: 'Register for the Lectures', abstractLabel: 'Abstract', aboutSpeakerLabel: 'About the Speaker'
  },
  ar: {
    dir: 'rtl', logoText: 'كلية بيت بيرل', title: 'على حافة الذكاء', subtitle: 'سلسلة محاضرات للضيوف حول الذكاء الاصطناعي في التعليم', aboutBtn: 'حول السلسلة', registerBtn: 'سجل الآن', contactBtn: 'اتصل بنا', mailYishay: 'أرسل بريدًا إلى يشاي مور', whatsappYishay: 'واتساب يشاي مور', talksTitle: 'محاضرات الضيوف لدينا', readMore: 'اقرأ المزيد', close: 'إغلاق', timeLabel: 'أيام الثلاثاء، 18:30-19:30', locationLabel: 'لقاءات زووم (Zoom)', aboutModalTitle: 'حول دورة تطبيقات الذكاء الاصطناعي',
    aboutModalContent: `تُقدم دورة "تطوير واستخدام تطبيقات الذكاء الاصطناعي في التعليم" في كلية بيت بيرل كجزء من تأهيل المعلمين لمسار تكنولوجيا المعلومات والاتصالات.\nتزود الدورة الطلاب بكفاءة متقدمة في الذكاء الاصطناعي مع التركيز على تطوير التطبيقات التعليمية.\nتتضمن الدورة سلسلة من محاضرات الضيوف، وتدعو الكلية المهتمين للانضمام كمستمعين. الأماكن محدودة!`,
    registerModalTitle: 'التسجيل في المحاضرات', abstractLabel: 'ملخص المحاضرة', aboutSpeakerLabel: 'حول المحاضر'
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  fetchData().then(() => {
    lucide.createIcons();
    renderApp();
  });
});

async function fetchData() {
  try {
    const response = await fetch('lectures.json');
    if (!response.ok) throw new Error('File not found');
    talksData = await response.json();
  } catch (error) {
    console.error("Could not fetch lecture data:", error);
    document.getElementById('talks-grid').innerHTML = '<p class="text-slate-500 text-center col-span-3">שגיאה בטעינת הנתונים.</p>';
  }
}

// --- LOGIC ---
function changeLanguage(lang) {
  currentLang = lang;
  const t = translations[currentLang];
  
  document.documentElement.dir = t.dir;
  document.documentElement.lang = currentLang;
  
  if (t.dir === 'rtl') {
    document.body.classList.add('text-right');
    document.body.classList.remove('text-left');
  } else {
    document.body.classList.add('text-left');
    document.body.classList.remove('text-right');
  }
  renderApp();
}

function renderApp() {
  const t = translations[currentLang];
  document.getElementById('logo-text').innerText = t.logoText;
  document.getElementById('contact-text').innerText = t.contactBtn;
  document.getElementById('mail-text').innerText = t.mailYishay;
  document.getElementById('whatsapp-text').innerText = t.whatsappYishay;
  document.getElementById('hero-badge').innerText = `${t.locationLabel} | ${t.timeLabel}`;
  document.getElementById('hero-title').innerText = t.title;
  document.getElementById('hero-subtitle').innerText = t.subtitle;
  document.getElementById('hero-btn-register').innerText = t.registerBtn;
  document.getElementById('hero-btn-about').innerText = t.aboutBtn;
  document.getElementById('talks-title').innerText = t.talksTitle;
  document.getElementById('footer-text').innerText = `© 2026 ${t.logoText}. ${t.title}.`;
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('talks-grid');
  grid.innerHTML = '';
  const t = translations[currentLang];

  if (!talksData || talksData.length === 0) return;

  talksData.forEach(talk => {
    const title = talk.title[currentLang] || talk.title.he;
    const speaker = talk.speaker[currentLang] || talk.speaker.he;
    const abstract = talk.abstract[currentLang] || talk.abstract.he;

    const cardHTML = `
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col group cursor-pointer" onclick="openModal(${talk.id})">
        <div class="p-6 flex-grow">
          <div class="flex items-center gap-4 mb-4">
            <img src="${talk.image}" alt="${speaker}" class="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 group-hover:border-indigo-400 transition-colors" />
            <div>
              <h3 class="font-bold text-lg text-slate-900">${speaker}</h3>
              <div class="flex items-center gap-1.5 text-sm text-indigo-600 font-medium mt-1">
                <i data-lucide="calendar" class="w-4 h-4"></i>
                ${talk.date}
              </div>
            </div>
          </div>
          <h4 class="font-semibold text-slate-800 mb-3 line-clamp-2">${title}</h4>
          <p class="text-slate-600 text-sm line-clamp-3">${abstract}</p>
        </div>
        <div class="bg-slate-50 p-4 border-t border-slate-100 text-indigo-700 text-sm font-medium flex items-center justify-between group-hover:bg-indigo-50 transition-colors">
          <span>${t.readMore}</span>
          <i data-lucide="external-link" class="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"></i>
        </div>
      </div>
    `;
    grid.insertAdjacentHTML('beforeend', cardHTML);
  });
  lucide.createIcons();
}

let isDropdownOpen = false;

function toggleContact(event) {
  event.stopPropagation();
  const menu = document.getElementById('contact-menu');
  isDropdownOpen = !isDropdownOpen;
  if (isDropdownOpen) menu.classList.remove('hidden');
  else menu.classList.add('hidden');
}

document.addEventListener('click', () => {
  if (isDropdownOpen) {
    document.getElementById('contact-menu').classList.add('hidden');
    isDropdownOpen = false;
  }
});

function openModal(typeOrId) {
  const overlay = document.getElementById('modal-overlay');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  const footerEl = document.getElementById('modal-footer');
  const t = translations[currentLang];

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden'; 
  
  footerEl.classList.add('hidden');
  footerEl.innerHTML = '';
  bodyEl.innerHTML = '';
  bodyEl.classList.remove('p-0');

  if (typeOrId === 'about') {
    titleEl.innerText = t.aboutModalTitle;
    bodyEl.innerHTML = `<div class="space-y-4 text-slate-700 leading-relaxed whitespace-pre-line">${t.aboutModalContent}</div>`;
  } 
  else if (typeOrId === 'register') {
    titleEl.innerText = t.registerModalTitle;
    bodyEl.classList.add('p-0');
    bodyEl.innerHTML = `
      <div class="w-full h-[75vh] sm:h-[800px] bg-slate-50">
        <iframe src="${googleFormsEmbed}" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">טוען...</iframe>
      </div>
    `;
  } 
  else {
    const talk = talksData.find(t => t.id === typeOrId);
    if (!talk) return;

    const speaker = talk.speaker[currentLang] || talk.speaker.he;
    const title = talk.title[currentLang] || talk.title.he;
    const abstract = talk.abstract[currentLang] || talk.abstract.he;

    titleEl.innerText = speaker;
    
    bodyEl.innerHTML = `
      <div class="flex flex-col sm:flex-row gap-6 mb-8">
        <img src="${talk.image}" alt="${speaker}" class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-50 shadow-md" />
        <div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">${title}</h3>
          <div class="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
            <span class="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><i data-lucide="calendar" class="w-4 h-4"></i> ${talk.date}</span>
            <span class="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><i data-lucide="clock" class="w-4 h-4"></i> 18:30-19:30</span>
            <span class="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><i data-lucide="map-pin" class="w-4 h-4"></i> Zoom</span>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div>
          <h4 class="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">${t.abstractLabel}</h4>
          <p class="text-slate-700 leading-relaxed">${abstract}</p>
        </div>
        <div class="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h4 class="text-sm font-bold text-slate-900 mb-2">${t.aboutSpeakerLabel}</h4>
          <p class="text-slate-600 text-sm leading-relaxed">${talk.bio.he}</p>
        </div>
      </div>
    `;

    footerEl.classList.remove('hidden');
    footerEl.classList.add('flex');
    footerEl.innerHTML = `
      <button onclick="openModal('register')" class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors">
        <i data-lucide="user-plus" class="w-4 h-4"></i>
        ${t.registerBtn}
      </button>
    `;
  }
  lucide.createIcons();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  document.body.style.overflow = 'auto'; 
}
