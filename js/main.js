/* ========================================
   הכותל המערבי — JavaScript ראשי v2
   ======================================== */

(function () {
  'use strict';

  const isHome = !!document.querySelector('.hero');

  // Detect base path (works from /index.html or /pages/*.html)
  const base = location.pathname.includes('/pages/') ? '../' : './';

  // ---------- Dynamically load Supabase config + client in order ----------
  // (Scripts inserted via DOM with async=false execute in insertion order)
  ['js/config.js', 'js/supabase-client.js'].forEach((src) => {
    const s = document.createElement('script');
    s.src = base + src;
    s.async = false;
    document.head.appendChild(s);
  });

  // ---------- Header scroll state ----------
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Ensure header has .nav-right wrapping the logo ----------
  // For pages that still use the old structure (logo directly inside .nav-wrap),
  // wrap the logo so we have a consistent insertion point for the hamburger.
  let navRight = document.querySelector('.nav-right');
  if (!navRight) {
    const navWrap = document.querySelector('.nav-wrap');
    const oldLogo = navWrap && navWrap.querySelector('.logo');
    if (navWrap && oldLogo) {
      navRight = document.createElement('div');
      navRight.className = 'nav-right';
      navWrap.insertBefore(navRight, oldLogo);
      navRight.appendChild(oldLogo);
    }
  }

  // ---------- Inject Search button (in nav-actions) + Drawer toggle (in nav-right, right of logo) ----------
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    const searchBtn = document.createElement('button');
    searchBtn.className = 'icon-btn';
    searchBtn.setAttribute('aria-label', 'חיפוש');
    searchBtn.id = 'searchToggle';
    searchBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>`;
    navActions.insertBefore(searchBtn, navActions.firstChild);
  }

  if (navRight) {
    const drawerBtn = document.createElement('button');
    drawerBtn.className = 'icon-btn';
    drawerBtn.setAttribute('aria-label', 'תפריט');
    drawerBtn.id = 'drawerToggle';
    drawerBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18M3 12h18M3 18h12"/>
      </svg>`;
    // Insert BEFORE the logo so in RTL flex-row it appears to the right of the logo
    navRight.insertBefore(drawerBtn, navRight.firstChild);
  }

  // ---------- Inject Side Rail (persistent right-edge quick actions) ----------
  const sideRailHTML = `
    <aside class="side-rail" aria-label="קיצורים">
      <a class="rail-item live" href="${base}index.html#live" aria-label="שידור חי">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span class="label">שידור חי מהכותל</span>
      </a>
      <a class="rail-item" href="${base}pages/send-note.html" aria-label="שליחת פתק">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span class="label">שלחו פתק לכותל</span>
      </a>
      <a class="rail-item" href="${base}pages/visitor-info.html" aria-label="דרכי הגעה">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span class="label">דרכי הגעה</span>
      </a>
      <a class="rail-item" href="${base}pages/visitor-info.html" aria-label="שעות פתיחה">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span class="label">שעות פתיחה</span>
      </a>
      <a class="rail-item" href="tel:*5958" aria-label="חיוג">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span class="label">חיוג: 5958*</span>
      </a>
      <span class="rail-divider"></span>
      <a class="rail-item donate" href="${base}pages/donate.html" aria-label="תרומה">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span class="label">לתרומה</span>
      </a>
      <button class="rail-item rail-top" id="railToTop" aria-label="חזרה למעלה">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        <span class="label">חזרה למעלה</span>
      </button>
    </aside>
  `;
  document.body.insertAdjacentHTML('beforeend', sideRailHTML);

  const railToTop = document.getElementById('railToTop');
  if (railToTop) {
    railToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Inject Drawer markup ----------
  const drawerHTML = `
    <div class="drawer-backdrop" id="drawerBackdrop"></div>
    <aside class="drawer" id="drawer" aria-hidden="true">
      <div class="drawer-head">
        <div class="logo">
          <span class="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-5 9 5v12"/><path d="M3 21h18M9 21v-9h6v9"/></svg>
          </span>
          <span class="logo-text">
            <strong>הכותל המערבי</strong>
            <span style="color: rgba(255,255,255,0.65);">תפריט מלא</span>
          </span>
        </div>
        <button class="drawer-close" id="drawerClose" aria-label="סגירה">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="drawer-body">

        <div class="drawer-group">
          <h5>ראשי</h5>
          <a class="drawer-link" href="${base}index.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4M3 9v11a2 2 0 0 0 2 2h4M3 9h18M9 22V12h6v10"/></svg></span>
            עמוד הבית
          </a>
          <a class="drawer-link" href="${base}pages/about.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></span>
            אודות הכותל
          </a>
        </div>

        <div class="drawer-group">
          <h5>חוויות וסיורים</h5>
          <a class="drawer-link" href="${base}pages/tours.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
            המסע לירושלים
          </a>
          <a class="drawer-link" href="${base}pages/tours.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18s4-8 10-8 10 8 10 8"/><circle cx="12" cy="10" r="2"/></svg></span>
            מסלול הגשר הגדול
          </a>
          <a class="drawer-link" href="${base}pages/tours.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M7 9V5a5 5 0 0 1 10 0v4"/></svg></span>
            מסלול האבן הגדולה
          </a>
          <a class="drawer-link" href="${base}pages/tours.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z"/></svg></span>
            מרכז המבקרים "שער השמיים"
          </a>
        </div>

        <div class="drawer-group">
          <h5>אירועים וטקסים</h5>
          <a class="drawer-link" href="${base}pages/events.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z"/></svg></span>
            בר מצווה
          </a>
          <a class="drawer-link" href="${base}pages/events.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4m12 0h4"/></svg></span>
            בת מצווה
          </a>
          <a class="drawer-link" href="${base}pages/events.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"/></svg></span>
            חלאקה
          </a>
          <a class="drawer-link" href="${base}pages/events.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
            קבוצות מאורגנות
          </a>
        </div>

        <div class="drawer-group">
          <h5>שירותים</h5>
          <a class="drawer-link" href="${base}pages/send-note.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
            שליחת פתק לכותל
          </a>
          <a class="drawer-link" href="${base}pages/donate.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
            תרומה לקרן
          </a>
          <a class="drawer-link" href="#shop">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg></span>
            חנות הכותל
          </a>
        </div>

        <div class="drawer-group">
          <h5>תוכן ומידע</h5>
          <a class="drawer-link" href="${base}pages/visitor-info.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
            מידע למבקר
          </a>
          <a class="drawer-link" href="${base}pages/gallery.html">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg></span>
            גלריית תמונות
          </a>
          <a class="drawer-link" href="#live">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></span>
            שידור חי מהרחבה
          </a>
          <a class="drawer-link" href="#podcast">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/></svg></span>
            פודקאסט
          </a>
          <a class="drawer-link" href="#news">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zM18 14h-8M15 18h-5M10 6h8M10 10h8"/></svg></span>
            חדשות ועדכונים
          </a>
        </div>

        <div class="drawer-group">
          <h5>צרו קשר</h5>
          <a class="drawer-link" href="tel:*5958">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
            5958* | 02-627-1333
          </a>
          <a class="drawer-link" href="mailto:info@thekotel.org">
            <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="m22 6-10 7L2 6"/></svg></span>
            info@thekotel.org
          </a>
        </div>
      </div>
      <div class="drawer-foot">
        <div class="meta">
          <span>השעה ברחבת הכותל</span>
          <strong id="drawerTime">--:--</strong>
        </div>
        <a href="${base}pages/send-note.html" class="btn btn-gold">
          שלחו פתק עכשיו
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </a>
      </div>
    </aside>
  `;
  document.body.insertAdjacentHTML('beforeend', drawerHTML);

  // ---------- Drawer logic ----------
  const drawer = document.getElementById('drawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerToggle = document.getElementById('drawerToggle');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (drawerToggle) drawerToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // ---------- Search Overlay ----------
  const searchHTML = `
    <div class="search-overlay" id="searchOverlay">
      <div class="search-panel" role="dialog" aria-label="חיפוש באתר">
        <div class="search-input-wrap">
          <svg class="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="search" id="searchInput" placeholder="חיפוש סיורים, מידע, אירועים..." autocomplete="off" />
          <span class="esc">ESC</span>
        </div>
        <div class="search-results" id="searchResults"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', searchHTML);

  const searchIndex = [
    { title: 'שליחת פתק לכותל', desc: 'הפתק שלכם בין אבני הקודש', url: `${base}pages/send-note.html`, cat: 'שירותים', keywords: 'פתק תפילה משאלה בקשה' },
    { title: 'המסע לירושלים', desc: 'חוויה אודיו-ויזואלית מרהיבה', url: `${base}pages/tours.html`, cat: 'סיורים', keywords: 'סרט סינמה אודיו ויזואלי' },
    { title: 'מסלול הגשר הגדול', desc: 'בנתיב עולי הרגל', url: `${base}pages/tours.html`, cat: 'סיורים', keywords: 'גשר רחוב הירודיאני אבני ענק' },
    { title: 'מסלול האבן הגדולה', desc: 'אבן 570 טון', url: `${base}pages/tours.html`, cat: 'סיורים', keywords: 'מנהרות אבן' },
    { title: 'מרכז המבקרים "שער השמיים"', desc: 'הקרנות הולוגרפיות', url: `${base}pages/tours.html`, cat: 'סיורים', keywords: 'מרכז שער השמיים הולוגרמה' },
    { title: 'בר מצווה', desc: 'טקס עליה לתורה ברחבה', url: `${base}pages/events.html`, cat: 'אירועים', keywords: 'בר מצווה תפילין' },
    { title: 'בת מצווה', desc: 'טקס מרגש לבת', url: `${base}pages/events.html`, cat: 'אירועים', keywords: 'בת מצווה' },
    { title: 'חלאקה', desc: 'תספורת ראשונה ברחבה', url: `${base}pages/events.html`, cat: 'אירועים', keywords: 'תספורת ל"ג בעומר' },
    { title: 'שעות פתיחה', desc: '24/7 לרחבה, מנהרות לפי לוח', url: `${base}pages/visitor-info.html`, cat: 'מידע', keywords: 'שעות פתיחה זמנים' },
    { title: 'דרכי הגעה', desc: 'רכב, רכבת קלה, אוטובוס', url: `${base}pages/visitor-info.html`, cat: 'מידע', keywords: 'איך להגיע הגעה חניה תחבורה' },
    { title: 'נגישות', desc: 'נגיש לכל המבקרים', url: `${base}pages/visitor-info.html`, cat: 'מידע', keywords: 'נגישות מעלית כיסא גלגלים' },
    { title: 'קוד לבוש וכללי ביקור', desc: 'הנחיות לרחבה', url: `${base}pages/visitor-info.html`, cat: 'מידע', keywords: 'לבוש צניעות כללים' },
    { title: 'אודות הכותל', desc: 'אלפיים שנה של היסטוריה', url: `${base}pages/about.html`, cat: 'תוכן', keywords: 'היסטוריה אודות סיפור' },
    { title: 'הקרן למורשת הכותל', desc: 'הגוף הרשמי', url: `${base}pages/about.html`, cat: 'תוכן', keywords: 'קרן עמותה ארגון' },
    { title: 'גלריית תמונות', desc: 'רגעים מהכותל', url: `${base}pages/gallery.html`, cat: 'תוכן', keywords: 'תמונות צילום גלריה' },
    { title: 'תרומה לקרן', desc: 'שותפים במורשת', url: `${base}pages/donate.html`, cat: 'שירותים', keywords: 'תרומה תרומות סעיף 46' },
  ];

  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchToggle = document.getElementById('searchToggle');

  function renderResults(query) {
    const q = (query || '').trim().toLowerCase();
    let items = searchIndex;
    if (q) {
      items = searchIndex.filter(it =>
        it.title.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q) ||
        it.keywords.toLowerCase().includes(q) ||
        it.cat.toLowerCase().includes(q)
      );
    }
    if (!items.length) {
      searchResults.innerHTML = `
        <div class="search-section">
          <h6>אין תוצאות</h6>
          <p style="color: var(--text-muted); padding: 8px;">לא נמצאו תוצאות עבור "${query}". נסו מילים אחרות.</p>
        </div>`;
      return;
    }
    // Group by category
    const groups = {};
    items.forEach(it => {
      if (!groups[it.cat]) groups[it.cat] = [];
      groups[it.cat].push(it);
    });
    searchResults.innerHTML = Object.keys(groups).map(cat => `
      <div class="search-section">
        <h6>${cat}</h6>
        ${groups[cat].map(it => `
          <a class="search-item" href="${it.url}">
            <span class="ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11H5a2 2 0 0 0-2 2v7h18v-7a2 2 0 0 0-2-2h-4M12 2v11M8 7l4-5 4 5"/></svg>
            </span>
            <div>
              <strong>${it.title}</strong>
              <span>${it.desc}</span>
            </div>
            <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </a>
        `).join('')}
      </div>
    `).join('');
  }

  function openSearch() {
    renderResults('');
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput.focus(), 200);
    document.body.style.overflow = 'hidden';
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchInput.value = '';
    document.body.style.overflow = '';
  }
  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
  searchInput.addEventListener('input', (e) => renderResults(e.target.value));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchOverlay.classList.contains('open')) closeSearch();
      else if (drawer.classList.contains('open')) closeDrawer();
    }
    // Ctrl/Cmd + K opens search
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    // "/" opens search (when not typing)
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearch();
    }
  });

  // ---------- Live Jerusalem time (hero + drawer) ----------
  const kotelTime = document.getElementById('kotelTime');
  const drawerTime = document.getElementById('drawerTime');
  function updateTime() {
    try {
      const opts = { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hour12: false };
      const t = new Intl.DateTimeFormat('he-IL', opts).format(new Date());
      if (kotelTime) kotelTime.textContent = t;
      if (drawerTime) drawerTime.textContent = t;
    } catch (e) {
      const d = new Date();
      const t = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      if (kotelTime) kotelTime.textContent = t;
      if (drawerTime) drawerTime.textContent = t;
    }
  }
  updateTime();
  setInterval(updateTime, 30 * 1000);

  // ---------- Image fallback to gradient (global) ----------
  // Any <img> that fails to load: hide it and mark the parent so the
  // gradient placeholder shows through. We also ensure the parent has
  // a relative position + the .img-wrap visual.
  const visualContainers = [
    '.story-image', '.news-image', '.gallery-item',
    '.experience-card', '.tour-image', '.live-cam-video',
    '.page-hero-bg', '.hero-bg'
  ].join(',');
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.opacity = '0';
      img.style.visibility = 'hidden';
      const p = img.closest(visualContainers) || img.parentElement;
      if (!p) return;
      // Ensure positioning context
      const pos = getComputedStyle(p).position;
      if (pos === 'static') p.style.position = 'relative';
      // Decide dark vs light based on context
      const isDark = p.matches('.experience-card, .live-cam-video, .page-hero-bg, .hero-bg') ||
                     p.closest('.experiences, .live-cam, .page-hero, .hero, .donate-banner, .site-footer');
      if (!p.classList.contains('img-wrap')) {
        p.classList.add('img-wrap');
        if (isDark) p.classList.add('dark');
      }
      p.classList.add('img-failed');
    }, { once: true });
  });

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // ---------- DB-aware submit helper ----------
  // Tries Supabase when ready; falls back to demo mode otherwise.
  async function dbSubmit(form, opts) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const orig = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = opts.loadingLabel || 'שולח...';
    let dbError = null;
    try {
      if (window.KotelDB && KotelDB.enabled && KotelDB.ready && typeof opts.dbCall === 'function') {
        const { error } = await opts.dbCall();
        if (error) throw error;
      } else {
        // Demo mode — wait a bit so UX feels real
        await new Promise(r => setTimeout(r, 700));
      }
      showToast(opts.successMsg);
      form.reset();
      if (typeof opts.onSuccess === 'function') opts.onSuccess();
    } catch (err) {
      console.warn('Form submit failed:', err);
      dbError = err;
      showToast(opts.errorMsg || 'הייתה שגיאה. נסו שוב או צרו קשר.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = orig;
    }
    return { error: dbError };
  }

  // ---------- Note form (send-note page) ----------
  const noteForm = document.getElementById('noteForm');
  if (noteForm) {
    const textarea = noteForm.querySelector('textarea[name="note"]');
    const preview = document.getElementById('notePreview');
    const charCount = document.getElementById('charCount');
    const MAX = 500;

    const updatePreview = () => {
      const val = textarea.value;
      if (preview) preview.textContent = val;
      if (charCount) charCount.textContent = `${val.length} / ${MAX}`;
    };
    if (textarea) {
      textarea.setAttribute('maxlength', MAX);
      textarea.addEventListener('input', updatePreview);
      updatePreview();
    }

    noteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      dbSubmit(noteForm, {
        loadingLabel: 'שולח...',
        successMsg: 'הפתק שלך נשלח. שליחנו יטמין אותו בכותל בקרוב.',
        errorMsg: 'הפתק לא נשלח. בדקו את החיבור ונסו שוב.',
        dbCall: () => KotelDB.insertNote({
          content: textarea.value.trim(),
          firstName: noteForm.firstName.value.trim(),
          motherName: noteForm.motherName.value.trim(),
          intention: noteForm.intention.value,
          email: noteForm.email.value.trim(),
        }),
        onSuccess: updatePreview,
      });
    });
  }

  // ---------- Toast ----------
  const toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    const msgEl = document.getElementById('toastMsg');
    if (msgEl && msg) msgEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 4200);
  }
  window.showToast = showToast;

  // ---------- Smooth anchors offset ----------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ---------- Gallery lightbox (gallery page) ----------
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="סגירה">&times;</button>
      <button class="lightbox-prev" aria-label="הקודם">‹</button>
      <button class="lightbox-next" aria-label="הבא">›</button>
      <img alt="" />
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    const lbCap = lightbox.querySelector('.lightbox-caption');
    let current = 0;

    function open(idx) {
      current = idx;
      const item = galleryItems[idx];
      const img = item.querySelector('img');
      const cap = item.querySelector('.caption');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = cap ? cap.textContent : '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    function nav(delta) {
      open((current + delta + galleryItems.length) % galleryItems.length);
    }
    galleryItems.forEach((it, i) => it.addEventListener('click', () => open(i)));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => nav(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => nav(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nav(-1);
      if (e.key === 'ArrowLeft') nav(1);
    });

    const style = document.createElement('style');
    style.textContent = `
      .lightbox { position: fixed; inset: 0; z-index: 1000; background: rgba(15, 16, 25, 0.94); display: none; align-items: center; justify-content: center; padding: 60px 24px; }
      .lightbox.open { display: flex; }
      .lightbox img { max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 8px; box-shadow: 0 24px 80px rgba(0,0,0,0.5); }
      .lightbox-caption { position: absolute; bottom: 32px; right: 0; left: 0; text-align: center; color: rgba(255,255,255,0.9); font-size: 1rem; padding: 0 24px; }
      .lightbox button { position: absolute; background: rgba(255,255,255,0.1); color: #fff; border-radius: 50%; display: grid; place-items: center; backdrop-filter: blur(10px); transition: all 280ms cubic-bezier(0.4,0,0.2,1); }
      .lightbox button:hover { background: rgba(255,255,255,0.25); }
      .lightbox-close { top: 24px; left: 24px; width: 48px; height: 48px; font-size: 28px; }
      .lightbox-prev, .lightbox-next { top: 50%; transform: translateY(-50%); width: 56px; height: 56px; font-size: 32px; }
      .lightbox-prev { right: 24px; }
      .lightbox-next { left: 24px; }
      @media (max-width: 720px) { .lightbox-prev, .lightbox-next { width: 44px; height: 44px; font-size: 24px; } }
    `;
    document.head.appendChild(style);
  }

  // ---------- Donate amount selector ----------
  const donateOptions = document.querySelectorAll('.donate-amount');
  if (donateOptions.length) {
    const customInput = document.getElementById('donateCustom');
    donateOptions.forEach((opt) => {
      opt.addEventListener('click', () => {
        donateOptions.forEach((o) => o.classList.remove('active'));
        opt.classList.add('active');
        if (customInput) customInput.value = '';
      });
    });
    if (customInput) {
      customInput.addEventListener('focus', () => {
        donateOptions.forEach((o) => o.classList.remove('active'));
      });
    }
  }

  // ---------- Event form ----------
  document.querySelectorAll('form.event-form').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const typeMap = {
        'בר מצווה': 'bar_mitzvah',
        'בת מצווה': 'bat_mitzvah',
        'חלאקה': 'halaka',
      };
      const eTypeVal = f.querySelector('select') ? f.querySelector('select').value : '';
      dbSubmit(f, {
        loadingLabel: 'שולח...',
        successMsg: 'הפנייה נשלחה. נציג שלנו ייצור איתכם קשר תוך 24 שעות.',
        dbCall: () => KotelDB.insertEvent({
          fullName: (f.querySelector('#ename') || {}).value || '',
          phone:    (f.querySelector('#ephone') || {}).value || '',
          email:    (f.querySelector('#eemail') || {}).value || '',
          eventType: typeMap[eTypeVal] || 'other',
          preferredDate: (f.querySelector('#edate') || {}).value || null,
          notes:    (f.querySelector('#enotes') || {}).value || '',
        }),
      });
    });
  });

  // ---------- Donate form ----------
  document.querySelectorAll('form.donate-form').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const activeAmount = document.querySelector('.donate-amount.active');
      const customAmount = (document.getElementById('donateCustom') || {}).value;
      const amount = parseInt(customAmount || (activeAmount && activeAmount.dataset.val) || '0', 10);
      const freq = (document.querySelector('.frequency-toggle button.active') || {}).dataset?.freq || 'once';
      dbSubmit(f, {
        loadingLabel: 'מעבד...',
        successMsg: 'תודה! מעבירים אתכם לתשלום מאובטח.',
        dbCall: () => KotelDB.insertDonationIntent({
          fullName: (f.querySelector('#dname') || {}).value || '',
          email:    (f.querySelector('#demail') || {}).value || '',
          phone:    (f.querySelector('#dphone') || {}).value || '',
          amountIls: amount || 0,
          frequency: freq,
          inMemoryOf: (f.querySelector('#dnotes') || {}).value || '',
        }),
      });
    });
  });

  // ---------- Contact form ----------
  document.querySelectorAll('form.contact-form').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      dbSubmit(f, {
        successMsg: 'ההודעה נשלחה בהצלחה.',
        dbCall: () => KotelDB.insertContact({
          fullName: f.fullName?.value || '',
          email: f.email?.value || '',
          phone: f.phone?.value || '',
          subject: f.subject?.value || '',
          message: f.message?.value || '',
        }),
      });
    });
  });

  // ---------- Newsletter form ----------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value.trim();
      dbSubmit(newsletterForm, {
        loadingLabel: 'מצרף...',
        successMsg: 'נרשמתם בהצלחה! נשמח לפגוש אתכם בתיבה.',
        errorMsg: 'הרישום נכשל. בדקו את הכתובת ונסו שוב.',
        dbCall: () => KotelDB.subscribeNewsletter(email, 'homepage'),
      });
    });
  }
})();
