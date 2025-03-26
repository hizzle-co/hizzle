/**
 * External dependencies
 */
import {
    useState,
    useEffect,
    useLayoutEffect,
} from 'react';

/**
 * WordPress dependencies
 */
import { getQueryArgs, addQueryArgs } from '@wordpress/url';
import { QueryArgParsed } from '@wordpress/url/build-types/get-query-arg';

interface History {
    /**
     * The current location.
     */
    location: {
        query: Record<string, QueryArgParsed>;
        pathname: string;
    };

    /**
     * Push a new page onto the history stack.
     * @param path - The path to push onto the history stack.
     * @param data - The data to push onto the history stack.
     */
    push: ( path: string, data?: Record<string, string> ) => void;

    /**
     * Replace the current page.
     * @param path - The path to replace the current page with.
     * @param data - The data to replace the current page with.
     */
    replace: ( path: string, data?: Record<string, string> ) => void;

    /**
     * Go to a specific page.
     * @param delta - The number of pages to go back or forward.
     */
    go: ( delta: number ) => void;

    /**
     * Go back to the previous page. Same as calling `go(-1)`.
     */
    back: () => void;

    /**
     * Go forward to the next page. Same as calling `go(1)`.
     */
    forward: () => void;

    /**
     * Listen to history changes.
     * @param listener - The listener to call when the history changes.
     * @returns A function to remove the listener.
     */
    listen: ( listener: ( location: CustomEvent<{ state: Record<string, string> }> | PopStateEvent ) => void ) => () => void;
}

let _history: History;

/**
 * Recreate `history` to coerce React Router into accepting path arguments found in query
 * parameter `hizzlewp_path`, allowing a url hash to be avoided. Since hash portions of the url are
 * not sent server side, full route information can be detected by the server.
 *
 * @return {History} React-router history object with `get location` modified.
 */
export function getHistory( defaultRoute = '/' ): History {
    if ( !_history ) {
        let listeners: ( ( location: CustomEvent<{ state: Record<string, string> }> | PopStateEvent ) => void )[] = [];

        // Prevent duplicate events.
        let lastHistory = window.location.href;
        const handleEvent = ( event: CustomEvent<{ state: Record<string, string> }> | PopStateEvent ) => {
            if ( lastHistory !== window.location.href ) {
                lastHistory = window.location.href;
                listeners.forEach( fn => fn( event ) );
            }
        };

        // Generate a history object.
        _history = {
            get location() {
                const query = getQueryArgs( window.location.search );
                const pathname = query.hizzlewp_path as string || defaultRoute;

                return {
                    query,
                    pathname: pathname.startsWith( '/' ) ? pathname : `/${ pathname }`,
                };
            },
            push( url, data = {} ) {
                window.history.pushState( data, '', url );
                handleEvent( new CustomEvent( 'pushstate', {
                    detail: { state: data },
                } ) );
            },
            replace( url, data = {} ) {
                window.history.replaceState( data, '', url );
                handleEvent( new CustomEvent( 'replacestate', {
                    detail: { state: data },
                } ) );
            },
            go( delta ) {
                window.history.go( delta );
                handleEvent( new CustomEvent( 'popstate', {
                    detail: { state: {} },
                } ) );
            },
            back() {
                window.history.back();
                handleEvent( new CustomEvent( 'popstate', {
                    detail: { state: {} },
                } ) );
            },
            forward() {
                window.history.forward();
                handleEvent( new CustomEvent( 'popstate', {
                    detail: { state: {} },
                } ) );
            },
            listen( fn ) {
                // Add the listener to the list.
                listeners.push( fn );

                // Return a function to remove the listener.
                return () => {
                    listeners = listeners.filter( listener => listener !== fn );
                };
            },
        };

        // Add a listener for the popstate event.
        window.addEventListener( 'popstate', handleEvent );
    }
    return _history;
}

/**
 * Get the current path from history.
 *
 * @return {string}  Current path.
 */
export const getPath = () => getHistory().location.pathname;

/**
 * Get the current query string, parsed into an object, from history.
 *
 * @return {Record<string, QueryArgParsed>}  Current query object, defaults to empty object.
 */
export const getQuery = () => getHistory().location.query;

/**
 * Return a URL with set query parameters.
 *
 * @param {Object} query object of params to be updated.
 * @param {string} path  Relative path (defaults to current path).
 * @return {string}  Updated URL merging query params into existing params.
 */
export function getNewPath(
    query: Record<string, QueryArgParsed>,
    path = getPath(),
    currentQuery = getQuery(),
) {
    const args = { ...currentQuery, ...query };
    if ( path !== '/' ) {

        if ( !path.startsWith( '/' ) ) {
            path = `/${ path }`;
        }

        // Remove double forward slashes.
        args.hizzlewp_path = path.replace( /\/{2,}/g, '/' );
    }

    // Remove args where value === ''.
    Object.keys( args ).forEach( ( key ) => {
        if ( args[ key ] === '' ) {
            delete args[ key ];
        }
    } );

    return addQueryArgs( 'admin.php', args );
}

/**
 * Updates the query parameters of the current page.
 *
 * @param {Object} query        object of params to be updated.
 * @param {string} path         Relative path (defaults to current path).
 * @param {Object} currentQuery object of current query params (defaults to current querystring).
 */
export function updateQueryString(
    query: Record<string, QueryArgParsed>,
    path = getPath(),
    currentQuery = getQuery(),
) {
    getHistory().push( getNewPath( query, path, currentQuery ) );
}

/**
 * Updates the path of the current page.
 *
 * @param {string} path Relative path (defaults to current path).
 */
export function updatePath(
    path: string,
) {
    getHistory().push( getNewPath( {}, path, getQuery() ) );
}

/**
 * Navigates to the parent path.
 */
export function goToParent() {
    /**
     * Gets the current path and navigates to its parent path.
     */
    const currentPath = getPath();

    /**
     * Extracts the parent path by removing the last segment of the current path.
     * If the current path is the root, it defaults to '/'.
     */
    const parentPath = currentPath.substring( 0, currentPath.lastIndexOf( '/' ) ) || '/';

    /**
     * Updates the path to the parent path.
     */
    updatePath( parentPath );
}

/**
 * Adds a listener that runs on history change.
 *
 * @param {Function} listener Listener to run on history change.
 * @return {Function} Function to remove listeners.
 */
export const addHistoryListener = ( listener ) => {
    return getHistory().listen( listener );
};

function deepSort( obj ) {
    if ( Array.isArray( obj ) ) {
        // Sort arrays and apply deep sort to each element
        return obj.map( deepSort ).sort();
    } else if ( typeof obj === 'object' && obj !== null ) {
        // Create a sorted array of keys with recursively sorted values
        const sortedKeys = Object.keys( obj ).sort();
        const result = {};
        for ( const key of sortedKeys ) {
            result[ key ] = deepSort( obj[ key ] );
        }
        return result;
    }

    // Return primitive types as is
    return obj;
}

function isEqual( obj1: Record<string, QueryArgParsed>, obj2: Record<string, QueryArgParsed> ) {

    // Compare the serialized forms.
    return addQueryArgs( '', deepSort( { ...obj1 } ) ) === addQueryArgs( '', deepSort( { ...obj2 } ) );
}

/**
 * Like getQuery but in useHook format for easy usage in React functional components
 *
 * @return {Record<string, string>} Current query object, defaults to empty object.
 */
export const useQuery = () => {
    // Store the current query parameters in state
    const [ queryState, setQueryState ] = useState( getQuery() );
    // Flag to track when the location/URL has changed
    const [ locationChanged, setLocationChanged ] = useState( true );

    // Set up a listener for history changes (navigation events)
    useLayoutEffect( () => {
        // Add event listeners for browser navigation (back/forward) and programmatic navigation
        return addHistoryListener( () => {
            // Mark that location has changed when navigation occurs
            setLocationChanged( true );
        } );
    }, [] ); // Empty dependency array ensures this only runs once on mount

    // Handle query parameter updates when location changes
    useEffect( () => {
        if ( locationChanged ) {
            // Get the latest query parameters
            const query = getQuery();

            // Reset the location changed flag
            setLocationChanged( false );

            // Only update state if the query parameters have actually changed
            // This prevents unnecessary re-renders
            if ( !isEqual( query, queryState ) ) {
                setQueryState( query );
            }
        }
    }, [ locationChanged, queryState ] ); // Re-run when these dependencies change

    // Return the current query parameters
    return queryState;
};

/**
 * This function returns an event handler for the given `param`
 *
 * @param {string} param The parameter in the querystring which should be updated (ex `paged`, `per_page`)
 * @param {string} path  Relative path (defaults to current path).
 * @param {string} query object of current query params (defaults to current querystring).
 * @return {Function} A callback which will update `param` to the passed value when called.
 */
export function onQueryChange( param, path = getPath(), query = getQuery() ) {
    switch ( param ) {
        case 'sort':
            return ( key, dir ) =>
                updateQueryString( { orderby: key, order: dir }, path, query );
        default:
            return ( value ) =>
                updateQueryString( { [ param ]: value }, path, query );
    }
}

/**
 * A utility function that navigates to a page.
 *
 * @param {Object} args     - All arguments.
 * @param {string} args.url - Relative path or absolute url to navigate to
 */
export const navigateTo = ( url: string ) => {

    // Update the URL.
    getHistory().push( addQueryArgs( 'admin.php', getQueryArgs( url ) ) );

    // Scroll to the top.
    window.scrollTo( { top: 0, behavior: 'smooth' } );
};

/**
 * A hook that returns the current path.
 *
 * @return {string} The current path.
 */
export const usePath = (): string => {
    const [ path, setPath ] = useState<string>( getPath() );
    const [ locationChanged, setLocationChanged ] = useState<boolean>( false );

    // Set up a listener for history changes (navigation events)
    useLayoutEffect( () => {
        // Add event listeners for browser navigation (back/forward) and programmatic navigation
        return addHistoryListener( () => {
            // Mark that location has changed when navigation occurs
            setLocationChanged( true );
        } );
    }, [] ); // Empty dependency array ensures this only runs once on mount

    // Handle query parameter updates when location changes
    useEffect( () => {
        if ( locationChanged ) {
            const currentPath = getPath();

            // Reset the location changed flag
            setLocationChanged( false );

            // Only update state if the path has actually changed
            // This prevents unnecessary re-renders
            if ( currentPath !== path ) {
                setPath( currentPath );
            }
        }
    }, [ locationChanged, path ] ); // Re-run when these dependencies change

    // Return the current path
    return path;
};
