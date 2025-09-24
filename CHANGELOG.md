# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-09-24

### Changed
- Update dependency major version. If you are updating to this major version, make sure to update the following apps (if you have then installed) to the following major versions:
    - vtex.b2b-admin-customers@2.x
    - vtex.b2b-checkout-settings@3.x
    - vtex.b2b-my-account@2.x
    - vtex.b2b-orders-history@2.x
    - vtex.b2b-organizations@3.x
    - vtex.b2b-organizations-graphql@2.x
    - vtex.b2b-quotes@3.x
    - vtex.b2b-quotes-graphql@4.x
    - vtex.b2b-suite@2.x
    - vtex.b2b-theme@5.x
    - vtex.storefront-permissions-components@2.x
    - vtex.storefront-permissions-ui@1.x

## [1.0.0] - 2025-05-27

### Changed
- Update dependency major version. If you are updating to this major version, make sure to update the following apps (if you have then installed) to the following major versions:
    - vtex.b2b-admin-customers@1.x
    - vtex.b2b-checkout-settings@2.x
    - vtex.b2b-my-account@1.x
    - vtex.b2b-organizations@2.x
    - vtex.b2b-organizations-graphql@1.x
    - vtex.b2b-quotes@2.x
    - vtex.b2b-quotes-graphql@3.x
    - vtex.b2b-suite@1.x
    - vtex.b2b-theme@4.x
    - vtex.storefront-permissions@2.x
    - vtex.storefront-permissions-components@1.x
    - vtex.storefront-permissions-ui@2.x

## [0.3.0] - 2023-07-21

### Fixed

- Update prefix for B2B order history API requests

## [0.2.1] - 2023-07-13

### Fixed

- Add header x-vtex-account to request orders on backend API

## [0.2.0] - 2023-05-31

### Fixed

- Bulgarian, English, Spanish, French, Italian, Korean, Dutch, Romanian, Catalan, Czech, Danish, German, Greek, Finnish,
  Norwegian, Polish, Russian, Slovakian, Slovenian, Swedish, Spanish, and Ukrainian translations.

### Added

- Indonesian and Thai translations.

## [0.1.0] - 2023-05-25

### Fixed

- Localization for English, Spanish and Portuguese.

## [0.0.9] - 2023-03-28

### Fixed

- German translation.

## [0.0.8] - 2023-01-24

### Fixed

- Crowdin configuration file.

## [0.0.7] - 2022-08-16

### Fixed

- Code smells on Global.css

## [0.0.6] - 2022-05-13

### Fixed

- Hide options to "Order again" and "Change order" if current user is not the user who originally placed the order
- When order cancellation is requested, send request to b2b-organizations-graphql endpoint

## [0.0.5] - 2022-03-29

### Added

- docs folder

### Changed

- Moved the README.md file to the new docs folder

## [0.0.4] - 2022-03-28

### Changed

- Reviewed the documentation in the README.md file

## [0.0.3] - 2022-01-06

## [0.0.2] - 2021-10-28

### Added

- Individual menu route under my account

## [0.0.1] - 2021-10-05

### Added

- B2B Orders History compatible with `vtex.storefront-permissions` and `vtex.b2b-organizations-graphql`
