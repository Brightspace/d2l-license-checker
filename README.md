[![Build Status](https://travis-ci.com/Brightspace/license-checker-ci.svg?token=6ZPKDbnLEoi6zxDfhpAL&branch=master)](https://travis-ci.com/Brightspace/license-checker-ci)

# license-checker-ci

[![Greenkeeper badge](https://badges.greenkeeper.io/Brightspace/license-checker-ci.svg?token=35c8aaa2a23218042f46e29b59702f97633d82b3ef2fecefaa9b760fb0d3a305)](https://greenkeeper.io/)

Simple tool to continuously check licenses of all npm or bower dependencies in a project. Can be added to a test suite / CI to get a warning about packages not meeting predefined license requirements. This is basically a wrapper around [`davglass/license-checker`](https://github.com/davglass/license-checker)

## How to use

1. Add this package as a dev-requirement:

  `node install --save-dev @d2l/license-checker-ci`

1. Define a new script in your `package.json` by adding the following lines:
  ```json
  "scripts": {
    "license-check": "license-checker-ci"
  }
  ```

1. Add an (optional) config file `.licensechecker.json` to your node module.
  ```json
  {
    "packageManager": "bower",
    "acceptedScopes": ["yourCompanyScopeWithoutThe@"],
    "manualOverrides": {
      "some-package@9.9.9": "MIT"
    }
  }
  ```

1. Check that the licenses pass the test by running `npm run license-check`. See `--help` for more options.

1. Make sure `npm run license-check` is called in your CI build script or as part as your tests

## Configuration file

The configuration file is a simple JSON file with the following optional entries:

* `"manualOverrides"`: Object where each key is a package name and version (see above example), and the value is a valid SPDX ID. The version number can be a semver expression. You might want to use this to manually specify the license of a package for which the license is not specified or for which it uses the wrong license identifier.

  In addition to the [SPDX IDs](https://spdx.org/licenses/), you can use the following strings:

  - `Public-Domain`: identifier for public domain code (not supported by SPDX)
  - `Project-Owner`: identifier indicating that you own this package and that its license can be ignored (doesn't need to be added to `acceptedlicenses`)
  - `D2L-Open-Source-Special-Exemption (license-name)`: identifier indicating that although `license-name` is not a D2L-approved open source license, its use has been granted a special-exemption for this project.

* `"acceptedScopes"`: List of [NPM scopes](https://docs.npmjs.com/misc/scope) that should always be accepted. This is convenient if your team uses its own scoped registry. Do not include the `@` or `/` characters. The default config is `["d2l"]`.

* `"ignoreUnusedManualOverrides"`: Set it to true if you do not want warnings logged when you have unused manual overrides (`false` by default)

* `"packageManager"`: Set to `"bower"` or `"npm"` to specify the package dependencies to check. (`"npm"` by default)

## Contributing

1. Update code.
1. Update version in `package.json`.
1. Commit/merge changes via pull request.
1. Tag merge commit: `git tag -a <tag_name> -m "<comment>"`
1. Push tag: `git push origin <tag_name>`
1. Travis will automatically publish tagged commits to Artifactory.
