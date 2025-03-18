const webpack = require('webpack');
const {
	output,
	devServer,
	...defaultConfig
} = require('@wordpress/scripts/config/webpack.config');

/** @type {webpack.Configuration} Base configuration for all targets */
const baseConfig = {
	...defaultConfig,
	plugins: defaultConfig.plugins.filter(
		(plugin) =>
			plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
	),
};

module.exports = {
	baseConfig,
	output,
	devServer,
};
