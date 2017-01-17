#!/bin/bash
ARTIFACTORY_REGISTRY=https://d2lartifacts.artifactoryonline.com/d2lartifacts/api/npm/npm-local

echo "Running deploy script"

curl -ks -u$ARTIFACTORY_USER:$ARTIFACTORY_PASS "${ARTIFACTORY_REGISTRY}/auth/d2l" -o .npmrc
echo "debug 1"
npm config set @d2l:registry $ARTIFACTORY_REGISTRY
echo "debug 2"
npm publish --registry $ARTIFACTORY_REGISTRY
