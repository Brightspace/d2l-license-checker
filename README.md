[![Build Status](https://travis-ci.com/Brightspace/license-checker-ci.svg?token=6ZPKDbnLEoi6zxDfhpAL&branch=master)](https://travis-ci.com/Brightspace/license-checker-ci)

# license-checker-ci

Simple tool to continuously check licenses of all npm dependencies in a project. Can be added to a test suite / CI to get a warning about packages not meeting predefined license requirements. This is basically a wrapper around [`davglass/license-checker`]([https://github.com/davglass/license-checker)

## How to use

1. Add this package as a dev-requirement

        node install --save-dev @d2l/license-checker-ci

1. Define a new script in your `package.json` by adding the following lines:

		"scripts": {
			`"license-check": "license-checker-ci"`
		}

1. Add a file `license-checker-ci.cfg` to your node module.

		{
		  "acceptedLicenses": [
			"MIT",
			"ISC",
			"BSD"
		  ],
		  "acceptedScopes": ["yourCompanyScopeWithoutTheAt"],
		  "manualOverrides": {
			"some-package@9.9.9": "MIT"
		  },
		  "checkDev": true,
		  "checkProd": true
		}

1. Check that the licenses pass the test by running `npm run license-check`. See `--help` for more options.

1. Make sure `npm run license-check` is called in your CI build script or as part as your tests

## Configuration file

The configuration file is a simple JSON file with the following optional entries:

1. `"acceptedLicenses"`: List of valid [SPDX license IDs](https://spdx.org/licenses/) that you want to accept.

1. `"manualOverrides"`: Object where each key is a package name and version (see above example), and the value is a valid SPDX ID. You might want to use this to manually specify the license of a package for which the license is not specified or for which it uses the wrong license identifier.

1. `"acceptedScopes"`: List of (NPM scopes)[https://docs.npmjs.com/misc/scope] that should always be accepted. This is convenient if your team uses its own scoped registry. Do not include the `@` or `/` characters.

1. `"checkDev"`: Set it to true if you want dev dependencies to be checked as well (false by default)

2. `"checkProd"`: Set it to false if you want exclude production dependencies from being checked (true by default)

In addition to the SPDX IDs, you can use the strings `Public-Domain` and `Project-Owner`:

- `Public-Domain`: identifier for public domain code (not supported by SPDX)
- `Project-Owner`: identifier saying that you own this package and that its license can be ignored (doesn't need to be added to `acceptedlicenses`)

## Contributing

1. Update code.
1. Update version in `package.json`.
1. Commit/merge changes via pull request.
1. Tag merge commit: `git tag -a <tag_name> -m "<comment>"`
1. Push tag: `git push origin <tag_name>`
1. Travis will automatically publish tagged commits to Artifactory.
