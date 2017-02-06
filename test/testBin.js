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

describe('Command invocation', () => {
	it('should accept a project with no dependencies', () => {
		const projectPath = path.join(dataDir, 'proj-no-deps');
		assert.equal(checkProject(projectPath), 0);
	});

	it('should fail a project with no configuration file', () => {
		const projectPath = path.join(dataDir, 'proj-no-cfg');
		assert.equal(checkProject(projectPath), 1);
	});

	it('should ignore dev dependencies', () => {
		const projectPath = path.join(dataDir, 'proj-ok-dev');
		assert.equal(checkProject(projectPath), 0);
	});

	it('should ignore prod dependencies', () => {
		const projectPath = path.join(dataDir, 'proj-ok-prod');
		assert.equal(checkProject(projectPath), 0);
	});

	it('should reject bad config', () => {
		const projectPath = path.join(dataDir, 'proj-bad-cfg');
		assert.equal(checkProject(projectPath), 1);
	});

	it('should reject license (dev)', () => {
		const projectPath = path.join(dataDir, 'proj-license-issue-dev');
		assert.equal(checkProject(projectPath), 2);
	});

	it('should reject license (prod)', () => {
		const projectPath = path.join(dataDir, 'proj-license-issue');
		assert.equal(checkProject(projectPath), 2);
	});

	it('self test', () => {
		assert.equal(checkProject('.'), 0);
	});
});
