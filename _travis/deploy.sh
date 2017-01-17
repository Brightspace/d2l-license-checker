#!/bin/bash
ARTIFACTORY_REGISTRY=https://d2lartifacts.artifactoryonline.com/d2lartifacts/api/npm/npm-local

echo "Running deploy script"
echo "TEMP: $ARTIFACTORY_USER:$ARTIFACTORY_PASS"

curl -ks -u$ARTIFACTORY_USER:$ARTIFACTORY_PASS "${ARTIFACTORY_REGISTRY}/auth/d2l" -o .npmrc
npm config set @d2l:registry $ARTIFACTORY_REGISTRY
yes '' | npm adduser
npm publish --registry $ARTIFACTORY_REGISTRY
