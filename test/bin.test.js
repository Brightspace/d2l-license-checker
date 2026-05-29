const { expect } = require('chai');
const { join } = require('path');
const { spawnSync } = require('child_process');

const npmCmd = (process.platform === 'win32') ? 'npm.cmd' : 'npm';
const dataDir = join('test', 'data');
const verbose = true; // turn this on if you want to see checker command output

const checkProject = (projectPath, install = true) => {
	const args = [join('bin', 'd2l-license-checker')];

	if (projectPath) {
		args.push(projectPath);
	}

	if (install) {
		const npm = spawnSync(npmCmd, ['install'], { cwd: projectPath, shell: true });

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

	const node = spawnSync('node', args);

	if (node.error !== undefined) {
		throw node.error;
	}

	if (verbose) {
		console.log(`Running command "node ${args.join(' ')}"`);
		console.log(`stdout:\n${node.stdout}`);
		console.log(`stderr:\n${node.stderr}`);
	}

	return node.status;
};

const makeTestPath = (proj) => join(dataDir, proj);

describe('license checker', () => {
	describe('config', () => {
		it('allows no config file', () => {
			expect(checkProject(makeTestPath('proj-no-cfg'))).to.equal(0);
		});

		it('rejects bad config', () => {
			expect(checkProject(makeTestPath('proj-bad-cfg'))).to.equal(1);
		});
	});

	describe('dependencies', () => {
		it('accepts none', () => {
			expect(checkProject(makeTestPath('proj-no-deps'))).to.equal(0);
		});

		it('ignores dev', () => {
			expect(checkProject(makeTestPath('proj-ok-dev'))).to.equal(0);
		});

		it('ignores prod', () => {
			expect(checkProject(makeTestPath('proj-ok-prod'))).to.equal(0);
		});
	});

	describe('licenses', () => {
		it('rejects (dev)', () => {
			expect(checkProject(makeTestPath('proj-license-issue-dev'))).to.equal(2);
		});

		it('rejects (prod)', () => {
			expect(checkProject(makeTestPath('proj-license-issue'))).to.equal(2);
		});
	});

	describe('scopes', () => {
		it('accepts d2l', () => {
			expect(checkProject(makeTestPath('proj-ok-scope-d2l'), false)).to.equal(0);
		});

		it('rejects non-whitelisted', () => {
			expect(checkProject(makeTestPath('proj-license-issue-scope'))).to.equal(2);
		});
	});

	describe('overrides', () => {
		it('accepts in-range', () => {
			expect(checkProject(makeTestPath('proj-ok-range'))).to.equal(0);
		});

		it('rejects out-of-range', () => {
			expect(checkProject(makeTestPath('proj-bad-override-range'))).to.equal(2);
		});

		it('allows special exemption', () => {
			expect(checkProject(makeTestPath('proj-ok-override-special'))).to.equal(0);
		});
	});

	describe('SPDX expressions', () => {
		it('allows valid', () => {
			expect(checkProject(makeTestPath('proj-ok-spdx-expression'))).to.equal(0);
		});

		it('rejects invalid', () => {
			expect(checkProject(makeTestPath('proj-bad-spdx-expression'))).to.equal(2);
		});
	});

	it('self test', () => {
		expect(checkProject('.')).to.equal(0);
	});
});
