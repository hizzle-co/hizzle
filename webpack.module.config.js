const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@hizzlewp/dependency-extraction-webpack-plugin' );

module.exports = {
    ...defaultConfig,
    plugins: [
        ...defaultConfig.plugins.filter(
            ( plugin ) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        ),
        new DependencyExtractionWebpackPlugin( {
            injectPolyfill: true,
            combineAssets: true,
            useDefaults: true,
            bundledPackages: [] // packages that shouldn't be externalized
        } )
    ],
   output: {
        ...defaultConfig.output,
        module: true,
    },
    experiments: {
        ...defaultConfig.experiments,
        outputModule: true,
    },
};

// --config my-own-webpack-config.js
