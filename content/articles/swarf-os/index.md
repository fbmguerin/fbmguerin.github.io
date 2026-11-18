---
title: Swarf-os
date: 2026-11-01
tags:
  - linux
  - cv
draft: false
epingle: false
---

Mon daily-driver : une image Fedora bootc avec KDE Plasma (Wayland), construite à partir d'une liste blanche de paquets et publiée sur le registre ghcr.io.

## Pourquoi

## Choix des outils

## Construction

La CI GitHub Actions construit l'image, vérifie les paquets, les services et la signature Secure Boot, la démarre dans une machine virtuelle, puis génère une ISO d'installation (Anaconda, chiffrement LUKS) signée avec cosign.

## Au quotidien

- Mises à jour atomiques.
- Outil de bascule depuis Fedora Kinoite, avec épinglage et retour arrière.
- Surveillance automatique de la chaîne de build.

Sources : [github.com/swarf-os/image](https://github.com/swarf-os/image).

## Rendu

Rien de spécial, pas de ricing, c'est juste Fedora Kinoite, avec des paquets en moins, et quelques préréglages personnalisés (effets de kwin, plasmoïde de gestionnaire de tâches, etc. ).

Je vais probablement aller plus loin dans la personnalisation de KDE, je pense qu'un menu d'applications plus épuré, façon ChromeOS ou Pantheon, serait bien.

![](Capture%20d%27%C3%A9cran_20261118_083410.webp)

![](Capture%20d%27%C3%A9cran_20261118_084050.webp)

```bash
podman run --rm -it --privileged --pull=newer --security-opt label=type:unconfined_t -v ./sortie:/output -v /var/lib/containers/storage:/var/lib/containers/storage quay.io/centos-bootc/bootc-image-builder:latest --type iso ghcr.io/swarf-os/image:latest
```

| Étape | Outil | Entrée | Sortie | Vérification |
| --- | --- | --- | --- | --- |
| Image | bootc | liste blanche | ghcr.io | paquets, services |
| Démarrage | machine virtuelle | image | journal | Secure Boot |
| Installation | Anaconda | image | ISO | chiffrement LUKS |
| Signature | cosign | ISO | signature | clé publique |
| Surveillance | GitHub Actions | chaîne de build | alertes | quotidienne |
