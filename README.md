# fbmguerin.github.io

Source de mon site personnel : journal d'articles, CV et portfolio, publié sur GitHub Pages.

> Le générateur (Hugo ou Jekyll) n'est pas encore choisi. Voir [docs/verification.md](docs/verification.md).

## Ajouter un article

Tout article est un dossier, même sans image :

```
articles/
  swarf-os/
    index.md
    bureau.png      ← référencée dans le texte par ![légende](bureau.png)
  menu-kde/
    index.md
```

Le nom du dossier donne l'adresse (`/articles/swarf-os/`). Le renommer remet la date de révision à zéro.

En-tête minimal :

```yaml
---
title: Swarf OS
date: 2026-09-15
tags: [linux, bureau]
resume: Facultatif ; sinon le premier paragraphe sert de résumé.
epingle: false            # true : en tête de liste…
epingle_jusqu_au: 2026-12-01   # …jusqu'à cette date (facultatif)
lang: fr                  # facultatif, français par défaut
---
```

Pour un brouillon, voir le champ indiqué dans docs/verification.md (il dépend du générateur).

On peut aussi passer par l'interface d'édition en `/admin/` (Sveltia CMS, connexion par jeton d'accès personnel GitHub).

Chaque push sur `main` déclenche la publication (`.github/workflows/pages.yml`), ainsi qu'une reconstruction quotidienne qui fait expirer les épingles.

## Licences

- Code : [MIT](LICENSE).
- Textes et images des articles : [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.fr), sauf mention contraire.
