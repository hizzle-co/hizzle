const WPDependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const packages = require( '../assets/packages' );

const HIZZLE_NAMESPACE = '@hizzlewp/';

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

const hizzleRequestToExternal = ( request, excludedExternals ) => {
    if ( packages.includes( request ) ) {
        const handle = request.substring( HIZZLE_NAMESPACE.length );

        if ( ( excludedExternals || [] ).includes( request ) ) {
            return;
        }

        return [ 'hizzle', camelCaseDash( handle ) ];
    }
};

const hizzleRequestToHandle = ( request ) => {
    if ( packages.includes( request ) ) {
        const handle = request.substring( HIZZLE_NAMESPACE.length );

        return 'hizzle-' + handle;
    }
};

class DependencyExtractionWebpackPlugin extends WPDependencyExtractionWebpackPlugin {
    externalizeWpDeps( data, callback ) {
        const request = data.request;

        let externalRequest;

        // Handle via options.requestToExternal first
        if ( typeof this.options.requestToExternal === 'function' ) {
            externalRequest = this.options.requestToExternal( request );
        }

        // Cascade to default if unhandled and enabled
        if (
            typeof externalRequest === 'undefined' &&
            this.options.useDefaults
        ) {
            externalRequest = hizzleRequestToExternal(
                request,
                this.options.bundledPackages || []
            );
        }

        if ( externalRequest ) {
            this.externalizedDeps.add( request );

            return callback( null, externalRequest );
        }

        // Fall back to the WP method
        return super.externalizeWpDeps( data, callback );
    }

    mapRequestToDependency( request ) {
        // Handle via options.requestToHandle first
        if ( typeof this.options.requestToHandle === 'function' ) {
            const scriptDependency = this.options.requestToHandle( request );
            if ( scriptDependency ) {
                return scriptDependency;
            }
        }

        // Cascade to default if enabled
        if ( this.options.useDefaults ) {
            const scriptDependency = hizzleRequestToHandle( request );
            if ( scriptDependency ) {
                return scriptDependency;
            }
        }

        // Fall back to the WP method
        return super.mapRequestToDependency( request );
    }
}

module.exports = DependencyExtractionWebpackPlugin;
