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
        } )
    ],
    output: {
        ...defaultConfig.output,
        library: {
            name: [ 'hizzlewp', 'interface' ],
            type: 'window'
        }
    }
};

