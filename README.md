[![Build Status](https://api.travis-ci.com/Brightspace/d2l-license-checker.svg?branch=master)](https://travis-ci.com/Brightspace/d2l-license-checker-ci)

# d2l-license-checker

Simple tool to check licenses of all npm dependencies in a project against an approved set of licenses. Can be added to a test suite / CI to get a warning about packages not meeting predefined license requirements. This is basically a wrapper around [`davglass/license-checker`](https://github.com/davglass/license-checker)

## How to use

1. Add this package as a development dependency:

    `npm install --save-dev d2l-license-checker`

1. Define a new script in your `package.json` by adding the following lines:
    ```json
    "scripts": {
      "license-check": "license-checker-ci"
    }
    ```

1. Add an (optional) config file `.licensechecker.json` to your node module.
    ```json
    {
      "acceptedScopes": ["yourCompanyScopeWithoutThe@"],
      "manualOverrides": {
        "some-package@9.9.9": "MIT"
      }
    }
    ```

1. Check that the licenses pass the test by running `npm run license-check`. See `--help` for more options.

1. Make sure `npm run license-check` is called in your CI build script or as part as your tests

If licenses do not pass the test, you can run `npm run license-check -- --generate-template > .licensechecker.template.json` to generate a template file that can be copied and pasted into the config file for easy overrides.

## Configuration file

The configuration file is a simple JSON file with the following optional entries:

* `"manualOverrides"`: Object where each key is a package name and version (see above example), and the value is a valid SPDX ID. The version number can be a semver expression. You can use this to manually specify the license of a package for which the license is not specified in its `package.json` file or where an invalid SPDX ID is used. The default config is a set of overrides for packages used by D2L.

  In addition to the [SPDX IDs](https://spdx.org/licenses/), you can use the following strings:

  - `Public-Domain`: identifier for public domain code (not supported by SPDX)
  - `Project-Owner`: identifier indicating that you own this package and that its license can be ignored (doesn't need to be added to `"acceptedlicenses"`)
  - `D2L-Open-Source-Special-Exemption (license-name)`: identifier indicating that although `license-name` is not in the `"acceptedLicenses"` set, its use has been granted a special exemption for this project.

* `"acceptedScopes"`: List of [NPM scopes](https://docs.npmjs.com/misc/scope) that should always be allowed. This is convenient if your team uses its own scoped registry. Do not include the `@` or `/` characters. The default config is `["d2l"]`.

* `"ignoreUnusedManualOverrides"`: Set it to true if you do not want warnings logged when you have unused manual overrides (`false` by default)

## Contributing

1. Update code.
1. Update version in `package.json`.
1. Commit/merge changes via pull request.
1. Tag merge commit: `git tag -a <tag_name> -m "<comment>"`
1. Push tag: `git push origin <tag_name>`
1. Travis will automatically publish tagged commits to npmjs.org.
