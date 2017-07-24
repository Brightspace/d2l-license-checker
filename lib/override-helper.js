'use strict';

const semver = require('semver');

class OverrideHelper {
	constructor(manualOverrides) {
		this._packages = new Map();
		this._unvisited = new Set();

		const keys = Object.keys(manualOverrides);
		for (const key of keys) {
			// Start at 1 to handle scopes (e.g. "@d2l/license-checker-ci@^1.0.0")
			const delimiterIndex = key.indexOf('@', 1);
			if (delimiterIndex < 0) {
				console.error(`WARNING: Manual override "${key}" could not be parsed as "[@scope/]module@version".`);
				continue;
			}

			const name = key.slice(0, delimiterIndex);
			const version = key.slice(delimiterIndex + 1);
			const range = semver.validRange(version);
			if (range === null) {
				console.error(`WARNING: Manual override "${key}" does not have a well formed version.`);
				continue;
			}

			let ranges = this._packages.get(name);
			if (ranges === undefined) {
				ranges = new Map();
				this._packages.set(name, ranges);
			}

			if (ranges.has(range)) {
				const conflict = ranges.get(range);
				console.error(`WARNING: Manual overrides "${key}" conflicts with "${conflict.key}" over "${range}".`);
				continue;
			}

			const data = {
				name, version, key,
				license: manualOverrides[key]
			};
			ranges.set(range, data);
			this._unvisited.add(key);
		}
	}

	find(key) {
		const delimiterIndex = key.indexOf('@', 1);
		const name = key.slice(0, delimiterIndex);
		const version = key.slice(delimiterIndex + 1);
		const ranges = this._packages.get(name);
		if (ranges !== undefined) {
			for (const [range, data] of ranges) {
				if (semver.satisfies(version, range)) {
					this._unvisited.delete(data.key);
					return data.license;
				}
			}
		}
		return null;
	}

	get unvisited() {
		return Array.from(this._unvisited);
	}
}

module.exports = OverrideHelper;
