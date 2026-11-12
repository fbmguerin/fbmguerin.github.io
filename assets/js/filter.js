// Filtre de l'accueil par tag. Sans JavaScript, la rangée reste masquée et
// toutes les cartes sont visibles. L'état est dans l'adresse : /#linux.
// Les cartes épinglées (data-pinned) ne sont jamais masquées.
(() => {
  const rangee = document.querySelector(".tags");
  if (!rangee) return;
  const boutons = [...rangee.querySelectorAll("button")];
  const cartes = [...document.querySelectorAll("li[data-tags]:not([data-pinned])")];
  const connus = new Set(boutons.map((b) => b.dataset.tag));

  const actif = () => {
    let t = "";
    try { t = decodeURIComponent(location.hash.slice(1)); } catch (e) { /* hash mal formé */ }
    return connus.has(t) ? t : "";
  };

  const appliquer = () => {
    const t = actif();
    for (const b of boutons) b.setAttribute("aria-pressed", String(b.dataset.tag === t));
    for (const c of cartes) c.hidden = t !== "" && !c.dataset.tags.split(" ").includes(t);
  };

  rangee.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const t = b.dataset.tag === actif() ? "" : b.dataset.tag;
    history.pushState(null, "", t ? "#" + encodeURIComponent(t) : location.pathname + location.search);
    appliquer();
  });
  addEventListener("hashchange", appliquer);
  addEventListener("popstate", appliquer);
  appliquer();
  rangee.hidden = false;
})();
