/* ========================================
   Kotel — Public configuration
   ========================================
   The Supabase URL and *anon* key are SAFE to expose in the browser.
   They are designed to be public — Row Level Security (RLS) policies
   on the database control what the anon key can do.

   NEVER paste the database password here (or anywhere in client code).
   The DB password is for server-side use only.
   ======================================== */

window.KOTEL_CONFIG = {
  supabase: {
    // From the project ref `pbfvutqsdlxonmoufvqn`
    url: 'https://pbfvutqsdlxonmoufvqn.supabase.co',

    // ⚠️ Paste your anon (public) key here.
    // Find it in: Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`
    anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE',
  },

  // Feature flags
  features: {
    liveFormSubmit: true, // when false, forms only show success toast (no DB write)
  },
};
