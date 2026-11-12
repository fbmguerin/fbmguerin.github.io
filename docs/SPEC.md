# Spécification — fbmguerin.github.io

Site perso de François Guerin : un journal d'articles qui sert aussi de CV. Ce document est la référence pour la mise en place. En cas de contradiction avec une de tes habitudes de développement, c'est ce document qui gagne. En cas de contradiction **dans** ce document, ou d'exigence irréaliste : dis-le avant de contourner.

## 0. Avant de commencer

1. Lis `docs/verification.md` (sur `main`) et la branche `proto/hugo` : le rapport a déjà validé sur de vrais essais l'arborescence Hugo, l'adresse des articles, le gabarit Atom, le correctif de fuseau horaire, l'épinglage et la configuration Sveltia. **Réutilise ce qui a été validé**, ne le réécris pas de mémoire.
2. Ne touche pas au workflow de déploiement existant sauf nécessité (voir §11).
3. Travaille par petites étapes, un commit par étape, en français.

Ordre de travail :
1. Structure Hugo et modèle de contenu (§2, §3)
2. Gabarits et CSS (§4 à §8)
3. Thème clair/sombre (§9)
4. Filtre par tags (§6)
5. Flux Atom (§10)
6. Sveltia (§12)
7. Articles de test (§13)
8. Vérifications (§14)

## 1. Décisions déjà prises

| Sujet | Décision |
|---|---|
| Générateur | **Hugo 0.169.0**, version figée dans le workflow |
| Langue | Français. Champ `lang` facultatif par article (défaut `fr`), rien d'autre pour l'instant. Si un jour il y a des articles en anglais, ce sera un article par langue, sans refonte |
| Contenu | **Tout est un article en dossier** : `content/articles/<nom>/index.md` + ses ressources à côté, même sans image |
| Adresse | `/articles/<nom>/` |
| Tri | Par date de publication décroissante. Un article révisé ne change pas de place sur le site, mais remonte dans le flux Atom |
| Tags | Liste libre par article, que l'auteur gère. Pas de page par tag |
| CMS | Sveltia CMS sur `/admin/`, connexion par jeton d'accès personnel, validations directes sur `main` |
| Navigateurs | Évergreen récents (Baseline 2024). Pas de repli pour les anciens |
| Nom affiché | « François Guerin » exactement, sans titre ni deuxième prénom |
| Hors périmètre | Recherche, commentaires, sommaire automatique, traduction, page par tag, feuille d'impression, statistiques, toute fonctionnalité non listée |

## 2. Arborescence du dépôt

```
.
├─ hugo.toml
├─ content/
│  └─ articles/
│     └─ <nom>/index.md   (+ images et autres ressources dans le même dossier)
├─ layouts/               (_default/baseof.html, home, articles/single, 404, partials, index.atom.xml…)
├─ assets/css/site.css    (un seul fichier, voir §5)
├─ assets/js/             (theme.js, filter.js)
├─ static/
│  ├─ admin/              (index.html et config.yml de Sveltia)
│  ├─ icons/github.svg    (fourni par l'auteur, voir §4)
│  └─ favicon.svg         (carré couleur d'accent, provisoire)
├─ docs/                  (verification.md, SPEC.md)
├─ .github/workflows/     (déploiement, voir §11)
├─ README.md   LICENSE (MIT, code)   LICENSE-CONTENT.md (CC BY 4.0, textes)
```

## 3. Modèle de contenu

En-tête YAML. Clés sans accents (Hugo met les clés en minuscules).

| Clé | Type | Obligatoire | Rôle |
|---|---|---|---|
| `title` | texte | oui | Titre |
| `date` | date `AAAA-MM-JJ` | oui | Date de publication, fuseau `Europe/Paris` |
| `tags` | liste de textes | non | Libres, en minuscules, normalisés par le gabarit |
| `resume` | texte | non | Remplace le résumé automatique |
| `draft` | booléen | non | `true` = non publié (clé imposée par Hugo ; ne pas utiliser `published`) |
| `epingle` | booléen | non | Carte épinglée en tête |
| `epingle_jusqu_au` | date | non | Fin d'épinglage ; sans date, épinglé tant que `epingle: true` |
| `lang` | `fr` ou `en` | non | Défaut `fr` ; place l'attribut `lang` de la page |

- **Résumé de carte** : `resume` s'il existe ; sinon premier paragraphe de texte nettoyé (sans Markdown ni HTML), coupé à ~160 caractères à la fin d'un mot, avec « … » si coupé.
- **Dernière révision** : dérivée de git (`enableGitInfo`, historique complet dans le workflow, `fetch-depth: 0`). Renommer un dossier remet cette date à zéro : à documenter dans le README.
- **Épinglé actif** : `epingle: true` et (pas de `epingle_jusqu_au` ou date ≥ aujourd'hui en `Europe/Paris`). Au-delà de **deux** épinglés actifs, seuls les deux plus récents (par `date`) restent épinglés ; les autres retombent dans le fil normal. Une carte épinglée **n'apparaît pas deux fois**.

## 4. Pages

### Barre du haut (toutes les pages)
- `position: sticky; top: 0`, hauteur 60 px, fond `--bg`, filet de 1 px `--line` en dessous.
- Contenu : à gauche le nom « François Guerin » (lien vers `/`, graisse 500, sans soulignement) ; à droite quatre boutons carrés : GitHub, RSS, courriel, thème. Aucun autre lien, **aucun nom répété ailleurs dans la page**.
- Boutons : 40×40 px (44×44 en dessous de 600 px), icône 18 px, trait de 1,5 px, couleur `--tx2`, fond transparent, au survol fond `--card` et couleur `--tx`. Même bouton pour les liens et pour la bascule du thème.
- GitHub : le fichier `static/icons/github.svg` (logo officiel en une couleur, fourni par l'auteur) inclus en ligne, avec `fill="currentColor"`. Ne pas le déformer ni le recolorer autrement. Tant que le fichier est absent, le build ne doit pas échouer : afficher un carré en pointillés de 18 px.
- RSS : lien vers le flux Atom. Courriel : `mailto:` vers l'adresse définie dans `hugo.toml` (`params.email`, valeur initiale `francoisguerin@ikmail.com`).
- Bascule du thème : affiche la **lune** quand le thème effectif est clair, le **soleil** quand il est sombre.
- Un lien « Aller au contenu » visible uniquement au focus clavier, avant la barre.
- Icônes (SVG en ligne, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `aria-hidden="true"`) :
  - RSS : `<path d="M5 4.5a14.5 14.5 0 0 1 14.5 14.5M5 10.5a8.5 8.5 0 0 1 8.5 8.5"/><rect x="4.5" y="16.5" width="3" height="3" fill="currentColor" stroke="none"/>`
  - Courriel : `<rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/>`
  - Soleil : `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`
  - Lune : `<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>`
- Tous les boutons ont un `aria-label` en français, le bouton de thème porte `aria-pressed`.

### Accueil (`/`)
De haut en bas, dans un conteneur de 1040 px maximum, marges latérales de 24 px :
1. **Cartes épinglées** (zéro à deux). Ce sont des cartes ordinaires, **sans aucun marquage particulier** : pas de punaise, pas de bandeau, pas de libellé, pas de couleur propre. Elles se trouvent simplement en tête de la grille, **et restent visibles quel que soit le tag filtré**. S'il n'y en a pas, rien n'est rendu.
2. **Rangée de tags** : un bouton « tout » puis un bouton par tag, triés par nombre d'articles décroissant, puis ordre alphabétique français. Le nombre d'articles reste affiché en petit dans chaque bouton. Les boutons passent sur plusieurs lignes, y compris sur mobile (jamais de défilement horizontal).
3. **Grille de cartes** : `repeat(auto-fill, minmax(280px, 1fr))`, `gap: 12px`.

Pas de présentation de l'auteur, pas de titre « Journal », pas de slogan.

### Carte
Un seul lien englobant (`<a>`), de haut en bas : titre (18 px/1,35, graisse 500), résumé (15 px/1,55, `--tx2`), puis en bas de carte : la date `AAAA-MM`, suivie des tags sous forme de pastilles (pas des liens). Les pastilles passent à la ligne si besoin. Pas de nombre de révisions, pas de « révisé le », pas d'icône, pas de flèche.
- Fond `--card`, **aucun filet autour**, padding 20 px, hauteur minimale 180 px. Au survol et au focus clavier : fond `--hover` et titre en `--ac`.
- Pastille : `padding: 2px 8px`, 13 px, fond `--chip`, couleur `--tx2` (au survol de la carte, fond `--card`).

### Page d'article (`/articles/<nom>/`)
- Colonne de lecture de 720 px maximum, sous la barre. Lien « Retour à l'accueil » (14 px, `--tx3`), puis le titre (40 px, 32 px en mobile, graisse 500, interligne 1,1).
- Ligne d'informations sous le titre : `AAAA-MM`, puis « Révisé le JJ/MM/AAAA » **uniquement si** la dernière révision tombe un autre jour que la publication, puis les tags (liens vers `/#<tag>`).
- Corps : voir §7.
- En bas : section « Même tag » (cinq articles au plus, hors l'article courant, du plus récent au plus ancien, rien si aucun), puis pied de page.
- Pied de page : « Modifier cette page » (lien vers `https://github.com/fbmguerin/fbmguerin.github.io/edit/main/content/articles/<nom>/index.md`) et « Source du site ». Sur l'accueil : « Source du site » seulement. Rien d'autre.

### 404
Phrase courte et lien vers l'accueil.

## 5. Design — jetons

Un seul fichier CSS. Toutes les couleurs sont définies **une seule fois** avec `light-dark()` dans des variables sur `:root`.

| Variable | Clair | Sombre |
|---|---|---|
| `--bg` fond de page | `#e5e5e2` | `#161618` |
| `--card` cartes, boutons de tag | `#ffffff` | `#232326` |
| `--hover` survol | `#f2f6fc` | `#2b2f37` |
| `--chip` pastilles | `#ececea` | `#2f2f34` |
| `--sunk` blocs de code et tableaux | `#e6e6e3` | `#232326` |
| `--line` filets | `#cbcbc7` | `#333337` |
| `--tx` texte | `#1c1c1e` | `#e9e9eb` |
| `--tx2` texte secondaire | `#4f4f55` | `#b4b4bb` |
| `--tx3` texte discret | `#57575d` | `#90909a` |
| `--ac` accent | `#1a5fb4` | `#8fbaf0` |

- Police : `system-ui, sans-serif` pour tout, `ui-monospace, monospace` pour le code uniquement. **Aucune police ni ressource externe.**
- Texte courant : 17 px/1,6, graisse 400. Graisses utilisées : 400 et 500 seulement.
- **Interdit, partout** : `border-radius` (toujours 0), `box-shadow`, `text-shadow`, `backdrop-filter`, `filter`, toute couleur avec transparence (`rgba`, `opacity` < 1, `#rrggbbaa`), dégradés, animations. Le survol change une couleur, instantanément. Vérifie par recherche dans le CSS compilé.
- Focus clavier : contour de 2 px `--ac`, décalage de 2 px, sur tous les éléments interactifs.
- Liens dans le texte : couleur du texte, soulignés (`text-decoration-color: --line`) ; au survol couleur `--ac`.
- Point de rupture unique : `@media (max-width: 600px)` (cibles de 44 px, titre d'article 32 px, boutons de la barre 44 px).

## 6. Filtre par tags

- **Amélioration progressive** : sans JavaScript, toutes les cartes sont visibles et la rangée de tags n'est pas affichée (attribut `hidden`, levé par le script).
- `filter.js` : moins de 60 lignes, aucune dépendance, chargé en `defer`. Les cartes portent `data-tags="linux stage"` (séparés par des espaces, mots simples).
- Un seul tag actif à la fois. Cliquer sur le tag actif ou sur « tout » retire le filtre.
- L'état est dans l'adresse : `/#linux`. Au chargement et sur `hashchange`, le filtre se règle d'après le hash (un hash inconnu = « tout »).
- Les cartes épinglées (`data-pinned`) ne sont jamais masquées.
- Les boutons sont de vrais `<button>` avec `aria-pressed`. Pas de mise à jour du titre de la page, pas de message de décompte.

## 7. Corps d'article (contenu Markdown)

- Titres : `h2` 21 px/1,3 graisse 500 (marge haute 48 px), `h3` 18 px graisse 500. Pas de `h1` dans le corps.
- Paragraphes limités à 66 caractères de large (`max-width: 66ch`), marge basse de 16 px.
- Images : `max-width: 100%`, `height: auto`, rendues en `<figure>` avec `<figcaption>` quand une légende est fournie. Les images d'un article sont dans son dossier et s'écrivent `![texte alternatif](nom.png)`.
- Blocs de code : fond `--sunk`, padding 16 px 20 px, `overflow-x: auto`, 14 px/1,8. Coloration avec les classes Chroma de Hugo (jamais de styles en ligne), deux palettes (clair/sombre) pilotées par le même mécanisme que §9, contraste AA dans les deux.
- Tableaux : défilement horizontal dans leur propre cadre, jamais de débordement de la page.
- **Aucun élément du corps ne doit pouvoir élargir la page** : `overflow-wrap: break-word` sur le conteneur, `min-width: 0` sur les éléments flex ou grille.

## 8. Accessibilité et responsive

- Test obligatoire à **360 px** de large : aucun défilement horizontal de la page, tout est lisible, toutes les cibles ≥ 44 px au tactile.
- Tout est utilisable au clavier seul, dans un ordre logique, avec focus visible ; au pouce sur mobile ; à la souris.
- Contrastes WCAG AA (4,5 : 1 pour le texte) dans les deux thèmes, y compris texte sur pastille et boutons de tag sélectionnés (texte `--bg` sur fond `--tx`).
- `scroll-padding-top` égal à la hauteur de la barre pour que les ancres ne soient pas masquées.
- Balisage : `<html lang>`, un seul `h1` par page, repères (`header`, `nav`, `main`, `footer`), `aria-label` sur les boutons-icônes.

## 9. Thème clair/sombre

Mécanisme (conforme aux guides de bonnes pratiques web de Google pour `dark-mode` et `dark-mode-toggle`) :
- `<meta name="color-scheme" content="light dark">` dans `<head>`, et `:root { color-scheme: light dark; }` en CSS. **Ne jamais coder en dur** `light` ou `dark` comme valeur par défaut.
- La bascule met à jour le `<meta name="color-scheme">` (`light`, `dark`, ou `light dark` = système) et le CSS le relaie :
  ```css
  :root {
    color-scheme: light dark;
    &:has(> head > meta[name="color-scheme"][content="dark"])  { color-scheme: dark; }
    &:has(> head > meta[name="color-scheme"][content="light"]) { color-scheme: light; }
  }
  ```
- Par défaut, le thème suit le système. Un clic bascule vers l'opposé du thème effectif et **mémorise** le choix dans `localStorage` (clé `color-scheme`, toujours dans `try … catch` : si le stockage est bloqué, le thème s'applique quand même sans être mémorisé).
- Un petit script **en ligne dans `<head>`**, avant le CSS, lit le choix mémorisé et règle le `<meta>` pour éviter tout flash de mauvais thème.
- Si un JavaScript lit `matchMedia('(prefers-color-scheme: dark)')`, il écoute aussi l'événement `change`.

## 10. Flux Atom

- Gabarit maison (celui qui a été validé dans `proto/hugo`), adresse `/atom.xml`, annoncé dans `<head>` (`<link rel="alternate" type="application/atom+xml">`).
- Contient tous les articles publiés (jamais les brouillons), les plus récemment **mis à jour** en premier. `<updated>` = date de dernière révision git (ou la date de publication à défaut), `<published>` = `date`. Contenu = résumé + lien, pas le texte complet.
- Aucun flux parasite par section ou par tag.

## 11. Construction et déploiement

- Workflow GitHub Actions existant : à conserver. Il doit : installer **Hugo 0.169.0** (version figée), récupérer **tout l'historique** (`fetch-depth: 0`), construire avec `--minify`, puis déployer avec `configure-pages`, `upload-pages-artifact`, `deploy-pages`.
- Déclenché par : `push` sur `main`, `workflow_dispatch`, et un `cron` quotidien (nécessaire pour l'expiration des épinglés). **Ne déploie que `main`**, jamais les branches de prototype.
- `hugo.toml` : `timeZone = "Europe/Paris"`, `enableGitInfo = true`, langue `fr`, permaliens `/articles/:slug/`, coloration par classes (pas de styles en ligne).
- Réglage GitHub déjà fait par l'auteur : *Settings → Pages → Source : GitHub Actions*.
- Note pour le README : GitHub désactive les workflows planifiés d'un dépôt public sans aucune activité pendant 60 jours.

## 12. Sveltia CMS

- `static/admin/index.html` charge Sveltia CMS depuis un CDN **en version figée** (numéro de version explicite, jamais `latest`). Cette page n'est utilisée que par l'auteur ; les pages publiques n'ont aucun script externe.
- `static/admin/config.yml` : fournis la configuration validée dans `proto/hugo` ; elle prime sur l'exemple ci-dessous. Si la configuration du prototype ne couvre pas un point, vérifie la documentation actuelle de Sveltia.
  ```yaml
  backend: { name: github, repo: fbmguerin/fbmguerin.github.io, branch: main }
  media_folder: ""        # image rangée dans le dossier de l'article (à confirmer)
  public_folder: ""
  collections:
    - name: articles
      label: Articles
      folder: content/articles
      create: true
      path: "{{slug}}/index"
      extension: md
      format: yaml-frontmatter
      slug: "{{slug}}"
      fields:
        - { name: title, label: Titre, widget: string }
        - { name: date, label: Date de publication, widget: datetime, date_format: "YYYY-MM-DD", time_format: false }
        - { name: tags, label: Tags, widget: list, required: false }
        - { name: resume, label: Résumé (facultatif), widget: text, required: false }
        - { name: draft, label: Brouillon, widget: boolean, default: false, required: false }
        - { name: epingle, label: Épinglé, widget: boolean, default: false, required: false }
        - { name: epingle_jusqu_au, label: Épinglé jusqu'au, widget: datetime, date_format: "YYYY-MM-DD", time_format: false, required: false }
        - { name: lang, label: Langue, widget: select, options: [fr, en], default: fr, required: false }
        - { name: body, label: Texte, widget: markdown }
  ```
- Authentification : bouton « Sign in with Token », jeton fin limité au seul dépôt, permission *Contents : Read and write*. À expliquer dans le README (section « Publier un article »).
- Interdit : tout service d'authentification tiers, tout serveur.
- Vérifie dans un navigateur réel (pas seulement à la lecture du code) : création d'un article avec image téléversée dans son dossier, édition, passage en brouillon, épinglage.

## 13. Articles de test

Crée ces trois articles. Les dates sont **provisoires** (marque-le dans le README) et le contenu est tiré du CV de l'auteur ; n'invente rien d'autre. Tags en tout : `linux`, `stage`, `recherche`.

**1. `content/articles/recherche-stage/index.md`** — épinglé
```yaml
title: Je cherche un stage du 18 janvier au 19 février 2027
date: 2026-11-12
tags: [recherche]
epingle: true
epingle_jusqu_au: 2027-02-19
```
Corps : Élève en Terminale Bac Pro CIEL au lycée Louis de Cormontaigne, à Metz, je cherche un stage du lundi 18 janvier au vendredi 19 février 2027, idéalement sur les cinq semaines consécutives. Je peux aussi n'en faire qu'une partie : du 18 au 29 janvier, ou du 1er au 19 février. Contact : francoisguerin@ikmail.com.

**2. `content/articles/swarf-os/index.md`** — un tag, image, code, tableau
```yaml
title: swarf-os
date: 2026-11-01
tags: [linux]
```
Corps : mon système d'exploitation personnel, que j'utilise au quotidien : une image Fedora bootc avec KDE Plasma (Wayland), construite à partir d'une liste blanche de paquets officiels et publiée sur le registre ghcr.io. La CI GitHub Actions construit l'image, vérifie les paquets, les services et la signature Secure Boot, la démarre dans une machine virtuelle, puis génère une ISO d'installation (Anaconda, chiffrement LUKS) signée avec cosign. Mises à jour atomiques, outil de bascule depuis Fedora Kinoite avec épinglage et retour arrière, surveillance automatique de la chaîne de build. Sources : github.com/swarf-os/image.
Ajoute une section « Rendu » (à supprimer ensuite) avec : une image SVG de remplacement (un rectangle gris 16/9 nommé `bureau.svg`, dans le dossier de l'article) avec légende ; un bloc de code contenant une ligne volontairement très longue ; un tableau de cinq colonnes. Ces éléments servent à tester l'absence de débordement à 360 px.

**3. `content/articles/stage-sidsic/index.md`** — deux tags
```yaml
title: Stage au SIDSIC de la Moselle
date: 2026-10-16
tags: [stage, linux]
```
Corps : stage de Terminale à la préfecture de la Moselle, à Metz (septembre-octobre 2026). Conception et développement de Februus, une station blanche libre qui analyse les clés USB avant leur utilisation sur le réseau : socle Debian 13 et Python, refus des clés amorçables, montage en lecture seule, analyse ClamAV, filtrage USBGuard, interface web en mode kiosque, journalisation, guide de déploiement. Autres missions : réinitialisation du BIOS et installation de secureblue sur un ThinkCentre verrouillé, remplacement de la dalle d'un portable, inventaire de 40 écrans réformés.

## 14. Critères de réussite

À vérifier et à consigner dans la description de la pull request :
- Le build passe en local et dans Actions ; le site déployé répond à `https://fbmguerin.github.io/`.
- Aucune requête externe depuis les pages publiques (contrôle dans le panneau réseau). `/admin/` fait exception.
- Aucun `border-radius`, `box-shadow`, `backdrop-filter`, `filter`, dégradé, animation ni transparence dans le CSS compilé.
- 360 px : aucun défilement horizontal sur l'accueil et sur chaque article de test.
- Navigation complète au clavier, focus visible.
- Contrastes AA dans les deux thèmes.
- Sans JavaScript : l'accueil affiche toutes les cartes, les articles se lisent.
- Filtre : `/#linux` affiche l'épinglé plus les articles `linux` ; « tout » rétablit la liste.
- Épinglé : avec `epingle_jusqu_au` dans le passé, la carte rejoint le fil ordinaire après reconstruction.
- Flux Atom valide (testé avec un validateur) ; un article modifié change sa date `<updated>`.
- Dernière révision : un article modifié affiche « Révisé le … » sur sa page, jamais sur sa carte.
- Sveltia : article créé, modifié et passé en brouillon depuis `/admin/`.

## 15. Règles de conduite

- Pas de fonctionnalité en plus de celles de ce document. Aucune « amélioration » non demandée, aucun compteur, aucun bandeau, aucune section supplémentaire, aucun texte promotionnel.
- Textes d'interface en français, courts, sans point d'exclamation, sans point final sur les libellés.
- Ne committe jamais de jeton ni de secret.
- Pour chaque écart par rapport à cette spec, un commentaire dans la pull request qui l'explique.
