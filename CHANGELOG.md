# Changelog

## 4.0.0
### Breaking Changes
- Renamed executable command from `license-checker-ci` to `d2l-license-checker`.
- Renamed special exemption identifier from `D2L-Open-Source-Special-Exemption` to `Special-Exemption`.
- Changed specifying a custom config file from a positional argument to `--config-file` option.

### Enhancements
- Added `--no-d2l` option to bypass built-in defaults that are D2L-specific.
- Allow specifying `"acceptedLicenses"` in config file when `--no-d2l` is used.

### Other
- Replaced deprecated `spdx` package with `spdx-license-ids`.
- Setup automated deployed to npmjs.org in CI.
