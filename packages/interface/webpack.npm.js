const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
    ...defaultConfig,
    output: {
        ...defaultConfig.output,
        library: {
            name: '@hizzlewp/interface',
            type: 'umd',
            umdNamedDefine: true
        },
        globalObject: 'this'
    }
};
