/**
 * Educational Prompts App Logic
 * Modules: CONFIG, ThemeManager, SheetService, UIController, App Initialization
 */

// הגדרת תצורת Tailwind עבור Dark Mode
if (window.tailwind) {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: ['Heebo', 'sans-serif'],
        },
        colors: {
          brand: {
            50: '#f5f3ff',
            100: '#ede9fe',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
          }
        }
      }
    }
  };
}

// קבועים וקישורים
const CONFIG = {
  SHEET_ID: '1Ca9sM_Hy-MvOGT5gaMSpEg6Xf9FiC47rrxEm0wvNQVo',
  GVIZ_URL: 'https://docs.google.com/spreadsheets/d/1Ca9sM_Hy-MvOGT5gaMSpEg6Xf9FiC47rrxEm0wvNQVo/gviz/tq?tqx=out:json',
  COMPLEXITY_LEVELS: ['הכל', 'בסיסי', 'בינוני', 'מתקדם']
};

// מאגר פרומפטים מובנה כגיבוי איכותי
const DEFAULT_PROMPTS = [
  {
    id: 'def-1',
    title: 'תכנון מערך שיעור אינטראקטיבי מבוסס מיומנויות',
    goal: 'בניית מערך שיעור מובנה הכולל פתיחה מסקרנת, התנסות פעילה ומשוב מעצב',
    scenario: 'המורה מעוניינת לבנות שיעור מעורר מעורבות בנושא חדש ומאתגר, וזקוקה לחלוקת זמנים ולשאלת פתיחה (Hook) שתרתק את הכיתה.',
    prompt: `פעל כמומחה פדגוגי בכיר. בנה מערך שיעור מקיף בנושא: [נושא השיעור].\nקהל היעד: תלמידי כיתה [שכבת גיל/כיתה], משך השיעור: [45 / 90 דקות].\nהמטרות הלימודיות: [מטרות עיקריות].\n\nאנא בנה את המערך במבנה הבא:\n1. פתיחה ומליאה (Hook): שאלת אתגר, סרטון או חידה לעורר סקרנות (5-10 דק').\n2. הקנייה ממוקדת: הצגת הרעיון המרכזי בדרך חווייתית ואינטראקטיבית.\n3. פעילות והתנסות בקבוצות/יחידים: משימה פעילה המפתחת חשיבה ביקורתית.\n4. סיכום והערכה מעצבת: כרטיס יציאה (Exit Ticket) או שאלת רפלקציה.\n5. הצעת דיפרנציאציה: התאמה לתלמידים מתקשים ותלמידים מצטיינים.`,
    tips: 'הגדירו מראש מטרות לימודיות ברורות ומדודות. ציינו אם יש מגבלות ציוד (למשל: ללא מחשבים / עם טלפונים).',
    warnings: 'ודאו שהזמנים המוצעים ריאליים לכיתה שלכם ושמשימת הסיכום אכן בודקת את השגת המטרה.',
    complexity: 'בינוני',
    approved: 1
  },
  {
    id: 'def-2',
    title: 'יצירת משחק חדר בריחה לימודי בכיתה',
    goal: 'הפיכת נושא לימודי למשחק חידות ואתגרים מרתק לעבודה שיתופית בקבוצות',
    scenario: 'כהכנה למבחן סיכום או לשיעור חווייתי לקראת סוף יחידת לימוד, המורה רוצה שהתלמידים יפתרו חידות תוכן בשיתוף פעולה.',
    prompt: `אתה מעצב משחקים לימודיים (Gamification Specialist).\nתכנן חדר בריחה כיתתי (בלי ציוד יקר, על בסיס דפים ורמזים) בנושא: [נושא השיעור/היחידה].\nקהל היעד: כיתה [שכבת גיל], מספר תחנות: [3 עד 5 תחנות].\n\nעבור כל תחנה/חידה כלול:\n1. סיפור המסגרת (עלילה מסתורית ומלהיבה שמתאימה לגיל).\n2. תוכן החידה המבוסס ישירות על החומר הנלמד (למשל: צופן, פירמידת מושגים, התאמת כרטיסיות).\n3. פתרון החידה וקבלת קוד או מילת מפתח לשלב הבא.\n4. רמז למורה במידה והתלמידים נתקעים.\n5. משימת סיום קבוצתית המשלבת את כל הקודים שנאספו.`,
    tips: 'מומלץ להגדיר סיפור מסגרת סוחף שמתחבר לעולמם של התלמידים. הכינו דפי עזר עם רמזים מראש.',
    warnings: 'אל תייצרו חידות מורכבות מדי מתמטית/טכנית שיסיטו את הפוקוס מהתוכן הלימודי הנלמד.',
    complexity: 'מתקדם',
    approved: 1
  },
  {
    id: 'def-3',
    title: 'מחוון הערכה מפורט עם מדרגות ביצוע (Rubric)',
    goal: 'ניסוח מחוון הערכה שקוף וברור למטלה, פרויקט או עבודה כתובה',
    scenario: 'המורה חילקה פרויקט חקר ורוצה שהתלמידים ידעו בדיוק כיצד יוערכו בכל קריטריון.',
    prompt: `צור מחוון הערכה (רובריקה) מקצועי ומפורט עבור המטלה: [תיאור המטלה או הפרויקט].\nשכבת גיל: [שכבת כיתה], מקצוע: [תחום הדעת].\nהניקוד הכולל: 100 נקודות.\n\nאנא בנה טבלה עם 4 רמות ביצוע:\n- מצטיין (100%-90%)\n- טוב מאוד / נאות (89%-75%)\n- טעון שיפור (74%-60%)\n- לא מותאם / ראשוני (מתחת ל-60%)\n\nהקריטריונים להערכה צריכים לכלול:\n1. שליטה בתוכן ובמושגים המרכזיים.\n2. עומק הניתוח והחשיבה הביקורתית.\n3. מבנה, בהירות וארגון המידע.\n4. יצירתיות, מקוריות ועבודת צוות.\nהוסף גם שאלות קצרות להערכה עצמית של התלמיד.`,
    tips: 'השתמשו בניסוחים חיוביים המתארים מה התלמיד השיג ולא רק מה חסר.',
    warnings: 'ודאו שסך כל האחוזים והנקודות מתכנסים במדויק ל-100 נקודות.',
    complexity: 'בסיסי',
    approved: 1
  },
  {
    id: 'def-4',
    title: 'פישוט והנגשת טקסט מורכב להוראה מותאמת',
    goal: 'התאמת טקסט עיוני ברמות קריאה שונות עם ביאורי מילים ושאלות הבנה',
    scenario: 'בכיתה הטרוגנית, המורה רוצה שכל התלמידים יעבדו על אותו נושא אך ברמת טקסט נגישה לתלמידי שילוב.',
    prompt: `אנא פעל כמומחה להוראה מותאמת והנגשת שפה.\nלפניך הטקסט הבא:\n\"\"\"\n[הדבק כאן את הטקסט המקורי]\n\"\"\"\n\nבצע את הפעולות הבאות:\n1. שכתב את הטקסט לרמת קריאה המתאימה לתלמידי [שכבת גיל / רמת קריאה].\n2. השתמש במשפטים קצרים וברורים, חלק לפסקאות עם כותרות ביניים.\n3. צור מילון מונחים קצר בצד עם 4-5 מילים מאתגרות והסברן בעברית פשוטה.\n4. נסח 3 שאלות הבנה ברמות חשיבה שונות: שאלה לאיתור מידע, שאלה להסקת מסקנות ושאלה לחיבור אישי של הלומד.`,
    tips: 'הדביקו טקסט קצר יחסית (עד 300 מילים בכל פעם) כדי לקבל פישוט איכותי ומדויק.',
    warnings: 'בדקו שהשכתוב לא השמיט מושגי מפתח קריטיים הנדרשים בתוכנית הלימודים.',
    complexity: 'בסיסי',
    approved: 1
  },
  {
    id: 'def-5',
    title: 'סימולציית שיחה עם דמות היסטורית / מדעית',
    goal: 'הפיכת ה-AI לדמות היסטורית או מדעית לראיון כיתתי מעמיק',
    scenario: 'במהלך שיעור היסטוריה או מדעים, המורה מקרין את הצ׳אט והכיתה "מראיינת" את אלברט איינשטיין או דוד בן גוריון.',
    prompt: `אני רוצה שתשמש כדמות של: [שם הדמות - למשל אלברט איינשטיין / דוד בן-גוריון / מארי קירי].\nהשיחה מיועדת לתלמידי כיתה [שכבת גיל] שלומדים על [הנושא הנלמד והתקופה].\n\nהנחיות להתנהגותך:\n1. הישאר בדמות לאורך כל השיחה! דבר בגוף ראשון בסגנון התקופה אך בשפה נגישה לתלמידים.\n2. פתח בברכה חמה והצג את עצמך בקצרה יחד עם ההישג או האירוע המרכזי בחייך.\n3. עודד את התלמידים לשאול אותך שאלות קשות על הדילמות, הכישלונות והתגליות שלך.\n4. בסוף כל תשובה, החזר לתלמיד שאלה מעוררת מחשבה שמשווה בין התקופה שלך למציאות של היום.`,
    tips: 'בקשו מהתלמידים להכין מראש 2 שאלות מאתגרות שלא ניתן לענות עליהן ב"כן/לא".',
    warnings: 'הזכירו לתלמידים שמדובר בסימולציה מבוססת בינה מלאכותית ויש לאמת עובדות היסטוריות קריטיות.',
    complexity: 'בינוני',
    approved: 1
  },
  {
    id: 'def-6',
    title: 'יצירת דף עבודה מדורג ברמות קושי עולות',
    goal: 'הפקת דף עבודה הכולל שאלות ידע, הבנה, יישום ואתגר לחשיבה גבוהה',
    scenario: 'המורה רוצה דף תרגול אישי לכיתה שמאפשר לכל תלמיד להתקדם בקצב שלו לפי רמתו.',
    prompt: `פעל כמפתח תכניות לימודים. צור דף עבודה מקיף ומדורג בנושא: [נושא דף העבודה].\nמקצוע: [מתמטיקה / מדעים / אזרחות / לשון / אחר], שכבת גיל: [כיתה].\n\nבנה את דף העבודה ב-3 רמות מדורגות:\nרמה 1 - שליטה בסיסית והגדרות (3 שאלות ידע והבנה ישירה).\nרמה 2 - יישום וניתוח (2 שאלות מורכבות / בעיות מילוליות / ניתוח מקרה).\nרמה 3 - שאלת אתגר והעמקה (משימת חקר קצרה או שאלת חשיבה ביקורתית).\n\nלכל שאלה הוסף:\n- מחוון קצר לתשובה נכונה\n- טיפ/רמז לתלמיד שמתקשה`,
    tips: 'ציינו את המושגים המדויקים שתרצו שיופיעו בשאלות הרמה הבסיסית.',
    warnings: 'וודאו ששאלת האתגר עדיין ברת השגה ואינה דורשת ידע מוקדם שלא נלמד.',
    complexity: 'בינוני',
    approved: 1
  }
];

// ניהול המצב הגלובלי של האפליקציה
const State = {
  allPrompts: [],
  searchQuery: '',
  selectedComplexity: 'הכל',
  currentEditingPrompt: null,
  variableValues: {},
  activeEditTab: 'smart',
  theme: 'light'
};

// ניהול מצב כהה / בהיר
const ThemeManager = {
  init() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light');

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.setTheme(e.matches ? 'dark' : 'light');
      });
    }
  },

  setTheme(theme) {
    State.theme = theme;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
    }
  },

  toggle() {
    const nextTheme = State.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    UIController.showToast(nextTheme === 'dark' ? 'עברת למצב כהה 🌙' : 'עברת למצב בהיר ☀️');
  }
};

// שירות משיכת נתונים וזיהוי מדויק של עמודות מ-Google Sheets
const SheetService = {
  async fetchPrompts() {
    const response = await fetch(CONFIG.GVIZ_URL);
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const text = await response.text();

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('Invalid JSON format');

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);

    const rawCols = data.table.cols || [];
    const rows = data.table.rows || [];

    // שחזור כותרות העמודות (כולל בדיקה אם כותרות נמצאות בשורה הראשונה)
    const firstRowCells = rows[0]?.c || [];
    const headers = rawCols.map((col, idx) => {
      let label = (col.label || col.id || '').trim().toLowerCase();
      if ((!label || /^[a-z]$/i.test(label)) && firstRowCells[idx] && firstRowCells[idx].v) {
        label = String(firstRowCells[idx].v).trim().toLowerCase();
      }
      return { idx, label };
    });

    const getCol = (predicate) => {
      const found = headers.find(h => predicate(h.label));
      return found ? found.idx : -1;
    };

    // זיהוי עמודות מדויק ומניעת בלבול בין שם הפרומפט לתבנית הפרומפט
    const approvedIdx = getCol(l => l.includes('מאושר') || l.includes('approved') || l.includes('אישור') || l.includes('סטטוס'));
    
    // שם הפרומפט - עמודה שמכילה 'שם' או 'כותרת'
    const titleIdx = getCol(l => (l.includes('שם') || l.includes('כותרת') || l.includes('title')) && !l.includes('משתמש'));
    
    // מטרת הפרומפט
    const goalIdx = getCol(l => l.includes('מטר') || l.includes('goal') || l.includes('purpose'));
    
    // תבנית הפרומפט - שדה התוכן! מוודא שאינו לוכד בטעות את שדה "שם הפרומפט"
    const promptTemplateIdx = getCol(l => {
      if (l.includes('תבנית') || l.includes('template')) return true;
      if (l.includes('פרומפט') && !l.includes('שם') && !l.includes('מטר') && !l.includes('הסבר') && !l.includes('מורכבות') && !l.includes('הערות') && !l.includes('רמת')) {
        return true;
      }
      if (l.includes('prompt') && !l.includes('name') && !l.includes('title') && !l.includes('goal') && !l.includes('level')) {
        return true;
      }
      return false;
    });

    const scenarioIdx = getCol(l => l.includes('תרחיש') || l.includes('דוגמא') || l.includes('scenario') || l.includes('example'));
    const tipsIdx = getCol(l => l.includes('טיפ') || l.includes('הסבר') || l.includes('הנחיות') || l.includes('tips') || l.includes('עבודה נכונה'));
    const warningsIdx = getCol(l => l.includes('אזהר') || l.includes('הערות') || l.includes('מגבלות') || l.includes('מה לא לעשות') || l.includes('warnings'));
    const complexityIdx = getCol(l => l.includes('מורכבות') || l.includes('רמת') || l.includes('רמה') || l.includes('complexity') || l.includes('קושי'));

    const parsedPrompts = [];

    rows.forEach((row, rowIndex) => {
      const cells = row.c || [];
      const getVal = (idx) => (idx >= 0 && cells[idx] && cells[idx].v !== null && cells[idx].v !== undefined) ? String(cells[idx].v).trim() : '';

      // סינון: רק שורות בהן מופיע 1 בעמודת מאושר
      const approvedVal = approvedIdx >= 0 ? getVal(approvedIdx) : (cells[0] ? String(cells[0].v).trim() : '1');
      const isApproved = approvedVal === '1' || approvedVal.toLowerCase() === 'true' || approvedVal === 'כן' || approvedVal === 'מאושר';

      if (isApproved) {
        const title = titleIdx >= 0 ? getVal(titleIdx) : getVal(1) || `פרומפט ${rowIndex + 1}`;
        const goal = goalIdx >= 0 ? getVal(goalIdx) : getVal(2) || 'ללא תיאור מוגדר';
        const scenario = scenarioIdx >= 0 ? getVal(scenarioIdx) : '';
        
        // שליפת תבנית הפרומפט המדויקת
        const promptTemplate = promptTemplateIdx >= 0 ? getVal(promptTemplateIdx) : (getVal(3) || goal);
        
        const tips = tipsIdx >= 0 ? getVal(tipsIdx) : '';
        const warnings = warningsIdx >= 0 ? getVal(warningsIdx) : '';
        const complexity = complexityIdx >= 0 ? getVal(complexityIdx) : 'בסיסי';

        if (title && (promptTemplate || goal)) {
          parsedPrompts.push({
            id: `sheet-${rowIndex}`,
            title,
            goal,
            scenario: scenario || 'מתאים לשילוב במהלך הוראה פרונטלית, עבודה קבוצתית או תרגול עצמאי.',
            prompt: promptTemplate || goal,
            tips: tips || 'מומלץ להזין את המשתנים הרלוונטיים לכיתתכם ולדייק את התוצאה בשיחה חוזרת.',
            warnings: warnings || 'זכרו לבדוק את התוצרים שמופקים ולוודא התאמה מלאה לרמת התלמידים.',
            complexity: complexity || 'בסיסי',
            approved: 1
          });
        }
      }
    });

    return parsedPrompts;
  }
};

// בקר ממשק המשתמש
const UIController = {
  showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    toastText.textContent = message;
    toast.classList.remove('-translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('-translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3600);
  },

  copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  },

  extractVariables(text) {
    const regex = /\[(.*?)\]/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  },

  getComplexityBadge(complexity) {
    const comp = (complexity || 'בסיסי').trim();
    if (comp.includes('מתקדם')) {
      return { text: 'מתקדם', class: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
    } else if (comp.includes('בינוני')) {
      return { text: 'בינוני', class: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
    }
    return { text: 'בסיסי', class: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
  },

  renderComplexityFilters() {
    const container = document.getElementById('complexity-filters');
    container.innerHTML = '';

    CONFIG.COMPLEXITY_LEVELS.forEach(lvl => {
      const btn = document.createElement('button');
      const isActive = State.selectedComplexity === lvl;
      btn.className = `px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
        isActive
          ? 'bg-indigo-600 text-white shadow-sm font-bold'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`;
      btn.textContent = lvl;
      btn.onclick = () => {
        State.selectedComplexity = lvl;
        this.renderComplexityFilters();
        this.renderPrompts();
      };
      container.appendChild(btn);
    });
  },

  getFilteredPrompts() {
    return State.allPrompts.filter(p => {
      if (State.selectedComplexity !== 'הכל' && !p.complexity.includes(State.selectedComplexity)) {
        return false;
      }

      if (State.searchQuery.trim()) {
        const q = State.searchQuery.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchGoal = (p.goal || '').toLowerCase().includes(q);
        const matchScenario = (p.scenario || '').toLowerCase().includes(q);
        const matchPrompt = (p.prompt || '').toLowerCase().includes(q);
        const matchTips = (p.tips || '').toLowerCase().includes(q);
        const matchWarnings = (p.warnings || '').toLowerCase().includes(q);
        const matchComplexity = (p.complexity || '').toLowerCase().includes(q);

        if (!matchTitle && !matchGoal && !matchScenario && !matchPrompt && !matchTips && !matchWarnings && !matchComplexity) {
          return false;
        }
      }

      return true;
    });
  },

  renderPrompts() {
    const grid = document.getElementById('prompts-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsCount = document.getElementById('results-count');

    const filtered = this.getFilteredPrompts();
    resultsCount.innerHTML = `נמצאו <strong class="text-slate-800 dark:text-slate-100 font-bold">${filtered.length}</strong> פרומפטים מתאימים`;

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    filtered.forEach(prompt => {
      const badge = this.getComplexityBadge(prompt.complexity);

      const card = document.createElement('div');
      card.className = 'group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-6 shadow-sm hover:shadow-xl dark:shadow-slate-950 transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden transform hover:-translate-y-1';
      
      card.innerHTML = `
        <!-- Top Gradient Border -->
        <div class="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

        <div class="space-y-3">
          <!-- Badge & AI indicators -->
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.class}">
              רמת ${badge.text}
            </span>
            <span class="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <svg class="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
              ChatGPT • Claude • Gemini
            </span>
          </div>

          <!-- שם הפרומפט -->
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            ${prompt.title}
          </h3>

          <!-- מטרת הפרומפט -->
          <div class="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              מטרת הפרומפט:
            </p>
            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
              ${prompt.goal || 'הפקת תוצר פדגוגי איכותי מותאם'}
            </p>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5 flex items-center justify-between">
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">צפייה בכל השדות ועריכה</span>
          <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 group-hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 group-hover:text-white font-bold text-xs rounded-xl transition-all shadow-sm">
            <span>התאם ופתח</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </span>
        </div>
      `;

      card.onclick = () => this.openEditModal(prompt);
      grid.appendChild(card);
    });
  },

  openEditModal(prompt) {
    State.currentEditingPrompt = prompt;
    State.variableValues = {};
    State.activeEditTab = 'smart';

    document.getElementById('modal-prompt-title').textContent = prompt.title;
    document.getElementById('modal-prompt-goal').textContent = prompt.goal || 'ללא תיאור מוגדר';
    
    const badge = this.getComplexityBadge(prompt.complexity);
    const badgeEl = document.getElementById('modal-complexity-badge');
    badgeEl.textContent = `רמת מורכבות: ${badge.text}`;
    badgeEl.className = `inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.class}`;

    document.getElementById('modal-scenario-text').textContent = prompt.scenario || 'לא הוזן תרחיש שימוש ספציפי.';
    document.getElementById('modal-tips-text').textContent = prompt.tips || 'הזינו ערכים ספציפיים וברורים במשתנים לקבלת תוצאה מדויקת.';
    document.getElementById('modal-warnings-text').textContent = prompt.warnings || 'מומלץ לעבור על תשובת הבינה המלאכותית ולאמת עובדות טרם שימוש בכיתה.';
    
    // טעינת תבנית הפרומפט לשדה העריכה
    document.getElementById('modal-prompt-textarea').value = prompt.prompt;

    const vars = this.extractVariables(prompt.prompt);
    const varGrid = document.getElementById('variable-inputs-grid');
    const smartTabLabel = document.getElementById('tab-smart-label');

    smartTabLabel.textContent = vars.length > 0 ? `הזנת משתנים (${vars.length})` : 'הזנת משתנים';
    varGrid.innerHTML = '';

    if (vars.length > 0) {
      vars.forEach(variableName => {
        State.variableValues[variableName] = '';
        const div = document.createElement('div');
        div.className = 'space-y-1';
        div.innerHTML = `
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">${variableName}</label>
          <input
            type="text"
            placeholder="הזן ערך עבור ${variableName}..."
            class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
        `;
        const input = div.querySelector('input');
        input.oninput = (e) => {
          State.variableValues[variableName] = e.target.value;
          this.updateLivePreview();
        };
        varGrid.appendChild(div);
      });
    } else {
      varGrid.innerHTML = `
        <div class="col-span-full text-center py-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
          תבנית זו אינה מכילה משתנים מוגדרים מראש. תוכלו לעבור ללשונית "עריכת טקסט חופשית" לשינוי הנוסח לפי הצורך.
        </div>
      `;
    }

    this.setEditTab('smart');
    this.updateLivePreview();

    document.getElementById('edit-modal').classList.remove('hidden');
  },

  setEditTab(tab) {
    State.activeEditTab = tab;
    const smartBtn = document.getElementById('tab-smart-btn');
    const directBtn = document.getElementById('tab-direct-btn');
    const smartContainer = document.getElementById('smart-fields-container');
    const directContainer = document.getElementById('direct-edit-container');

    if (tab === 'smart') {
      smartBtn.className = 'px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm transition-all flex items-center gap-1 font-bold';
      directBtn.className = 'px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1';
      smartContainer.classList.remove('hidden');
      directContainer.classList.add('hidden');
    } else {
      smartBtn.className = 'px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1';
      directBtn.className = 'px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm transition-all flex items-center gap-1 font-bold';
      smartContainer.classList.add('hidden');
      directContainer.classList.remove('hidden');
      document.getElementById('modal-prompt-textarea').value = this.getCalculatedPromptText();
    }
  },

  getCalculatedPromptText() {
    if (!State.currentEditingPrompt) return '';
    let text = State.currentEditingPrompt.prompt;
    Object.entries(State.variableValues).forEach(([k, v]) => {
      if (v && v.trim()) {
        text = text.replaceAll(`[${k}]`, v.trim());
      }
    });
    return text;
  },

  updateLivePreview() {
    const preview = document.getElementById('prompt-live-preview');
    preview.textContent = this.getCalculatedPromptText();
  },

  getFinalPrompt() {
    if (State.activeEditTab === 'smart') {
      return this.getCalculatedPromptText();
    } else {
      return document.getElementById('modal-prompt-textarea').value;
    }
  },

  closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
  },

  launchChatGPT() {
    const text = UIController.getFinalPrompt();
    UIController.copyToClipboard(text);
    const url = `https://chatgpt.com/?q=${encodeURIComponent(text)}`;
    UIController.showToast('פותח את ChatGPT עם הפרומפט הערוך...');
    setTimeout(() => window.open(url, '_blank'), 200);
  },

  launchClaude() {
    const text = UIController.getFinalPrompt();
    UIController.copyToClipboard(text);
    const url = `https://claude.ai/new?q=${encodeURIComponent(text)}`;
    UIController.showToast('פותח את Claude עם הפרומפט הערוך...');
    setTimeout(() => window.open(url, '_blank'), 200);
  },

  launchGemini() {
    const text = UIController.getFinalPrompt();
    UIController.copyToClipboard(text);
    UIController.showToast('הפרומפט הועתק ללוח! ב-Gemini לחצו Ctrl+V להדבקה ✨');
    setTimeout(() => window.open('https://gemini.google.com/app', '_blank'), 250);
  }
};

// פתיחת מודאל תרומת פרומפט מהפוטר
window.openContributeModal = () => {
  document.getElementById('contribute-modal').classList.remove('hidden');
};

// אתחול האפליקציה וטעינת הנתונים
async function initApp() {
  ThemeManager.init();

  const statusEl = document.getElementById('data-status');
  const refreshIcon = document.getElementById('refresh-icon');
  refreshIcon.classList.add('animate-spin', 'text-indigo-600');
  statusEl.textContent = 'טוען נתונים מהגיליון...';

  try {
    const parsed = await SheetService.fetchPrompts();
    if (parsed && parsed.length > 0) {
      State.allPrompts = parsed;
      statusEl.textContent = `נטענו ${parsed.length} פרומפטים מאושרים בזמן אמת`;
      UIController.showToast(`נטענו ${parsed.length} פרומפטים מאושרים בהצלחה!`);
    } else {
      State.allPrompts = DEFAULT_PROMPTS;
      statusEl.textContent = 'מוצגים פרומפטים מובנים (הגיליון ריק מפרומפטים שסומנו 1 במאושר)';
    }
  } catch (err) {
    console.warn('Fallback to curated prompts:', err);
    State.allPrompts = DEFAULT_PROMPTS;
    statusEl.textContent = 'מוצג מאגר פרומפטים חינוכיים מובנה';
  } finally {
    refreshIcon.classList.remove('animate-spin', 'text-indigo-600');
    UIController.renderComplexityFilters();
    UIController.renderPrompts();
  }

  // חיבור מאזיני אירועים
  document.getElementById('theme-toggle-btn').onclick = () => ThemeManager.toggle();
  document.getElementById('refresh-btn').onclick = () => initApp();

  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  searchInput.oninput = (e) => {
    State.searchQuery = e.target.value;
    if (State.searchQuery) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    UIController.renderPrompts();
  };

  clearSearchBtn.onclick = () => {
    searchInput.value = '';
    State.searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    UIController.renderPrompts();
  };

  document.getElementById('reset-filters-btn').onclick = () => {
    searchInput.value = '';
    State.searchQuery = '';
    State.selectedComplexity = 'הכל';
    clearSearchBtn.classList.add('hidden');
    UIController.renderComplexityFilters();
    UIController.renderPrompts();
  };

  document.getElementById('tab-smart-btn').onclick = () => UIController.setEditTab('smart');
  document.getElementById('tab-direct-btn').onclick = () => UIController.setEditTab('direct');

  document.getElementById('launch-chatgpt-btn').onclick = UIController.launchChatGPT;
  document.getElementById('launch-claude-btn').onclick = UIController.launchClaude;
  document.getElementById('launch-gemini-btn').onclick = UIController.launchGemini;

  document.getElementById('modal-copy-only-btn').onclick = () => {
    const text = UIController.getFinalPrompt();
    UIController.copyToClipboard(text);
    UIController.showToast('הפרומפט המותאם הועתק ללוח בהצלחה!');
  };
  document.getElementById('modal-close-bottom-btn').onclick = () => UIController.closeEditModal();
  document.getElementById('close-edit-modal-btn').onclick = () => UIController.closeEditModal();

  const contribModal = document.getElementById('contribute-modal');
  document.getElementById('contribute-btn').onclick = () => contribModal.classList.remove('hidden');
  document.getElementById('close-contribute-modal-btn').onclick = () => contribModal.classList.add('hidden');

  window.onclick = (e) => {
    const editModal = document.getElementById('edit-modal');
    if (e.target === editModal) UIController.closeEditModal();
    if (e.target === contribModal) contribModal.classList.add('hidden');
  };
}

// הפעלה בעת טעינת העמוד
document.addEventListener('DOMContentLoaded', initApp);
