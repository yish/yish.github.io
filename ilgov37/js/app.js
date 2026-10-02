/**
 * ממשלת ישראל ה-37: תעודת סיום
 * Core Application Logic
 */

const STATE = {
  currentLang: 'he',
  theme: 'light',
  density: 'compact',
  activeFilter: 'all',
  selectedTopicId: 'all',
  searchQuery: '',
  uiStrings: {},
  contentData: {}
};

const DOC_REPORT_URL = "https://docs.google.com/document/d/1xrR56z_ModNzuMQJjj3cpW9hQDB6REx5SbiwSN-yliM/edit?usp=sharing";
const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSexihWTSheCFHFo9AfhV5W-pJmW8H6_CizbDJlAyXQrle5FpA/viewform?embedded=true";
const FEEDBACK_FORM_DIRECT_URL = "https://docs.google.com/forms/d/e/1FAIpQLSexihWTSheCFHFo9AfhV5W-pJmW8H6_CizbDJlAyXQrle5FpA/viewform?usp=publish-editor";

// Initializer
document.addEventListener('DOMContentLoaded', async () => {
  loadStoredPreferences();
  await loadI18nStrings();
  await loadContent(STATE.currentLang);
  setupEventListeners();
  renderApp();
});

function loadStoredPreferences() {
  const savedLang = localStorage.getItem('gov37_lang');
  const savedTheme = localStorage.getItem('gov37_theme');
  const savedDensity = localStorage.getItem('gov37_density');

  if (savedLang) STATE.currentLang = savedLang;
  if (savedTheme) STATE.theme = savedTheme;
  if (savedDensity) STATE.density = savedDensity;

  document.getElementById('lang-select').value = STATE.currentLang;
  document.getElementById('theme-select').value = STATE.theme;
  document.getElementById('density-select').value = STATE.density;

  applyTheme(STATE.theme);
  applyDensity(STATE.density);
}

async function loadI18nStrings() {
  try {
    const res = await fetch('data/i18n_ui.json');
    STATE.uiStrings = await res.json();
  } catch (err) {
    console.error('Failed to load UI strings:', err);
  }
}

async function loadContent(lang) {
  try {
    const res = await fetch(`data/content_${lang}.json`);
    STATE.contentData = await res.json();
  } catch (err) {
    console.error(`Failed to load content for ${lang}:`, err);
  }
}

function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('gov37_theme', theme);
}

function applyDensity(density) {
  document.body.classList.remove('density-compact', 'density-dense');
  document.body.classList.add(`density-${density}`);
  localStorage.setItem('gov37_density', density);
}

function updateDirection(lang) {
  const isRtl = lang === 'he' || lang === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
}

function setupEventListeners() {
  // Open Share & QR Modal
  const btnShare = document.getElementById('btn-share');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      document.getElementById('share-modal').classList.remove('hidden');
    });
  }

  // Close Share Modal
  const shareClose = document.getElementById('share-close');
  if (shareClose) {
    shareClose.addEventListener('click', () => {
      document.getElementById('share-modal').classList.add('hidden');
    });
  }

  // Native Web Share API (Ideal for Mobile)
  const btnNativeShare = document.getElementById('btn-native-share');
  if (btnNativeShare) {
    btnNativeShare.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: 'ממשלת ישראל ה-37: תעודת סיום — דו"ח הערכה אסטרטגי',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User cancelled or unsupported
        }
      } else {
        // Fallback to copy link
        copyAppUrl();
      }
    });
  }

  // Copy URL button
  const btnCopyUrl = document.getElementById('btn-copy-url');
  if (btnCopyUrl) {
    btnCopyUrl.addEventListener('click', copyAppUrl);
  }
  
  // Language Change
  document.getElementById('lang-select').addEventListener('change', async (e) => {
    STATE.currentLang = e.target.value;
    localStorage.setItem('gov37_lang', STATE.currentLang);
    updateDirection(STATE.currentLang);
    await loadContent(STATE.currentLang);
    renderApp();
  });

  // Theme Change
  document.getElementById('theme-select').addEventListener('change', (e) => {
    STATE.theme = e.target.value;
    applyTheme(STATE.theme);
  });

  // Density Change
  document.getElementById('density-select').addEventListener('change', (e) => {
    STATE.density = e.target.value;
    applyDensity(STATE.density);
  });

  // Search Filter
  document.getElementById('filter-input').addEventListener('input', (e) => {
    STATE.searchQuery = e.target.value.toLowerCase().trim();
    renderCards();
  });

  // Topic Select Dropdown
  document.getElementById('topic-select').addEventListener('change', (e) => {
    STATE.selectedTopicId = e.target.value;
    renderCards();
  });

  // Category Status Filters
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      STATE.activeFilter = chip.getAttribute('data-filter');
      renderCards();
    });
  });

  // Summary Toggle
  const toggleBtn = document.getElementById('btn-toggle-summary');
  const summaryBody = document.getElementById('summary-content');
  toggleBtn.addEventListener('click', () => {
    summaryBody.classList.toggle('collapsed');
    const strings = STATE.uiStrings[STATE.currentLang] || {};
    toggleBtn.textContent = summaryBody.classList.contains('collapsed') 
      ? (strings.read_more || 'קרא עוד') 
      : (strings.read_less || 'סגור');
  });

  // Modals Close
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('detail-modal').classList.add('hidden');
  });
  document.getElementById('about-close').addEventListener('click', () => {
    document.getElementById('about-modal').classList.add('hidden');
  });

  document.getElementById('btn-about').addEventListener('click', () => {
    renderAboutModal();
    document.getElementById('about-modal').classList.remove('hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.add('hidden');
    }
  });
}

function populateTopicDropdown() {
  const topicSelect = document.getElementById('topic-select');
  const strings = STATE.uiStrings[STATE.currentLang] || {};
  const chapters = STATE.contentData.chapters || [];

  topicSelect.innerHTML = '';
  
  // Default option
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = strings.dropdown_all_topics || 'כל הנושאים';
  topicSelect.appendChild(allOption);

  chapters.forEach(chap => {
    const opt = document.createElement('option');
    opt.value = chap.id;
    opt.textContent = chap.title;
    topicSelect.appendChild(opt);
  });

  topicSelect.value = STATE.selectedTopicId || 'all';
}

function renderApp() {
  updateDirection(STATE.currentLang);
  const strings = STATE.uiStrings[STATE.currentLang] || {};
  const btnShareSpan = document.getElementById('ui-btn-share');
  if (btnShareSpan) btnShareSpan.textContent = strings.btn_share || '🔗 שתף / QR';
  
  const shareTitle = document.getElementById('ui-share-modal-title');
  if (shareTitle) shareTitle.textContent = strings.share_modal_title || 'שיתוף היישום';
  
  const qrInstruct = document.getElementById('ui-qr-instruction');
  if (qrInstruct) qrInstruct.textContent = strings.qr_instruction || 'סרקו במכשיר נייד';

  const btnNativeSpan = document.getElementById('ui-btn-native-share');
  if (btnNativeSpan) btnNativeSpan.textContent = strings.btn_native_share || 'שתף';

  const btnCopySpan = document.getElementById('ui-btn-copy-url');
  if (btnCopySpan) btnCopySpan.textContent = strings.btn_copy_url || 'העתק קישור';

  // Update UI Elements
  document.getElementById('ui-app-title').textContent = strings.app_title || '';
  document.getElementById('ui-app-subtitle').textContent = strings.app_subtitle || '';
  document.getElementById('ui-lbl-lang').textContent = strings.lbl_lang || '';
  document.getElementById('ui-lbl-theme').textContent = strings.lbl_theme || '';
  document.getElementById('ui-lbl-density').textContent = strings.lbl_density || '';
  document.getElementById('ui-opt-light').textContent = strings.opt_light || '';
  document.getElementById('ui-opt-dark').textContent = strings.opt_dark || '';
  document.getElementById('ui-opt-compact').textContent = strings.opt_compact || '';
  document.getElementById('ui-opt-dense').textContent = strings.opt_dense || '';
  document.getElementById('ui-btn-about').textContent = strings.btn_about || '';
  document.getElementById('filter-input').placeholder = strings.search_placeholder || '';

  document.getElementById('ui-filter-all').textContent = strings.filter_all || '';
  document.getElementById('ui-filter-failed').textContent = strings.filter_failed || '';
  document.getElementById('ui-filter-negative').textContent = strings.filter_negative || '';
  document.getElementById('ui-filter-mixed').textContent = strings.filter_mixed || '';

  document.getElementById('ui-summary-title').textContent = strings.summary_title || '';
  document.getElementById('summary-content').textContent = STATE.contentData.executive_summary || '';

  populateTopicDropdown();
  renderCards();
}

function renderCards() {
  const container = document.getElementById('chapters-container');
  container.innerHTML = '';
  const strings = STATE.uiStrings[STATE.currentLang] || {};
  const chapters = STATE.contentData.chapters || [];

  const filtered = chapters.filter(chap => {
    const matchesTopic = (STATE.selectedTopicId === 'all') || (chap.id === STATE.selectedTopicId);
    const matchesFilter = (STATE.activeFilter === 'all') || (chap.status_category === STATE.activeFilter);
    const matchesQuery = !STATE.searchQuery || 
      chap.title.toLowerCase().includes(STATE.searchQuery) ||
      chap.bottom_line.toLowerCase().includes(STATE.searchQuery);
    return matchesTopic && matchesFilter && matchesQuery;
  });

  filtered.forEach(chapter => {
    const card = document.createElement('article');
    card.className = 'card';

    const headlinesList = (chapter.headlines || [])
      .slice(0, 3)
      .map(item => `<li>${item}</li>`)
      .join('');

    card.innerHTML = `
      <div>
        <div class="card-top">
          <h3 class="card-title">${chapter.title}</h3>
          <span class="badge badge-${chapter.status_category}">${chapter.status_label}</span>
        </div>
        <ul class="card-headline-stats">
          ${headlinesList}
        </ul>
      </div>
      <div>
        <div class="bottom-line-box">
          "${chapter.bottom_line}"
        </div>
        <button class="btn btn-primary btn-open-detail" data-id="${chapter.id}">
          ${strings.btn_view_details || 'ניתוח מפורט'}
        </button>
      </div>
    `;

    card.querySelector('.btn-open-detail').addEventListener('click', () => {
      openDetailModal(chapter.id);
    });

    container.appendChild(card);
  });
}

function openDetailModal(chapterId) {
  const chapter = (STATE.contentData.chapters || []).find(c => c.id === chapterId);
  if (!chapter) return;

  const strings = STATE.uiStrings[STATE.currentLang] || {};
  document.getElementById('modal-title').textContent = chapter.title;
  const badge = document.getElementById('modal-category-badge');
  badge.className = `badge badge-${chapter.status_category}`;
  badge.textContent = chapter.status_label;

  let tableHtml = '';
  if (chapter.table && chapter.table.headers && chapter.table.rows) {
    const ths = chapter.table.headers.map(h => `<th>${h}</th>`).join('');
    const trs = chapter.table.rows.map(row => {
      const tds = row.map(cell => `<td>${cell}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    tableHtml = `
      <div class="detail-section">
        <h3>${strings.sec_comparative_table || 'נתונים השוואתיים'}</h3>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr>${ths}</tr></thead>
            <tbody>${trs}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  const modalBody = document.getElementById('modal-body-content');
  modalBody.innerHTML = `
    <div class="detail-section">
      <h3>${strings.sec_overview || 'סקירה והתפתחות'}</h3>
      <p>${chapter.overview || ''}</p>
    </div>

    ${tableHtml}

    <div class="detail-section">
      <h3>${strings.sec_prev_gov_comparison || 'השוואה לממשלה ה-36'}</h3>
      <p>${chapter.comparison_prev_gov || ''}</p>
    </div>

    <div class="detail-section">
      <h3>${strings.sec_arguments || 'עימות עמדות'}</h3>
      <div class="arguments-grid">
        <div class="argument-card arg-supporters">
          <div class="arg-title">${strings.arg_supporters_title || 'טענות התומכים:'}</div>
          <p>${chapter.arguments_supporters || ''}</p>
        </div>
        <div class="argument-card arg-critics">
          <div class="arg-title">${strings.arg_critics_title || 'טענות המבקרים:'}</div>
          <p>${chapter.arguments_critics || ''}</p>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h3>${strings.sec_bottom_line || 'השורה התחתונה'}</h3>
      <div class="bottom-line-box">
        ${chapter.bottom_line || ''}
      </div>
    </div>
  `;

  document.getElementById('detail-modal').classList.remove('hidden');
}

function renderAboutModal() {
  const strings = STATE.uiStrings[STATE.currentLang] || {};
  const aboutBody = document.getElementById('about-body');
  aboutBody.innerHTML = `
    <p style="margin-bottom: 1.25rem;">${strings.about_text_p1 || ''}</p>

    <!-- Link to the full Google Doc Report -->
    <div style="text-align: center; margin-bottom: 1.25rem;">
      <a href="${DOC_REPORT_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-doc-link">
        📄 ${strings.about_view_full_doc || 'לצפייה בדו״ח המלא המקורי (Google Docs)'}
      </a>
    </div>

    <!-- Translation disclaimer -->
    <div style="border-inline-start: 4px solid #f59e0b; padding: 0.75rem 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 0.25rem; margin-bottom: 1.5rem;">
      <p style="font-size: 0.85rem; color: var(--text-main);">
        ${strings.about_translation_disclaimer || ''}
      </p>
    </div>

    <!-- Embedded Feedback Form -->
    <div style="margin-top: 1rem;">
      <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.5rem;">
        ${strings.about_feedback_title || 'טופס משוב, הערות והצעות שיפור:'}
      </h3>
      <div class="form-embed-wrapper">
        <iframe src="${FEEDBACK_FORM_URL}" class="feedback-iframe" loading="lazy">טוען טופס...</iframe>
        <div class="form-fallback">
          <a href="${FEEDBACK_FORM_DIRECT_URL}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); font-weight: 600;">
            ${strings.about_form_external_link || 'פתח את טופס המשוב בלשונית נפרדת ↗'}
          </a>
        </div>
      </div>
    </div>
  `;
}

function copyAppUrl() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const toast = document.getElementById('copy-toast');
    if (toast) {
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    }
  });
}
