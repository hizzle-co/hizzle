/**
 * External dependencies
 */
import React, { createContext, useContext, useMemo } from "react";

/**
 * Internal dependencies
 */
import { usePath } from ".";

/**
 * Route config type
 */
export interface RouteConfig {
	/**
	 * The path to match for this route.
	 */
	path: string;

	/**
	 * The element to render when the route matches.
	 */
	element: React.ReactNode;

	/**
	 * The child routes.
	 */
	children?: RouteConfig[];

	/**
	 * The default element to render if no child routes match.
	 */
	index?: React.ReactNode;
}

/**
 * Route context type
 */
interface RouteContextType {

	/**
	 * The current route params
	 */
	params?: Map<string, string>;

	/**
	 * The current route path
	 */
	path: string;

	/**
	 * The base route path
	 */
	basePath?: string;

	/**
	 * The current route outlets.
	 *
	 * The key is the matched path pattern and the value is the route config.
	 */
	outlets?: Map<string, RouteConfig>;
}

// Create a route context
const RouteContext = createContext<RouteContextType>( { path: '' } );

export const useRoute = () => useContext( RouteContext );

/**
 * Matches a path against a pattern and returns the matched parameters
 * 
 * @param {string} pattern - The pattern to match against (e.g. "/:tab/:section")
 * @param {string} path - The actual path to match (e.g. "/settings/general")
 * @return {Map<string, string> | undefined} - Object with matched parameters or undefined if no match
 */
const getParams = ( pattern: string, path: string ): Map<string, string> | undefined => {
	// Split both pattern and path into segments
	const patternParts = pattern.split( '/' ).filter( Boolean );
	const pathParts = path.split( '/' ).filter( Boolean );

	// If the number of segments doesn't match, return null
	if ( patternParts.length !== pathParts.length ) {
		return undefined;
	}

	const params: Map<string, string> = new Map();

	// Compare each segment
	for ( let i = 0; i < patternParts.length; i++ ) {
		const patternPart = patternParts[ i ];
		const pathPart = pathParts[ i ];

		// If it's a parameter (starts with :)
		if ( patternPart.startsWith( ':' ) ) {
			const paramName = patternPart.slice( 1 );
			params.set( paramName, pathPart );
		}
		// If it's a static segment and doesn't match
		else if ( patternPart !== pathPart ) {
			return undefined;
		}
	}

	return params;
}

/**
 * Recursively finds all routes that match the given path, including nested children.
 *
 * This function iterates through the provided routes and checks if each route's path matches
 * the input path using a path matching utility. If a match is found, the route is added to
 * a Map. It then recursively processes any child routes, merging their matches into the
 * same Map. If no routes match, it returns null.
 *
 * @param routes - An array of route configurations to search through.
 * @param path - The path string to match against the routes.
 * @returns A Map of matched route paths to their configurations, or null if no matches are found.
 *
 * @example
 * ```typescript
 * const routes: RouteConfig[] = [
 *   { path: '/home', element: HomeComponent },
 *   { path: '/about', element: AboutComponent, children: [
 *     { path: '/about/team', element: TeamComponent }
 *   ]}
 * ];
 * 
 * const matches = getMatchingRoutes(routes, '/about/team');
 * // matches will be a Map with '/about' and '/about/team' if they match
 * ```
 */
const getMatchingRoutes = ( routes: RouteConfig[], path: string ): Map<string, RouteConfig> | null => {
	const matchedRoutes = new Map<string, RouteConfig>();

	// For each route,
	for ( const route of routes ) {
		// Ensure it matches the current path.
		if ( !matchPath( route.path, path ) ) continue;

		// Add the route to the matched routes.
		matchedRoutes.set( route.path, route );

		// Do the same for any children.
		if ( Array.isArray( route.children ) ) {
			const childMatch = getMatchingRoutes( route.children, path );
			if ( childMatch ) {
				// Merge child matches into the current map
				childMatch.forEach( ( config, key ) => matchedRoutes.set( key, config ) )
			}
		}
	}

	return matchedRoutes.size > 0 ? matchedRoutes : null;
};

/**
 * Utility to match path patterns and extract params.
 *
 * Does a partial match, e.g, /users/:id will also match /users/123/edit/:section.
 * This is useful for nested routes.
 *
 * @param {string} pattern - The pattern to match
 * @param {string} path - The path to match
 * @returns {Boolean} True if the path matches the pattern, false otherwise
 */
const matchPath = ( pattern: string, path: string ): boolean => {
	const patternParts = pattern.split( '/' ).filter( Boolean );
	const pathParts = path.split( '/' ).filter( Boolean );

	// If the path is shorter than the pattern, return null.
	// /users/123/edit can't match /users/:id.
	if ( pathParts.length < patternParts.length ) return false;

	// Compare each segment
	for ( let i = 0; i < patternParts.length; i++ ) {
		// If it's a static segment and doesn't match, return null.
		// For example, if the pattern is "/users" and the path is "/posts", they don't match...
		// But /users/:role matches /users/admins
		if ( !patternParts[ i ].startsWith( ":" ) && patternParts[ i ] !== pathParts[ i ] ) {
			return false;
		}
	}

	return true;
};

/**
 * Router component props
 */
interface RouterProps {
	/**
	 * The routes configuration
	 */
	routes: RouteConfig[];

	/**
	 * Children components.
	 *
	 * Provide a default <Outlet /> (with no path) to render the top level route if you provide children.
	 */
	children?: React.ReactNode;

	/**
	 * The base path to use if no path matches.
	 */
	basePath?: string;
}

/**
 * Router component
 */
export const Router: React.FC<RouterProps> = ( { children, routes, basePath = '/' } ) => {
	let path = usePath();

	// If no path, use the base path.
	if ( !path || path === '/' ) {
		path = basePath;
	}

	const value = useMemo( () => {
		// If no routes or no path, return empty params
		if ( !routes.length || !path ) {
			return { path };
		}

		// Find the matching routes.
		const outlets = getMatchingRoutes( routes, path );

		// If there are no outlets, return empty params
		if ( !outlets ) {
			return { path };
		}

		// Use the last outlet to get the params
		const outlet = Array.from( outlets.values() ).pop();
		if ( !outlet ) {
			return { path };
		}

		return {
			params: getParams( outlet.path as string, path ),
			outlets,
			path,
			basePath,
		};
	}, [ routes, path, basePath ] );

	return (
		<RouteContext.Provider value={ value }>
			{ children || <Outlet /> }
		</RouteContext.Provider>
	);
};

/**
 * Outlet component for rendering nested routes in the router.
 *
 * This component is responsible for rendering the appropriate route element based on the current
 * routing context. It handles nested routing by finding and rendering the next appropriate outlet
 * or index route.
 *
 * @param props - The component props
 * @param props.path - Don't provide for the first <Outlet />. Always provide for other paths otherwise your browser will hang.
 *
 * @returns The rendered route element, or null if no matching route is found
 *
 * @example
 * ```tsx
 * // Render the first outlet
 * <Outlet />
 *
 * // Render a specific outlet by path
 * <Outlet path="/dashboard" />
 * ```
 *
 * @remarks
 * The component uses the following logic to determine what to render:
 * 1. If a path is provided, renders the outlet matching that path
 * 2. If no path is provided, renders the first available outlet
 * 3. If there's a next nested outlet, renders that outlet
 * 4. If there's an index route defined, renders the index
 * 5. If no path is provided and no children exist, renders the route element
 * 6. Otherwise, returns null
 */
export const Outlet: React.FC<{ path?: string }> = ( { path } ) => {
	const { outlets } = useRoute();

	// Get the current route level and the next outlet.
	const [ route, nextOutlet ] = useMemo( () => {

		// Abort if no matching routes.
		if ( !outlets ) {
			return [ undefined, undefined ];
		}

		// Get current route
		const currentRoute = path
			// Render the specified outlet.
			? outlets.get( path )
			// If no path, render the first outlet.
			: Array.from( outlets.values() )[ 0 ];

		// Get the outlet that renders just after the current outlet's path.
		let next: RouteConfig | null = null;
		if ( currentRoute && path ) {
			// Convert the outlets map to an array of entries for easier iteration
			const entries = Array.from( outlets.entries() );

			// Find the index of the current route in the outlets array
			const currentIndex = entries.findIndex( ( [ p ] ) => p === path );

			// Check if we found the current route and there's a next route available
			if ( currentIndex !== -1 && currentIndex + 1 < entries.length ) {
				// Get the next route entry (path and config)
				const [ nextPath, nextRoute ] = entries[ currentIndex + 1 ];

				// Verify that the next route is a child of the current route
				// by checking if its path starts with the current path
				if ( nextPath.startsWith( path ) ) {
					next = nextRoute;
				}
			}
		}

		return [ currentRoute, next ];
	}, [ path, outlets ] );

	// If no outlet, return null.
	if ( !route ) {
		return null;
	}

	// If there is a next outlet, return it.
	if ( nextOutlet ) {
		return nextOutlet.element;
	}

	// If we have an index, return it.
	if ( route.index ) {
		return route.index;
	}

	// If no path and no children, return the element to prevent infinite loop
	if ( !path ) {
		return route.element;
	}

	// Return null.
	return null;
};
