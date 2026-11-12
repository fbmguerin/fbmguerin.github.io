// Bascule clair/sombre. Le thème est porté par <meta name="color-scheme"> :
// "light dark" (système, par défaut), "light" ou "dark" ; le CSS le relaie.
// Le choix mémorisé est appliqué avant le CSS par le script en ligne de <head>.
(() => {
  const meta = document.querySelector('meta[name="color-scheme"]');
  const bouton = document.getElementById("theme");
  if (!meta || !bouton) return;
  const systeme = matchMedia("(prefers-color-scheme: dark)");
  const sombre = () => meta.content === "dark" || (meta.content !== "light" && systeme.matches);
  const afficher = () => bouton.setAttribute("aria-pressed", String(sombre()));

  bouton.addEventListener("click", () => {
    const choix = sombre() ? "light" : "dark";
    meta.content = choix;
    try { localStorage.setItem("color-scheme", choix); } catch (e) { /* stockage bloqué : non mémorisé */ }
    afficher();
  });
  systeme.addEventListener("change", afficher);
  afficher();
  bouton.hidden = false;
})();
