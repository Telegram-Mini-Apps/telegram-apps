# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.1.2 (2022-11-09)

**Note:** Version bump only for package twa-bridge





# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.1](https://github.com/Telegram-Web-Apps/bridge/compare/v0.1.0...v0.1.1) (2022-11-07)


### Bug Fixes

* **haptic types:** remove usage of Record<string, never> ([de4e1cf](https://github.com/Telegram-Web-Apps/bridge/commit/de4e1cf8e661b57ac4b9dca68dfacbd9b432ad21))

## [0.1.0](https://github.com/Telegram-Web-Apps/bridge/compare/v0.0.5...v0.1.0) (2022-11-06)


### ⚠ BREAKING CHANGES

* **bridge:** You are now unable to await events

### Features

* **bridge:** add static init() function to create new bridge instances ([f505d54](https://github.com/Telegram-Web-Apps/bridge/commit/f505d545fe065d8364ec35b60a389a410130e02b))
* **event receiving:** create seprate utilities for global event handling ([22c5f53](https://github.com/Telegram-Web-Apps/bridge/commit/22c5f53f3222fe75ad269b08b2c77cbc6d421a0b))


### Bug Fixes

* **bridge:** remove awaiting functionality ([ed579a0](https://github.com/Telegram-Web-Apps/bridge/commit/ed579a061176f48d048bc2159e23fcacf285646c))
* **ignore:** add playground to ignore ([19d2b18](https://github.com/Telegram-Web-Apps/bridge/commit/19d2b18b48b78959a69a1da754a477150ed541d5))
* **types:** replace {} with more appropriate type ([b59a11b](https://github.com/Telegram-Web-Apps/bridge/commit/b59a11bb609a4ac0249f03e96a93b339c69427a9))

### [0.0.5](https://github.com/Telegram-Web-Apps/bridge/compare/v0.0.4...v0.0.5) (2022-11-02)


### Bug Fixes

* **types:** fix bugs in types ([6b39a10](https://github.com/Telegram-Web-Apps/bridge/commit/6b39a104962a6cd8367c634eeebcaf01a98d2555))

### [0.0.4](https://github.com/Telegram-Web-Apps/bridge/compare/v0.0.3...v0.0.4) (2022-11-02)

### [0.0.3](https://github.com/Telegram-Web-Apps/bridge/compare/v0.0.2...v0.0.3) (2022-11-02)

### [0.0.2](https://github.com/Telegram-Web-Apps/bridge/compare/v0.0.1...v0.0.2) (2022-11-02)


### Features

* **bridge:** add processing of settings_button_pressed and invoice_closed events ([519a64c](https://github.com/Telegram-Web-Apps/bridge/commit/519a64c1514704b072d2f715a0ca5bf3c8c8429a))
* **parsers:** add parser for invoice_closed. Fix parser for viewport_changed ([05a6ed7](https://github.com/Telegram-Web-Apps/bridge/commit/05a6ed7dea471a91bc092e89418c6c2bf4f7f733))
* **post-available events:** add web_app_open_invoice event. Fix params for web_app_open_tg_link ([40101e3](https://github.com/Telegram-Web-Apps/bridge/commit/40101e3cc61eda29cfa089f31ed46a3dec010180))
* **types:** add typings for invoice_closed event. Add property width in viewport_changed event data ([f56fd7d](https://github.com/Telegram-Web-Apps/bridge/commit/f56fd7d95c46fa00a9e6fb49ee4b96d87bdf86dc))

### 0.0.1 (2022-11-01)
