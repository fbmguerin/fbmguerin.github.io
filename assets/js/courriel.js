// Adresse courriel : les pages n'en portent qu'une forme encodée (data-courriel,
// renversée puis base64), décodée seulement quand le visiteur clique.
// Sans JavaScript, les boutons restent masqués (attribut hidden).
(() => {
  const decoder = (el) => atob(el.dataset.courriel).split("").reverse().join("");
  for (const el of document.querySelectorAll("[data-courriel]")) {
    el.addEventListener("click", () => {
      const adresse = decoder(el);
      if (el.classList.contains("icone")) {
        location.href = "mailto:" + adresse;
        return;
      }
      // Dans un article : le bouton devient un lien qui montre l'adresse.
      const lien = document.createElement("a");
      lien.href = "mailto:" + adresse;
      lien.textContent = adresse;
      el.replaceWith(lien);
      lien.focus();
    });
    el.hidden = false;
  }
})();
