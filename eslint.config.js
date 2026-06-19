import { nodeConfig, testingConfig } from 'eslint-config-brightspace';
import { includeIgnoreFile } from '@eslint/compat';
import jsonPlugin from 'eslint-plugin-json';
import promisePlugin from 'eslint-plugin-promise';
import commentsConfigs from '@eslint-community/eslint-plugin-eslint-comments/configs';
import mochaPlugin from 'eslint-plugin-mocha';
import chaiFriendlyPlugin from 'eslint-plugin-chai-friendly';
import { resolve } from 'node:path';

const gitignorePath = resolve(import.meta.dirname, '.gitignore');
const mochaConfig = mochaPlugin.configs.recommended;
const jsonConfig = jsonPlugin.configs['recommended'];
const promiseConfig = promisePlugin.configs['flat/recommended'];
const commentsConfig = commentsConfigs.recommended;

export default [
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
			'bin/d2l-license-checker'
		],
		rules: {
			...config.rules,
			'key-spacing': ['error', { beforeColon: false, afterColon: true }],
			'object-shorthand': ['error', 'always'],
			'prefer-template': 'error',
			'@stylistic/comma-dangle': ['error', 'never'],
			'@stylistic/template-curly-spacing': ['error', 'never'],
			'@stylistic/padded-blocks': ['error', 'never'],
			'@stylistic/member-delimiter-style': ['error', {
				multiline: {
					delimiter: 'semi',
					requireLast: true
				},
				singleline: {
					delimiter: 'comma',
					requireLast: false
				}
			}]
		}
	})),
	{
		...promiseConfig,
		files: ['**/*.js'],
		rules: {
			...promiseConfig.rules,
			'promise/prefer-await-to-then': ['error', { strict: true }]
		}
	},
	{
		...commentsConfig,
		files: ['**/*.js']
	},
	jsonConfig,
	...testingConfig.map(config => ({
		...config,
		files: ['test/**/*.test.js']
	})),
	{
		...mochaConfig,
		files: ['test/**/*.test.js'],
		rules: {
			...mochaConfig.rules,
			'mocha/consistent-spacing-between-blocks': 'off',
			'mocha/no-exclusive-tests': 'error',
			'mocha/no-mocha-arrows': 'off',
			'mocha/no-setup-in-describe': 'off'
		}
	},
	{
		files: ['test/**/*.test.js'],
		plugins: {
			'chai-friendly': chaiFriendlyPlugin
		},
		rules: {
			'no-unused-expressions': 'off',
			'chai-friendly/no-unused-expressions': 'error'
		}
	}
];
