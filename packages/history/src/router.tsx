/**
 * External dependencies
 */
import React, { createContext, useContext, useCallback, useState, useMemo, useEffect } from "react";

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
 * Get the matching routes for a given path
 *
 */
const getMatchingRoutes = ( routes: RouteConfig[], path: string ): Map<string, RouteConfig> | null => {
	const matchedRoutes = new Map<string, RouteConfig>();

	// Iterate over the routes.
	for ( const route of routes ) {
		if ( matchPath( route.path, path ) ) {
			// Add the route to the matched routes.
			matchedRoutes.set( route.path, route );

			if ( route.children ) {
				const childMatch = getMatchingRoutes( route.children, path );
				if ( childMatch ) {
					// Merge child matches into the current map
					childMatch.forEach( ( value, key ) => {
						matchedRoutes.set( key, value );
					} );
				}
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
	const patternParts = pattern.split( "/" ).filter( Boolean );
	const pathParts = path.split( "/" ).filter( Boolean );

	// If the path is shorter than the pattern, return null.
	// /users/123/edit can't match /users/:id.
	if ( pathParts.length < patternParts.length ) return false;

	// Compare each segment
	for ( let i = 0; i < patternParts.length; i++ ) {
		// If it's a static segment and doesn't match, return null.
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
}

/**
 * Router component
 */
export const Router: React.FC<RouterProps> = ( { children, routes } ) => {
	const path = usePath();

	const { params, outlets } = useMemo( () => {
		// If no routes or no path, return empty params
		if ( !routes.length || !path ) {
			return {};
		}

		// Find the matching routes.
		const outlets = getMatchingRoutes( routes, path );

		// If there are no outlets, return empty params
		if ( !outlets ) {
			return {};
		}

		// Use the last outlet to get the params
		const outlet = Array.from( outlets.values() ).pop();
		if ( !outlet ) {
			return {};
		}

		return {
			params: getParams( outlet.path as string, path ),
			outlets,
		};
	}, [ routes, path ] );

	return (
		<RouteContext.Provider value={ { params, path, outlets } }>
			{ children || <Outlet /> }
		</RouteContext.Provider>
	);
};

/**
 * The outlet component
 */
export const Outlet: React.FC<{ path?: string }> = ( { path } ) => {
	const { outlets } = useRoute();

	// Get the current route level.
	const route = useMemo( () => {
		if ( !outlets ) {
			return undefined;
		}

		// If no path, render the first outlet.
		if ( !path ) {
			return Array.from( outlets.values() ).shift();
		}

		// Otherwise, render the specified outlet.
		return outlets.get( path );
	}, [ path, outlets ] );

	// Get the next outlet.
	const nextOutlet = useMemo( () => {
		if ( !route || !path || !outlets ) {
			return null;
		}

		// Get the outlet that renders just after the current outlet's path.
		// We need to find the outlet whose path starts with the current path
		// but is one level deeper.
		for ( const [ outletPath, outlet ] of outlets.entries() ) {
			if ( outletPath.startsWith( path ) ) {
				return outlet;
			}
		}

		return null;
	}, [ path, outlets ] );

	// If no outlet, return null.
	if ( !route ) {
		return null;
	}

	// If no path, return the default element.
	if ( !path ) {
		return route.element;
	}

	// If there is a next outlet, return it.
	if ( nextOutlet ) {
		return nextOutlet.element;
	}

	// If we have an index, return it.
	if ( route.index ) {
		return route.index;
	}

	// Return null.
	return null;
};
