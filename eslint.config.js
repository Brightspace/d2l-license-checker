const { resolve } = require('node:path');
const { includeIgnoreFile } = require('@eslint/compat');
const jsonPlugin = require('eslint-plugin-json');
const mochaPlugin = require('eslint-plugin-mocha').default;
const { nodeConfig } = require('eslint-config-brightspace');

const gitignorePath = resolve(__dirname, '.gitignore');

module.exports = [
	includeIgnoreFile(gitignorePath),
	{
		linterOptions: {
			reportUnusedInlineConfigs: 'error',
			reportUnusedDisableDirectives: 'error'
		}
	},
	...nodeConfig.map(config => ({
		...config,
		files: [
			'**/*.js',
			'bin/d2l-license-checker',
			'bin/license-checker-ci'
		],
		rules: {
			...config.rules,
			'key-spacing': ['error', { beforeColon: false, afterColon: true }],
			'object-shorthand': ['error', 'always'],
			'prefer-template': 'error',
			'@stylistic/comma-dangle': 'error',
			'@stylistic/template-curly-spacing': ['error', 'never']
		}
	})),
	jsonPlugin.configs['recommended'],
	mochaPlugin.configs.recommended,
	{
		rules: {
			'mocha/no-exclusive-tests': 'error',
			'mocha/no-mocha-arrows': 'off'
		}
	}
];
