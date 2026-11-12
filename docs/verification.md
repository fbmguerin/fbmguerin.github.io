# Vérification : Jekyll ou Hugo ?

Essais réalisés le 2026-11-12 sur deux branches, avec les 4 mêmes faux articles. Les liens Actions renvoient à la dernière exécution, faite après le passage de tous les articles en dossier ; ses résultats sont identiques aux exécutions précédentes.

**Convention retenue : tout contenu est un article, et tout article est un dossier** (`articles/<nom>/index.md`, ressources à côté), même sans image. Il n'existe pas d'autre type de contenu.

| Branche | Générateur | Vérification Actions |
| --- | --- | --- |
| [`proto/jekyll`](https://github.com/fbmguerin/fbmguerin.github.io/tree/proto/jekyll) | Jekyll 4.4.1, jekyll-feed 0.18.0, jekyll-last-modified-at 1.3.2 (Ruby 3.3) | [exécution 43257695747](https://github.com/fbmguerin/fbmguerin.github.io/actions/runs/43257695747) |
| [`proto/hugo`](https://github.com/fbmguerin/fbmguerin.github.io/tree/proto/hugo) | Hugo 0.169.0 (binaire officiel dans Actions, compilé depuis les sources en local) | [exécution 43257697607](https://github.com/fbmguerin/fbmguerin.github.io/actions/runs/43257697607) |

Les deux générateurs ont pu être installés et exécutés pour de vrai, en local comme dans GitHub Actions. Aucun résultat ci-dessous n'est simulé. Seules les **dates de commit** des faux articles ont été fixées à la main (`GIT_COMMITTER_DATE`) pour fabriquer un historique : articles ajoutés le 2026-10-10, swarf-os révisé le 2026-10-20.

Articles d'essai :

| Fichier | Rôle |
| --- | --- |
| `swarf-os/index.md` + `bureau.png` | article en dossier avec image, révisé après publication |
| `menu-kde/index.md` | article sans image ni `resume` (test du résumé automatique) |
| `brouillon/index.md` | brouillon |
| `annonce/index.md` | épinglé jusqu'au 2026-11-01 (donc expiré), `lang: en` |

## Tableau de synthèse

✅ fonctionne · 🔧 fonctionne avec contournement · ❌ ne fonctionne pas

| # | Besoin | Jekyll | Hugo |
| --- | --- | --- | --- |
| 1 | Article = dossier | 🔧 dossier `_articles/`, pas `articles/` | ✅ `articles/` (montage de module) |
| 2 | Adresse propre, images à côté | 🔧 plugin Ruby de 8 lignes | ✅ natif |
| 3 | En-tête minimal | ✅ (`published: false` natif) | 🔧 `draft: true` au lieu de `published: false` |
| 4 | Résumé automatique | ✅ (gabarit Liquid) | ✅ (partial de 8 lignes) |
| 5 | Date de révision via git, dans Actions | ✅ | ✅ |
| 6 | Flux avec date de mise à jour | 🔧 flux « posts » parasite à écarter | 🔧 gabarit Atom maison (le RSS natif n'a pas de date de mise à jour) |
| 7 | Accueil avec tags, données pour filtre JS | ✅ | ✅ |
| 8 | Épingle + expiration, reconstruction quotidienne | ✅ | ✅ (après correction d'un piège de fuseau horaire) |
| 9 | Sveltia CMS en /admin/ | ✅ (a, b, c vérifiés dans un vrai navigateur) | ✅ (a, b, c vérifiés dans un vrai navigateur) |
| 10 | Ni pisteur ni CDN, JS minimal | ✅ site : 0 script · 🔧 /admin/ | ✅ site : 0 script · 🔧 /admin/ |

## Détail point par point

### 1. Un article = un dossier

- **Jekyll 🔧.** Les collections doivent être dans un dossier préfixé par `_` : les articles vivent dans `_articles/<nom>/index.md` et non `articles/`. C'est le **contournement n° 1**, sans solution propre. Une autre piste, non testée : traiter les articles comme de simples pages (`articles/` sans `_`), mais on perd alors le support de jekyll-feed.
- **Hugo ✅.** `articles/` reste à la racine du dépôt grâce à un montage `articles → content/articles` dans `hugo.toml`. Comme déclarer un montage remplace ceux par défaut, il faut aussi redéclarer `layouts` et `static` (3 blocs de configuration). Ce sont les « page bundles » natifs.

Les deux générateurs accepteraient aussi un article en fichier unique (`articles/<nom>.md`), testé dans une première version. Cette forme est **abandonnée** : Sveltia ne la voit pas dans la collection des articles en dossier (voir point 9), et un dossier permet d'ajouter une image plus tard sans rien déplacer.

### 2. Adresse finale

Adresses réellement obtenues : **`/articles/swarf-os/`**, `/articles/menu-kde/`, `/articles/annonce/`, image servie à **`/articles/swarf-os/bureau.png`** et référencée dans la page par `<img src="bureau.png">`.

- **Jekyll 🔧.** Avec `permalink: /articles/:path/`, l'essai donne **`/articles/swarf-os/index/`**. Le **contournement n° 2** est un plugin (`_plugins/articles_en_dossier.rb`, 8 lignes de Ruby) qui force `/articles/<nom>/` pour les fichiers `index.md`. Les images, elles, sont copiées au bon endroit sans rien faire.
- **Hugo ✅.** Natif.

J'ai choisi `/articles/<nom>/` : c'est le chemin naturel des deux générateurs, et il laisse la racine libre pour `/cv/` et `/portfolio/`. Passer à `/<nom>/` coûterait une ligne avec Hugo (`[permalinks]`) et une ligne dans le plugin avec Jekyll.

### 3. En-tête

Champs testés : `title`, `date`, `tags`, `resume`, `epingle`, `epingle_jusqu_au`, `lang`. Les deux générateurs les lisent sans difficulté. `lang: en` donne bien `<html lang="en">` sur la page, `lang="en"` dans la liste et `xml:lang="en"` dans le flux. Sans `lang`, la page est en `fr`. Un futur site bilingue pourra s'appuyer dessus sans refonte.

**Contradiction avec Hugo : `published: false`.**
- Dans Hugo, `published` est un alias de la **date** de publication. Résultat réel : `ERROR the "published" front matter field is not a parsable date`, et le build échoue.
- On peut retirer cet alias dans la configuration, mais Hugo ne sait pas transformer un paramètre personnalisé en brouillon. Un article `published: false` serait alors **publié** sans avertissement, ce qui est pire.
- Le contournement propre consiste à utiliser le champ natif **`draft: true`**. Dans le CMS, la case s'appelle « Brouillon ».

Jekyll gère `published: false` nativement : le fichier n'est pas lu du tout.

### 4. Résumé automatique

Les deux générateurs donnent le même résultat. Sans `resume`, ils prennent le premier paragraphe **non vide**, retirent le HTML (gras, lien, code) et coupent au mot avant 160 caractères en ajoutant « … ». Résultat pour `menu-kde/index.md` :

> Le menu de KDE Plasma propose par défaut beaucoup trop d’entrées : voici comment le réduire à l’essentiel avec l’éditeur de menu et deux lignes de…

Piège rencontré avec Jekyll : son `excerpt` natif est vide quand l'article commence par une image. Le gabarit parcourt donc le contenu rendu jusqu'au premier paragraphe qui contient du texte. Ce cas a été testé pour les deux générateurs.

### 5. Date de révision tirée de git

Les deux générateurs fonctionnent ✅ (`jekyll-last-modified-at` d'un côté, `enableGitInfo = true` de l'autre). La date n'est affichée que sur la page d'article, et seulement si elle diffère de la date de publication. **Vérifié dans GitHub Actions** avec deux clones (exécutions ci-dessus) :

| | `fetch-depth: 0` | `fetch-depth: 1` |
| --- | --- | --- |
| Jekyll, swarf-os | révisé le **2026-10-20** ✅ | révisé le 2026-11-12 ❌ (date du dernier commit, pour tous les articles) |
| Hugo, swarf-os | révisé le **2026-10-20** ✅ | révisé le 2026-11-12 ❌ (idem) |

`fetch-depth: 0` est donc indispensable. Il figure dans `.github/workflows/pages.yml`.

**Limite commune : renommer un article remet sa date de révision à la date du renommage.** Les deux générateurs ne suivent pas l'historique d'un fichier déplacé (pas de `git log --follow`). Test réel : `git mv articles/swarf-os articles/swarf-os-v2`, puis construction. Résultat : « révisé le 2026-11-12 » avec Hugo comme avec Jekyll. Changer le slug d'un article dans Sveltia déplace son dossier, avec le même effet. Le passage de `menu-kde.md` à `menu-kde/index.md` dans les prototypes a donc été commité avec une date antidatée, pour garder les résultats ci-dessous comparables.

### 6. Flux Atom

Les deux flux sont générés à **`/feed.xml`** (Atom). Le brouillon en est absent. Chaque entrée porte `<updated>` égal à la date git. Extrait de la sortie Actions avec `fetch-depth: 0` :

```
Un menu KDE plus court   <updated>2026-10-10T09:00:00+02:00
Swarf OS                 <updated>2026-10-20T18:30:00+02:00   ← révision prise en compte
Pinned announcement      <updated>2026-10-10T09:00:00+02:00   (entry xml:lang="en")
```

- **Jekyll 🔧.** jekyll-feed sait faire un flux de collection et utilise `last_modified_at` pour `<updated>`. Mais il génère **toujours** en plus un flux des « posts », vide ici, au même chemin `/feed.xml` (avertissement « Conflict » au build). Le **contournement n° 3** déplace ce flux inutile vers `/feed/posts.xml`, un fichier vide mais inoffensif.
- **Hugo 🔧.** Le RSS natif ne porte que `<pubDate>` par article. Une révision n'y est donc pas visible, ce qui a été vérifié dans le gabarit embarqué de Hugo 0.169.0. J'ai écrit un **gabarit Atom de 25 lignes** (`layouts/home.atom.xml`) et désactivé le RSS natif. Le flux produit est du XML valide.

### 7. Page d'accueil

Les deux générateurs fonctionnent ✅. Chaque article est un `<li>` qui porte les données du futur filtre, sans aucun JavaScript pour l'instant :

```html
<li data-tags="kde astuce" data-date="2026-10-10">
<li data-tags="annonce" data-date="2026-08-01" data-epingle lang="en">
```

Les tags sont aussi affichés en clair (`<span class="tag">`). Un tag qui contient une espace casserait `data-tags` : il faudra imposer des tags sans espace, ou passer à du JSON si besoin.

### 8. Épinglage et expiration

Règle appliquée : un article est épinglé tant que la date de construction est au plus tard le jour `epingle_jusqu_au` inclus, à l'heure de Paris. Après cette date, il redevient un article ordinaire.

Pour le prouver, j'ai simulé la date de construction, avec `faketime` pour Jekyll et l'option native `--clock` pour Hugo (faketime n'a aucun effet sur un binaire Go). Ces tests ont tourné en local **et dans Actions**. Article « annonce » (`epingle_jusqu_au: 2026-11-01`) :

| Date de construction simulée | Jekyll | Hugo |
| --- | --- | --- |
| 2026-10-25 12:00 Paris | 1er, `data-epingle` | 1er, `data-epingle` |
| 2026-11-01 12:00 (dernier jour) | 1er, `data-epingle` | 1er, `data-epingle` |
| 2026-11-01 23:30 UTC (= 2 nov. 00:30 Paris) | — | dernier, ordinaire |
| 2026-11-02 | dernier, ordinaire | dernier, ordinaire |
| construction réelle du 2026-11-12 | dernier, ordinaire | dernier, ordinaire |

Piège corrigé côté Hugo : `now | time.Format` raisonne en UTC et ignore `timeZone`. La première version laissait donc l'épingle active jusqu'à 1 h ou 2 h du matin, heure de Paris. Le gabarit compare désormais deux instants : maintenant, et le lendemain de `epingle_jusqu_au` à 00:00 dans le fuseau du site.

La reconstruction quotidienne passe par `schedule: cron "17 4 * * *"` dans `pages.yml`. **Limite de la preuve** : je n'ai pas pu observer d'exécution planifiée, puisque la première aura lieu cette nuit et que GitHub ne lance les `schedule` que sur la branche par défaut. Son déclenchement se vérifiera avec `gh run list --event schedule`. Note : GitHub désactive les cron d'un dépôt public après 60 jours sans activité.

### 9. Sveltia CMS en /admin/

Documentation lue sur sveltiacms.app le 2026-11-12, pour la version **0.264.0** (publiée le jour même). Configuration : `admin-src/public/config.yml` sur chaque branche.

**Méthode de test.**
- J'ai lancé le vrai Sveltia dans Chromium (Playwright) en mode « Work with Local Repository », sur une copie du dépôt placée dans le système de fichiers privé du navigateur.
- J'ai rempli tous les champs, téléversé une image dans le corps du texte et enregistré, puis relu les fichiers réellement écrits.
- Je n'ai pas testé la connexion GitHub par jeton : je n'ai pas de jeton, et il ne faut pas m'en donner. La logique de chemins et de champs est la même dans les deux modes.

| Vérification | Résultat |
| --- | --- |
| (a) images dans le dossier de l'article | ✅ L'image téléversée a été écrite dans `…/essai-depuis-le-cms/capture-essai.png`, et le texte contient `![Ma capture](capture-essai.png)`, sans chemin. Réglages utilisés : `media_folder: ''` et `public_folder: ''`. |
| (b) articles en dossier | ✅ Avec `path: '{{slug}}/index'`, Sveltia a créé `…/essai-depuis-le-cms/index.md`. |
| (b') une seule collection | ✅ La collection unique « Articles » liste les 4 articles d'essai, brouillon compris. Un fichier unique `articles/<nom>.md` n'y apparaîtrait **pas** : c'est vérifié dans une première version de l'essai, et c'est pourquoi tout article est un dossier. |
| (c) champs | ✅ Dates écrites `2026-11-05`, sans heure (`type: date`, `input_timezone: utc` pour éviter un décalage d'un jour). Booléens écrits `true`/`false`. Tags en liste. `resume` et `lang` vides **omis** (`omit_empty_optional_fields`). |
| chaîne complète | ✅ Le fichier écrit par Sveltia a été construit tel quel par Jekyll et par Hugo. L'article apparaît épinglé en tête, avec son image. |

Fichier produit par Sveltia (version Jekyll) :

```yaml
---
title: Essai depuis le CMS
date: 2026-11-05
tags:
  - essai
published: true
epingle: true
epingle_jusqu_au: 2026-12-01
---

Premier paragraphe écrit dans Sveltia.

![Ma capture](capture-essai.png)
```

**Ce qui n'est pas possible tel quel.**

1. **Aucun CDN avec la version « script » de Sveltia, même copiée chez soi : impossible.** La doc et le code le confirment : elle charge ses polices depuis jsDelivr et des modules depuis UNPKG, et vérifie les mises à jour sur UNPKG.
   - Seul le **paquet npm compilé avec un bundler** sert tout depuis le site. Je l'ai fait avec Vite (`admin-src/`, construit dans le workflow) et vérifié dans le navigateur : aucune requête vers un CDN.
   - Coût : environ 20 Mo et 450 fichiers dans `/admin/`, une étape Node dans le workflow, **pas de mise à jour automatique** (la version est fixée à 0.264.0 et se met à jour à la main ou via Dependabot), et ce mode n'est **pas pris en charge** par l'équipe Sveltia.
2. **Requête tierce restante : `www.githubstatus.com`**, que Sveltia interroge avec le backend GitHub. Ce n'est pas un pisteur, et la requête ne part que de `/admin/`, jamais des pages publiques.
3. **Hugo : la case « Publié » devient « Brouillon » (`draft`)**, voir le point 3.
4. **Un fichier `articles/<nom>.md` créé à la main serait invisible dans le CMS.** Il faut toujours créer un dossier `<nom>/index.md`.
5. **Jeton.** Choisir un jeton « fine-grained » limité à ce dépôt, avec la permission *Contents: read and write*. Il est stocké dans le `localStorage` du navigateur.
6. Le flux éditorial (relecture par pull request) n'est pas activé.
7. Les images ne sont pas redimensionnées.

### 10. Contraintes générales

- **Pages publiques** ✅ pour les deux générateurs : aucun `<script>`, aucune police, aucune ressource externe. Les seules balises de ressources trouvées dans le HTML produit sont `<img src="bureau.png">` et le `<link rel="alternate">` du flux.
- **/admin/** 🔧 : voir le point 9.1. Le CMS lui-même pèse environ 2,6 Mo de JavaScript, mais il n'est chargé que par vous.

## Sorties de construction (locales)

Jekyll (`JEKYLL_ENV=production bundle exec jekyll build`), première version, avant le contournement n° 3 :

```
       Jekyll Feed: Generating feed for articles
       Jekyll Feed: Generating feed for posts
          Conflict: The following destination is shared by multiple files.
                    The written file may end up with unexpected contents.
                    /home/user/fbmguerin.github.io/_site/feed.xml
```

Jekyll, version finale :

```
Configuration file: /home/user/fbmguerin.github.io/_config.yml
      Generating...
       Jekyll Feed: Generating feed for articles
       Jekyll Feed: Generating feed for posts
                    done in 0.38 seconds.
$ find _site -type f
_site/articles/annonce/index.html
_site/articles/menu-kde/index.html
_site/articles/swarf-os/bureau.png
_site/articles/swarf-os/index.html
_site/feed.xml
_site/feed/posts.xml
_site/index.html
```

Hugo avec `published: false` :

```
ERROR the "published" front matter field is not a parsable date: see …/articles/brouillon/index.md
ERROR error building site: logged 1 error(s)
```

Hugo, version finale (`hugo --gc --destination _site`) :

```
hugo v0.169.0 linux/amd64
                  │ FR
 Pages            │  5
 Non-page files   │  1
Total in 22 ms
$ find _site -type f
_site/articles/annonce/index.html
_site/articles/menu-kde/index.html
_site/articles/swarf-os/bureau.png
_site/articles/swarf-os/index.html
_site/feed.xml
_site/index.html
```

## Recommandation : Hugo

Critère principal : la simplicité de maintenance, pour quelqu'un à l'aise avec Linux, Git, Actions, HTML/JS et Python, mais pas avec Ruby.

1. **Pas de Ruby.**
   - Avec Jekyll, il faut maintenir une chaîne Ruby (Ruby, Bundler, `Gemfile.lock`, mises à jour des gems), écrire un plugin **en Ruby** pour obtenir des adresses propres, et contourner un comportement de jekyll-feed.
   - Hugo est un binaire unique, dont la version est fixée en une ligne du workflow.
2. **Contournements plus légers et sans code exotique.**
   - Hugo : un nom de champ (`draft`), un gabarit Atom de 25 lignes, trois montages déclarés.
   - Jekyll : un dossier renommé contre votre spécification (`_articles`), un plugin Ruby, un flux parasite.
3. **Plus de besoins couverts nativement.**
   - Hugo gère nativement les page bundles, git et `--clock` pour tester les épingles. Les gabarits Go se lisent mieux que les boucles Liquid de l'accueil Jekyll.
   - Sveltia documente explicitement le cas Hugo et les page bundles.
4. **Les points faibles de Hugo sont à connaître.**
   - Il évolue vite et déprécie des clés : `languageCode` est devenu `locale` en 0.158. Il faut donc **figer la version** (déjà fait) et la monter volontairement.
   - Ses gabarits ont des pièges : le fuseau horaire, et l'échappement `&#43;` dans le flux, corrigé avec `safeHTML`.
   - Jekyll garde deux avantages : `published: false` natif, et un flux Atom sans gabarit.

## Configuration côté GitHub

- **Settings > Pages > Build and deployment > Source : « GitHub Actions ».** Aujourd'hui la source est « Deploy from a branch » : l'exécution `pages build and deployment` du 2026-11-12 a publié le README de `main` avec le Jekyll intégré de GitHub.
- L'environnement `github-pages` (Settings > Environments), créé au premier déploiement, n'autorise que `main` par défaut. C'est un garde-fou supplémentaire contre le déploiement des branches `proto/*`.
