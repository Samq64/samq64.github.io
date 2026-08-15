---
date: "2026-08-15T17:03:00-04:00"
title: "4 Underrated Android Apps"
description: "Here are four Android apps I use regularly on my de-googled phone and why."
tags: ["Android"]
---

{{< meta "description" >}} All of them are open source, available on F-Droid, and have under a million downloads on Google Play.

## Aegis Authenticator

[Git Repository](https://github.com/beemdevelopment/Aegis) | [F-Droid](https://f-droid.org/packages/com.beemdevelopment.aegis/) | [Google Play](https://play.google.com/store/apps/details?id=com.beemdevelopment.aegis)

Aegis is a two-factor authentication app I use because it works entirely offline and doesn't declare any network permissions. Instead, automatic encrypted backups are either saved to the specified location or enabled by opting into Android cloud backups within the app's settings. Manual JSON exports are also supported.

Secrets may be scanned directly, from an image, or manually typed, and the vault may be configured for biometric unlocking.

This is the most popular app on the list but it's still niche because even those who use a dedicated authenticator often don't realize that TOTP is compatible with other apps, not just the one recommended by the service.

## Capy Reader

[Git Repository](https://github.com/jocmp/capyreader) | [F-Droid](https://f-droid.org/packages/com.capyreader.app/) | [Google Play](https://play.google.com/store/apps/details?id=com.capyreader.app)

RSS readers are still a great option and support subscribing to YouTube channels for those who don't want to login.

Capy has a reader mode that feels fast and handles media better than others I've tried. `<video>` elements play (assuming the system has the codecs) and it displays YouTube thumbnails, opening the videos in a browser. It also has a very basic podcast player but it's not a replacement for a dedicated app.

Capy supports [FreshRSS](https://www.freshrss.org), [Miniflux](https://miniflux.app), and a couple other services, but it also works just fine with a local account.

[Feeder](https://github.com/spacecowboy/Feeder) is another solid RSS reader with a more tablet-friendly interface by default and more options but I still prefer the way Capy displays articles.

## F-Droid Basic

[Source Code](https://gitlab.com/fdroid/fdroidclient) | [F-Droid](https://f-droid.org/packages/org.fdroid.basic/)

I use the basic F-Droid client instead of the standard one because it declares way fewer hidden permissions and allows unattended updates while still keeping the UI very similar.

The reason for those extra permissions is the standard client supports features most people don't need such as local app sharing and panic (which can uninstall apps and hide F-Droid when triggered).

I wouldn't be surprised if F-Droid Basic becomes the default client some day, but for now it's something most people don't know about.

## NotallyX

[Source Code](https://github.com/Crustack/NotallyX) | [F-Droid](https://f-droid.org/en/packages/com.philkes.notallyx/) | [Google Play](https://play.google.com/store/apps/details?id=com.philkes.notallyx)

[Notally](https://github.com/OmGodse/Notally) was a nice notes app that is now in maintenance mode while NotallyX is an actively developed fork continuing the project.

Both apps support checklists, labels, pinning, reminders, rich text, non-inline attachments, and batch exporting in various formats. Like Aegis they declare no network permissions and support automatic local backups.

NotallyX builds on that by porting to Material 3, making some interactions much more intuitive, and adding Markdown to its list of export formats. It still has a few quirks but it's the best notes app I've found.

## Conclusion

There are a few other open source apps I use but they're either well known or I haven't used them enough to write about them. I hope this list is useful!
