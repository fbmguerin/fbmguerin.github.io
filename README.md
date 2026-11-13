# fbmguerin.github.io

Le site de [François Guerin](https://fbmguerin.github.io/) : un journal d'articles qui sert aussi de CV. [Hugo](https://gohugo.io/), GitHub Pages, [Sveltia CMS](https://sveltiacms.app/). Aucun pisteur, aucune police externe, presque pas de JavaScript.

## Reprendre ce thème

1. **Forkez** ce dépôt en le nommant `<votre-compte>.github.io`, pour être servi à `https://<votre-compte>.github.io/`.
2. **Activez GitHub Pages** : *Settings → Pages → Source : GitHub Actions*. Chaque push sur `main` publie le site, et une reconstruction a lieu chaque nuit.
3. **Adaptez `hugo.toml`** : `baseURL`, `title`, et dans `[params]` : `github`, `avatar`, `favoris`, `courriel_nom`, `courriel_domaine`.
4. **Adaptez `static/admin/config.yml`** : `backend.repo` = `<votre-compte>/<votre-compte>.github.io`.
5. **Remplacez le contenu** : videz `content/articles/`, mettez votre nom dans `LICENSE` et `LICENSE-CONTENT.md`, supprimez `docs/` si vous voulez.

Pour construire en local : `hugo server` (Hugo 0.169.0, la version figée dans `.github/workflows/pages.yml`).

## Sveltia CMS (`/admin/`)

Rien à installer : Sveltia est chargé depuis unpkg, en version figée dans `static/admin/index.html`.

1. Créez un jeton GitHub : *Settings → Developer settings → Fine-grained tokens*, limité à ce dépôt, permission *Contents : Read and write*.
2. Ouvrez `https://<votre-compte>.github.io/admin/` (ou cliquez cinq fois vite tout en bas d'une page), puis *Sign in with Token*.
3. Chaque enregistrement est un commit sur `main`. Les images sont réduites en WebP et rangées dans le dossier de l'article.

## Écrire

Un article = un dossier : `content/articles/<nom>/index.md`, plus ses images. Adresse : `/articles/<nom>/`.

```yaml
---
title: Mon article        # obligatoire
date: 2026-11-12          # obligatoire
tags: [linux]
resume: Facultatif, sinon le premier paragraphe.
draft: true               # brouillon, non publié
epingle: true             # en tête de l'accueil…
epingle_jusqu_au: 2027-01-31   # …jusqu'à cette date
---
```

- Adresse courriel dans un article : `{{</* courriel */>}}`. L'adresse n'est jamais écrite en clair et n'est décodée qu'au clic.
- Un dossier nommé comme une [slash page](https://slashpages.net/) (`uses`, `now`, `wish`…) est aussi servi à `/<nom>/`.
- Renommer un dossier remet sa date de révision à zéro (elle vient de git).

## Crédit

Le pied de page de toute copie affiche « Thème par François Guerin », avec un lien vers mon site. Ce n'est pas une obligation (licence MIT), mais ça me fait plaisir de le voir. Si vous refaites le pied de page, voici le lien à garder :

```html
Thème par <a href="https://fbmguerin.github.io/">François Guerin</a>
```

ou, si vous l'avez beaucoup modifié :

```html
Thème dérivé de celui de <a href="https://fbmguerin.github.io/">François Guerin</a>
```

## Licences

Code : [MIT](LICENSE). Textes et images des articles : [CC BY 4.0](LICENSE-CONTENT.md).
