const fs = require( 'fs' );
const path = require( 'path' );
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
const camelCaseDash = ( string ) => {
    return string.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() );
};

/**
 * Get all the folder names in a directory
 * @param {string} directoryPath - Path to the directory
 * @return {string[]} Array of folder names
 */
const getPackageDirs = ( directoryPath ) => {
    // Read all items in the directory
    const items = fs.readdirSync( directoryPath );

    // Filter out only the directories
    const folders = items.filter( item => {
        const itemPath = path.join( directoryPath, item );
        return fs.statSync( itemPath ).isDirectory();
    } );

    return folders;
};

/**
 * Generates config for all packages
 *
 * @param {Function} cb - Callback function to generate config for all packages
 * @param {string} cwd - The path to the packages directory
 */
const generateConfigs = ( cb, cwd ) => {

    const packages = getPackageDirs( path.resolve( cwd, 'packages' ) ).reduce( ( acc, package ) => {
        acc[ package ] = getEntryPath( path.resolve( cwd, 'packages', package, 'src' ) );
        return acc;
    }, {} );

    return cb( packages, cwd );
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

module.exports = {
    generateTypes,
    camelCaseDash,
    getPackageDirs,
    generateConfigs,
    getEntryPath,
};
