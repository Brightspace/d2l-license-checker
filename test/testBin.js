'use strict';

const assert = require('assert');
const spawnSync = require('child_process').spawnSync;
const _ = require('lodash');

const dataDir = 'test/data/';
const verbose = false; // turn this on if you want to see checker command output

function checkProject(projectPath, configFile) {
	let args = ['bin/license-checker-ci'];
	if (projectPath) {
		args.push(projectPath);
		if (configFile) {
			args.push(configFile);
		}
	}
	let npm = spawnSync('npm', ['install'], {cwd: projectPath, shell: true});
	if (verbose || npm.status !== 0) {
		console.log('Running npm install');
		console.log(`stdout:\n${npm.stdout}`);
		console.log(`stderr:\n${npm.stderr}`);
	}
	if (npm.status !== 0) {
		console.log(npm);
		throw new Error('npm install failed (code: ${npm.status})"');
	}
	let proc = spawnSync('node', args);
	if (verbose) {
		console.log(`Running command "node ${_.join(args, ' ')}"`);
		console.log(`stdout:\n${proc.stdout}`);
		console.log(`stderr:\n${proc.stderr}`);
	}
	return proc.status;
}

describe('Command invocation', () => {
	it('should accept a project with no dependencies', () =>
		assert.equal(checkProject(dataDir + 'proj-no-deps'), 0)
	);

	it('should fail a project with no configuration file', () =>
		assert.equal(checkProject(dataDir + 'proj-no-cfg'), 1)
	);

	it('should ignore dev dependencies', () =>
		assert.equal(checkProject(dataDir + 'proj-ok-dev'), 0)
	);

	it('should ignore prod dependencies', () =>
		assert.equal(checkProject(dataDir + 'proj-ok-prod'), 0)
	);

	it('should reject bad config', () =>
		assert.equal(checkProject(dataDir + 'proj-bad-cfg'), 1)
	);

	it('should reject license (dev)', () =>
		assert.equal(checkProject(dataDir + 'proj-license-issue-dev'), 2)
	);

	it('should reject license (prod)', () =>
		assert.equal(checkProject(dataDir + 'proj-license-issue'), 2)
	);

	it('self test', () =>
		assert.equal(checkProject('.'), 0)
	);
});
