/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/clsx/dist/clsx.mjs":
/*!*****************************************!*\
  !*** ./node_modules/clsx/dist/clsx.mjs ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: () => (/* binding */ clsx),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

/***/ }),

/***/ "./packages/settings/src/components/integration-section.tsx":
/*!******************************************************************!*\
  !*** ./packages/settings/src/components/integration-section.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IntegrationSection: () => (/* binding */ IntegrationSection)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hizzlewp/components */ "@hizzlewp/components");
/* harmony import */ var _hizzlewp_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _settings_provider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./settings-provider */ "./packages/settings/src/components/settings-provider.tsx");
/* harmony import */ var _section__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./section */ "./packages/settings/src/components/section.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */



/**
 * WordPress dependencies
 */


/**
 * HizzleWP dependencies.
 */


/**
 * Local dependancies.
 */



/**
 * Displays an integration section.
 *
 */

function IntegrationSection({
  id,
  heading,
  description,
  help_url,
  badges,
  className,
  settings,
  cardProps
}) {
  const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    saved
  } = (0,_settings_provider__WEBPACK_IMPORTED_MODULE_4__.useSettings)();
  let badge = null;
  badges.forEach(badgeInfo => {
    // Key value conditions.
    if (!Array.isArray(badgeInfo.conditions) || (0,_hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__.checkConditions)(badgeInfo.conditions, saved)) {
      badge = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalText, {
        ...badgeInfo.props,
        children: badgeInfo.text
      });
    }
  });
  const style = {
    paddingLeft: 16,
    paddingRight: 16,
    height: 48
  };
  const HelpLinkOrDescription = () => {
    if (help_url) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        href: help_url,
        target: "_blank",
        icon: "info",
        label: "Learn more",
        showTooltip: true
      });
    }
    if (description) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
        icon: "info",
        style: {
          color: '#454545'
        }
      });
    }
    return null;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
    id: id,
    size: "small",
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])(className, 'noptin-no-shadow'),
    ...(cardProps || {}),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
      style: {
        padding: 0
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Flex, {
        as: _wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button,
        onClick: () => setIsOpen(!isOpen),
        style: style,
        label: description,
        showTooltip: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHStack, {
          as: _wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexBlock,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalText, {
            as: "h3",
            weight: 600,
            children: heading
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(HelpLinkOrDescription, {})]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHStack, {
            children: [badge, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
              icon: isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'
            })]
          })
        })]
      })
    }), isOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalVStack, {
        spacing: 6,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_section__WEBPACK_IMPORTED_MODULE_5__.SettingsList, {
          settings: settings
        }), help_url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHStack, {
          alignment: "flex-end",
          justify: "flex-end",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            href: help_url,
            target: "_blank",
            label: "Need help?",
            variant: "secondary",
            showTooltip: true,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalText, {
              children: "View integration guide"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
              icon: "external"
            })]
          })
        })]
      })
    })]
  });
}

/***/ }),

/***/ "./packages/settings/src/components/layout.tsx":
/*!*****************************************************!*\
  !*** ./packages/settings/src/components/layout.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hizzlewp_interface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hizzlewp/interface */ "@hizzlewp/interface");
/* harmony import */ var _hizzlewp_interface__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_hizzlewp_interface__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _notices__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./notices */ "./packages/settings/src/components/notices.tsx");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./settings */ "./packages/settings/src/components/settings.tsx");
/* harmony import */ var _use_save_button_props__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./use-save-button-props */ "./packages/settings/src/components/use-save-button-props.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */



/**
 * HizzleWP dependencies.
 */


/**
 * Local dependancies.
 */




const TheHeader = props => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_hizzlewp_interface__WEBPACK_IMPORTED_MODULE_2__.Header, {
    ...props,
    actions: [(0,_use_save_button_props__WEBPACK_IMPORTED_MODULE_5__.useSaveButtonProps)()]
  });
};
const theContent = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalVStack, {
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_settings__WEBPACK_IMPORTED_MODULE_4__.Settings, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_notices__WEBPACK_IMPORTED_MODULE_3__.EditorSnackbars, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_notices__WEBPACK_IMPORTED_MODULE_3__.EditorNotices, {})]
});
const TheFooter = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_hizzlewp_interface__WEBPACK_IMPORTED_MODULE_2__.Footer, {
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    ...(0,_use_save_button_props__WEBPACK_IMPORTED_MODULE_5__.useSaveButtonProps)()
  })
});
function Layout(props) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_hizzlewp_interface__WEBPACK_IMPORTED_MODULE_2__.Interface, {
    className: "hizzlewp-settings__interface",
    header: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(TheHeader, {
      ...props
    }),
    content: theContent,
    footer: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(TheFooter, {})
  });
}

/***/ }),

/***/ "./packages/settings/src/components/notices.tsx":
/*!******************************************************!*\
  !*** ./packages/settings/src/components/notices.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditorNotices: () => (/* binding */ EditorNotices),
/* harmony export */   EditorSnackbars: () => (/* binding */ EditorSnackbars)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */




function EditorNotices() {
  const {
    notices
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => ({
    notices: select(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__.store).getNotices()
  }), []);
  const {
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__.store);
  const dismissibleNotices = notices.filter(({
    isDismissible,
    type
  }) => isDismissible && type === 'default');
  const nonDismissibleNotices = notices.filter(({
    isDismissible,
    type
  }) => !isDismissible && type === 'default');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.NoticeList, {
      notices: nonDismissibleNotices,
      className: "components-editor-notices__pinned"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.NoticeList, {
      notices: dismissibleNotices,
      className: "components-editor-notices__dismissible",
      onRemove: removeNotice
    })]
  });
}

// Last three notices. Slices from the tail end of the list.
const MAX_VISIBLE_NOTICES = -3;
function EditorSnackbars() {
  const notices = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => select(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__.store).getNotices(), []);
  const {
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__.store);
  const snackbarNotices = notices.filter(({
    type
  }) => type === 'snackbar').slice(MAX_VISIBLE_NOTICES);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SnackbarList, {
    notices: snackbarNotices,
    className: "components-editor-notices__snackbar",
    onRemove: removeNotice
  });
}

/***/ }),

/***/ "./packages/settings/src/components/section.tsx":
/*!******************************************************!*\
  !*** ./packages/settings/src/components/section.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Section: () => (/* binding */ Section),
/* harmony export */   SettingsList: () => (/* binding */ SettingsList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hizzlewp/components */ "@hizzlewp/components");
/* harmony import */ var _hizzlewp_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _hizzlewp_history__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @hizzlewp/history */ "@hizzlewp/history");
/* harmony import */ var _hizzlewp_history__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_hizzlewp_history__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _settings_provider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./settings-provider */ "./packages/settings/src/components/settings-provider.tsx");
/* harmony import */ var _integration_section__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./integration-section */ "./packages/settings/src/components/integration-section.tsx");
/* harmony import */ var _settings_group__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./settings-group */ "./packages/settings/src/components/settings-group.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * External dependencies.
 */


/**
 * WordPress dependencies
 */



/**
 * HizzleWP dependencies.
 */



/**
 * Local dependencies
 */




/**
 * Displays the current settings section.
 */

const Section = () => {
  // Whether we are on a small screen.
  const isSmallScreen = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.useViewportMatch)('small', '<');

  // The available setting tabs.
  const {
    settings: tabs
  } = (0,_settings_provider__WEBPACK_IMPORTED_MODULE_5__.useSettings)();

  // The current settings params.
  const {
    params,
    path
  } = (0,_hizzlewp_history__WEBPACK_IMPORTED_MODULE_4__.useRoute)();

  // Prepare the current tab and section.
  const {
    tab,
    section
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    // If no tab is provided, use the first tab.
    if (!params.get('tab')) {
      return {
        tab: tabs[0].name,
        section: tabs[0].sections[0].name
      };
    }

    // Get the current tab.
    const tab = tabs.find(tab => tab.name === params.get('tab'));

    // If no tab is found, use the first tab.
    if (!tab) {
      return {
        tab: tabs[0].name,
        section: tabs[0].sections[0].name
      };
    }

    // If no section is provided, use the first section.
    if (!params.get('section')) {
      return {
        tab: tab.name,
        section: tab.sections[0].name
      };
    }
    const section = tab.sections.find(section => section.name === params.get('section'));

    // If no section is found, use the first section.
    if (!section) {
      return {
        tab: tab.name,
        section: tab.sections[0].name
      };
    }
    return {
      tab: tab.name,
      section: section.name
    };
  }, [params.get('tab'), params.get('section'), tabs]);
  const currentTab = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return tabs.find(_tab => _tab.name === tab);
  }, [tab, tabs]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalVStack, {
      spacing: 4,
      style: {
        padding: 20
      },
      children: [1 < tabs.length && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalSurface, {
        className: "hizzlewp-settings__tabs",
        orientation: isSmallScreen ? 'vertical' : 'horizontal',
        onNavigate: index => (0,_hizzlewp_history__WEBPACK_IMPORTED_MODULE_4__.updatePath)(tabs[index].path),
        as: _wordpress_components__WEBPACK_IMPORTED_MODULE_1__.NavigableMenu,
        borderBottom: true,
        borderTop: true,
        borderLeft: true,
        borderRight: true,
        children: tabs.map(_tab => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          onClick: () => (0,_hizzlewp_history__WEBPACK_IMPORTED_MODULE_4__.updatePath)(_tab.path),
          className: `components-tab-panel__tabs-item ${tab === _tab.name ? 'is-active' : ''}`,
          "aria-selected": tab === _tab.name,
          children: _tab.title
        }, _tab.path))
      }), currentTab && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(SectionsList, {
        ...currentTab,
        currentTab: tab,
        currentSection: section
      })]
    }, path)
  });
};
const SectionsList = ({
  name,
  sections,
  currentTab,
  currentSection
}) => {
  const {
    path
  } = (0,_hizzlewp_history__WEBPACK_IMPORTED_MODULE_4__.useRoute)();
  const section = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return sections.find(section => section.name === currentSection);
  }, [currentTab, currentSection]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__.ErrorBoundary, {
    children: [1 < sections.length && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.NavigableMenu, {
      className: `hizzlewp-settings__sections-menu hizzlewp-settings__sections-menu--${name}`,
      orientation: "horizontal",
      onNavigate: index => (0,_hizzlewp_history__WEBPACK_IMPORTED_MODULE_4__.updatePath)(sections[index].path),
      children: sections.map(section => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: () => (0,_hizzlewp_history__WEBPACK_IMPORTED_MODULE_4__.updatePath)(section.path),
        variant: "tertiary",
        isPressed: path === section.path,
        children: section.title
      }, section.path))
    }), section && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(SettingsList, {
      settings: section.settings
    })]
  });
};
const SettingsList = ({
  settings
}) => {
  const {
    isSaving
  } = (0,_settings_provider__WEBPACK_IMPORTED_MODULE_5__.useSettings)();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalVStack, {
    spacing: 4,
    style: {
      maxWidth: 620,
      opacity: isSaving ? 0.5 : 1,
      pointerEvents: isSaving ? 'none' : 'auto',
      cursor: isSaving ? 'wait' : 'auto'
    },
    children: Object.keys(settings).map(setting => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__.ErrorBoundary, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(SingleSetting, {
        settingKey: setting,
        setting: settings[setting]
      })
    }, setting))
  });
};
const SingleSetting = ({
  setting,
  settingKey
}) => {
  const {
    saved,
    setAttributes
  } = (0,_settings_provider__WEBPACK_IMPORTED_MODULE_5__.useSettings)();
  if ('integration_panel' === setting.el) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_integration_section__WEBPACK_IMPORTED_MODULE_6__.IntegrationSection, {
      ...setting
    });
  }
  if ('settings_group' === setting.el) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_settings_group__WEBPACK_IMPORTED_MODULE_7__.SettingsGroup, {
      ...setting
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__.Setting, {
    settingKey: settingKey,
    setting: setting,
    saved: saved,
    setAttributes: setAttributes
  });
};

/***/ }),

/***/ "./packages/settings/src/components/settings-group.tsx":
/*!*************************************************************!*\
  !*** ./packages/settings/src/components/settings-group.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsGroup: () => (/* binding */ SettingsGroup)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @hizzlewp/components */ "@hizzlewp/components");
/* harmony import */ var _hizzlewp_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _section__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./section */ "./packages/settings/src/components/section.tsx");
/* harmony import */ var _settings_provider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./settings-provider */ "./packages/settings/src/components/settings-provider.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */



/**
 * WordPress dependencies
 */


/**
 * HizzleWP dependencies.
 */


/**
 * Local dependancies.
 */



/**
 * Displays a settings group.
 *
 */

function SettingsGroup({
  id,
  label,
  className,
  settings,
  conditions,
  cardProps
}) {
  const {
    saved
  } = (0,_settings_provider__WEBPACK_IMPORTED_MODULE_5__.useSettings)();
  if (Array.isArray(conditions) && !(0,_hizzlewp_components__WEBPACK_IMPORTED_MODULE_3__.checkConditions)(conditions, saved)) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
    id: id,
    isRounded: false,
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_1__["default"])('hizzlewp-settings__group', className),
    ...(cardProps || {}),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHeading, {
        level: 4,
        size: 16,
        children: label
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_section__WEBPACK_IMPORTED_MODULE_4__.SettingsList, {
        settings: settings
      })
    })]
  });
}

/***/ }),

/***/ "./packages/settings/src/components/settings-provider.tsx":
/*!****************************************************************!*\
  !*** ./packages/settings/src/components/settings-provider.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsProvider: () => (/* binding */ SettingsProvider),
/* harmony export */   useSettings: () => (/* binding */ useSettings)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies.
 */


/**
 * WordPress dependencies.
 */





/**
 * HizzleWP dependencies.
 */

/**
 * Interface for a settings section, e.g, PayPal.
 */

/**
 * Interface for a settings tab, e.g, Payment Methods.
 */

/**
 * Interface for the settings context.
 */

/**
 * Context for settings.
 */
const SettingsContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  option_name: '',
  saved: {},
  settings: [],
  isSaving: false,
  setAttributes: () => {},
  save: () => {}
});

/**
 * Custom hook to access the context.
 */
const useSettings = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(SettingsContext);

/**
 * Provider component for settings.
 */

/**
 * Provider component for settings.
 */
const SettingsProvider = ({
  settings,
  option_name,
  saved,
  children
}) => {
  const [options, setOptions] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(saved);
  const [isSaving, setIsSaving] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const hasPendingChanges = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const {
    createSuccessNotice,
    createErrorNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__.store);

  // Prepare the tabs.
  const tabs = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return Object.keys(settings).map(tabKey => {
      const tab = settings[tabKey];
      const defaultSection = Object.keys(tab.sub_sections)[0];
      const sections = [];
      Object.keys(tab.sub_sections).map(sectionKey => {
        const section = tab.sub_sections[sectionKey];
        sections.push({
          name: sectionKey,
          title: section.label,
          settings: section.settings,
          path: `/${tabKey}/${sectionKey}`
        });
      });
      return {
        name: tabKey,
        title: tab.label,
        path: `/${tabKey}/${defaultSection}`,
        sections
      };
    });
  }, [settings]);

  // Show unsaved changes warning.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    /**
     * Warns the user if there are unsaved changes before leaving the editor.
     *
     * @param {Event} event `beforeunload` event.
     *
     * @return {string | undefined} Warning prompt message, if unsaved changes exist.
     */
    const warnIfUnsavedChanges = event => {
      if (hasPendingChanges.current) {
        event.returnValue = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('You have unsaved changes. If you proceed, they will be lost.');
        return event.returnValue;
      }
    };
    window.addEventListener('beforeunload', warnIfUnsavedChanges);
    return () => {
      window.removeEventListener('beforeunload', warnIfUnsavedChanges);
    };
  }, [hasPendingChanges.current]);

  /**
   * Save the settings.
   */
  const save = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setIsSaving(true);
    hasPendingChanges.current = false;

    // Save the options.
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      path: '/wp/v2/settings',
      method: 'POST',
      data: {
        [option_name]: {
          ...options
        }
      }
    })

    // Update the state on success.
    .then(res => {
      // Display a success message.
      createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Settings saved.'), {
        type: 'snackbar'
      });

      // Update the options.
      if (typeof res === 'object' && res !== null && option_name in res) {
        setOptions(res[option_name]);
      }
      return res;
    })

    // Display an error on failure.
    .catch(err => {
      if (err.message) {
        createErrorNotice(err.message);
      } else {
        createErrorNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('An error occurred while saving.'));
      }
    })

    // Reset the state.
    .finally(() => {
      setIsSaving(false);
    });
  }, [options, setOptions, setIsSaving, createSuccessNotice, createErrorNotice, option_name]);

  /**
   * Sets options attributes.
   */
  const setAttributes = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(attributes => {
    hasPendingChanges.current = true;
    setOptions({
      ...options,
      ...attributes
    });
  }, [options, setOptions]);
  const prepared = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return {
      option_name,
      saved: options,
      settings: tabs,
      isSaving,
      save,
      setAttributes
    };
  }, [option_name, options, tabs, isSaving, save, setAttributes]);
  const style = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return {
      pointerEvents: isSaving ? 'none' : 'auto',
      cursor: isSaving ? 'wait' : 'auto'
    };
  }, [isSaving]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(SettingsContext.Provider, {
    value: prepared,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      style: style,
      children: children
    })
  });
};

/***/ }),

/***/ "./packages/settings/src/components/settings.tsx":
/*!*******************************************************!*\
  !*** ./packages/settings/src/components/settings.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Settings: () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hizzlewp_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hizzlewp/components */ "@hizzlewp/components");
/* harmony import */ var _hizzlewp_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_hizzlewp_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hizzlewp_history__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hizzlewp/history */ "@hizzlewp/history");
/* harmony import */ var _hizzlewp_history__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_hizzlewp_history__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _section__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./section */ "./packages/settings/src/components/section.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */


/**
 * HizzleWP dependencies.
 */



/**
 * Local dependencies
 */


const element = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_section__WEBPACK_IMPORTED_MODULE_3__.Section, {});
const Settings = () => {
  // Define routes.
  const routes = [{
    path: '/',
    element,
    children: [{
      path: '/:tab',
      element,
      children: [{
        path: '/:tab/:section',
        element
      }]
    }]
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_hizzlewp_components__WEBPACK_IMPORTED_MODULE_1__.ErrorBoundary, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_hizzlewp_history__WEBPACK_IMPORTED_MODULE_2__.Router, {
      routes: routes
    })
  });
};

/***/ }),

/***/ "./packages/settings/src/components/use-save-button-props.ts":
/*!*******************************************************************!*\
  !*** ./packages/settings/src/components/use-save-button-props.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSaveButtonProps: () => (/* binding */ useSaveButtonProps)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _settings_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings-provider */ "./packages/settings/src/components/settings-provider.tsx");
/**
 * WordPress dependencies
 */

/**
 * Local dependancies.
 */

const useSaveButtonProps = () => {
  const {
    save,
    isSaving
  } = (0,_settings_provider__WEBPACK_IMPORTED_MODULE_1__.useSettings)();
  return {
    variant: 'primary',
    text: isSaving ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Saving...', 'newsletter-optin-box') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Save Settings', 'newsletter-optin-box'),
    onClick: save,
    isBusy: isSaving,
    disabled: isSaving
  };
};

/***/ }),

/***/ "@hizzlewp/components":
/*!******************************************!*\
  !*** external ["hizzlewp","components"] ***!
  \******************************************/
/***/ ((module) => {

module.exports = window["hizzlewp"]["components"];

/***/ }),

/***/ "@hizzlewp/history":
/*!***************************************!*\
  !*** external ["hizzlewp","history"] ***!
  \***************************************/
/***/ ((module) => {

module.exports = window["hizzlewp"]["history"];

/***/ }),

/***/ "@hizzlewp/interface":
/*!*****************************************!*\
  !*** external ["hizzlewp","interface"] ***!
  \*****************************************/
/***/ ((module) => {

module.exports = window["hizzlewp"]["interface"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/notices":
/*!*********************************!*\
  !*** external ["wp","notices"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["notices"];

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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************************!*\
  !*** ./packages/settings/src/index.tsx ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/layout */ "./packages/settings/src/components/layout.tsx");
/* harmony import */ var _components_settings_provider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/settings-provider */ "./packages/settings/src/components/settings-provider.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies.
 */




/**
 * Internal dependencies.
 */



const {
  option_name,
  saved,
  settings,
  ...rest
} = window.hizzleWPSettings?.data || {};
_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  const target = document.getElementById('hizzlewp-settings__app');

  // Abort if the target element is not found.
  if (!target || !settings) {
    return;
  }
  const App = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SlotFillProvider, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_settings_provider__WEBPACK_IMPORTED_MODULE_4__.SettingsProvider, {
      option_name: option_name || 'hizzlewp_settings',
      settings: settings || {},
      saved: saved || {},
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_layout__WEBPACK_IMPORTED_MODULE_3__["default"], {
        ...rest
      })
    })
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createRoot)(target).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(App, {}));
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map