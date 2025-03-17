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

/**
 * Generate types for a package
 * @param {string} packagePath - Path to the package
 */
const generateTypes = ( packagePath ) => {
    const tsConfigPath = path.join( packagePath, 'tsconfig.json' );

    // Only run if the tsconfig.json file exists
    if ( fs.existsSync( tsConfigPath ) ) {
        execSync( `tsc --project ${ tsConfigPath } --emitDeclarationOnly`, {
            stdio: 'inherit',
            cwd: packagePath
        } );
    }
};

/** @type {webpack.Configuration} Base configuration for all packages */
const baseConfig = {
    ...defaultConfig,
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        ...defaultConfig.plugins.filter(
            ( plugin ) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        )
    ],
    externals: [ nodeExternals() ],
    optimization: {
        minimize: false,
    },
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
        target: 'node',
    };

    /** @type {webpack.Configuration} ESM build */
    const esmConfig = {
        ...baseConfig,
        entry: { index },
        output: {
            ...output,
            path: path.resolve( packagePath, 'build-module' ),
            filename: '[name].esm.js',
            library: {
                type: 'module',
            },
        },
        target: 'node',
        experiments: {
            outputModule: true,
        },
    };

    return [ cjsConfig, esmConfig ];
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
