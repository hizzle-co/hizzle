/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/actions.ts":
/*!************************!*\
  !*** ./src/actions.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   apiFetch: () => (/* reexport safe */ _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch),\n/* harmony export */   beforeDeleteRecord: () => (/* binding */ beforeDeleteRecord),\n/* harmony export */   setPartialRecords: () => (/* binding */ setPartialRecords),\n/* harmony export */   setRecord: () => (/* binding */ setRecord),\n/* harmony export */   setRecordOverview: () => (/* binding */ setRecordOverview),\n/* harmony export */   setRecords: () => (/* binding */ setRecords),\n/* harmony export */   setSchema: () => (/* binding */ setSchema),\n/* harmony export */   setTabContent: () => (/* binding */ setTabContent)\n/* harmony export */ });\n/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data-controls */ \"@wordpress/data-controls\");\n/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__);\n\n/**\n * Sets partial records.\n *\n * @param {RecordDescriptor[]} records\n * @param {string} queryString\n * @return {Action} Action.\n */\nvar setPartialRecords = function (records, queryString) { return ({\n    type: 'SET_PARTIAL_RECORDS',\n    records: records,\n    queryString: queryString,\n}); };\n/**\n * Sets new records.\n *\n * @param {RecordDescriptor} records\n * @param {string} queryString\n * @return {Action} Action.\n */\nvar setRecords = function (records, queryString) { return ({\n    type: 'SET_RECORDS',\n    records: records,\n    queryString: queryString,\n}); };\n/**\n * Sets a new record.\n *\n * @param {RecordDescriptor} record\n * @return {Action} Action.\n */\nvar setRecord = function (record) { return ({\n    type: 'SET_RECORD',\n    record: record,\n}); };\n/**\n * Sets the collection schema.\n *\n * @param {Schema} schema\n * @return {Action} Action.\n */\nvar setSchema = function (schema) { return ({\n    type: 'SET_SCHEMA',\n    schema: schema,\n}); };\n/**\n * Before deleting a record.\n *\n * @param {number} id\n * @return {Action} Action.\n */\nvar beforeDeleteRecord = function (id) { return ({\n    type: 'BEFORE_DELETE_RECORD',\n    id: id,\n}); };\n/**\n * Sets a single record's schema.\n *\n * @param {number} id\n * @param {string} tab_id\n * @param {any} content\n * @return {Action} Action.\n */\nvar setTabContent = function (id, tab_id, content) { return ({\n    type: 'SET_TAB_CONTENT',\n    id: id,\n    tab_id: tab_id,\n    content: content,\n}); };\n/**\n * Sets a single record's overview.\n *\n * @param {number} id\n * @param {RecordOverview} overview\n * @return {Action} Action.\n */\nvar setRecordOverview = function (id, overview) { return ({\n    type: 'SET_RECORD_OVERVIEW',\n    id: id,\n    overview: overview,\n}); };\n\n\n//# sourceURL=webpack://@hizzle/store/./src/actions.ts?");

/***/ }),

/***/ "./src/default.ts":
/*!************************!*\
  !*** ./src/default.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DEFAULT_STATE: () => (/* binding */ DEFAULT_STATE)\n/* harmony export */ });\nvar DEFAULT_STATE = {\n    recordIDs: {},\n    records: {},\n    partialRecords: {},\n    schema: {\n        schema: [],\n        hidden: [],\n        ignore: [],\n        routes: {},\n        labels: {},\n        id_prop: 'id',\n        tabs: {},\n    },\n    tabContent: {},\n    recordOverview: {},\n};\n\n\n//# sourceURL=webpack://@hizzle/store/./src/default.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ initStore),\n/* harmony export */   hooks: () => (/* reexport module object */ _hooks__WEBPACK_IMPORTED_MODULE_7__)\n/* harmony export */ });\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ \"@wordpress/data\");\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data-controls */ \"@wordpress/data-controls\");\n/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions */ \"./src/actions.ts\");\n/* harmony import */ var _dynamic_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dynamic-actions */ \"./src/dynamic-actions.js\");\n/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reducer */ \"./src/reducer.js\");\n/* harmony import */ var _resolvers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./resolvers */ \"./src/resolvers.js\");\n/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./selectors */ \"./src/selectors.ts\");\n/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hooks */ \"./src/hooks.js\");\n/* harmony import */ var _default__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./default */ \"./src/default.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n/**\n * External dependencies\n */\n\n\n\n/**\n * Internal dependencies\n */\n\n\n\n\n\n\n\n\n// Cache the stores.\nvar stores = {};\n/**\n * Initializes the store.\n *\n * @param {string} namespace The namespace.\n * @param {string} collection The collection.\n * @return {object} The store descriptor.\n */\nfunction initStore(namespace, collection) {\n    var STORE_NAME = \"\".concat(namespace, \"/\").concat(collection);\n    // If the store already exists, return it.\n    if (stores[STORE_NAME]) {\n        return stores[STORE_NAME];\n    }\n    // Create the store.\n    stores[STORE_NAME] = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)(STORE_NAME, {\n        reducer: _reducer__WEBPACK_IMPORTED_MODULE_4__.reducer,\n        actions: __assign(__assign({}, _actions__WEBPACK_IMPORTED_MODULE_2__), (0,_dynamic_actions__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(namespace, collection)),\n        selectors: __assign({}, _selectors__WEBPACK_IMPORTED_MODULE_6__),\n        controls: __assign(__assign({}, _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.controls), _wordpress_data__WEBPACK_IMPORTED_MODULE_0__.controls),\n        resolvers: (0,_resolvers__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(namespace, collection),\n        initialState: __assign({}, _default__WEBPACK_IMPORTED_MODULE_8__.DEFAULT_STATE),\n    });\n    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(stores[STORE_NAME]);\n    return stores[STORE_NAME];\n}\n\n\n//# sourceURL=webpack://@hizzle/store/./src/index.ts?");

/***/ }),

/***/ "./src/selectors.ts":
/*!**************************!*\
  !*** ./src/selectors.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getQuerySummary: () => (/* binding */ getQuerySummary),\n/* harmony export */   getQueryTotal: () => (/* binding */ getQueryTotal),\n/* harmony export */   getRecord: () => (/* binding */ getRecord),\n/* harmony export */   getRecordIDs: () => (/* binding */ getRecordIDs),\n/* harmony export */   getRecordOverview: () => (/* binding */ getRecordOverview),\n/* harmony export */   getRecords: () => (/* binding */ getRecords),\n/* harmony export */   getSchema: () => (/* binding */ getSchema),\n/* harmony export */   getTabContent: () => (/* binding */ getTabContent)\n/* harmony export */ });\n/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/url */ \"@wordpress/url\");\n/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./default */ \"./src/default.ts\");\n/**\n * External dependencies\n */\n\n/**\n * Internal dependencies\n */\n\n/**\n * Retrieves record IDs.\n *\n * @param {string} queryString\n * @return {number[]} Records.\n */\nvar getRecordIDs = function (state, queryString) {\n    var _a;\n    queryString = queryString === '' ? 'all' : queryString;\n    // Check if records are already loaded.\n    if (Array.isArray((_a = state.recordIDs[queryString]) === null || _a === void 0 ? void 0 : _a.items)) {\n        return state.recordIDs[queryString].items;\n    }\n    return [];\n};\n/**\n * Retrieves query total.\n *\n * @param {string} queryString\n * @return {number} Total Records.\n */\nvar getQueryTotal = function (state, queryString) {\n    var _a;\n    queryString = queryString === '' ? 'all' : queryString;\n    var total = (_a = state.recordIDs[queryString]) === null || _a === void 0 ? void 0 : _a.total;\n    return total ? total : 0;\n};\n/**\n * Retrieves query summary.\n *\n * @param {string} queryString\n * @return {Summary} Summary.\n */\nvar getQuerySummary = function (state, queryString) {\n    var _a;\n    queryString = queryString === '' ? 'all' : queryString;\n    var querySummary = (_a = state.recordIDs[queryString]) === null || _a === void 0 ? void 0 : _a.summary;\n    return querySummary ? querySummary : {};\n};\n/**\n * Retrieves records.\n *\n * @param {string} queryString\n * @return {RecordDescriptor[]} Records.\n */\nvar getRecords = function (state, queryString) {\n    var _a, _b, _c;\n    queryString = queryString === '' ? 'all' : queryString;\n    var _fields = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.getQueryArg)(queryString, '__fields');\n    // If we have fields, we need to use the partial records store.\n    if (_fields) {\n        return Array.isArray((_a = state.partialRecords[queryString]) === null || _a === void 0 ? void 0 : _a.items) ? (_b = state.partialRecords[queryString]) === null || _b === void 0 ? void 0 : _b.items : [];\n    }\n    // Check if records are already loaded.\n    if (!Array.isArray((_c = state.recordIDs[queryString]) === null || _c === void 0 ? void 0 : _c.items)) {\n        return [];\n    }\n    // Loop through records to find the record.\n    return state.recordIDs[queryString].items.map(function (id) { return state.records[id]; });\n};\n/**\n * Retrieves a record.\n *\n * @param {number} id\n * @return {RecordDescriptor | null} Record.\n */\nvar getRecord = function (state, id) { return state.records[id] || null; };\n/**\n * Retrieves the schema for the collection.\n *\n * @return {StateDescriptor.schema} schema.\n */\nvar getSchema = function (state) { return state.schema || _default__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_STATE.schema; };\n/**\n * Retrieves a single record tab's content.\n *\n * @param {string} id\n * @param {string} tab_id\n * @return {any} Tab content.\n */\nvar getTabContent = function (state, id, tab_id) { return state.tabContent[\"\".concat(id, \"_\").concat(tab_id)] || {}; };\n/**\n * Retrieves a single record's overview data.\n *\n * @param {number} id\n * @return {RecordOverview[]} Record overview data.\n */\nvar getRecordOverview = function (state, id) { return state.recordOverview[id] || []; };\n\n\n//# sourceURL=webpack://@hizzle/store/./src/selectors.ts?");

/***/ }),

/***/ "./src/dynamic-actions.js":
/*!********************************!*\
  !*** ./src/dynamic-actions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ createDynamicActions)\n/* harmony export */ });\n/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data-controls */ \"@wordpress/data-controls\");\n/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ \"./src/actions.ts\");\n/**\n * External dependencies\n */\n\n\n/**\n * Internal dependencies\n */\n\n\n/**\n * Creates dynamic actions for the store.\n * @param {string} namespace The namespace.\n * @param {string} collection The collection.\n * @link https://unfoldingneurons.com/2020/wordpress-data-store-properties-action-creator-generators\n */\nfunction createDynamicActions( namespace, collection ) {\n\n\treturn {\n\n\t\t/**\n\t\t * Creates a record.\n\t\t *\n\t\t * @param {Object} data\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*createRecord( data, dispatch ) {\n\t\t\tconst path   = `${namespace}/v1/${collection}`;\n\t\t\tconst method = 'POST';\n\t\t\tconst result = yield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path, method, data } );\n\n\t\t\tif ( result ) {\n\n\t\t\t\t// Invalidate the getRecords selector.\n\t\t\t\tyield dispatch.invalidateResolutionForStoreSelector( 'getRecords' );\n\n\t\t\t\t// Invalidate the getRecord selector.\n\t\t\t\tyield dispatch.invalidateResolution( 'getRecord', [ result.id ] );\n\n\t\t\t\t// Resolve to avoid further network requests.\n\t\t\t\tyield dispatch.startResolution( 'getRecord', [ result.id ] );\n\t\t\t\tyield dispatch.finishResolution( 'getRecord', [ result.id ] );\n\n\t\t\t\t// Set the record.\n\t\t\t\treturn (0,_actions__WEBPACK_IMPORTED_MODULE_1__.setRecord)( result );\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Updates a record.\n\t\t *\n\t\t * @param {string} id\n\t\t * @param {Object} data\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*updateRecord( id, data, dispatch ) {\n\t\t\tconst path   = `${namespace}/v1/${collection}/${id}`;\n\t\t\tconst method = 'PUT';\n\t\t\tconst result = yield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path, method, data } );\n\n\t\t\tif ( result ) {\n\n\t\t\t\t// Resolve to avoid further network requests.\n\t\t\t\tyield dispatch.startResolution( 'getRecord', [ result.id ] );\n\t\t\t\tyield dispatch.finishResolution( 'getRecord', [ result.id ] );\n\n\t\t\t\t// Set the record.\n\t\t\t\treturn dispatch.setRecord( result );\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Deletes a record.\n\t\t *\n\t\t * @param {string} id\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*deleteRecord( id, dispatch ) {\n\n\t\t\t/**\n\t\t\t * Fire action before deleting record.\n\t\t\t */\n\t\t\tyield dispatch.beforeDeleteRecord( id );\n\n\t\t\t// Delete the record.\n\t\t\tconst path   = `${namespace}/v1/${collection}/${id}`;\n\t\t\tconst method = 'DELETE';\n\n\t\t\tyield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path, method } );\n\n\t\t\t// Invalidate the getRecord selector.\n\t\t\tyield dispatch.invalidateResolution( 'getRecord', [ result.id ] );\n\n\t\t\treturn {\n\t\t\t\ttype: 'DELETE_RECORD',\n\t\t\t\tid\n\t\t\t};\n\t\t},\n\n\t\t/**\n\t\t * Deletes multiple records.\n\t\t *\n\t\t * @param {string} queryString\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*deleteRecords( queryString, dispatch ) {\n\n\t\t\t// Delete the record.\n\t\t\tconst path   = `${namespace}/v1/${collection}${queryString}`;\n\t\t\tconst method = 'DELETE';\n\n\t\t\t// Delete the records.\n\t\t\tyield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path, method } );\n\n\t\t\t// Invalidate related selectors.\n\t\t\tyield dispatch.emptyCache( dispatch );\n\n\t\t\treturn { type: 'DELETE_RECORDS' };\n\t\t},\n\n\t\t/**\n\t\t * Empties the cache.\n\t\t *\n\t\t * @param {string} queryString\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*emptyCache( dispatch ) {\n\t\t\tyield dispatch.invalidateResolutionForStoreSelector( 'getRecords' );\n\t\t\tyield dispatch.invalidateResolutionForStoreSelector( 'getRecord' );\n\t\t\tyield dispatch.invalidateResolutionForStoreSelector( 'getRecordOverview' );\n\t\t\tyield dispatch.invalidateResolutionForStoreSelector( 'getTabContent' );\n\t\t},\n\t}\n}\n\n\n//# sourceURL=webpack://@hizzle/store/./src/dynamic-actions.js?");

/***/ }),

/***/ "./src/hooks.js":
/*!**********************!*\
  !*** ./src/hooks.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useRecord: () => (/* binding */ useRecord),\n/* harmony export */   useRecordOverview: () => (/* binding */ useRecordOverview),\n/* harmony export */   useRecords: () => (/* binding */ useRecords),\n/* harmony export */   useSchema: () => (/* binding */ useSchema),\n/* harmony export */   useStore: () => (/* binding */ useStore),\n/* harmony export */   useTabContent: () => (/* binding */ useTabContent)\n/* harmony export */ });\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ \"@wordpress/data\");\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ \"@wordpress/element\");\n/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/url */ \"@wordpress/url\");\n/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index */ \"./src/index.ts\");\n/**\n * WordPress dependencies\n */\n\n\n\n\n/**\n * Internal dependencies\n */\n\n\n/**\n * Uses the specified store.\n *\n * @param {String} namespace\n * @param {String} collection\n * @return {Object} The store.\n */\nfunction useStore( namespace, collection ) {\n\treturn (0,_index__WEBPACK_IMPORTED_MODULE_3__[\"default\"])( namespace, collection );\n}\n\n/**\n * Resolves the specified record.\n *\n * @param {String} namespace\n * @param {String} collection\n * @param {Number} recordId ID of the requested record.\n * @return {Object} The record resolution.\n */\nfunction useRecord( namespace, collection, recordId ) {\n\tconst STORE_NAME = `${namespace}/${collection}`;\n\n\t// Ensure we have a valid record ID.\n\trecordId = parseInt( recordId, 10 );\n\n\tconst dispatch = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useDispatch)( STORE_NAME );\n\n\tconst mutations = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(\n\t\t() => ( {\n\t\t\tsave: ( saveOptions = {} ) => dispatch.updateRecord( recordId, saveOptions, dispatch ),\n\t\t\tdelete: () => dispatch.deleteRecord( recordId, dispatch ).catch( (e) => { console.error( e) } ),\n\t\t} ),\n\t\t[ recordId ]\n\t);\n\n\tconst recordState = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)( ( select ) => {\n\t\tconst store = select( STORE_NAME );\n\n\t\treturn {\n\t\t\trecord: store.getRecord( recordId ),\n\t\t\tisResolving: () => store.isResolving( 'getRecord', [ recordId ] ) || ! store.hasStartedResolution( 'getRecord', [ recordId ] ),\n\t\t\thasResolutionFailed: () => store.hasResolutionFailed( 'getRecord', [ recordId ] ),\n\t\t\tgetResolutionError: () => store.getResolutionError( 'getRecord', [ recordId ] ),\n\t\t}\n\t},[ recordId ] );\n\n\treturn { ...recordState, ...mutations };\n}\n\n/**\n * Resolves the specified record's schema.\n *\n * @param {String} namespace\n * @param {String} collection\n * @param {Object} recordId ID of the requested record.\n * @param {String} tabID ID of the requested tab.\n * @return {Object} The records resolution.\n */\nfunction useTabContent( namespace, collection, recordId, tabID ) {\n\n\t// Prepare the store name.\n\tconst STORE_NAME = `${namespace}/${collection}`;\n\n\t// Ensure we have a valid record ID.\n\trecordId = parseInt( recordId, 10 );\n\n\treturn (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)( ( select ) => {\n\t\tconst store = select( STORE_NAME );\n\n\t\treturn {\n\t\t\tdata: store.getTabContent( recordId, tabID ),\n\t\t\tisResolving: () => store.isResolving( 'getTabContent', [ recordId, tabID ] ) || ! store.hasStartedResolution( 'getTabContent', [ recordId, tabID ] ),\n\t\t\thasResolutionFailed: () => store.hasResolutionFailed( 'getTabContent', [ recordId, tabID ] ),\n\t\t\tgetResolutionError: () => store.getResolutionError( 'getTabContent', [ recordId, tabID ] ),\n\t\t}\n\t},[ recordId, tabID ]);\n\n}\n\n/**\n * Resolves the specified record's overview.\n *\n * @param {String} namespace\n * @param {String} collection\n * @param {Object} recordId ID of the requested record.\n * @return {Object} The records resolution.\n */\nfunction useRecordOverview( namespace, collection, recordId ) {\n\n\t// Prepare the store name.\n\tconst STORE_NAME = `${namespace}/${collection}`;\n\n\t// Ensure we have a valid record ID.\n\trecordId = parseInt( recordId, 10 );\n\n\treturn (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)( ( select ) => {\n\t\tconst store = select( STORE_NAME );\n\n\t\treturn {\n\t\t\tdata: store.getRecordOverview( recordId ),\n\t\t\tisResolving: () => store.isResolving( 'getRecordOverview', [ recordId ] ) || ! store.hasStartedResolution( 'getRecordOverview', [ recordId ] ),\n\t\t\thasResolutionFailed: () => store.hasResolutionFailed( 'getRecordOverview', [ recordId ] ),\n\t\t\tgetResolutionError: () => store.getResolutionError( 'getRecordOverview', [ recordId ] ),\n\t\t}\n\t},[ recordId ]);\n}\n\n/**\n * Resolves the specified records.\n *\n * @param {String} namespace\n * @param {String} collection\n * @param {Object} queryArgs Query arguments.\n * @return {Object} The records resolution.\n */\nfunction useRecords( namespace, collection, queryArgs = {} ) {\n\n\tconst STORE_NAME = `${namespace}/${collection}`;\n\tconst argsString = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_2__.addQueryArgs)( '', queryArgs );\n\n\treturn (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)( ( select ) => {\n\t\tconst store = select( STORE_NAME );\n\n\t\treturn {\n\t\t\tdata: store.getRecords( argsString ),\n\t\t\ttotal: store.getQueryTotal( argsString ),\n\t\t\tsummary: store.getQuerySummary( argsString ),\n\t\t\tisResolving: () => store.isResolving( 'getRecords', [ argsString ] ) || ! store.hasStartedResolution( 'getRecords', [ argsString ] ),\n\t\t\thasResolutionFailed: () => store.hasResolutionFailed( 'getRecords', [ argsString ] ),\n\t\t\tgetResolutionError: () => store.getResolutionError( 'getRecords', [ argsString ] ),\n\t\t}\n\t}, [argsString]);\n}\n\n/**\n * Resolves the store schema.\n *\n * @param {String} collection\n * @param {Object} queryArgs Query arguments.\n * @return {Object} The records resolution.\n */\nfunction useSchema( namespace, collection ) {\n\n\tconst STORE_NAME = `${namespace}/${collection}`;\n\n\treturn (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)( ( select ) => {\n\t\tconst store = select( STORE_NAME );\n\n\t\treturn {\n\t\t\tdata: store.getSchema(),\n\t\t\tisResolving: () => store.isResolving( 'getSchema' ) || ! store.hasStartedResolution( 'getSchema' ),\n\t\t\thasResolutionFailed: () => store.hasResolutionFailed( 'getSchema' ),\n\t\t\tgetResolutionError: () => store.getResolutionError( 'getSchema' ),\n\t\t}\n\t}, []);\n\n}\n\n\n//# sourceURL=webpack://@hizzle/store/./src/hooks.js?");

/***/ }),

/***/ "./src/reducer.js":
/*!************************!*\
  !*** ./src/reducer.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   reducer: () => (/* binding */ reducer)\n/* harmony export */ });\n/* harmony import */ var _default__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./default */ \"./src/default.ts\");\n/**\n * Internal dependencies\n */\n\n\n/**\n * The reducer for the store data\n */\nconst reducer = (state = _default__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_STATE, action) => {\n\tconst queryString = '' === action.queryString ? 'all' : action.queryString;\n\n\tswitch (action.type) {\n\n\t\t/**\n\t\t * Sets the collection schema.\n\t\t */\n\t\tcase 'SET_SCHEMA':\n\t\t\treturn { ...state, schema: action.schema };\n\n\t\t/**\n\t\t * Sets partial records keyed by query string, e.g.: { \"page=1\": { 1: { id: 1, ... } } }\n\t\t */\n\t\tcase 'SET_PARTIAL_RECORDS':\n\n\t\t\treturn {\n\t\t\t\t...state,\n\t\t\t\tpartialRecords: {\n\t\t\t\t\t...state.partialRecords,\n\t\t\t\t\t[ queryString ]: action.records,\n\t\t\t\t},\n\t\t\t};\n\n\t\t/**\n\t\t * Sets record IDs keyed by the query, e.g.: { \"page=1\": { items: [ 1, 2, 3 ], summary: {}, total: 3 } },\n\t\t * and records keyed by ID, e.g.: { 1: { id: 1, ... } }\n\t\t */\n\t\tcase 'SET_RECORDS':\n\n\t\t\t// Prepare constants.\n\t\t\tconst cachedRecords = { ...state.records };\n\t\t\tconst recordIds     = [];\n\t\t\tconst summary       = action.records.summary;\n\t\t\tconst total         = action.records.total;\n\n\t\t\t// Loop through the records and add them to the cache.\n\t\t\taction.records.items.forEach((record) => {\n\t\t\t\tcachedRecords[ record.id ] = record;\n\t\t\t\trecordIds.push( record.id );\n\t\t\t});\n\n\t\t\treturn {\n\t\t\t\t...state,\n\t\t\t\trecords: cachedRecords,\n\t\t\t\trecordIDs: {\n\t\t\t\t\t...state.recordIDs,\n\t\t\t\t\t[ queryString ]: {\n\t\t\t\t\t\titems: recordIds,\n\t\t\t\t\t\tsummary,\n\t\t\t\t\t\ttotal,\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t};\n\n\t\t/**\n\t\t * Sets a record keyed by ID, e.g.: { 1: { id: 1, ... } }\n\t\t */\n\t\tcase 'SET_RECORD':\n\t\t\treturn {\n\t\t\t\t...state,\n\t\t\t\trecords: {\n\t\t\t\t\t...state.records,\n\t\t\t\t\t[ action.record.id ]: action.record,\n\t\t\t\t},\n\t\t\t};\n\n\t\t/**\n\t\t * Before deleting a record, we need to remove it from the record IDs.\n\t\t */\n\t\tcase 'BEFORE_DELETE_RECORD':\n\t\t\tconst recordIDsBeforeDelete = { ...state.recordIDs };\n\n\t\t\t// Loop through the record IDs and remove the deleted record.\n\t\t\tObject.keys( recordIDsBeforeDelete ).forEach((queryString) => {\n\t\t\t\tconst index = recordIDsBeforeDelete[ queryString ].items.indexOf( action.id );\n\t\t\t\n\t\t\t\tif ( -1 !== index ) {\n\t\t\t\t\trecordIDsBeforeDelete[ queryString ].items.splice( index, 1 );\n\t\t\t\t\trecordIDsBeforeDelete[ queryString ].total -= 1;\n\t\t\t\t}\n\t\t\t});\n\n\t\t\treturn { ...state, recordIDs: recordIDsBeforeDelete };\n\n\t\t/**\n\t\t * Deletes a record keyed by ID, e.g.: { 1: { id: 1, ... } }\n\t\t */\n\t\tcase 'DELETE_RECORD':\n\t\t\tconst records   = { ...state.records };\n\t\t\tdelete records[ action.id ];\n\t\t\treturn { ...state, records };\n\n\t\t/**\n\t\t * Empty caches when deleting multiple records.\n\t\t */\n\t\tcase 'DELETE_RECORDS':\n\t\t\treturn {\n\t\t\t\t...state,\n\t\t\t\trecords: {},\n\t\t\t\trecordIDs: {},\n\t\t\t\ttabContent: {},\n\t\t\t\trecordOverview: {},\n\t\t\t\tpartialRecords: {},\n\t\t\t};\n\n\t\t/**\n\t\t * Set tab content key by subscriber ID and tab name, e.g.: { 1_overview:{} } }\n\t\t */\n\t\tcase 'SET_TAB_CONTENT':\n\t\t\treturn {\n\t\t\t\t...state,\n\t\t\t\ttabContent: {\n\t\t\t\t\t...state.tabContent,\n\t\t\t\t\t[ `${action.id}_${action.tab_id}` ]: action.content,\n\t\t\t\t},\n\t\t\t};\n\n\t\t/**\n\t\t * Set record overview keyed by the record ID.\n\t\t */\n\t\tcase 'SET_RECORD_OVERVIEW':\n\t\t\treturn {\n\t\t\t\t...state,\n\t\t\t\trecordOverview: {\n\t\t\t\t\t...state.recordOverview,\n\t\t\t\t\t[ action.id ]: action.overview,\n\t\t\t\t},\n\t\t\t};\n\t}\n\n\t// Return the state.\n\treturn state;\n}\n\n\n//# sourceURL=webpack://@hizzle/store/./src/reducer.js?");

/***/ }),

/***/ "./src/resolvers.js":
/*!**************************!*\
  !*** ./src/resolvers.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ createResolvers)\n/* harmony export */ });\n/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data-controls */ \"@wordpress/data-controls\");\n/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ \"@wordpress/data\");\n/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/url */ \"@wordpress/url\");\n/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions */ \"./src/actions.ts\");\n/**\n * External dependencies\n */\n\n\n\n\n/**\n * Internal dependencies\n */\n\n\n/**\n * Creates resolvers for the store.\n * @param {string} namespace The namespace.\n * @param {string} collection The collection.\n * @link https://unfoldingneurons.com/2020/wordpress-data-store-properties-resolvers\n */\nfunction createResolvers( namespace, collection ) {\n\n\treturn {\n\n\t\t/**\n\t\t * Fetches the records from the API.\n\t\t *\n\t\t * @param {String} queryString\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*getRecords( queryString ) {\n\t\t\tconst path    = `${namespace}/v1/${collection}${queryString}`;\n\t\t\tconst _fields = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_2__.getQueryArg)( queryString, '__fields' );\n\t\t\tconst records = yield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path } );\n\n\t\t\tif ( records ) {\n\n\t\t\t\tif ( _fields ) {\n\t\t\t\t\treturn (0,_actions__WEBPACK_IMPORTED_MODULE_3__.setPartialRecords)( records.items, queryString );\n\t\t\t\t}\n\n\t\t\t\t// Resolve each record to avoid further network requests.\n\t\t\t\tconst STORE_NAME = `${namespace}/${collection}`;\n\n\t\t\t\t// Resolve to avoid further network requests.\n\t\t\t\tconst resolutionsArgs = records.items.map( ( record ) => [ record.id ] );\n\n\t\t\t\tyield _wordpress_data__WEBPACK_IMPORTED_MODULE_1__.controls.dispatch(\n\t\t\t\t\tSTORE_NAME,\n\t\t\t\t\t'startResolutions',\n\t\t\t\t\t'getRecord',\n\t\t\t\t\tresolutionsArgs\n\t\t\t\t);\n\n\t\t\t\tyield _wordpress_data__WEBPACK_IMPORTED_MODULE_1__.controls.dispatch(\n\t\t\t\t\tSTORE_NAME,\n\t\t\t\t\t'finishResolutions',\n\t\t\t\t\t'getRecord',\n\t\t\t\t\tresolutionsArgs\n\t\t\t\t);\n\n\t\t\t\treturn (0,_actions__WEBPACK_IMPORTED_MODULE_3__.setRecords)( records, queryString );\n\t\t\t}\n\n\t\t\treturn (0,_actions__WEBPACK_IMPORTED_MODULE_3__.setRecords)( [], queryString );\n\t\t},\n\n\t\t/**\n\t\t * Fetches a record from the API.\n\t\t *\n\t\t * @param {string} id\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*getRecord( id ) {\n\t\t\tconst path   = `${namespace}/v1/${collection}/${id}`;\n\t\t\tconst record = yield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path } );\n\n\t\t\treturn (0,_actions__WEBPACK_IMPORTED_MODULE_3__.setRecord)( record );\n\t\t},\n\n\t\t/**\n\t\t * Fetch the collection schema from the API.\n\t\t *\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*getSchema() {\n\t\t\tconst path   = `${namespace}/v1/${collection}/collection_schema`;\n\t\t\tconst schema = yield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path } );\n\n\t\t\treturn (0,_actions__WEBPACK_IMPORTED_MODULE_3__.setSchema)( schema );\n\t\t},\n\n\t\t/**\n\t\t * Fetch a single record tab's content from the API.\n\t\t *\n\t\t * @param {string} id\n\t\t * @param {string} tab_id\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*getTabContent( id, tab_id ) {\n\t\t\tconst path    = `${namespace}/v1/${collection}/${id}/${tab_id}`;\n\t\t\tconst content = yield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path } );\n\n\t\t\treturn (0,_actions__WEBPACK_IMPORTED_MODULE_3__.setTabContent)( id, tab_id, content );\n\t\t},\n\n\t\t/**\n\t\t * Retrieves a single record's overview data.\n\t\t *\n\t\t * @param {string} id\n\t\t * @return {Object} Action.\n\t\t */\n\t\t*getRecordOverview( id ) {\n\t\t\tconst path     = `${namespace}/v1/${collection}/${id}/overview`;\n\t\t\tconst overview = yield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)( { path } );\n\n\t\t\treturn (0,_actions__WEBPACK_IMPORTED_MODULE_3__.setRecordOverview)( id, overview );\n\t\t},\n\t}\n}\n\n\n//# sourceURL=webpack://@hizzle/store/./src/resolvers.js?");

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/data-controls":
/*!**************************************!*\
  !*** external ["wp","dataControls"] ***!
  \**************************************/
/***/ ((module) => {

module.exports = window["wp"]["dataControls"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/url":
/*!*****************************!*\
  !*** external ["wp","url"] ***!
  \*****************************/
/***/ ((module) => {

module.exports = window["wp"]["url"];

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;