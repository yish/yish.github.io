/**
 * Educational Prompts App Logic
 * Modules: CONFIG, BUILTIN_TRANSLATIONS, I18nManager, ThemeManager, SheetService, UIController, App Initialization
 */

// הגדרת תצורת Tailwind עבור Dark Mode ופונטים רב-לשוניים
if (window.tailwind) {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: ['Heebo', 'Cairo', 'Inter', 'sans-serif'],
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
  TRANSLATIONS_URL: 'translations.json',
  COMPLEXITY_LEVELS: ['0', '1', '2', '3', '4', '5'] // '0' represents All/الכל/הכל
};

// מילון תרגומים מובנה כגיבוי מוחלט למקרה ש-translations.json נחסם ב-CORS או בטעינה מקומית
const BUILTIN_TRANSLATIONS = {
  he: {
    appTitle: "פרומפטים לחינוך והוראה",
    appSubtitle: "מאגר תבניות להוראה – התאמה אישית והפעלה ב-ChatGPT, Claude ו-Gemini",
    pedagogicalBadge: "AI פדגוגי",
    bannerText: "לחצו על פרומפט כדי להזין את הפרטים שלכם, ולפתוח ישירות ב-ChatGPT, Claude או Gemini!",
    statusLoading: "טוען פרומפטים מ-Google Sheets...",
    statusLoaded: "נטענו {count} פרומפטים מאושרים בזמן אמת",
    statusFallback: "מוצג מאגר פרומפטים חינוכיים מובנה",
    statusEmpty: "מוצגים פרומפטים מובנים (הגיליון ריק מפרומפטים שסומנו 1 במאושר)",
    refresh: "רענון",
    contribute: "תרמו פרומפט",
    themeToggle: "החלף ערכת נושא (כהה/בהיר)",
    searchPlaceholder: "חפש לפי שם, מטרה, תרחיש שימוש, טיפים או מילות מפתח...",
    categoryLabel: "קטגוריה:",
    complexityLabel: "רמת מורכבות:",
    all: "הכל",
    level: "רמה",
    badgeLevel: "דרגה",
    resultsCount: "נמצאו <strong class=\"text-slate-800 dark:text-slate-100 font-bold\">{count}</strong> פרומפטים מתאימים",
    promptGoalLabel: "מטרת הפרומפט:",
    defaultGoal: "הפקת תוצר פדגוגי איכותי מותאם",
    defaultScenario: "מתאים לשילוב במהלך הוראה פרונטלית, עבודה קבוצתית או תרגול עצמאי.",
    defaultTips: "מומלץ להזין את המשתנים הרלוונטיים לכיתתכם ולדייק את התוצאה בשיחה חוזרת.",
    defaultWarnings: "זכרו לבדוק את התוצרים שמופקים ולוודא התאמה מלאה לרמת התלמידים.",
    cardFooterHint: "צפייה בכל השדות ועריכה",
    cardActionBtn: "התאם ופתח",
    emptyTitle: "לא נמצאו פרומפטים תואמים",
    emptySubtitle: "נסו לשנות את מילות החיפוש או תרמו פרומפט חדש למאגר.",
    resetFilters: "איפוס סינונים",
    approvedRepository: "מאגר פרומפטים מאושר",
    modalComplexityPrefix: "רמת מורכבות: ",
    scenarioTitle: "תרחיש שימוש לדוגמא",
    tipsTitle: "טיפים והסבר לעבודה נכונה",
    warningsTitle: "הערות, אזהרות ומגבלות",
    editSectionTitle: "עריכת תבנית הפרומפט (התוכן שיועבר לצ'אטבוט)",
    smartTab: "הזנת משתנים",
    directTab: "עריכת טקסט חופשית",
    varInputPlaceholder: "הזן ערך עבור {var}...",
    noVarsNotice: "תבנית זו אינה מכילה משתנים מוגדרים מראש בסוגריים מרובעים. תוכלו לעבור ללשונית \"עריכת טקסט חופשית\" לשינוי הנוסח לפי הצורך.",
    livePreviewLabel: "תצוגה מקדימה של הפרומפט הסופי:",
    livePreviewSub: "מתעדכן בזמן אמת",
    directEditTextareaPlaceholder: "ערוך את תבנית הפרומפט כאן...",
    chooseAiLabel: "בחרו היכן לפתוח את הפרומפט הערוך:",
    chooseAiSub: "לחצו על ה-AI המבוקש להפעלה מיידית",
    chatgptSub: "נפתח עם הפרומפט מוטמע ב-URL",
    claudeSub: "נפתח עם הפרומפט מוטמע ב-URL",
    geminiSub: "מועתק ללוח ונפתח להדבקה",
    geminiBadge: "העתק+Ctrl+V",
    copyPromptOnly: "העתק פרומפט בלבד",
    done: "סיום",
    contribModalTitle: "טופס תרומת פרומפט פדגוגי",
    contribModalSub: "הפרומפט ייבדק ויתווסף למאגר לאחר אישור (עמודה 'מאושר' = 1)",
    openInNewTab: "פתח בלשונית נפרדת",
    loadingForm: "טוען טופס...",
    footerTitle: "מאגר פרומפטים שיתופי לחינוך והוראה",
    footerLink: "רוצים לתרום פרומפט משלכם? לחצו כאן",
    toasts: {
      themeDark: "עברת למצב כהה 🌙",
      themeLight: "עברת למצב בהיר ☀️",
      loadedSuccess: "נטענו {count} פרומפטים מאושרים בהצלחה!",
      copiedSuccess: "הפרומפט המותאם הועתק ללוח בהצלחה!",
      launchingChatGPT: "פותח את ChatGPT עם הפרומפט הערוך...",
      launchingClaude: "פותח את Claude עם הפרומפט הערוך...",
      launchingGemini: "הפרומפט הועתק ללוח! ב-Gemini לחצו Ctrl+V להדבקה ✨",
      langChanged: "שפת הממשק הוחלפה לעברית"
    }
  },
  ar: {
    appTitle: "برومبتات للتعليم والتدريس",
    appSubtitle: "مستودع نماذج تعليمية – تخصيص وتشغيل مباشر على ChatGPT و Claude و Gemini",
    pedagogicalBadge: "ذكاء اصطناعي تربوي",
    bannerText: "انقر فوق أي برومبت لإدخال بياناتك وتشغيله مباشرة في ChatGPT أو Claude أو Gemini!",
    statusLoading: "جارٍ تحميل البرومبتات من Google Sheets...",
    statusLoaded: "تم تحميل {count} برومبت معتمد في الوقت الفعلي",
    statusFallback: "يتم عرض مستودع البرومبتات التعليمية المدمج",
    statusEmpty: "يتم عرض البرومبتات المدمجة (الجدول لا يحتوي على برومبتات معتمدة = 1)",
    refresh: "تحديث",
    contribute: "شارك برومبت",
    themeToggle: "تبديل المظهر (داكن/فاتح)",
    searchPlaceholder: "ابحث بالاسم، الهدف، سيناريو الاستخدام، النصائح أو الكلمات المفتاحية...",
    categoryLabel: "الفئة:",
    complexityLabel: "مستوى الصعوبة:",
    all: "الكل",
    level: "مستوى",
    badgeLevel: "درجة",
    resultsCount: "تم العثور على <strong class=\"text-slate-800 dark:text-slate-100 font-bold\">{count}</strong> برومبت مناسب",
    promptGoalLabel: "هدف البرومبت:",
    defaultGoal: "إنتاج مخرجات تربوية عالية الجودة ومخصصة",
    defaultScenario: "مناسب للدمج أثناء التدريس المباشر أو العمل الجماعي أو التدريب الفردي.",
    defaultTips: "يُوصى بإدخال المتغيرات المناسبة لصفك وتحسين النتيجة في محادثة متابعة.",
    defaultWarnings: "تأكد من مراجعة المخرجات الناتجة والتحقق من توافقها مع مستوى الطلاب.",
    cardFooterHint: "عرض جميع الحقول والتعديل",
    cardActionBtn: "تخصيص وفتح",
    emptyTitle: "لم يتم العثور على برومبتات مطابقة",
    emptySubtitle: "جرّب تغيير كلمات البحث أو شارك برومبت جديد في المستودع.",
    resetFilters: "إعادة ضبط الفلاتر",
    approvedRepository: "مستودع برومبتات معتمد",
    modalComplexityPrefix: "مستوى الصعوبة: ",
    scenarioTitle: "سيناريو استخدام نموذجي",
    tipsTitle: "نصائح وإرشادات للعمل الصحيح",
    warningsTitle: "ملاحظات، تحذيرات وقيود",
    editSectionTitle: "تعديل نموذج البرومبت (المحتوى المرسل لروبوت الدردشة)",
    smartTab: "إدخال المتغيرات",
    directTab: "تعديل حر للنص",
    varInputPlaceholder: "أدخل قيمة لـ {var}...",
    noVarsNotice: "هذا النموذج لا يحتوي على متغيرات محددة مسبقًا بين أقواس مربعة. يمكنك الانتقال إلى تبويب \"تعديل حر للنص\" لتعديل الصياغة.",
    livePreviewLabel: "معاينة مباشرة للبرومبت النهائي:",
    livePreviewSub: "يتم التحديث مباشرة",
    directEditTextareaPlaceholder: "عدّل نموذج البرومبت هنا...",
    chooseAiLabel: "اختر أين تريد فتح البرومبت المعدّل:",
    chooseAiSub: "انقر فوق نموذج الذكاء الاصطناعي المطلوب للتشغيل الفوري",
    chatgptSub: "يفتح مع تضمين البرومبت في الرابط",
    claudeSub: "يفتح مع تضمين البرومبت في الرابط",
    geminiSub: "يتم نسخه إلى الحافظة ويفتح للصق",
    geminiBadge: "نسخ+Ctrl+V",
    copyPromptOnly: "نسخ البرومبت فقط",
    done: "إغلاق",
    contribModalTitle: "نموذج مشاركة برومبت تربوي",
    contribModalSub: "سيتم فحص البرومبت وإضافته للمستودع فور الاعتماد (العمود 'معتمد' = 1)",
    openInNewTab: "فتح في علامة تبويب جديدة",
    loadingForm: "جارٍ تحميل النموذج...",
    footerTitle: "مستودع برومبتات تعاوني للتعليم والتدريس",
    footerLink: "هل ترغب في مشاركة برومبت خاص بك؟ اضغط هنا",
    toasts: {
      themeDark: "تم التبديل إلى الوضع الداكن 🌙",
      themeLight: "تم التبديل إلى الوضع الفاتح ☀️",
      loadedSuccess: "تم تحميل {count} برومبت معتمد بنجاح!",
      copiedSuccess: "تم نسخ البرومبت المخصص إلى الحافظة بنجاح!",
      launchingChatGPT: "جارٍ فتح ChatGPT مع البرومبت المعدّل...",
      launchingClaude: "جارٍ فتح Claude مع البرومبت المعدّل...",
      launchingGemini: "تم نسخ البرومبت! في Gemini اضغط Ctrl+V للصق ✨",
      langChanged: "تم تغيير لغة الواجهة إلى العربية"
    }
  },
  en: {
    appTitle: "Prompts for Education & Teaching",
    appSubtitle: "Curated repository of pedagogical prompts – customize and launch in ChatGPT, Claude, and Gemini",
    pedagogicalBadge: "Pedagogical AI",
    bannerText: "Click on any prompt to enter your classroom details, then launch directly in ChatGPT, Claude, or Gemini!",
    statusLoading: "Loading prompts from Google Sheets...",
    statusLoaded: "Loaded {count} approved prompts in real time",
    statusFallback: "Displaying built-in educational prompt repository",
    statusEmpty: "Displaying built-in prompts (sheet has no approved = 1 items)",
    refresh: "Refresh",
    contribute: "Contribute Prompt",
    themeToggle: "Toggle theme (Dark/Light)",
    searchPlaceholder: "Search by title, goal, scenario, tips, or keywords...",
    categoryLabel: "Category:",
    complexityLabel: "Complexity level:",
    all: "All",
    level: "Level",
    badgeLevel: "Level",
    resultsCount: "Found <strong class=\"text-slate-800 dark:text-slate-100 font-bold\">{count}</strong> matching prompts",
    promptGoalLabel: "Prompt Goal:",
    defaultGoal: "Generate tailored, high-quality pedagogical outcomes",
    defaultScenario: "Suitable for front-of-class instruction, group work, or self-paced student activities.",
    defaultTips: "Fill in the relevant variables for your class and refine the answer through follow-up chat.",
    defaultWarnings: "Always review the AI-generated outputs to verify factual accuracy and curriculum fit.",
    cardFooterHint: "View all fields & edit",
    cardActionBtn: "Customize & Launch",
    emptyTitle: "No matching prompts found",
    emptySubtitle: "Try adjusting your search terms or contribute a new prompt to the collection.",
    resetFilters: "Reset filters",
    approvedRepository: "Approved Prompts Repository",
    modalComplexityPrefix: "Complexity: ",
    scenarioTitle: "Example Use Case Scenario",
    tipsTitle: "Tips & Best Practices",
    warningsTitle: "Notes, Warnings & Limitations",
    editSectionTitle: "Edit Prompt Template (Content sent to chatbot)",
    smartTab: "Variable Inputs",
    directTab: "Free Text Edit",
    varInputPlaceholder: "Enter value for {var}...",
    noVarsNotice: "This template does not contain square bracket variables. You can switch to the \"Free Text Edit\" tab to modify text directly.",
    livePreviewLabel: "Live preview of final prompt:",
    livePreviewSub: "Updates in real time",
    directEditTextareaPlaceholder: "Edit the prompt template here...",
    chooseAiLabel: "Choose where to launch the edited prompt:",
    chooseAiSub: "Click your desired AI to launch immediately",
    chatgptSub: "Opens with prompt embedded in URL",
    claudeSub: "Opens with prompt embedded in URL",
    geminiSub: "Copied to clipboard and opened for pasting",
    geminiBadge: "Copy+Ctrl+V",
    copyPromptOnly: "Copy prompt only",
    done: "Done",
    contribModalTitle: "Pedagogical Prompt Contribution Form",
    contribModalSub: "The prompt will be reviewed and published once approved ('approved' column = 1)",
    openInNewTab: "Open in new tab",
    loadingForm: "Loading form...",
    footerTitle: "Collaborative educational prompt repository",
    footerLink: "Want to contribute your own prompt? Click here",
    toasts: {
      themeDark: "Switched to Dark Mode 🌙",
      themeLight: "Switched to Light Mode ☀️",
      loadedSuccess: "Loaded {count} approved prompts successfully!",
      copiedSuccess: "Customized prompt copied to clipboard!",
      launchingChatGPT: "Opening ChatGPT with edited prompt...",
      launchingClaude: "Opening Claude with edited prompt...",
      launchingGemini: "Prompt copied to clipboard! Press Ctrl+V in Gemini to paste ✨",
      langChanged: "Language switched to English"
    }
  }
};

// מאגר פרומפטים מובנה כגיבוי איכותי
const DEFAULT_PROMPTS = [
  {
    id: 'def-1',
    title: 'תכנון מערך שיעור אינטראקטיבי מבוסס מיומנויות',
    goal: 'בניית מערך שיעור מובנה הכולל פתיחה מסקרנת, התנסות פעילה ומשוב מעצב',
    category: 'מערכי שיעור',
    scenario: 'המורה מעוניינת לבנות שיעור מעורר מעורבות בנושא חדש ומאתגר, וזקוקה לחלוקת זמנים ולשאלת פתיחה (Hook) שתרתק את הכיתה.',
    prompt: `פעל כמומחה פדגוגי בכיר. בנה מערך שיעור מקיף בנושא: [נושא השיעור].\nקהל היעד: תלמידי כיתה [שכבת גיל/כיתה], משך השיעור: [45 / 90 דקות].\nהמטרות הלימודיות: [מטרות עיקריות].\n\nאנא בנה את המערך במבנה הבא:\n1. פתיחה ומליאה (Hook): שאלת אתגר, סרטון או חידה לעורר סקרנות (5-10 דק').\n2. הקנייה ממוקדת: הצגת הרעיון המרכזי בדרך חווייתית ואינטראקטיבית.\n3. פעילות והתנסות בקבוצות/יחידים: משימה פעילה המפתחת חשיבה ביקורתית.\n4. סיכום והערכה מעצבת: כרטיס יציאה (Exit Ticket) או שאלת רפלקציה.\n5. הצעת דיפרנציאציה: התאמה לתלמידים מתקשים ותלמידים מצטיינים.`,
    tips: 'הגדירו מראש מטרות לימודיות ברורות ומדודות. ציינו אם יש מגבלות ציוד (למשל: ללא מחשבים / עם טלפונים).',
    warnings: 'ודאו שהזמנים המוצעים ריאליים לכיתה שלכם ושמשימת הסיכום אכן בודקת את השגת המטרה.',
    complexity: '2',
    approved: 1
  },
  {
    id: 'def-2',
    title: 'יצירת משחק חדר בריחה לימודי בכיתה',
    goal: 'הפיכת נושא לימודי למשחק חידות ואתגרים מרתק לעבודה שיתופית בקבוצות',
    category: 'משחוק והפעלות',
    scenario: 'כהכנה למבחן סיכום או לשיעור חווייתי לקראת סוף יחידת לימוד, המורה רוצה שהתלמידים יפתרו חידות תוכן בשיתוף פעולה.',
    prompt: `אתה מעצב משחקים לימודיים (Gamification Specialist).\nתכנן חדר בריחה כיתתי (בלי ציוד יקר, על בסיס דפים ורמזים) בנושא: [נושא השיעור/היחידה].\nקהל היעד: כיתה [שכבת גיל], מספר תחנות: [3 עד 5 תחנות].\n\nעבור כל תחנה/חידה כלול:\n1. סיפור המסגרת (עלילה מסתורית ומלהיבה שמתאימה לגיל).\n2. תוכן החידה המבוסס ישירות על החומר הנלמד (למשל: צופן, פירמידת מושגים, התאמת כרטיסיות).\n3. פתרון החידה וקבלת קוד או מילת מפתח לשלב הבא.\n4. רמז למורה במידה והתלמידים נתקעים.\n5. משימת סיום קבוצתית המשלבת את כל הקודים שנאספו.`,
    tips: 'מומלץ להגדיר סיפור מסגרת סוחף שמתחבר לעולמם של התלמידים. הכינו דפי עזר עם רמזים מראש.',
    warnings: 'אל תייצרו חידות מורכבות מדי מתמטית/טכנית שיסיטו את הפוקוס מהתוכן הלימודי הנלמד.',
    complexity: '4',
    approved: 1
  },
  {
    id: 'def-3',
    title: 'מחוון הערכה מפורט עם מדרגות ביצוע (Rubric)',
    goal: 'ניסוח מחוון הערכה שקוף וברור למטלה, פרויקט או עבודה כתובה',
    category: 'הערכה ומחוונים',
    scenario: 'המורה חילקה פרויקט חקר ורוצה שהתלמידים ידעו בדיוק כיצד יוערכו בכל קריטריון.',
    prompt: `צור מחוון הערכה (רובריקה) מקצועי ומפורט עבור המטלה: [תיאור המטלה או הפרויקט].\nשכבת גיל: [שכבת כיתה], מקצוע: [תחום הדעת].\nהניקוד הכולל: 100 נקודות.\n\nאנא בנה טבלה עם 4 רמות ביצוע:\n- מצטיין (100%-90%)\n- טוב מאוד / נאות (89%-75%)\n- טעון שיפור (74%-60%)\n- לא מותאם / ראשוני (מתחת ל-60%)\n\nהקריטריונים להערכה צריכים לכלול:\n1. שליטה בתוכן ובמושגים המרכזיים.\n2. עומק הניתוח והחשיבה הביקורתית.\n3. מבנה, בהירות וארגון המידע.\n4. יצירתיות, מקוריות ועבודת צוות.\nהוסף גם שאלות קצרות להערכה עצמית של התלמיד.`,
    tips: 'השתמשו בניסוחים חיוביים המתארים מה התלמיד השיג ולא רק מה חסר.',
    warnings: 'ודאו שסך כל האחוזים והנקודות מתכנסים במדויק ל-100 נקודות.',
    complexity: '1',
    approved: 1
  },
  {
    id: 'def-4',
    title: 'פישוט והנגשת טקסט מורכב להוראה מותאמת',
    goal: 'התאמת טקסט עיוני ברמות קריאה שונות עם ביאורי מילים ושאלות הבנה',
    category: 'הוראה מותאמת והכלה',
    scenario: 'בכיתה הטרוגנית, המורה רוצה שכל התלמידים יעבדו על אותו נושא אך ברמת טקסט נגישה לתלמידי שילוב.',
    prompt: `אנא פעל כמומחה להוראה מותאמת והנגשת שפה.\nלפניך הטקסט הבא:\n\"\"\"\n[הדבק כאן את הטקסט המקורי]\n\"\"\"\n\nבצע את הפעולות הבאות:\n1. שכתב את הטקסט לרמת קריאה המתאימה לתלמידי [שכבת גיל / רמת קריאה].\n2. השתמש במשפטים קצרים וברורים, חלק לפסקאות עם כותרות ביניים.\n3. צור מילון מונחים קצר בצד עם 4-5 מילים מאתגרות והסברן בעברית פשוטה.\n4. נסח 3 שאלות הבנה ברמות חשיבה שונות: שאלה לאיתור מידע, שאלה להסקת מסקנות ושאלה לחיבור אישי של הלומד.`,
    tips: 'הדביקו טקסט קצר יחסית (עד 300 מילים בכל פעם) כדי לקבל פישוט איכותי ומדויק.',
    warnings: 'בדקו שהשכתוב לא השמיט מושגי מפתח קריטיים הנדרשים בתוכנית הלימודים.',
    complexity: '1',
    approved: 1
  },
  {
    id: 'def-5',
    title: 'סימולציית שיחה עם דמות היסטורית / מדעית',
    goal: 'הפיכת ה-AI לדמות היסטורית או מדעית לראיון כיתתי מעמיק',
    category: 'משחוק והפעלות',
    scenario: 'במהלך שיעור היסטוריה או מדעים, המורה מקרין את הצ׳אט והכיתה "מראיינת" את אלברט איינשטיין או דוד בן גוריון.',
    prompt: `אני רוצה שתשמש כדמות של: [שם הדמות - למשל אלברט איינשטיין / דוד בן-גוריון / מארי קירי].\nהשיחה מיועדת לתלמידי כיתה [שכבת גיל] שלומדים על [הנושא הנלמד והתקופה].\n\nהנחיות להתנהגותך:\n1. הישאר בדמות לאורך כל השיחה! דבר בגוף ראשון בסגנון התקופה אך בשפה נגישה לתלמידים.\n2. פתח בברכה חמה והצג את עצמך בקצרה יחד עם ההישג או האירוע המרכזי בחייך.\n3. עודד את התלמידים לשאול אותך שאלות קשות על הדילמות, הכישלונות והתגליות שלך.\n4. בסוף כל תשובה, החזר לתלמיד שאלה מעוררת מחשבה שמשווה בין התקופה שלך למציאות של היום.`,
    tips: 'בקשו מהתלמידים להכין מראש 2 שאלות מאתגרות שלא ניתן לענות עליהן ב"כן/לא".',
    warnings: 'הזכירו לתלמידים שמדובר בסימולציה מבוססת בינה מלאכותית ויש לאמת עובדות היסטוריות קריטיות.',
    complexity: '3',
    approved: 1
  },
  {
    id: 'def-6',
    title: 'יצירת דף עבודה מדורג ברמות קושי עולות',
    goal: 'הפקת דף עבודה הכולל שאלות ידע, הבנה, יישום ואתגר לחשיבה גבוהה',
    category: 'מערכי שיעור',
    scenario: 'המורה רוצה דף תרגול אישי לכיתה שמאפשר לכל תלמיד להתקדם בקצב שלו לפי רמתו.',
    prompt: `פעל כמפתח תכניות לימודים. צור דף עבודה מקיף ומדורג בנושא: [נושא דף העבודה].\nמקצוע: [מתמטיקה / מדעים / אזרחות / לשון / אחר], שכבת גיל: [כיתה].\n\nבנה את דף העבודה ב-3 רמות מדורגות:\nרמה 1 - שליטה בסיסית והגדרות (3 שאלות ידע והבנה ישירה).\nרמה 2 - יישום וניתוח (2 שאלות מורכבות / בעיות מילוליות / ניתוח מקרה).\nרמה 3 - שאלת אתגר והעמקה (משימת חקר קצרה או שאלת חשיבה ביקורתית).\n\nלכל שאלה הוסף:\n- מחוון קצר לתשובה נכונה\n- טיפ/רמז לתלמיד שמתקשה`,
    tips: 'ציינו את המושגים המדויקים שתרצו שיופיעו בשאלות הרמה הבסיסית.',
    warnings: 'וודאו ששאלת האתגר עדיין ברת השגה ואינה דורשת ידע מוקדם שלא נלמד.',
    complexity: '3',
    approved: 1
  }
];

// ניהול המצב הגלובלי של האפליקציה
const State = {
  allPrompts: [],
  searchQuery: '',
  selectedComplexity: '0', // '0' = All
  selectedCategory: 'all',
  currentEditingPrompt: null,
  variableValues: {},
  activeEditTab: 'smart',
  theme: 'light',
  lang: 'he', // עברית היא ברירת המחדל
  translations: BUILTIN_TRANSLATIONS // מאותחל מיידית עם המילון המובנה
};

// פונקציית נרמול למורכבות 1-5
function normalizeComplexity(val) {
  if (val === null || val === undefined) return '1';
  const str = String(val).trim();
  const digitMatch = str.match(/[1-5]/);
  if (digitMatch) return digitMatch[0];

  if (str.includes('בסיסי') || str.includes('קל') || str.includes('basic') || str.includes('بسيط')) return '1';
  if (str.includes('בינוני') || str.includes('medium') || str.includes('متوسط')) return '3';
  if (str.includes('מתקדם') || str.includes('קשה') || str.includes('advanced') || str.includes('متقدم')) return '5';

  return '1';
}

// --- מנהל בינאום ושפות (I18n Manager) ---
const I18nManager = {
  async init() {
    // ברירת מחדל קשיחה: עברית (או בחירה מפורשת של המשתמש בעבר)
    const savedLang = localStorage.getItem('edu_prompts_lang');
    if (savedLang && ['he', 'ar', 'en'].includes(savedLang)) {
      State.lang = savedLang;
    } else {
      State.lang = 'he'; // ברירת המחדל היא עברית
    }

    // החלת השפה מיד עם המילון המובנה (ללא תלות ברשת)
    this.applyLanguage(State.lang, false);

    // ניסיון לעדכון עתידי מתוך translations.json במידה וקיים
    try {
      const res = await fetch(CONFIG.TRANSLATIONS_URL);
      if (res.ok) {
        const fetched = await res.json();
        State.translations = { ...BUILTIN_TRANSLATIONS, ...fetched };
        this.applyLanguage(State.lang, false);
      }
    } catch (e) {
      console.info('Using builtin translations dictionary:', e);
    }
  },

  t(key, params = {}) {
    const dict = State.translations[State.lang] || State.translations['he'] || BUILTIN_TRANSLATIONS.he;
    let text = dict[key] || (BUILTIN_TRANSLATIONS.he && BUILTIN_TRANSLATIONS.he[key]) || key;

    // החלפת פרמטרים כגון {count} או {var}
    Object.keys(params).forEach(p => {
      text = text.replaceAll(`{${p}}`, params[p]);
    });
    return text;
  },

  toast(subKey, params = {}) {
    const dict = State.translations[State.lang] || State.translations['he'] || BUILTIN_TRANSLATIONS.he;
    const toasts = dict.toasts || (BUILTIN_TRANSLATIONS.he && BUILTIN_TRANSLATIONS.he.toasts) || {};
    let text = toasts[subKey] || subKey;
    Object.keys(params).forEach(p => {
      text = text.replaceAll(`{${p}}`, params[p]);
    });
    return text;
  },

  applyLanguage(lang, showNotification = true) {
    State.lang = lang;
    localStorage.setItem('edu_prompts_lang', lang);

    const isRtl = lang === 'he' || lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // עדכון אלמנט ה-select
    const langSelect = document.getElementById('language-select');
    if (langSelect) langSelect.value = lang;

    // החלפת תגיות טקסט סטטיות בממשק
    const setElem = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setElem('i18n-app-title', this.t('appTitle'));
    setElem('i18n-app-subtitle', this.t('appSubtitle'));
    setElem('i18n-pedagogical-badge', this.t('pedagogicalBadge'));
    setElem('i18n-refresh-btn', this.t('refresh'));
    setElem('i18n-contribute-btn', this.t('contribute'));
    setElem('i18n-banner-text', this.t('bannerText'));
    setElem('i18n-category-label', this.t('categoryLabel'));
    setElem('i18n-complexity-label', this.t('complexityLabel'));
    setElem('i18n-empty-title', this.t('emptyTitle'));
    setElem('i18n-empty-subtitle', this.t('emptySubtitle'));
    setElem('reset-filters-btn', this.t('resetFilters'));
    setElem('i18n-footer-title', this.t('footerTitle'));
    setElem('i18n-footer-link', this.t('footerLink'));

    // מודאל עריכה
    setElem('i18n-approved-repo-badge', this.t('approvedRepository'));
    setElem('i18n-scenario-title', this.t('scenarioTitle'));
    setElem('i18n-tips-title', this.t('tipsTitle'));
    setElem('i18n-warnings-title', this.t('warningsTitle'));
    setElem('i18n-edit-section-title', this.t('editSectionTitle'));
    setElem('tab-smart-label', this.t('smartTab'));
    setElem('tab-direct-label', this.t('directTab'));
    setElem('i18n-live-preview-label', this.t('livePreviewLabel'));
    setElem('i18n-live-preview-sub', this.t('livePreviewSub'));
    setElem('i18n-choose-ai-label', this.t('chooseAiLabel'));
    setElem('i18n-choose-ai-sub', this.t('chooseAiSub'));
    setElem('i18n-chatgpt-sub', this.t('chatgptSub'));
    setElem('i18n-claude-sub', this.t('claudeSub'));
    setElem('i18n-gemini-sub', this.t('geminiSub'));
    setElem('i18n-gemini-badge', this.t('geminiBadge'));
    setElem('i18n-copy-prompt-btn', this.t('copyPromptOnly'));
    setElem('i18n-done-btn', this.t('done'));

    // מודאל תרומה
    setElem('i18n-contrib-title', this.t('contribModalTitle'));
    setElem('i18n-contrib-sub', this.t('contribModalSub'));
    setElem('i18n-open-newtab', this.t('openInNewTab'));

    // שדה חיפוש placeholder
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = this.t('searchPlaceholder');

    // שדה עריכה ישירה placeholder
    const directTextarea = document.getElementById('modal-prompt-textarea');
    if (directTextarea) directTextarea.placeholder = this.t('directEditTextareaPlaceholder');

    // עדכון סטטוס הנתונים במידה וקיים
    const statusEl = document.getElementById('data-status');
    if (statusEl && State.allPrompts.length > 0) {
      statusEl.textContent = this.t('statusLoaded', { count: State.allPrompts.length });
    }

    // רינדור מחדש של הפילטרים והכרטיסיות בהתאם לשפה
    UIController.renderComplexityFilters();
    UIController.renderCategoryFilters();
    UIController.renderPrompts();

    if (showNotification) {
      UIController.showToast(this.toast('langChanged'));
    }
  }
};

// ניהול מצב כהה / בהיר
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem('edu_prompts_theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('edu_prompts_theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  },

  setTheme(theme) {
    State.theme = theme;
    localStorage.setItem('edu_prompts_theme', theme);
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
    UIController.showToast(nextTheme === 'dark' ? I18nManager.toast('themeDark') : I18nManager.toast('themeLight'));
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

    // זיהוי עמודות מדויק (תומך בעברית, אנגלית וערבית בכותרות הטבלה)
    const approvedIdx = getCol(l => l.includes('מאושר') || l.includes('approved') || l.includes('אישור') || l.includes('סטטוס') || l.includes('معتمد'));
    const titleIdx = getCol(l => (l.includes('שם') || l.includes('כותרת') || l.includes('title') || l.includes('اسم') || l.includes('عنوان')) && !l.includes('משתמש') && !l.includes('user'));
    const goalIdx = getCol(l => l.includes('מטר') || l.includes('goal') || l.includes('purpose') || l.includes('هدف'));
    const categoryIdx = getCol(l => l.includes('קטגור') || l.includes('category') || l.includes('נושא') || l.includes('תחום') || l.includes('فئة') || l.includes('تصنيف'));

    // תבנית הפרומפט - שדה התוכן המלא
    const promptTemplateIdx = getCol(l => {
      if (l.includes('תבנית') || l.includes('template') || l.includes('نموذج') || l.includes('قالب')) return true;
      if (l.includes('פרומפט') && !l.includes('שם') && !l.includes('מטר') && !l.includes('הסבר') && !l.includes('מורכבות') && !l.includes('הערות') && !l.includes('רמת') && !l.includes('קטגור')) return true;
      if (l.includes('prompt') && !l.includes('name') && !l.includes('title') && !l.includes('goal') && !l.includes('level') && !l.includes('category')) return true;
      if (l.includes('برومبت') && !l.includes('اسم') && !l.includes('هدف') && !l.includes('مستوى') && !l.includes('فئة')) return true;
      return false;
    });

    const scenarioIdx = getCol(l => l.includes('תרחיש') || l.includes('דוגמא') || l.includes('scenario') || l.includes('example') || l.includes('سيناريو'));
    const tipsIdx = getCol(l => l.includes('טיפ') || l.includes('הסבר') || l.includes('הנחיות') || l.includes('tips') || l.includes('عבודה נכונה') || l.includes('نصائح'));
    const warningsIdx = getCol(l => l.includes('אזהר') || l.includes('הערות') || l.includes('מגבלות') || l.includes('מה לא לעשות') || l.includes('warnings') || l.includes('تحذير') || l.includes('ملاحظات'));
    const complexityIdx = getCol(l => l.includes('מורכבות') || l.includes('רמת') || l.includes('רמה') || l.includes('complexity') || l.includes('level') || l.includes('صعوبة') || l.includes('مستوى'));

    const parsedPrompts = [];

    rows.forEach((row, rowIndex) => {
      const cells = row.c || [];
      const getVal = (idx) => (idx >= 0 && cells[idx] && cells[idx].v !== null && cells[idx].v !== undefined) ? String(cells[idx].v).trim() : '';

      // סינון: רק שורות בהן מופיע 1 בעמודת מאושר
      const approvedVal = approvedIdx >= 0 ? getVal(approvedIdx) : (cells[0] ? String(cells[0].v).trim() : '1');
      const isApproved = approvedVal === '1' || approvedVal.toLowerCase() === 'true' || approvedVal === 'כן' || approvedVal === 'מאושר' || approvedVal === 'نعم' || approvedVal === 'معتمد';

      if (isApproved) {
        const title = titleIdx >= 0 ? getVal(titleIdx) : getVal(1) || `פרומפט ${rowIndex + 1}`;
        const goal = goalIdx >= 0 ? getVal(goalIdx) : getVal(2) || I18nManager.t('defaultGoal');
        const category = categoryIdx >= 0 ? getVal(categoryIdx) : 'כללי';
        const scenario = scenarioIdx >= 0 ? getVal(scenarioIdx) : '';
        const promptTemplate = promptTemplateIdx >= 0 ? getVal(promptTemplateIdx) : (getVal(3) || goal);
        const tips = tipsIdx >= 0 ? getVal(tipsIdx) : '';
        const warnings = warningsIdx >= 0 ? getVal(warningsIdx) : '';
        const rawComplexity = complexityIdx >= 0 ? getVal(complexityIdx) : '1';
        const complexity = normalizeComplexity(rawComplexity);

        if (title && (promptTemplate || goal)) {
          parsedPrompts.push({
            id: `sheet-${rowIndex}`,
            title,
            goal,
            category: category || 'כללי',
            scenario: scenario || I18nManager.t('defaultScenario'),
            prompt: promptTemplate || goal,
            tips: tips || I18nManager.t('defaultTips'),
            warnings: warnings || I18nManager.t('defaultWarnings'),
            complexity: complexity,
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
    const comp = normalizeComplexity(complexity);
    const badgeText = `${I18nManager.t('badgeLevel')} ${comp}`;

    if (comp === '5') {
      return { text: badgeText, class: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
    } else if (comp === '4') {
      return { text: badgeText, class: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
    } else if (comp === '3') {
      return { text: badgeText, class: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
    } else if (comp === '2') {
      return { text: badgeText, class: 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800' };
    }
    return { text: badgeText, class: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
  },

  renderComplexityFilters() {
    const container = document.getElementById('complexity-filters');
    if (!container) return;
    container.innerHTML = '';

    CONFIG.COMPLEXITY_LEVELS.forEach(lvl => {
      const btn = document.createElement('button');
      const isActive = State.selectedComplexity === lvl;
      btn.className = `px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
        isActive
          ? 'bg-indigo-600 text-white shadow-sm font-bold'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`;
      btn.textContent = lvl === '0' ? I18nManager.t('all') : `${I18nManager.t('level')} ${lvl}`;
      btn.onclick = () => {
        State.selectedComplexity = lvl;
        this.renderComplexityFilters();
        this.renderPrompts();
      };
      container.appendChild(btn);
    });
  },

  renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    if (!container) return;
    container.innerHTML = '';

    const categorySet = new Set();
    State.allPrompts.forEach(p => {
      if (p.category) {
        const parts = String(p.category).split(/[,/]/).map(s => s.trim()).filter(Boolean);
        parts.forEach(cat => categorySet.add(cat));
      }
    });

    const categories = ['all', ...Array.from(categorySet)];

    categories.forEach(cat => {
      const btn = document.createElement('button');
      const isActive = State.selectedCategory === cat;
      btn.className = `px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
        isActive
          ? 'bg-purple-600 text-white shadow-sm font-bold'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`;
      btn.textContent = cat === 'all' ? I18nManager.t('all') : cat;
      btn.onclick = () => {
        State.selectedCategory = cat;
        this.renderCategoryFilters();
        this.renderPrompts();
      };
      container.appendChild(btn);
    });
  },

  getFilteredPrompts() {
    return State.allPrompts.filter(p => {
      // סינון מורכבות (0 = הכל)
      if (State.selectedComplexity !== '0') {
        const normP = normalizeComplexity(p.complexity);
        if (normP !== State.selectedComplexity) {
          return false;
        }
      }

      // סינון קטגוריה
      if (State.selectedCategory !== 'all') {
        const cat = (p.category || '').toLowerCase();
        const selected = State.selectedCategory.toLowerCase();
        if (!cat.includes(selected)) {
          return false;
        }
      }

      // חיפוש חופשי
      if (State.searchQuery.trim()) {
        const q = State.searchQuery.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchGoal = (p.goal || '').toLowerCase().includes(q);
        const matchCategory = (p.category || '').toLowerCase().includes(q);
        const matchScenario = (p.scenario || '').toLowerCase().includes(q);
        const matchPrompt = (p.prompt || '').toLowerCase().includes(q);
        const matchTips = (p.tips || '').toLowerCase().includes(q);
        const matchWarnings = (p.warnings || '').toLowerCase().includes(q);

        if (!matchTitle && !matchGoal && !matchCategory && !matchScenario && !matchPrompt && !matchTips && !matchWarnings) {
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
    if (!grid || !resultsCount) return;

    const filtered = this.getFilteredPrompts();
    resultsCount.innerHTML = I18nManager.t('resultsCount', { count: filtered.length });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.classList.add('hidden');
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    grid.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');

    filtered.forEach(prompt => {
      const badge = this.getComplexityBadge(prompt.complexity);

      const card = document.createElement('div');
      card.className = 'group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-6 shadow-sm hover:shadow-xl dark:shadow-slate-950 transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden transform hover:-translate-y-1 text-start';
      
      card.innerHTML = `
        <!-- Top Gradient Border -->
        <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

        <div class="space-y-3">
          <!-- Badge & AI indicators -->
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.class}">
                ${badge.text}
              </span>
              ${prompt.category && prompt.category !== 'כללי' && prompt.category !== 'all' ? `
                <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  ${prompt.category}
                </span>
              ` : ''}
            </div>
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
          <div class="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-start">
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              ${I18nManager.t('promptGoalLabel')}
            </p>
            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
              ${prompt.goal || I18nManager.t('defaultGoal')}
            </p>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5 flex items-center justify-between">
          <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">${I18nManager.t('cardFooterHint')}</span>
          <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 group-hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 group-hover:text-white font-bold text-xs rounded-xl transition-all shadow-sm">
            <span>${I18nManager.t('cardActionBtn')}</span>
            <svg class="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    document.getElementById('modal-prompt-goal').textContent = prompt.goal || I18nManager.t('defaultGoal');
    
    const badge = this.getComplexityBadge(prompt.complexity);
    const badgeEl = document.getElementById('modal-complexity-badge');
    badgeEl.textContent = `${I18nManager.t('modalComplexityPrefix')}${badge.text}`;
    badgeEl.className = `inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.class}`;

    document.getElementById('modal-scenario-text').textContent = prompt.scenario || I18nManager.t('defaultScenario');
    document.getElementById('modal-tips-text').textContent = prompt.tips || I18nManager.t('defaultTips');
    document.getElementById('modal-warnings-text').textContent = prompt.warnings || I18nManager.t('defaultWarnings');
    
    // טעינת תבנית הפרומפט לשדה העריכה
    document.getElementById('modal-prompt-textarea').value = prompt.prompt;

    const vars = this.extractVariables(prompt.prompt);
    const varGrid = document.getElementById('variable-inputs-grid');
    const smartTabLabel = document.getElementById('tab-smart-label');

    smartTabLabel.textContent = vars.length > 0 ? `${I18nManager.t('smartTab')} (${vars.length})` : I18nManager.t('smartTab');
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
            placeholder="${I18nManager.t('varInputPlaceholder', { var: variableName })}"
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
          ${I18nManager.t('noVarsNotice')}
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
    if (preview) preview.textContent = this.getCalculatedPromptText();
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
    UIController.showToast(I18nManager.toast('launchingChatGPT'));
    setTimeout(() => window.open(url, '_blank'), 200);
  },

  launchClaude() {
    const text = UIController.getFinalPrompt();
    UIController.copyToClipboard(text);
    const url = `https://claude.ai/new?q=${encodeURIComponent(text)}`;
    UIController.showToast(I18nManager.toast('launchingClaude'));
    setTimeout(() => window.open(url, '_blank'), 200);
  },

  launchGemini() {
    const text = UIController.getFinalPrompt();
    UIController.copyToClipboard(text);
    UIController.showToast(I18nManager.toast('launchingGemini'));
    setTimeout(() => window.open('https://gemini.google.com/app', '_blank'), 250);
  }
};

// פתיחת מודאל תרומת פרומפט מהפוטר
window.openContributeModal = () => {
  document.getElementById('contribute-modal').classList.remove('hidden');
};

// אתחול האפליקציה וטעינת הנתונים
async function initApp() {
  // 1. אתחול שפות ומצב תצוגה
  await I18nManager.init();
  ThemeManager.init();

  const statusEl = document.getElementById('data-status');
  const refreshIcon = document.getElementById('refresh-icon');
  if (refreshIcon) refreshIcon.classList.add('animate-spin', 'text-indigo-600');
  if (statusEl) statusEl.textContent = I18nManager.t('statusLoading');

  try {
    const parsed = await SheetService.fetchPrompts();
    if (parsed && parsed.length > 0) {
      State.allPrompts = parsed;
      if (statusEl) statusEl.textContent = I18nManager.t('statusLoaded', { count: parsed.length });
      UIController.showToast(I18nManager.toast('loadedSuccess', { count: parsed.length }));
    } else {
      State.allPrompts = DEFAULT_PROMPTS;
      if (statusEl) statusEl.textContent = I18nManager.t('statusEmpty');
    }
  } catch (err) {
    console.warn('Fallback to curated prompts:', err);
    State.allPrompts = DEFAULT_PROMPTS;
    if (statusEl) statusEl.textContent = I18nManager.t('statusFallback');
  } finally {
    if (refreshIcon) refreshIcon.classList.remove('animate-spin', 'text-indigo-600');
    UIController.renderCategoryFilters();
    UIController.renderComplexityFilters();
    UIController.renderPrompts();
  }

  // חיבור מאזיני אירועים
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) themeBtn.onclick = () => ThemeManager.toggle();

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) refreshBtn.onclick = () => initApp();

  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.onchange = (e) => {
      I18nManager.applyLanguage(e.target.value, true);
    };
  }

  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.oninput = (e) => {
      State.searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (State.searchQuery) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }
      UIController.renderPrompts();
    };
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.onclick = () => {
      searchInput.value = '';
      State.searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      UIController.renderPrompts();
    };
  }

  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (searchInput) searchInput.value = '';
      State.searchQuery = '';
      State.selectedComplexity = '0';
      State.selectedCategory = 'all';
      if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
      UIController.renderCategoryFilters();
      UIController.renderComplexityFilters();
      UIController.renderPrompts();
    };
  }

  const smartTabBtn = document.getElementById('tab-smart-btn');
  if (smartTabBtn) smartTabBtn.onclick = () => UIController.setEditTab('smart');

  const directTabBtn = document.getElementById('tab-direct-btn');
  if (directTabBtn) directTabBtn.onclick = () => UIController.setEditTab('direct');

  const chatgptBtn = document.getElementById('launch-chatgpt-btn');
  if (chatgptBtn) chatgptBtn.onclick = UIController.launchChatGPT;

  const claudeBtn = document.getElementById('launch-claude-btn');
  if (claudeBtn) claudeBtn.onclick = UIController.launchClaude;

  const geminiBtn = document.getElementById('launch-gemini-btn');
  if (geminiBtn) geminiBtn.onclick = UIController.launchGemini;

  const copyOnlyBtn = document.getElementById('modal-copy-only-btn');
  if (copyOnlyBtn) {
    copyOnlyBtn.onclick = () => {
      const text = UIController.getFinalPrompt();
      UIController.copyToClipboard(text);
      UIController.showToast(I18nManager.toast('copiedSuccess'));
    };
  }

  const closeBottomBtn = document.getElementById('modal-close-bottom-btn');
  if (closeBottomBtn) closeBottomBtn.onclick = () => UIController.closeEditModal();

  const closeTopBtn = document.getElementById('close-edit-modal-btn');
  if (closeTopBtn) closeTopBtn.onclick = () => UIController.closeEditModal();

  const contribModal = document.getElementById('contribute-modal');
  const contribBtn = document.getElementById('contribute-btn');
  if (contribBtn && contribModal) contribBtn.onclick = () => contribModal.classList.remove('hidden');

  const closeContribBtn = document.getElementById('close-contribute-modal-btn');
  if (closeContribBtn && contribModal) closeContribBtn.onclick = () => contribModal.classList.add('hidden');

  window.onclick = (e) => {
    const editModal = document.getElementById('edit-modal');
    if (e.target === editModal) UIController.closeEditModal();
    if (e.target === contribModal) contribModal.classList.add('hidden');
  };
}

// הפעלה בעת טעינת העמוד
document.addEventListener('DOMContentLoaded', initApp);
