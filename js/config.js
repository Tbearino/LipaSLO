/* Lipa: povezava z oblakom (Supabase).
   Prilepi sem "Project URL" in "anon public" ključ iz Supabase (Project Settings → API).
   Ključ "anon" je javen in je varno, da je tukaj. NIKOLI pa sem ne prilepi ključa "service_role".
   Če pustiš prazno, stran deluje kot prej: napredek je shranjen samo v tem brskalniku. */
window.LIPA_CONFIG = {
  supabaseUrl: "",
  supabaseKey: ""
};
