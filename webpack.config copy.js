/**
 * Browser build
 */

const {
    output,
    devServer,
    ...defaultConfig
} = require( '@wordpress/scripts/config/webpack.config' );
const fs = require( 'fs' );
const path = require( 'path' );
const webpack = require( 'webpack' );
const nodeExternals = require( 'webpack-node-externals' );
const { sync: glob } = require( 'fast-glob' );
const { execSync } = require( 'child_process' );
const DependencyExtractionWebpackPlugin = require( './packages/dependency-extraction-webpack-plugin/src/index.js' );

const NODE_ONLY_PACKAGES = [ 'dependency-extraction-webpack-plugin' ];

/**
 * Given a string, returns a new string with dash separators converted to
 * camelCase equivalent. This is not as aggressive as `_.camelCase` in
 * converting to uppercase, where Lodash will also capitalize letters
 * following numbers.
 *
 * @param {string} string Input dash-delimited string.
 *
 * @return {string} Camel-cased string.
 */
function camelCaseDash( string ) {
    return string.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() );
}

/**
 * Generate types for a package
 * @param {string} packagePath - Path to the package
 */
const generateTypes = ( packagePath ) => {
    const tsConfigPath = path.join( packagePath, 'tsconfig.json' );

    // Only run if the tsconfig.json file exists
    if ( fs.existsSync( tsConfigPath ) ) {
        try {
            execSync( `tsc --project ${ tsConfigPath } --emitDeclarationOnly --noCheck`, {
                stdio: 'inherit',
                cwd: packagePath
            } );
        } catch ( error ) {
            console.error( `Error generating types for package ${ packagePath }: ${ error.message || 'Unknown error' }` );
        }
    }
};

/** @type {webpack.Configuration} Base configuration for all packages */
const baseConfig = {
    ...defaultConfig,
    mode: 'production',
    devtool: false,
    plugins: [
        ...defaultConfig.plugins.filter(
            ( plugin ) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        )
    ],
    externals: [ nodeExternals() ],
    optimization: {
        minimize: false,
    },
    target: 'node',
};

/** @type {webpack.Configuration} Base configuration for browser packages */
const BROWSER_EXCLUDE_PLUGINS = [ 'DependencyExtractionWebpackPlugin' ];
const baseBrowserConfig = {
    ...defaultConfig,
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        ...defaultConfig.plugins.filter(
            ( plugin ) => !BROWSER_EXCLUDE_PLUGINS.includes( plugin.constructor.name )
        ),
        new DependencyExtractionWebpackPlugin( {
            injectPolyfill: false,
        } )
    ],
};

/**
 * Retrieves the entry path using glob( 'index.[jt]s?(x)' )
 * @param {string} cwd - The path to the package to create a config for.
 * @returns {string} The entry path.
 */
const getEntryPath = ( cwd ) => {

    // Detects the proper file extension used in the defined source directory.
    const [ entryFilepath ] = glob(
        'index.?(m)[jt]s?(x)',
        {
            absolute: true,
            cwd,
        }
    );

    return entryFilepath;
};

/**
 * Function to create package-specific config.
 * @param {string} packageName - The name of the package to create a config for.
 * @returns {webpack.Configuration[]} An array of webpack configurations for the package.
 */
const createPackageConfig = ( packageName ) => {
    const packagePath = path.resolve( __dirname, 'packages', packageName );
    const browserPath = path.resolve( __dirname, 'src', 'build', packageName );
    const index = getEntryPath( path.resolve( packagePath, 'src' ) );

    if ( !index ) {
        throw new Error( `Entry path not found for package ${ packageName }` );
    }

    // Generate types for the package
    generateTypes( packagePath );

    /** @type {webpack.Configuration} CommonJS build */
    const cjsConfig = {
        ...baseConfig,
        entry: { index },
        output: {
            ...output,
            path: path.resolve( packagePath, 'build-module' ),
            library: {
                type: 'commonjs2',
            },
            clean: true,
        },
    };

    /** @type {webpack.Configuration} ESM build */
    const esmConfig = {
        ...cjsConfig,
        output: {
            ...output,
            path: path.resolve( packagePath, 'build-module' ),
            filename: '[name].esm.js',
            library: {
                type: 'module',
            },
        },
        experiments: {
            outputModule: true,
        },
    };

    if ( NODE_ONLY_PACKAGES.includes( packageName ) ) {
        return [ cjsConfig, esmConfig ];
    }

    /** @type {webpack.Configuration} Browser build */
    const browserConfig = {
        ...baseBrowserConfig,
        entry: { index },
        output: {
            ...output,
            path: path.resolve( packagePath, 'build' ),
            clean: true,
            filename: '[name].js',
            library: {
                name: [ 'hizzlewp', camelCaseDash( packageName ) ],
                type: 'window'
            }
        },
    };

    return [ browserConfig, cjsConfig, esmConfig ];
};

function getFolderNames( directoryPath ) {
    try {
        // Read all items in the directory
        const items = fs.readdirSync( directoryPath );

        // Filter out only the directories
        const folders = items.filter( item => {
            const itemPath = path.join( directoryPath, item );
            return fs.statSync( itemPath ).isDirectory();
        } );

        return folders;
    } catch ( error ) {
        console.error( `Error reading directory: ${ error.message }` );
        return [];
    }
}

// Get all the folder names in the packages directory
const packageDirs = getFolderNames( path.resolve( __dirname, 'packages' ) );

// Log the known packages
console.log( { packageDirs } );

// Create configs for all packages
const configs = packageDirs.map( createPackageConfig );

module.exports = configs.flat(); 
