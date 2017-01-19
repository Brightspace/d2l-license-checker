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
		  "manualOverrides": {
			"some-package@9.9.9": "MIT"
		  }
		}

1. Check that the licenses pass the test by running `npm run license-check`. See `--help` for more options.

1. Make sure `npm run license-check` is called in your CI build script or as part as your tests

## Configuration file

The configuration file is a simple JSON file with the following optional entries:

1. `"acceptedLicenses"`: list of valid [SPDX license IDs](https://spdx.org/licenses/) that you want to accept

2. `"manualOverrides"`: object where each key is a package name and version (see above example), and the value is a valid SPDX ID. You might want to use this to manually specify the license of a package for which the license is not specified or for which it uses the wrong license identifier.

In addition to the SPDX IDs, you can use the strings `Public-Domain` and `Project-Owner`:

- `Public-Domain`: identifier for public domain code (not supported by SPDX)
- `Project-Owner`: identifier saying that you own this package and that its license can be ignored (doesn't need to be added to `acceptedlicenses`)
