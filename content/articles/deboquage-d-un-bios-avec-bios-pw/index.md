---
title: Déboquage d'un BIOS avec bios-pw
date: 2026-08-15
tags:
  - cv
  - hardware
draft: false
epingle: false
---

Après le [Lenovo](/articles/debloquage-d-un-bios-avec-un-ch341/) dont j'ai dû flasher le BIOS pour le débloquer, j'ai dû débloquer un portable HP, le modèle que les lycéens de la Région recevaient avant les Lenovo.

Cette fois, je n'ai pas eu besoin de sortir l'artillerie. Beaucoup de PC, après trois mauvais mots de passe, affichent "System Disabled" et un code. On recopie ce code sur [bios-pw.org](https://bios-pw.org/), le site donne un mot de passe maître, on le tape en QWERTY, et c'est fini.

Dans mon cas, le BIOS n'a affiché que "System Disabled". Pas de panique : les scripts de [bios-pwgen](https://github.com/dogbert/bios-pwgen), sur lesquels repose bios-pw.org, m'ont permis de m'en sortir quand même.

Deux minutes, contre deux jours pour le Lenovo. Vivement les BIOS vraiment libres, parce que bon, un BIOS avec un mot de passe maître qu'on peut retrouver aussi facilement, c'est ridicule.
