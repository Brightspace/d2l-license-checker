[![Build Status](https://travis-ci.com/Brightspace/license-checker-ci.svg?token=6ZPKDbnLEoi6zxDfhpAL&branch=master)](https://travis-ci.com/Brightspace/license-checker-ci)

# license-checker-ci

Simple tool to continuously check licenses of all npm dependencies in a project. Can be added to a test suite / CI to get a warning about packages not meeting predefined license requirements. This is basically a wrapper around [`davglass/license-checker`]([https://github.com/davglass/license-checker)

## Usage

Simply add this node package as a dev-requirement and add the following line to your CI test script:

```license-checker-ci [config-file-path]```

See --help for more details.

Example configuration file:

```
{
  "acceptedlicenses": [
    "MIT",
    "ISC",
    "BSD"
  ],
  "manualOverrides": {
    "some-package@9.9.9": "MIT"
  }
}
```
