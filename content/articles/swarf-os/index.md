---
title: swarf-os
date: 2026-11-01
tags:
  - linux
  - cv
draft: false
epingle: false
---

Mon système d'exploitation personnel, que j'utilise au quotidien : une image Fedora bootc avec KDE Plasma (Wayland), construite à partir d'une liste blanche de paquets officiels et publiée sur le registre ghcr.io.

## Construction

La CI GitHub Actions construit l'image, vérifie les paquets, les services et la signature Secure Boot, la démarre dans une machine virtuelle, puis génère une ISO d'installation (Anaconda, chiffrement LUKS) signée avec cosign.

## Au quotidien

- Mises à jour atomiques.
- Outil de bascule depuis Fedora Kinoite, avec épinglage et retour arrière.
- Surveillance automatique de la chaîne de build.

Sources : [github.com/swarf-os/image](https://github.com/swarf-os/image).

## Rendu

Section de test, à supprimer : elle vérifie qu'aucun élément ne fait déborder la page à 360 px.

![Rectangle gris qui tient lieu de capture du bureau](bureau.svg "Capture provisoire du bureau")

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
