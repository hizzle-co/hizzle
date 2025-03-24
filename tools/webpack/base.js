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
	ignoreWarnings: [
		...(defaultConfig.ignoreWarnings || []),
		{
			message: /@import/,
		},
	],
};

// Modify sass-loader options to include quietDeps
if (baseConfig.module && baseConfig.module.rules) {
	baseConfig.module.rules = baseConfig.module.rules.map((rule) => {
		// Check if this is the rule for sass/scss files
		if (rule.test && rule.test.toString().includes('\\.(sc|sa)ss')) {
			// Map through the use array to find and modify sass-loader
			if (Array.isArray(rule.use)) {
				rule.use = rule.use.map((loader) => {
					// If this is the sass-loader
					if (
						typeof loader === 'object' &&
						loader.loader &&
						loader.loader.includes('sass-loader')
					) {
						return {
							...loader,
							options: {
								...loader.options,
								sassOptions: {
									...((loader.options &&
										loader.options.sassOptions) ||
										{}),
									loadPaths: [
										'node_modules/@wordpress/base-styles',
									],
									quietDeps: true,
								},
							},
						};
					}
					return loader;
				});
			}
		}
		return rule;
	});
}

module.exports = {
	baseConfig,
	output,
	devServer,
};
