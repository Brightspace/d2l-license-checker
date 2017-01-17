#!/bin/bash
ARTIFACTORY_REGISTRY=https://d2lartifacts.artifactoryonline.com/d2lartifacts/api/npm/npm-local

curl -ks -u$ARTIFACTORY_USER:$ARTIFACTORY_PASS "${ARTIFACTORY_REGISTRY}/auth/d2l" -o .npmrc
npm config set @d2l:registry $ARTIFACTORY_REGISTRY
npm publish --registry $ARTIFACTORY_REGISTRY
