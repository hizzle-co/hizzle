/**
 * Node build
 */
const path = require( 'path' );
const webpack = require( 'webpack' );
const nodeExternals = require( 'webpack-node-externals' );
const { generateTypes, generateConfigs } = require( './utils.js' );
const { baseConfig, output } = require( './base.js' );

/**
 * Function to create package-specific config.
 * @param {Record<string, string>} packages - The packages to create configs for.
 * @param {string} cwd - The path to the packages directory.
 * @returns {webpack.Configuration} An array of webpack configurations for the package.
 */
const createPackageConfigs = ( packages, cwd ) => {
    /** @type {webpack.Entry} */
    const entry = Object.entries( packages ).reduce( ( acc, [ packageName, indexFile ] ) => {

        // If the index file is not found, throw an error.
        if ( !indexFile ) {
            throw new Error( `Entry path not found for package ${ packageName }` );
        }

        // Generate types for the package.
        generateTypes( path.resolve( cwd, 'packages', packageName ) );

        /** @type {webpack.EntryDescription} */
        acc[ packageName ] = {
            import: indexFile,
            library: {
                type: 'commonjs2',
            },
        };
        return acc;
    }, {} );

    /** @type {webpack.Configuration} CommonJS build */
    const cjsConfig = {
        ...baseConfig,
        target: 'node',
        mode: 'production',
        devtool: false,
        externals: [ nodeExternals() ],
        optimization: {
            minimize: false,
        },
        entry,
        output: {
            ...output,
            path: path.resolve( cwd, 'packages' ),
            filename: '[name]/build-module/index.js',
            library: {
                type: 'commonjs2',
            },
        },
    };

    return cjsConfig;
};

module.exports = {
    generateNodeConfigs: ( cwd ) => generateConfigs( createPackageConfigs, cwd ),
} 
