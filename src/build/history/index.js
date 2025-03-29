/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./packages/history/src/index.tsx":
/*!****************************************!*\
  !*** ./packages/history/src/index.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Outlet: () => (/* reexport safe */ _router__WEBPACK_IMPORTED_MODULE_2__.Outlet),
/* harmony export */   Router: () => (/* reexport safe */ _router__WEBPACK_IMPORTED_MODULE_2__.Router),
/* harmony export */   addHistoryListener: () => (/* binding */ addHistoryListener),
/* harmony export */   getHistory: () => (/* binding */ getHistory),
/* harmony export */   getNewPath: () => (/* binding */ getNewPath),
/* harmony export */   getPath: () => (/* binding */ getPath),
/* harmony export */   getQuery: () => (/* binding */ getQuery),
/* harmony export */   goToParent: () => (/* binding */ goToParent),
/* harmony export */   navigateTo: () => (/* binding */ navigateTo),
/* harmony export */   onQueryChange: () => (/* binding */ onQueryChange),
/* harmony export */   updatePath: () => (/* binding */ updatePath),
/* harmony export */   updateQueryString: () => (/* binding */ updateQueryString),
/* harmony export */   usePath: () => (/* binding */ usePath),
/* harmony export */   useQuery: () => (/* binding */ useQuery),
/* harmony export */   useRoute: () => (/* reexport safe */ _router__WEBPACK_IMPORTED_MODULE_2__.useRoute)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./router */ "./packages/history/src/router.tsx");
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */

/**
 * Local dependencies
 */

let _history;

/**
 * Recreate `history` to coerce React Router into accepting path arguments found in query
 * parameter `hizzlewp_path`, allowing a url hash to be avoided. Since hash portions of the url are
 * not sent server side, full route information can be detected by the server.
 *
 * @return {History} React-router history object with `get location` modified.
 */
function getHistory(defaultRoute = '/') {
  if (!_history) {
    let listeners = [];

    // Prevent duplicate events.
    let lastHistory = window.location.href;
    const handleEvent = event => {
      if (lastHistory !== window.location.href) {
        lastHistory = window.location.href;
        listeners.forEach(fn => fn(event));
      }
    };

    // Generate a history object.
    _history = {
      get location() {
        const query = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_1__.getQueryArgs)(window.location.search);
        const pathname = (query.hizzlewp_path || defaultRoute).toLowerCase().replace(/\/$/, '');
        return {
          query,
          pathname: pathname.startsWith('/') ? pathname : `/${pathname}`
        };
      },
      push(url, data = {}) {
        window.history.pushState(data, '', url);
        handleEvent(new CustomEvent('pushstate', {
          detail: {
            state: data
          }
        }));
      },
      replace(url, data = {}) {
        window.history.replaceState(data, '', url);
        handleEvent(new CustomEvent('replacestate', {
          detail: {
            state: data
          }
        }));
      },
      go(delta) {
        window.history.go(delta);
        handleEvent(new CustomEvent('popstate', {
          detail: {
            state: {}
          }
        }));
      },
      back() {
        window.history.back();
        handleEvent(new CustomEvent('popstate', {
          detail: {
            state: {}
          }
        }));
      },
      forward() {
        window.history.forward();
        handleEvent(new CustomEvent('popstate', {
          detail: {
            state: {}
          }
        }));
      },
      listen(fn) {
        // Add the listener to the list.
        listeners.push(fn);

        // Return a function to remove the listener.
        return () => {
          listeners = listeners.filter(listener => listener !== fn);
        };
      }
    };

    // Add a listener for the popstate event.
    window.addEventListener('popstate', handleEvent);
  }
  return _history;
}

/**
 * Get the current path from history.
 *
 * @return {string}  Current path.
 */
const getPath = () => getHistory().location.pathname;

/**
 * Get the current query string, parsed into an object, from history.
 *
 * @return {Record<string, QueryArgParsed>}  Current query object, defaults to empty object.
 */
const getQuery = () => getHistory().location.query;

/**
 * Return a URL with set query parameters.
 *
 * @param {Object} query object of params to be updated.
 * @param {string} path  Relative path (defaults to current path).
 * @return {string}  Updated URL merging query params into existing params.
 */
function getNewPath(query, path = getPath(), currentQuery = getQuery()) {
  const args = {
    ...currentQuery,
    ...query
  };
  if (path !== '/') {
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }

    // Remove double forward slashes.
    args.hizzlewp_path = path.replace(/\/{2,}/g, '/');
  }

  // Remove args where value === ''.
  Object.keys(args).forEach(key => {
    if (args[key] === '') {
      delete args[key];
    }
  });
  return (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_1__.addQueryArgs)('admin.php', args);
}

/**
 * Updates the query parameters of the current page.
 *
 * @param {Object} query        object of params to be updated.
 * @param {string} path         Relative path (defaults to current path).
 * @param {Object} currentQuery object of current query params (defaults to current querystring).
 */
function updateQueryString(query, path = getPath(), currentQuery = getQuery()) {
  getHistory().push(getNewPath(query, path, currentQuery));
}

/**
 * Updates the path of the current page.
 *
 * @param {string} path Relative path (defaults to current path).
 */
function updatePath(path) {
  getHistory().push(getNewPath({}, path, getQuery()));
}

/**
 * Navigates to the parent path.
 */
function goToParent() {
  /**
   * Gets the current path and navigates to its parent path.
   */
  const currentPath = getPath();

  /**
   * Extracts the parent path by removing the last segment of the current path.
   * If the current path is the root, it defaults to '/'.
   */
  const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';

  /**
   * Updates the path to the parent path.
   */
  updatePath(parentPath);
}

/**
 * Adds a listener that runs on history change.
 *
 * @param {Function} listener Listener to run on history change.
 * @return {Function} Function to remove listeners.
 */
const addHistoryListener = listener => {
  return getHistory().listen(listener);
};
function deepSort(obj) {
  if (Array.isArray(obj)) {
    // Sort arrays and apply deep sort to each element
    return obj.map(deepSort).sort();
  } else if (typeof obj === 'object' && obj !== null) {
    // Create a sorted array of keys with recursively sorted values
    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    for (const key of sortedKeys) {
      result[key] = deepSort(obj[key]);
    }
    return result;
  }

  // Return primitive types as is
  return obj;
}
function isEqual(obj1, obj2) {
  // Compare the serialized forms.
  return (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_1__.addQueryArgs)('', deepSort({
    ...obj1
  })) === (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_1__.addQueryArgs)('', deepSort({
    ...obj2
  }));
}

/**
 * Like getQuery but in useHook format for easy usage in React functional components
 *
 * @return {Record<string, string>} Current query object, defaults to empty object.
 */
const useQuery = () => {
  // Store the current query parameters in state
  const [queryState, setQueryState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(getQuery());
  // Flag to track when the location/URL has changed
  const [locationChanged, setLocationChanged] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);

  // Set up a listener for history changes (navigation events)
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    // Add event listeners for browser navigation (back/forward) and programmatic navigation
    return addHistoryListener(() => {
      // Mark that location has changed when navigation occurs
      setLocationChanged(true);
    });
  }, []); // Empty dependency array ensures this only runs once on mount

  // Handle query parameter updates when location changes
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (locationChanged) {
      // Get the latest query parameters
      const query = getQuery();

      // Reset the location changed flag
      setLocationChanged(false);

      // Only update state if the query parameters have actually changed
      // This prevents unnecessary re-renders
      if (!isEqual(query, queryState)) {
        setQueryState(query);
      }
    }
  }, [locationChanged, queryState]); // Re-run when these dependencies change

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
function onQueryChange(param, path = getPath(), query = getQuery()) {
  switch (param) {
    case 'sort':
      return (key, dir) => updateQueryString({
        orderby: key,
        order: dir
      }, path, query);
    default:
      return value => updateQueryString({
        [param]: value
      }, path, query);
  }
}

/**
 * A utility function that navigates to a page.
 *
 * @param {Object} args     - All arguments.
 * @param {string} args.url - Relative path or absolute url to navigate to
 */
const navigateTo = url => {
  // Update the URL.
  getHistory().push((0,_wordpress_url__WEBPACK_IMPORTED_MODULE_1__.addQueryArgs)('admin.php', (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_1__.getQueryArgs)(url)));

  // Scroll to the top.
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * A hook that returns the current path.
 *
 * @return {string} The current path.
 */
const usePath = () => {
  const [path, setPath] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(getPath());
  const [locationChanged, setLocationChanged] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Set up a listener for history changes (navigation events)
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    // Add event listeners for browser navigation (back/forward) and programmatic navigation
    return addHistoryListener(() => {
      // Mark that location has changed when navigation occurs
      setLocationChanged(true);
    });
  }, []); // Empty dependency array ensures this only runs once on mount

  // Handle query parameter updates when location changes
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (locationChanged) {
      const currentPath = getPath();

      // Reset the location changed flag
      setLocationChanged(false);

      // Only update state if the path has actually changed
      // This prevents unnecessary re-renders
      if (currentPath !== path) {
        setPath(currentPath);
      }
    }
  }, [locationChanged, path]); // Re-run when these dependencies change

  // Return the current path
  return path;
};

/***/ }),

/***/ "./packages/history/src/router.tsx":
/*!*****************************************!*\
  !*** ./packages/history/src/router.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Outlet: () => (/* binding */ Outlet),
/* harmony export */   Router: () => (/* binding */ Router),
/* harmony export */   useRoute: () => (/* binding */ useRoute)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./packages/history/src/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */


/**
 * Route config type
 */

/**
 * Route context type
 */

// Create a route context
const RouteContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  path: ''
});
const useRoute = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(RouteContext);

/**
 * Matches a path against a pattern and returns the matched parameters
 * 
 * @param {string} pattern - The pattern to match against (e.g. "/:tab/:section")
 * @param {string} path - The actual path to match (e.g. "/settings/general")
 * @return {Map<string, string> | undefined} - Object with matched parameters or undefined if no match
 */
const getParams = (pattern, path) => {
  // Split both pattern and path into segments
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  // If the number of segments doesn't match, return null
  if (patternParts.length !== pathParts.length) {
    return undefined;
  }
  const params = new Map();

  // Compare each segment
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    // If it's a parameter (starts with :)
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params.set(paramName, pathPart);
    }
    // If it's a static segment and doesn't match
    else if (patternPart !== pathPart) {
      return undefined;
    }
  }
  return params;
};

/**
 * Get the matching routes for a given path
 *
 */
const getMatchingRoutes = (routes, path) => {
  const matchedRoutes = new Map();

  // Iterate over the routes.
  for (const route of routes) {
    if (!matchPath(route.path, path)) continue;

    // Add the route to the matched routes.
    matchedRoutes.set(route.path, route);
    if (route.children?.length) {
      const childMatch = getMatchingRoutes(route.children, path);
      if (childMatch) {
        // Merge child matches into the current map
        for (const [key, value] of childMatch) {
          matchedRoutes.set(key, value);
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
const matchPath = (pattern, path) => {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  // If the path is shorter than the pattern, return null.
  // /users/123/edit can't match /users/:id.
  if (pathParts.length < patternParts.length) return false;

  // Compare each segment
  for (let i = 0; i < patternParts.length; i++) {
    // If it's a static segment and doesn't match, return null.
    if (!patternParts[i].startsWith(":") && patternParts[i] !== pathParts[i]) {
      return false;
    }
  }
  return true;
};

/**
 * Router component props
 */

/**
 * Router component
 */
const Router = ({
  children,
  routes
}) => {
  const path = (0,___WEBPACK_IMPORTED_MODULE_1__.usePath)();
  const value = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    // If no routes or no path, return empty params
    if (!routes.length || !path) {
      return {
        path
      };
    }

    // Find the matching routes.
    const outlets = getMatchingRoutes(routes, path);

    // If there are no outlets, return empty params
    if (!outlets) {
      return {
        path
      };
    }

    // Use the last outlet to get the params
    const outlet = Array.from(outlets.values()).pop();
    if (!outlet) {
      return {
        path
      };
    }
    return {
      params: getParams(outlet.path, path),
      outlets,
      path
    };
  }, [routes, path]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(RouteContext.Provider, {
    value: value,
    children: children || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Outlet, {})
  });
};

/**
 * The outlet component
 */
const Outlet = ({
  path
}) => {
  const {
    outlets
  } = useRoute();

  // Get the current route level and the next outlet.
  const [route, nextOutlet] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!outlets) {
      return [undefined, undefined];
    }

    // Get current route
    const currentRoute = path
    // Render the specified outlet.
    ? outlets.get(path)
    // If no path, render the first outlet.
    : Array.from(outlets.values())[0];

    // Get the outlet that renders just after the current outlet's path.
    let next = null;
    if (currentRoute && path) {
      const entries = Array.from(outlets.entries());
      const currentIndex = entries.findIndex(([p]) => p === path);
      if (currentIndex !== -1 && currentIndex + 1 < entries.length) {
        const [nextPath, nextRoute] = entries[currentIndex + 1];
        if (nextPath.startsWith(path)) {
          next = nextRoute;
        }
      }
    }
    return [currentRoute, next];
  }, [path, outlets]);

  // If no outlet, return null.
  if (!route) {
    return null;
  }

  // If no path, return the default element.
  if (!path) {
    return route.element;
  }

  // If there is a next outlet, return it.
  if (nextOutlet) {
    return nextOutlet.element;
  }

  // If we have an index, return it.
  if (route.index) {
    return route.index;
  }

  // Return null.
  return null;
};

/***/ }),

/***/ "@wordpress/url":
/*!*****************************!*\
  !*** external ["wp","url"] ***!
  \*****************************/
/***/ ((module) => {

module.exports = window["wp"]["url"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./packages/history/src/index.tsx");
/******/ 	(window.hizzlewp = window.hizzlewp || {}).history = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map