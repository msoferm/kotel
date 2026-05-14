/* ========================================
   Kotel — Supabase client wrapper
   ========================================
   Loads the Supabase JS SDK from CDN and exposes a thin
   `KotelDB` object with helper functions for each form submission.

   Falls back to local-only mode when:
   - Config is missing
   - anon key is the placeholder
   - SDK fails to load (offline)
   ======================================== */

(function () {
  'use strict';

  const cfg = (window.KOTEL_CONFIG && window.KOTEL_CONFIG.supabase) || {};
  const liveSubmit = !!(window.KOTEL_CONFIG && window.KOTEL_CONFIG.features && window.KOTEL_CONFIG.features.liveFormSubmit);
  const isPlaceholder = !cfg.anonKey || cfg.anonKey === 'YOUR_SUPABASE_ANON_KEY_HERE';

  const KotelDB = {
    ready: false,
    client: null,
    enabled: liveSubmit && !isPlaceholder,
    error: null,
  };
  window.KotelDB = KotelDB;

  if (!KotelDB.enabled) {
    if (isPlaceholder) {
      console.info('[Kotel] Supabase running in DEMO mode — set anonKey in js/config.js to enable.');
    }
    return; // Forms will fall back to toast-only mode
  }

  // Load Supabase SDK from CDN
  const SDK_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  const s = document.createElement('script');
  s.src = SDK_URL;
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.onload = () => {
    try {
      const supabaseLib = window.supabase;
      if (!supabaseLib || typeof supabaseLib.createClient !== 'function') {
        throw new Error('Supabase SDK loaded but createClient not found');
      }
      KotelDB.client = supabaseLib.createClient(cfg.url, cfg.anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      KotelDB.ready = true;
      document.dispatchEvent(new CustomEvent('kotel:db-ready'));
    } catch (e) {
      console.warn('[Kotel] Supabase init failed:', e);
      KotelDB.enabled = false;
      KotelDB.error = e;
    }
  };
  s.onerror = (e) => {
    console.warn('[Kotel] Supabase SDK failed to load — falling back to local mode.');
    KotelDB.enabled = false;
    KotelDB.error = e;
  };
  document.head.appendChild(s);

  // ----- Public helpers -----
  KotelDB.insertNote = async function (data) {
    if (!KotelDB.ready) throw new Error('DB not ready');
    return await KotelDB.client.from('notes').insert({
      content: data.content,
      first_name: data.firstName || null,
      mother_name: data.motherName || null,
      intention: data.intention || null,
      email: data.email || null,
      user_agent: navigator.userAgent.slice(0, 200),
    });
  };

  KotelDB.subscribeNewsletter = async function (email, source) {
    if (!KotelDB.ready) throw new Error('DB not ready');
    return await KotelDB.client.from('newsletter_subscribers').upsert(
      { email, source: source || 'site_footer' },
      { onConflict: 'email', ignoreDuplicates: false }
    );
  };

  KotelDB.insertEvent = async function (data) {
    if (!KotelDB.ready) throw new Error('DB not ready');
    return await KotelDB.client.from('event_inquiries').insert({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      event_type: data.eventType,
      preferred_date: data.preferredDate || null,
      notes: data.notes || null,
    });
  };

  KotelDB.insertDonationIntent = async function (data) {
    if (!KotelDB.ready) throw new Error('DB not ready');
    return await KotelDB.client.from('donation_intents').insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      amount_ils: data.amountIls,
      frequency: data.frequency || 'once',
      in_memory_of: data.inMemoryOf || null,
    });
  };

  KotelDB.insertContact = async function (data) {
    if (!KotelDB.ready) throw new Error('DB not ready');
    return await KotelDB.client.from('contact_messages').insert({
      full_name: data.fullName || null,
      email: data.email || null,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });
  };
})();
