---
title: Débloquage d'un BIOS avec un CH341
date: 2025-09-30
tags:
  - CV
  - perso
  - hardware
resume: Comment j'ai débloqué le BIOS de l'ordinateur portable que la région m'a fourni, après en avoir perdu le mot de passe.
draft: true
epingle: false
---

# Contexte

Un jour, en septembre 2025, j'ai voulu installer une autre distribution Linux sur le [Lenovo](https://pcsupport.lenovo.com/fr/fr/products/laptops-and-netbooks/lenovo-v-series-laptops/lenovo-v14-g4-amn) que la Région Grand-Est m'avait donné l'année précédente, lors de ma rentrée en seconde.

Je n'arrive pas à démarrer sur ma clef USB. Pas de panique, j'entre dans le BIOS pour réactiver le démarrage depuis des périphériques USB. 

Et là, je me rends compte que j'ai oublié mon mot de passe... c'est malin.

Je commence à marchander avec le fournisseur de la région, qui ne veut évidemment rien savoir parce que c'est moi qui ai flingué ma carte mère, ils n'ont pas tort.

Je commence à chercher sur le web, je demande à ChatGPT (pas aussi "intelligent" qu'aujourd'hui, si vous vous en souvenez),... Ça commence à parler de choses que je n'ai jamais vues. Je panique , et je reste coincé sur la distribution que j'avais installé.

# Comment j'ai résolu mon problème

Après moult recherches, j'achète du matériel :
un progrramateur CH341B et une pince crocrodile adaptée à la puce de BIOS Winbond, plus un transformateur
