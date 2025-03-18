/**
 * Node build
 */
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { generateTypes, generateConfigs } = require('./utils.js');
const { baseConfig } = require('./base.js');

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
			// If the index file is not found, throw an error.
			if (!indexFile) {
				throw new Error(
					`Entry path not found for package ${packageName}`
				);
			}

			// Generate types for the package.
			generateTypes(path.resolve(cwd, 'packages', packageName));

			/** @type {webpack.EntryDescription} */
			acc[packageName] = indexFile;
			return acc;
		},
		{}
	);

	/** @type {webpack.Configuration} CommonJS build */
	const cjsConfig = {
		...baseConfig,
		target: 'node',
		mode: 'production',
		devtool: false,
		externals: [nodeExternals()],
		optimization: {
			minimize: false,
		},
		plugins: baseConfig.plugins.filter(
			(plugin) => plugin.constructor.name !== 'CleanWebpackPlugin'
		),
		entry,
		output: {
			path: path.resolve(cwd, 'packages'),
			filename: '[name]/build-module/index.js',
			chunkFilename: '[name]/build-module/index.js?ver=[chunkhash]',
			clean: false,
			library: {
				type: 'commonjs2',
			},
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
							)}/${path.basename(chunkName)}/build-module/${cacheGroupKey}-index`;
						},
					},
					default: false,
				},
			},
		},
	};

	const esmConfig = {
		...cjsConfig,
		output: {
			...cjsConfig.output,
			filename: '[name]/build-module/index.esm.js',
			chunkFilename: '[name]/build-module/index.esm.js?ver=[chunkhash]',
			library: {
				type: 'module',
			},
		},
		experiments: {
			outputModule: true,
		},
	};

	return [cjsConfig, esmConfig];
};

module.exports = {
	generateNodeConfigs: (cwd) => generateConfigs(createPackageConfigs, cwd),
};
