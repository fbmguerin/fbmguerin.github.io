// Accès discret à l'administration (Sveltia, /admin/) : cinq clics rapides (moins
// de 2 s) dans les 20 derniers pixels de la page, c'est-à-dire le pied de page vide,
// où rien n'est cliquable. Rien de visible ; l'administration reste protégée par
// le jeton GitHub, ceci n'est qu'un raccourci.
(() => {
  const cible = document.body.dataset.admin;
  if (!cible) return;
  let clics = [];
  addEventListener("click", (e) => {
    if (e.pageY < document.documentElement.scrollHeight - 20) { clics = []; return; }
    const t = performance.now();
    clics = clics.filter((c) => t - c < 2000);
    clics.push(t);
    if (clics.length >= 5) location.href = cible;
  });
})();
