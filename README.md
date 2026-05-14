# הכותל המערבי — אתר רשמי

אתר חדש ומעוצב לכותל המערבי בירושלים. עברית מלאה, RTL, רספונסיבי, מתחבר ל-Supabase לטפסים ומתארח ב-Firebase Hosting.

## 🚀 הפעלה מקומית

פתחו את `index.html` בדפדפן (או הריצו שרת סטטי כלשהו):

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node (npx)
npx serve .

# Option 3: VSCode Live Server extension
```

## 🗄️ הגדרת Supabase

האתר משתמש ב-Supabase לטפסים: פתקים, ניוזלטר, אירועים, תרומות, צור קשר.

### 1. הריצו את הסכמה
פתחו את [Supabase Dashboard](https://app.supabase.com) → SQL Editor → העתיקו את `supabase/schema.sql` והריצו.

זה יוצר:
- `notes` — פתקים לכותל
- `newsletter_subscribers` — רשימת תפוצה
- `event_inquiries` — פניות אירועים
- `donation_intents` — כוונות תרומה
- `contact_messages` — הודעות צור קשר

כולל Row Level Security: anonymous יכול רק INSERT, לא לקרוא נתונים.

### 2. עדכנו את ה-anon key
פתחו את [`js/config.js`](js/config.js) והחליפו את `YOUR_SUPABASE_ANON_KEY_HERE`.

מצאו את ה-anon key ב: Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`.

**אזהרת אבטחה**:
- `anon key` ציבורי — בטוח לחשוף בדפדפן (מוגן ע"י RLS).
- **לא** להעתיק את `service_role` או את סיסמת ה-DB לקוד הזה!

## 🔥 פריסה ל-Firebase Hosting

הפרויקט מוגדר עם `firebase.json` ו-`.firebaserc` ל-project `kotel-a0668`.

### התקנה ראשונה

```bash
npm install -g firebase-tools
firebase login
```

### פריסה

```bash
firebase deploy
```

## 📁 מבנה

```
kotel/
├── index.html               # עמוד הבית
├── pages/                   # עמודי משנה
│   ├── send-note.html
│   ├── tours.html
│   ├── events.html
│   ├── visitor-info.html
│   ├── gallery.html
│   ├── about.html
│   └── donate.html
├── css/style.css            # עיצוב מלא, RTL, רספונסיבי
├── js/
│   ├── main.js              # אינטראקטיביות, drawer, search, forms
│   ├── config.js            # קונפיג ציבורי (Supabase URL + anon key)
│   └── supabase-client.js   # wrapper ל-Supabase JS SDK
├── supabase/schema.sql      # סכמת DB מלאה + RLS
├── firebase.json            # קונפיג Firebase Hosting
└── .firebaserc              # project alias
```

## ✨ מה יש בפנים

- **Hero** עם וידאו YouTube בלופ
- **שידור חי** מהכותל
- **Drawer** עם תפריט מקיף ו-6 קבוצות
- **Side Rail** קבוע עם 6 קיצורים
- **חיפוש** עם Ctrl+K
- **פתק לכותל** עם תצוגה מקדימה חיה
- **גלריה** עם פילטרים ו-lightbox
- **תרומה** עם בחירת סכומים
- **ניוזלטר** עם validation
- **רספונסיבי מלא** — 4 breakpoints (980 / 720 / 480 / 360)

## 📜 רישיון

© 2026 הקרן למורשת הכותל המערבי
