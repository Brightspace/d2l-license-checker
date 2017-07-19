'use strict';

const assert = require('chai').assert;
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const _ = require('lodash');

const npmCmd = (process.platform === 'win32') ? 'npm.cmd' : 'npm';
const dataDir = path.join('test', 'data');
const verbose = false; // turn this on if you want to see checker command output

function checkProject(projectPath, configFile) {

	let args = [path.join('bin', 'license-checker-ci')];
	if (projectPath) {
		args.push(projectPath);
		if (configFile) {
			args.push(configFile);
		}
	}

	let npm = spawnSync(npmCmd, ['install'], {cwd: projectPath, shell: true});
	if (npm.error !== undefined) {
		throw npm.error;
	}
	if (verbose || npm.status !== 0) {
		console.log('Running npm install');
		console.log(`stdout:\n${npm.stdout}`);
		console.log(`stderr:\n${npm.stderr}`);
	}

	if (npm.status !== 0) {
		console.error(npm);
		throw new Error(`npm install failed (code: ${npm.status})`);
	}

	let node = spawnSync('node', args);
	if (node.error !== undefined) {
		throw node.error;
	}
	if (verbose) {
		console.log(`Running command "node ${_.join(args, ' ')}"`);
		console.log(`stdout:\n${node.stdout}`);
		console.log(`stderr:\n${node.stderr}`);
	}

	return node.status;
}

const makeTestPath = (proj) => path.join(dataDir, proj);

describe('Command invocation', () => {
	it('should accept a project with no dependencies', () => {
		assert.equal(checkProject(makeTestPath('proj-no-deps')), 0);
	});

	it('should fail a project with no configuration file', () => {
		assert.equal(checkProject(makeTestPath('proj-no-cfg')), 1);
	});

	it('should ignore dev dependencies', () => {
		assert.equal(checkProject(makeTestPath('proj-ok-dev')), 0);
	});

	it('should ignore prod dependencies', () => {
		assert.equal(checkProject(makeTestPath('proj-ok-prod')), 0);
	});

	it('should reject bad config', () => {
		assert.equal(checkProject(makeTestPath('proj-bad-cfg')), 1);
	});

	it('should reject license (dev)', () => {
		assert.equal(checkProject(makeTestPath('proj-license-issue-dev')), 2);
	});

	it('should reject license (prod)', () => {
		assert.equal(checkProject(makeTestPath('proj-license-issue')), 2);
	});

	it('should accept a whitelisted scope', () => {
		assert.equal(checkProject(makeTestPath('proj-ok-scope')), 0);
	});

	it('should reject a non-whitelisted scope', () => {
		assert.equal(checkProject(makeTestPath('proj-license-issue-scope')), 2);
	});

	it('should accept a bower config', () => {
		assert.equal(checkProject(makeTestPath('proj-ok-bower')), 0);
	});

	it('should reject a bower license', () => {
		assert.equal(checkProject(makeTestPath('proj-no-bower')), 2);
	});

	it('self test', () => {
		assert.equal(checkProject('.'), 0);
	});
});
