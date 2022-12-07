---
sidebar_position: 1000
sidebar_label: "⭐ Application Control Center"
---

# Application Control Center

:::info

This project is currently WIP (Work In Progress). We are collecting ideas and
looking for developers to test its functionality. In case, you have something to
offer (ideas to implement, test project), you can
contact [project developer](https://t.me/vdkfrost). List of features or their
details can change sometimes.

:::

## Introduction

Application Control Center is the project being developed by Telegram Web Apps
enthusiasts. Its main purpose is to provide wider functionality in context of
application control than Telegram currently does.

The initial idea which stands behind the project is to create Web Apps
Store. Of course, to place your application in store and manage it, you should
have some control panel or something like that. That's how Application Control
Center idea was born.

Then, we decided to create something more universal that could be used outside
of Web Apps Store. But at the moment, we are developing it in context of store
with opportunity to make it universal. This project could also be used by
Telegram as long as it reuses flows standing behind Web Apps platform.

In simple words, Application Control Center is Web Apps management system
extending Telegram Web Apps platform with features useful during development
and providing content. It also brings some new features connected with
Web Apps monetization and offers a single source for user needed application
search.

## Features

### Separate links for different devices

As practice shows, there are some cases when developer doesn't need to display
his application on some devices. Project allows usage of 3 different links
for different platforms:

- **Mobile**. Mobile applications - Android, iOS and Windows Phone
- **Desktop**. Desktop applications - macOS, Windows etc.
- **Web**. Web version of Telegram

So, developer could specify link for mobile version of his application to
prevent it from displaying on desktop and web versions of Telegram. Control
Center will handle case when user tries opening application which doesn't have
URL for his platform by itself.

### Test groups

Currently, Telegram allows specifying separate links for different users, but
we decided to go further.

Control Center allows creating groups of users with specified platform (mobile,
desktop or web) and link to be opened. So, when user opens developer
application, with usage of user's device Control Center will check if he was
placed in some test group. In case, he was, system will replace default link
with specified one in test group.

Such approach brings us these features:

- Specifying separate link for user and group of users
- "Opening" application for some user in case, it has no default link for
  specified platform. So, for example, developer could provide some user a way
  to open desktop version of application even if it hasn't default one
- Allow application testers use single application and not to create separate
  one only for testing. Creating separate applications also have some other
  problems connected with accesses granted by Control Center.

### Monetization and search

As long as Control Center is recognized as single way of application management,
it has opportunity to aggregate all connected Web Apps. It unlocks new features:

- Creating an app store. You could imagine some Apple's App Store inside
  Telegram, but with Telegram's Web Apps. Creating store also allows
  developers to earn money by selling their applications or in-app items
- Searching through applications by keywords or application fields. This will
  make standard user search way easier and effective