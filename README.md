# fbmguerin.github.io

Source de mon site personnel : un journal d'articles qui sert aussi de CV, construit avec [Hugo](https://gohugo.io/) 0.169.0 et publié sur GitHub Pages.

- Spécification : [docs/SPEC.md](docs/SPEC.md)
- Choix du générateur : [docs/verification.md](docs/verification.md)

## Construire en local

```bash
hugo server
```

Puis ouvrir <http://localhost:1313/>. Pour une construction identique à celle de GitHub Actions :

```bash
hugo --gc --minify
```

## Publier un article

### Depuis le navigateur (Sveltia CMS)

1. Créer une fois pour toutes un jeton d'accès GitHub : *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token*.
   - *Repository access* : **Only select repositories**, ce dépôt seulement.
   - *Permissions → Repository permissions → Contents* : **Read and write**. Rien d'autre.
2. Ouvrir `https://fbmguerin.github.io/admin/`, choisir **Sign in with Token** et coller le jeton. Il reste dans le navigateur (`localStorage`). Ne jamais le committer ni l'écrire ailleurs.
3. *Articles → New*, remplir, **Save**. Chaque enregistrement est un commit direct sur `main`, qui déclenche la publication (une à deux minutes).

Une image ajoutée avec le bouton *Image* est rangée dans le dossier de l'article. Pour qu'elle s'affiche en grand avec une légende, elle doit être seule dans son paragraphe (ligne vide avant et après) et la légende va dans le champ *Title*.

### À la main

Tout article est un dossier, même sans image :

```
content/articles/
  swarf-os/
    index.md
    bureau.svg      ← référencée dans le texte par ![texte alternatif](bureau.svg "Légende")
```

Le nom du dossier donne l'adresse : `/articles/swarf-os/`. Un fichier `content/articles/<nom>.md` hors dossier serait invisible dans Sveltia.

En-tête :

```yaml
---
title: swarf-os                  # obligatoire
date: 2026-11-01                 # obligatoire, heure de Paris
tags: [linux]                    # facultatif : minuscules, un mot par tag
resume: Facultatif ; sinon le premier paragraphe sert de résumé.
draft: true                      # facultatif : brouillon, non publié
epingle: true                    # facultatif : carte en tête de l'accueil…
epingle_jusqu_au: 2027-02-19     # …jusqu'à ce jour inclus (facultatif)
lang: en                         # facultatif, français par défaut
---
```

- **Brouillon** : `draft: true`. Ne pas utiliser `published`, que Hugo lit comme une date (le build échoue).
- **Épinglé** : deux au plus. S'il y en a davantage, seuls les deux plus récents (par `date`) restent en tête.
- **Date future** : Hugo ne publie pas un article daté dans le futur avant ce jour-là (la reconstruction quotidienne le fera apparaître).

### Dates de révision

La date « Révisé le » d'une page vient du dernier commit qui touche son `index.md` (il faut donc l'historique complet, `fetch-depth: 0` dans le workflow). Elle n'apparaît que si elle tombe un autre jour que la publication.

- **Renommer le dossier d'un article remet sa date de révision à zéro** (date du renommage) : Hugo ne suit pas l'historique d'un fichier déplacé. Changer le slug dans Sveltia fait de même.
- Un article commité après sa date de publication affiche « Révisé le » dès le premier commit.

### Articles de test

Les trois articles actuels (`recherche-stage`, `swarf-os`, `stage-sidsic`) ont des **dates provisoires**, à corriger. La section « Rendu » de `swarf-os` (image de remplacement, code, tableau) ne sert qu'à tester l'affichage sur mobile : à supprimer avec `bureau.svg`.

## Adresse courriel

L'adresse n'est jamais écrite en entier, ni dans le dépôt ni dans les pages, pour échapper aux robots qui collectent les adresses :

- elle est définie en deux morceaux dans `hugo.toml` : `courriel_nom` et `courriel_domaine` ;
- les pages n'en contiennent qu'une forme encodée, que `assets/js/courriel.js` décode **seulement au clic**. Les mesures publiées par [Spencer Mortensen](https://spencermortensen.com/articles/email-obfuscation/) montrent qu'une adresse construite en JavaScript lors d'une action de l'utilisateur a arrêté 100 % des robots testés ;
- sans JavaScript, le bouton courriel est masqué.

Dans un article, n'écrivez pas l'adresse : utilisez le shortcode, qui affiche un bouton « afficher l'adresse » :

```markdown
Contact : {{</* courriel */>}}.
```

L'adresse reste visible dans l'historique Git (anciens commits) et, si vous n'utilisez pas l'adresse masquée de GitHub, dans les métadonnées de vos commits.

## Icône GitHub

La barre affiche `static/icons/github.svg` (logo officiel, une couleur), inclus tel quel dans la page. Préparer le fichier : `fill="currentColor"`, ni `width` ni `height`, sans `<g clip-path>`, `<defs>` ni `<clipPath>`. Tant que le fichier est absent, un carré en pointillés le remplace.

## Publication

`.github/workflows/pages.yml` construit et déploie `main` à chaque push, sur demande (*Actions → Pages → Run workflow*) et chaque nuit vers 04:17 UTC. Cette reconstruction quotidienne fait expirer les épingles.

GitHub **désactive les workflows planifiés d'un dépôt public sans activité pendant 60 jours**. Si cela arrive, les épingles n'expirent plus : réactiver le workflow dans l'onglet *Actions*, ou pousser un commit.

## Licences

- Code : [MIT](LICENSE).
- Textes et images des articles : [CC BY 4.0](LICENSE-CONTENT.md), sauf mention contraire.
