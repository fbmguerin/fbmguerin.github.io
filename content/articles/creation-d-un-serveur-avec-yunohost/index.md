---
title: Mon homelab YunoHost
date: 2025-11-16
tags:
  - linux
  - cv
draft: true
epingle: false
epingle_jusqu_au: 2025-06-16
---

En 2025, j'ai créé un homelab perso avec un serveur [Nextcloud](https://nextcloud.com/), un serveur Bitwarden ([Vaultwarden](https://github.com/dani-garcia/vaultwarden)), un [serveur de synchronisation Firefox](https://github.com/mozilla-services/syncstorage-rs), [OnlyOffice](https://www.onlyoffice.com/) pour la bureautique et d'autres services, à l'aide de [YunoHost](https://yunohost.org/), une distribution Linux basée sur Debian pour auto-héberger sans prise de tête. C'est un projet libre français 🇫🇷, porté surtout par des bénévoles.

Je voulais tout auto-héberger : drive, mots de passe, synchro Firefox, bureautique, mails, et peut-être des films.

## La machine

J'ai utilisé pour cela un vieux PC bricolé : carte mère Asus, 16 Go de DDR3, deux SSD de 250 Go et deux disques WD Blue de 500 Go tous  SATA, et beaucoup de ficelle pour un "cable management". Je l'ai branché à la Freebox familiale.

Un SSD accueillait Debian, l'autre, plus douteux, le swap, et les deux disques étaient en RAID 1 pour les données.

## Le réseau

Côté opérateur, il a fallu passer en IPv4 fixe full-stack (sinon Free ne donne qu'une partie des ports) et débloquer le port 25 pour les mails, les deux dans l'espace abonné.

Côté réseau, un bail DHCP fixe pour le serveur, les redirections de port sur la Freebox pour le web et les mails etc. , et les enregistrements DNS que YunoHost indique dans son diagnostic. J'avais deux domaines : un gratuit fourni par YunoHost, et un autre que j'ai loué chez [LWS](https://www.lws.fr/).

Tout a fonctionné, sauf les mails : les vérifications bloquaient sur le DNS inverse, vraisemblablement cassé côté Free.

## La fin (tragique)

Comme le PC était trop gros et bruyant pour aller dans le meuble de la Freebox et rester dans le salon, j'ai dû le mettre dans la cave avec CPL, ce qui a perturbé celui de mes parents. Au bout d'une semaine de service, j'ai donc dû tout débrancher, et mon père a été sérieusement refroidi par l'affaire... Dommage, j'avais plein de choses à expérimenter.

## Idées

- Pour un homelab léger chez soi, l'idéal c'est un ordinateur portable : c'est petit et silencieux, ça tient à côté de la box, et sa batterie fait onduleur. En parlant d'onduleur prenez-en un pour la box, au cas où les plombs sauteraient. 
- Free est le meilleur opérateur pour auto-héberger, et d'après mes recherches, pour SFR il faut se disputer avec le support, quand à Bouygues et Orange, ce n'est tout simplement pas prévu. Après il reste les petits opérateurs associatifs...
