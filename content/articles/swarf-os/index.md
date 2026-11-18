---
title: Swarf-os
date: 2026-11-01
tags:
  - linux
  - cv
draft: false
epingle: false
---

Mon daily-driver : une image Fedora bootc avec KDE Plasma, construite à partir d'une liste blanche de paquets Fedora, testée en CI et publiée sur le registre ghcr.io.

_Swarf_, en anglais, ce sont les copeaux qui tombent quand on usine une pièce. C'est à peu près le principe : partir de Fedora et faire des copeaux avec tout ce que je n'aime pas.

## Pourquoi

Ce que je voulais :

- **Un système propre dès l'installation.** Rien à nettoyer, supprimer etc.
- **Ne plus m'en occuper.** La machine ne reçoit que ce que ma CI a construit et testé. Les mises à jour sont téléchargées automatiquement et s'appliquent au redémarrage suivant (pas de redémarrage intempestif ou forcé).
- **Pouvoir revenir en arrière.** Mises à jour atomiques : si une image pose problème, je redémarre sur la précédente.
- **Secure Boot sans bidouille.** Le noyau est celui de Fedora, signé, jamais recompilé. Aucune clé à enrôler.

## Additif plutôt que soustractif

Il y a deux façons de faire une Fedora minimale.

**Soustractive** : on part de Kinoite (Fedora KDE Edition, mais en immuable), et on retire ce qu'on ne veut pas. Facile pour démarrer. Problème : Fedora ajoute régulièrement de nouveaux paquets à Kinoite, et ils arrivent dans l'image sans que personne ne les ait demandés. Pour rester minimal, il faudrait relire chaque changement de Fedora et allonger sans fin la liste de ce qu'on retire. On court après.

**Additive** : on part de `quay.io/fedora/fedora-bootc`, une image quasi nue (pas d'interface graphique, le strict minimum pour démarrer), et on nomme tout les paquets. Les dépendances faibles (recommandées) sont ignorées. Ce qui est dans l'image, c'est ce que j'ai nommé, plus ce dont ça dépend vraiment. et rien d'autre.

C'est le choix de swarf-os, avec deux fichiers :

- `whitelist.txt` : ce que je veux. C'est le seul fichier à modifier pour ajouter un logiciel.
- `blacklist.txt` : ce qui ne doit **jamais** se retrouver dans l'image. Bluetooth, impression, modems, serveur audio, session X11, dépôts tiers (RPM Fusion, COPR…). C'est le garde-fou : si un de ces paquets revient par une dépendance forte, le build échoue. Rien n'entre en douce, et tout ce qui n'est pas là, c'est autant de surface d'attaque en moins.

Parfois, un service dont je ne veux pas est une dépendance obligatoire, par exemple geoclue2 ou avahi .Je ne l'arrache pas de force, ça casserait le système de paquets : je le masque, il ne démarre jamais.

Et si malgré tout la liste des paquets change (une nouvelle version de Fedora, une nouvelle dépendance), la CI le voit et me me montre le diff avant de publier (voir plus bas).

## RPM pour le système, Flatpak pour le reste

**En RPM, dans l'image** : tout ce qui touche au système et a besoin d'y être intégré en profondeur. Plasma bien sûr, mais aussi Dolphin, KDE Partition Manager, Filelight, Konsole, Discover… Un gestionnaire de partitions doit accéder aux disques, Filelight doit voir tout le système de fichiers, Dolphin doit pouvoir ouvrir des dossiers en administrateur. Dans le bac à sable de Flatpak, il faudrait percer des trous partout, et ça n'aurait plus aucun intérêt. Ces applis font partie de l'image : elles sont testées par la CI et mises à jour avec le reste.

**En Flatpak, depuis Flathub** : tout ce que l'utilisateur ajoute lui-même. Les applis tournent dans leur bac à sable, se mettent à jour indépendamment du système, et c'est l'utilisateur qui choisit.

D'ailleurs, il n'y a ni navigateur ni lecteur vidéo préinstallés. Le menu contient juste deux raccourcis, "Internet" et "Lecteur multimédia", qui lancent un mini script bash : il demande une fois, fait un `flatpak install` de Waterfox ou de VLC, puis le raccourci devient l'appli. C'est juste pour rendre la chose plus conviviale. Rien n'est imposé.

J'ai aussi supprimé le dépôt flatpak de Fedora, dont l'existence même est controversée.

## Ce qui manque (exprès)

Pas de Bluetooth, d'impression, de modem, d'accès à distance (SSH, RDP, VNC), de session X11, de télémétrie. Et pas de son : c'est voulu, et ça s'ajoute en une commande. C'est mon image, si vous n'êtes pas contents, forkez.

```bash
sudo rpm-ostree install pipewire wireplumber pipewire-pulseaudio pipewire-alsa plasma-pa alsa-sof-firmware && systemctl reboot
```

Vérifiez dans le README les paquets exacts à ajouter.

Par contre, les logos Fedora (`fedora-logos`) sont toujours présents, bien que Fedora demande aux remix de les remplacer par un logo générique (`generic-logos`). Problème : regardez, c'est un hot-dog… Je n'ai pas envie de cliquer sur ça pour lancer mes applications, ni de l'avoir dans la page "À propos", ni sur l'écran de démarrage (Plymouth). J'estime que c'est un peu du foutage de gueule, donc ils peuvent aller se faire cuire un oeuf pour que je fasse maintenant un paquet de logos.

![](fedora-logo.webp "Mr. Hot-Dog")

## Construction

Chaque nuit, la CI (GitHub Actions) :

1. construit l'image (liste blanche, liste noire, configuration, puis `bootc container lint`) ;
2. compare son manifeste (paquets, services, dépôts, version de Fedora) au dernier validé. S'il a changé, l'image ne passe pas en stable : une pull request s'ouvre et c'est moi qui tranche ;
3. vérifie que le noyau porte la signature Secure Boot de Fedora et que l'initramfs garde le module de chiffrement ;
4. démarre l'image dans une machine virtuelle éphémère et contrôle les services ;
5. la publie sur ghcr.io, signée avec cosign (pas de clef, l'identité est le workflow du dépôt), puis la promeut en `:stable`., c'

Chaque dimanche, l'ISO d'installation (Titanoboa, Anaconda WebUI, chiffrement LUKS) est reconstruite à partir de `:stable`, et ses sommes SHA256 sont signées. Elle pèse 5,6 Go, trop pour les releases GitHub : elle est hébergée sur Cloudflare R2.

Si le build casse ou si Fedora change quelque chose, une issue ou une pull request s'ouvre sur GitHub.

| Étape | Outils | Quand | Vérification |
| --- | --- | --- | --- |
| Image | podman, bootc | chaque nuit | liste noire, `bootc container lint` |
| Manifeste | scripts maison | chaque nuit | paquets, services, dépôts, version de Fedora, signature du noyau |
| Démarrage | machine virtuelle (bcvk) | chaque nuit | services |
| Publication | ghcr.io, cosign | chaque nuit | signature, attestations |
| ISO | Titanoboa, Anaconda | chaque dimanche | `SHA256SUMS` signé |

Pour vérifier une ISO téléchargée :

```bash
sha256sum -c SHA256SUMS
cosign verify-blob --bundle SHA256SUMS.bundle --certificate-identity https://github.com/swarf-os/image/.github/workflows/iso.yml@refs/heads/main --certificate-oidc-issuer https://token.actions.githubusercontent.com SHA256SUMS
```

## Au quotidien

- **Mises à jour** : Discover télécharge la nouvelle image une fois par jour et la prépare. Elle s'applique au prochain redémarrage, quand je veux.
- **Retour arrière** : à la main, depuis le menu de démarrage ou avec une commande. Pour rester sur une ancienne image, j'épingle son empreinte, sinon la mise à jour du lendemain la remplace.
- **Bascule depuis Fedora Kinoite** : un script (`tools/switch.sh`) passe une Kinoite existante sur swarf-os en gardant le compte, `/home` et les Flatpak. Kinoite reste épinglée dans le menu de démarrage, au cas où.

## Rendu

Rien de spécial, pas de ricing : c'est Fedora Kinoite, avec des paquets en moins et quelques préréglages personnalisés (effets de KWin, gestionnaire de tâches avec icônes et titres, etc.).

![Bureau de swarf-os : fond d'écran Fedora, barre des tâches en bas avec Waterfox ouvert](Capture%20d%27%C3%A9cran_20261118_083410.webp "Le bureau")

![Menu d'applications ouvert sur les favoris : Waterfox, KWrite, Configuration du système, Dolphin, VLC, Konsole et Discover](Capture%20d%27%C3%A9cran_20261118_084050.webp "Le menu d'applications")

## Idées d'améliorations

- Un menu d'applications plus épuré, façon ChromeOS ou Pantheon.
- Utiliser Particle et mkosi.
- Faire un logo.

Sources : [github.com/swarf-os/image](https://github.com/swarf-os/image).
