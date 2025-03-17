/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/packages.js":
/*!****************************!*\
  !*** ./assets/packages.js ***!
  \****************************/
/***/ ((module) => {

module.exports = ['@hizzlewp/interface', '@hizzlewp/components'];

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const WPDependencyExtractionWebpackPlugin = __webpack_require__(/*! @wordpress/dependency-extraction-webpack-plugin */ "@wordpress/dependency-extraction-webpack-plugin");
const packages = __webpack_require__(/*! ../assets/packages */ "./assets/packages.js");
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
function camelCaseDash(string) {
  return string.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
const hizzleRequestToExternal = (request, excludedExternals) => {
  if (packages.includes(request)) {
    const handle = request.substring(HIZZLE_NAMESPACE.length);
    if ((excludedExternals || []).includes(request)) {
      return;
    }
    return ['hizzle', camelCaseDash(handle)];
  }
};
const hizzleRequestToHandle = request => {
  if (packages.includes(request)) {
    const handle = request.substring(HIZZLE_NAMESPACE.length);
    return 'hizzle-' + handle;
  }
};
class DependencyExtractionWebpackPlugin extends WPDependencyExtractionWebpackPlugin {
  externalizeWpDeps(data, callback) {
    const request = data.request;
    let externalRequest;

    // Handle via options.requestToExternal first
    if (typeof this.options.requestToExternal === 'function') {
      externalRequest = this.options.requestToExternal(request);
    }

    // Cascade to default if unhandled and enabled
    if (typeof externalRequest === 'undefined' && this.options.useDefaults) {
      externalRequest = hizzleRequestToExternal(request, this.options.bundledPackages || []);
    }
    if (externalRequest) {
      this.externalizedDeps.add(request);
      return callback(null, externalRequest);
    }

    // Fall back to the WP method
    return super.externalizeWpDeps(data, callback);
  }
  mapRequestToDependency(request) {
    // Handle via options.requestToHandle first
    if (typeof this.options.requestToHandle === 'function') {
      const scriptDependency = this.options.requestToHandle(request);
      if (scriptDependency) {
        return scriptDependency;
      }
    }

    // Cascade to default if enabled
    if (this.options.useDefaults) {
      const scriptDependency = hizzleRequestToHandle(request);
      if (scriptDependency) {
        return scriptDependency;
      }
    }

    // Fall back to the WP method
    return super.mapRequestToDependency(request);
  }
}
module.exports = DependencyExtractionWebpackPlugin;

/***/ }),

/***/ "@wordpress/dependency-extraction-webpack-plugin":
/*!***********************************************************!*\
  !*** external ["wp","dependencyExtractionWebpackPlugin"] ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["dependencyExtractionWebpackPlugin"];

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map