/**
 * Browser build
 */
const path = require('path');
const webpack = require('webpack');
const DependencyExtractionWebpackPlugin = require('../../packages/dependency-extraction-webpack-plugin/src/index.js');
const { baseConfig, devServer } = require('./base.js');
const { generateConfigs, camelCaseDash } = require('./utils.js');
const NODE_ONLY_PACKAGES = ['dependency-extraction-webpack-plugin'];
const NON_MODULE_PACKAGES = ['settings', 'store-ui'];

/**
 * Function to create package-specific config.
 * @param {Record<string, string>} packages - The packages to create configs for.
 * @param {string} cwd - The path to the packages directory.
 * @returns {webpack.Configuration} An array of webpack configurations for the package.
 */
const createPackageConfigs = (packages, cwd) => {
	/** @type {webpack.Entry} */
	const entry = Object.entries(packages).reduce(
		(acc, [packageName, indexFile]) => {
			// If the package is a node-only package, return an empty array.
			if (NODE_ONLY_PACKAGES.includes(packageName)) {
				return acc;
			}

			// If the index file is not found, throw an error.
			if (!indexFile) {
				throw new Error(
					`Entry path not found for package ${packageName}`
				);
			}

			/** @type {webpack.EntryDescription} */
			acc[packageName] = {
				import: indexFile,
				library: {
					name: ['hizzlewp', camelCaseDash(packageName)],
					type: 'window',
				},
			};

			// If the package is a non-module package, add it to the entry.
			if (NON_MODULE_PACKAGES.includes(packageName)) {
				acc[packageName] = {
					import: indexFile,
				};
			}

			return acc;
		},
		{}
	);

	/** @type {webpack.Configuration} Browser build */
	const browserConfig = {
		...baseConfig,
		devServer,
		plugins: [
			// Add base plugins.
			...baseConfig.plugins,

			// Add the dependency extraction plugin
			new DependencyExtractionWebpackPlugin({
				injectPolyfill: false,
			}),
		],
		entry,
		output: {
			path: path.resolve(cwd, 'src', 'build'),
			clean: true,
			filename: '[name]/index.js',
			chunkFilename: '[name]/index.js?ver=[chunkhash]',
		},
		optimization: {
			...baseConfig.optimization,
			splitChunks: {
				cacheGroups: {
					style: {
						type: 'css/mini-extract',
						test: /[\\/]style(\.module)?\.(pc|sc|sa|c)ss$/,
						chunks: 'all',
						enforce: true,
						name(_, chunks, cacheGroupKey) {
							const chunkName = chunks[0].name;

							return `${path.dirname(
								chunkName
							)}/${path.basename(chunkName)}/${cacheGroupKey}-index`;
						},
					},
					default: false,
				},
			},
		},
		watchOptions: {
			ignored: ['**/node_modules', '**/build'],
		},
	};

	return browserConfig;
};

module.exports = {
	generateBrowserConfigs: (cwd) => generateConfigs(createPackageConfigs, cwd),
};
