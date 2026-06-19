import { env, platform } from 'node:process';
import { expect } from 'chai';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import yn from 'yn';

const npmCmd = `${platform === 'win32' ? 'npm.cmd' : 'npm'} install`;
const dataDir = join('test', 'data');
// set this to truthy value if you want to see checker command output
const { TEST_LOGGING_VERBOSE } = env;
const verbose = yn(TEST_LOGGING_VERBOSE, false);

const checkProject = (projectPath, { install = true, args = [] } = {}) => {
	const checkerArgs = [join('bin', 'd2l-license-checker')];

	if (projectPath) {
		checkerArgs.push(projectPath);
	}

	checkerArgs.push(...args);

	if (install) {
		const npm = spawnSync(npmCmd, { cwd: projectPath, encoding: 'utf8', shell: true });

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

	const node = spawnSync('node', checkerArgs, { encoding: 'utf8' });

	if (node.error !== undefined) {
		throw node.error;
	}

	if (verbose) {
		console.log(`Running command "node ${checkerArgs.join(' ')}"`);
		console.log(`stdout:\n${node.stdout}`);
		console.log(`stderr:\n${node.stderr}`);
	}

	return {
		status: node.status,
		stdout: node.stdout || '',
		stderr: node.stderr || ''
	};
};

const checkProjectStatus = (projectPath, options) => checkProject(projectPath, options).status;

const makeTestPath = (proj) => join(dataDir, proj);

describe('license checker', () => {
	describe('config', () => {
		it('allows none', () => {
			const path = makeTestPath('proj-config-none');

			expect(checkProjectStatus(path)).to.equal(0);
		});

		it('rejects bad', () => {
			const path = makeTestPath('proj-config-bad');

			expect(checkProjectStatus(path)).to.equal(1);
		});

		it('rejects non-object overrides', () => {
			const path = makeTestPath('proj-config-overrides-non-object');

			expect(checkProjectStatus(path, { install: false })).to.equal(1);
		});
	});

	describe('dependencies', () => {
		it('accepts none', () => {
			const path = makeTestPath('proj-deps-none');

			expect(checkProjectStatus(path)).to.equal(0);
		});

		it('ignores dev', () => {
			const path = makeTestPath('proj-deps-dev');

			expect(checkProjectStatus(path)).to.equal(0);
		});

		it('ignores prod', () => {
			const path = makeTestPath('proj-deps-prod');

			expect(checkProjectStatus(path)).to.equal(0);
		});
	});

	describe('licenses', () => {
		it('rejects dev', () => {
			const path = makeTestPath('proj-license-dev');

			expect(checkProjectStatus(path)).to.equal(2);
		});

		it('rejects prod', () => {
			const path = makeTestPath('proj-license-prod');

			expect(checkProjectStatus(path)).to.equal(2);
		});

		it('accepts project-owner', () => {
			const path = makeTestPath('proj-license-project-owner');

			expect(checkProjectStatus(path)).to.equal(0);
		});

		it('accepts public-domain', () => {
			const path = makeTestPath('proj-license-public-domain');

			expect(checkProjectStatus(path)).to.equal(0);
		});

		it('accepts own package', () => {
			const path = makeTestPath('proj-license-own-package');

			expect(checkProjectStatus(path, { install: false })).to.equal(0);
		});
	});

	describe('scopes', () => {
		it('accepts d2l', () => {
			const path = makeTestPath('proj-scope-d2l');

			expect(checkProjectStatus(path, { install: false })).to.equal(0);
		});

		it('accepts custom', () => {
			const path = makeTestPath('proj-scope-custom');

			expect(checkProjectStatus(path, { install: false })).to.equal(0);
		});

		it('rejects non-whitelisted', () => {
			const path = makeTestPath('proj-scope-non-whitelisted');

			expect(checkProjectStatus(path)).to.equal(2);
		});
	});

	describe('overrides', () => {
		it('accepts in-range', () => {
			const path = makeTestPath('proj-override-in-range');

			expect(checkProjectStatus(path)).to.equal(0);
		});

		it('rejects out-of-range', () => {
			const path = makeTestPath('proj-override-out-of-range');

			expect(checkProjectStatus(path)).to.equal(2);
		});

		it('allows special exemption', () => {
			const path = makeTestPath('proj-override-special-exemption');

			expect(checkProjectStatus(path)).to.equal(0);
		});

		it('warns unused', () => {
			const path = makeTestPath('proj-override-warns-unused');
			const result = checkProject(path, { install: false });

			expect(result.status).to.equal(0);
			expect(result.stderr).to.contain('WARNING: Manual override');
		});

		it('ignores unused', () => {
			const path = makeTestPath('proj-override-ignores-unused');
			const result = checkProject(path, { install: false });

			expect(result.status).to.equal(0);
			expect(result.stderr).to.not.contain('WARNING: Manual override');
		});

		it('rejects malformed key', () => {
			const path = makeTestPath('proj-override-malformed-key');

			expect(checkProjectStatus(path)).to.equal(2);
		});

		it('rejects malformed version', () => {
			const path = makeTestPath('proj-override-malformed-version');

			expect(checkProjectStatus(path)).to.equal(2);
		});

		it('rejects conflict', () => {
			const path = makeTestPath('proj-override-conflict');

			expect(checkProjectStatus(path)).to.equal(2);
		});

		it('accepts wildcard', () => {
			const path = makeTestPath('proj-override-wildcard');

			expect(checkProjectStatus(path)).to.equal(0);
		});
	});

	describe('SPDX expressions', () => {
		it('allows valid', () => {
			const path = makeTestPath('proj-spdx-valid');

			expect(checkProjectStatus(path)).to.equal(0);
		});

		it('rejects invalid', () => {
			const path = makeTestPath('proj-spdx-invalid');

			expect(checkProjectStatus(path)).to.equal(2);
		});
	});

	describe('flags', () => {
		it('accepts prod', () => {
			const path = makeTestPath('proj-flag-prod');

			expect(checkProjectStatus(path, { args: ['-p'] })).to.equal(0);
		});

		it('accepts dev', () => {
			const path = makeTestPath('proj-flag-dev');

			expect(checkProjectStatus(path, { args: ['-d'] })).to.equal(0);
		});

		it('rejects conflict', () => {
			const path = makeTestPath('proj-flag-conflict');

			expect(checkProjectStatus(path, { args: ['-d', '-p'], install: false })).to.equal(1);
		});

		it('rejects unknown', () => {
			const path = makeTestPath('proj-flag-unknown');

			expect(checkProjectStatus(path, { args: ['--bogus'], install: false })).to.equal(1);
		});

		it('outputs template', () => {
			const path = makeTestPath('proj-flag-template');
			const result = checkProject(path, { args: ['-t'] });

			expect(result.status).to.equal(2);
			expect(() => JSON.parse(result.stdout)).to.not.throw();
			expect(JSON.parse(result.stdout).manualOverrides).to.have.property('modm@0.4.1');
		});
	});

	it('self test', () => {
		expect(checkProjectStatus('.', { install: false })).to.equal(0);
	});
});
