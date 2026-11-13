// Calendrier GitHub du pied de page : choix de la période (« 12 mois » ou une année).
// Sans JavaScript, la rangée de boutons reste masquée et seul « 12 mois » s'affiche.
(() => {
  const rangee = document.querySelector(".calendrier .annees");
  if (!rangee) return;
  const boutons = [...rangee.querySelectorAll("button")];
  const panneaux = [...document.querySelectorAll(".calendrier .cal")];

  rangee.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    for (const x of boutons) x.setAttribute("aria-pressed", String(x === b));
    for (const p of panneaux) p.hidden = p.dataset.cal !== b.dataset.cal;
  });
  rangee.hidden = false;
})();
