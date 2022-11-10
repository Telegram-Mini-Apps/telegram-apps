# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.2](https://github.com/Telegram-Web-Apps/client-sdk/compare/v2.1.1...v2.1.2) (2022-10-27)

### [2.1.1](https://github.com/Telegram-Web-Apps/client-sdk/compare/v2.1.0...v2.1.1) (2022-10-27)

## [2.1.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v2.0.0...v2.1.0) (2022-10-26)


### Features

* **events:** add types for componenents event names ([c4daec2](https://github.com/Telegram-Web-Apps/client-sdk/commit/c4daec292c0dc7ae9cff96b2a388aa1974480cec))

## [2.0.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.10.2...v2.0.0) (2022-10-24)


### ⚠ BREAKING CHANGES

* **components:** Each component is now instantiatable and almost has no static properties.
* **init data:** Properties "raw", "params" and "unsafe" were removed
* **theme params:** "change" event now does not accept any arguments. Property "colorScheme" was
replaced with "isDark" property.

### Features

* **components:** reimplement each ecosystem component. Remove unused utils ([5ba2026](https://github.com/Telegram-Web-Apps/client-sdk/commit/5ba2026bdd8187ec69a5dcd4b3dd7ca4a6efd3f8))
* **init data:** reimplement InitData component ([4da4e8a](https://github.com/Telegram-Web-Apps/client-sdk/commit/4da4e8a7d40f23068e9b4868695e2977380b142d))
* **theme params:** refactor theme params. Remove incorrect props, change events ([8c879f4](https://github.com/Telegram-Web-Apps/client-sdk/commit/8c879f4e1d194c23c8d4e8aafae7aa08ac7e04c7))


### Bug Fixes

* **init:** rework init scripts ([b498cc8](https://github.com/Telegram-Web-Apps/client-sdk/commit/b498cc8756f7e4dd72901571ae0cc51b992342e1))

### [1.10.2](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.10.1...v1.10.2) (2022-10-19)

### [1.10.1](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.10.0...v1.10.1) (2022-10-17)


### Bug Fixes

* **popup:** mark _isOpened as private ([35a4d19](https://github.com/Telegram-Web-Apps/client-sdk/commit/35a4d191a9116f012fd562e32ddfb748a73a9182))

## [1.10.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.9.0...v1.10.0) (2022-10-17)


### Features

* **viewport:** set min height and stable height to zero ([9e53411](https://github.com/Telegram-Web-Apps/client-sdk/commit/9e53411d702971958c3006b0df6f57b632954378))

## [1.9.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.8.3...v1.9.0) (2022-10-16)


### Features

* **popup:** make web_app_open_popup awaitable ([721245c](https://github.com/Telegram-Web-Apps/client-sdk/commit/721245c0f1a0c1fa0cd2b775d44476eed5b94e43))

### [1.8.3](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.8.2...v1.8.3) (2022-10-15)


### Bug Fixes

* **web view:** bugfix event payload for iOS, event 'popup_closed' ([6f5d2a6](https://github.com/Telegram-Web-Apps/client-sdk/commit/6f5d2a6b72a3bfd700cfec646817629f96476b8e))

### [1.8.2](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.8.1...v1.8.2) (2022-10-14)

### [1.8.1](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.8.0...v1.8.1) (2022-10-11)


### Bug Fixes

* **web app:** headerColor now returns SettableColorKey ([7f34d69](https://github.com/Telegram-Web-Apps/client-sdk/commit/7f34d699c3aa876eb996cef80dbf85f160f0fecd))

## [1.8.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.7.0...v1.8.0) (2022-10-11)


### Features

* **theme params:** move colorScheme from WebApp to ThemeParams ([b7a888e](https://github.com/Telegram-Web-Apps/client-sdk/commit/b7a888e828c6d18e9a00e1fbec8bea900cbf1010))

## [1.7.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.6.0...v1.7.0) (2022-10-09)


### Features

* **popup:** add on and off methods ([24f9054](https://github.com/Telegram-Web-Apps/client-sdk/commit/24f9054fae5a1172d38ff2fbc89a1535747a9ec3))
* **web app:** add on and off methods ([89a2e38](https://github.com/Telegram-Web-Apps/client-sdk/commit/89a2e3881b2f774ae8001e6e788e2b7ac7c6f038))

## [1.6.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.5.0...v1.6.0) (2022-10-09)


### Features

* **back button:** allow usage of events in BackButton ([82fbc5a](https://github.com/Telegram-Web-Apps/client-sdk/commit/82fbc5a756ce46779afb68dd92a92e0f6ee63ccd))
* **init:** refactor and improve init scripts ([ccf4f74](https://github.com/Telegram-Web-Apps/client-sdk/commit/ccf4f74350dcd844021cd63e8dee8e7bea87f61d))
* **main button:** allow usage of events in MainButton ([721074e](https://github.com/Telegram-Web-Apps/client-sdk/commit/721074ed25b52eb686eee8de89244e7855f56a1f))
* **popup:** allow usage of events in Popup ([f7c0f7e](https://github.com/Telegram-Web-Apps/client-sdk/commit/f7c0f7ef4064d1bb0971a8f962821057cd3966cd))
* **theme init:** add extraction of initial theme params from web view ([63da757](https://github.com/Telegram-Web-Apps/client-sdk/commit/63da75770966ca788a7266913a35e78102c60605))
* **theme params:** allow usage of events. Fix params initial value ([fabaff1](https://github.com/Telegram-Web-Apps/client-sdk/commit/fabaff1800dec445b62b22baa3cb30b55b35928b))


### Bug Fixes

* **viewport:** rename events ([2077679](https://github.com/Telegram-Web-Apps/client-sdk/commit/2077679bc809666656ec43d00471f22f0468c18d))

## [1.5.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.4.0...v1.5.0) (2022-10-08)


### Features

* **theme params:** allow usage of syncronization and request methods. Refactor code ([bd7b98e](https://github.com/Telegram-Web-Apps/client-sdk/commit/bd7b98e8838dc80012a92feab15af466aadd5c49))
* **viewport:** allow usage of tracking viewport changes. Add sync and request methods ([e6826cf](https://github.com/Telegram-Web-Apps/client-sdk/commit/e6826cf8747ad63361456746b4cd57562a6cdca0))
* **web app:** add typing for platform. Add isDesktop method ([d1cb51b](https://github.com/Telegram-Web-Apps/client-sdk/commit/d1cb51b9f5e38f81d517d654e8427e7000009a9c))
* **web view:** allow usage of awaitable events. Refactor existed utils, create new ([8bd00ca](https://github.com/Telegram-Web-Apps/client-sdk/commit/8bd00ca16f6b183987f1beb8d90e0bdea598f532))


### Bug Fixes

* **web app:** fix import typo ([56e5c4c](https://github.com/Telegram-Web-Apps/client-sdk/commit/56e5c4c87a025b932f58ff41a9d8443382d804f2))

## [1.4.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.3.0...v1.4.0) (2022-10-07)


### Features

* **init data:** bump twa-init-data ([7b9cd92](https://github.com/Telegram-Web-Apps/client-sdk/commit/7b9cd9201b14ad43b2bd11b99773c26836547d5c))

## [1.3.0](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.2.4...v1.3.0) (2022-10-02)


### Features

* **init data:** reuse already implemented library ([27859fd](https://github.com/Telegram-Web-Apps/client-sdk/commit/27859fd10c50e36ae01a26dc24c9cfe2e64b7bf8))

### [1.2.4](https://github.com/Telegram-Web-Apps/client-sdk/compare/v1.2.3...v1.2.4) (2022-10-02)

### [1.2.3](https://github.com/heyqbnk/twa-client-sdk/compare/v1.2.2...v1.2.3) (2022-10-01)

### [1.2.2](https://github.com/heyqbnk/twa-client-sdk/compare/v1.2.1...v1.2.2) (2022-10-01)

### [1.2.1](https://github.com/heyqbnk/twa-client-sdk/compare/v1.2.0...v1.2.1) (2022-09-28)

## [1.2.0](https://github.com/heyqbnk/twa-client-sdk/compare/v1.1.0...v1.2.0) (2022-09-27)


### Features

* **components:** lib is fully reworked. All components are static now ([327e629](https://github.com/heyqbnk/twa-client-sdk/commit/327e629e1182973e7389769ddd69167f1c481786))
* **mainbutton:** add applyTheme method ([277a109](https://github.com/heyqbnk/twa-client-sdk/commit/277a109d6375ee074a9cd33d25714edf8abfaeff))


### Bug Fixes

* **webapp:** remove theme params parsing from init function ([050c21e](https://github.com/heyqbnk/twa-client-sdk/commit/050c21ea942c24757c848bd80f4c688d30621349))

## [1.1.0](https://github.com/heyqbnk/twa-client-sdk/compare/v1.0.1...v1.1.0) (2022-09-25)


### Features

* **backward:** add separate backward compatibility script ([0cb2433](https://github.com/heyqbnk/twa-client-sdk/commit/0cb2433f94895a6c9177ec06706f8df92d9cb002))

### [1.0.1](https://github.com/heyqbnk/twa-client-sdk/compare/v1.0.0...v1.0.1) (2022-09-23)

## 1.0.0 (2022-09-23)
