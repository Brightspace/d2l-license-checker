'use strict';

const assert = require('chai').assert;
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const _ = require('lodash');

const npmCmd = (process.platform === 'win32') ? 'npm.cmd' : 'npm';
const dataDir = path.join('test', 'data');
const verbose = true; // turn this on if you want to see checker command output

function checkProject({projectPath = undefined, configFile = undefined, noD2l = false, install = true}) {

	let args = [path.join('bin', 'd2l-license-checker')];
	if (configFile) {
		args.push('--config-file');
		args.push(configFile);
	}
	if (noD2l) {
		args.push('--no-d2l');
	}
	if (projectPath) {
		args.push(projectPath);
	}

	if (install) {
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
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-no-deps')
		}), 0);
	});

	it('should allow a project with no configuration file', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-no-cfg')
		}), 0);
	});

	it('should ignore dev dependencies', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-ok-dev')
		}), 0);
	});

	it('should ignore prod dependencies', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-ok-prod')
		}), 0);
	});

	it('should reject bad config', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-bad-cfg')
		}), 1);
	});

	it('should reject license (dev)', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-license-issue-dev')
		}), 2);
	});

	it('should reject license (prod)', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-license-issue')
		}), 2);
	});

	it('should accept the d2l scope', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-ok-scope-d2l'),
			install: false
		}), 0);
	});

	it('should reject a non-whitelisted scope', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-license-issue-scope')
		}), 2);
	});

	it('should accept an in-range override', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-ok-range')
		}), 0);
	});

	it('should reject an out-of-range override', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-bad-override-range')
		}), 2);
	});

	it('should allow a special exemption override', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-ok-override-special')
		}), 0);
	});

	it('should allow a custom file', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-ok-custom-file'),
			configFile: 'myfile.json'
		}), 0);
	});

	it('should allow acceptedLicenses for no-d2l', () => {
		assert.equal(checkProject({
			projectPath: makeTestPath('proj-no-d2l'),
			noD2l: true
		}), 0);
	});

	it('self test', () => {
		assert.equal(checkProject({}), 0);
	});
});
