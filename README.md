license-checker-ci
---

Simple tool to continuously check licenses of all npm dependencies in a project. Can be added to test suite / CI to get a warning about packages not meeting the license requirements. Based on [https://github.com/davglass/license-checker](davglass/license-checker).

Usage
---

Simply add this node package as a dev-requirement and add the following line to your CI test script:
```license-checker-ci [config-file-path]```
