/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}


/***/ }),

/***/ "./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createCache)
/* harmony export */ });
/* harmony import */ var _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/sheet */ "./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Middleware.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! stylis */ "./node_modules/stylis/src/Parser.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");





var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
  var previous = 0;
  var character = 0;

  while (true) {
    previous = character;
    character = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)(); // &\f

    if (previous === 38 && character === 12) {
      points[index] = 1;
    }

    if ((0,stylis__WEBPACK_IMPORTED_MODULE_3__.token)(character)) {
      break;
    }

    (0,stylis__WEBPACK_IMPORTED_MODULE_3__.next)();
  }

  return (0,stylis__WEBPACK_IMPORTED_MODULE_3__.slice)(begin, stylis__WEBPACK_IMPORTED_MODULE_3__.position);
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch ((0,stylis__WEBPACK_IMPORTED_MODULE_3__.token)(character)) {
      case 0:
        // &\f
        if (character === 38 && (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += identifierWithPointTracking(stylis__WEBPACK_IMPORTED_MODULE_3__.position - 1, points, index);
        break;

      case 2:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_3__.delimit)(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.peek)() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += (0,stylis__WEBPACK_IMPORTED_MODULE_4__.from)(character);
    }
  } while (character = (0,stylis__WEBPACK_IMPORTED_MODULE_3__.next)());

  return parsed;
};

var getRules = function getRules(value, points) {
  return (0,stylis__WEBPACK_IMPORTED_MODULE_3__.dealloc)(toRules((0,stylis__WEBPACK_IMPORTED_MODULE_3__.alloc)(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  element.length < 1) {
    return;
  }

  var value = element.value;
  var parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};
var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule' || cache.compat) return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses) {
      var isNested = !!element.parent; // in nested rules comments become children of the "auto-inserted" rule and that's always the `element.parent`
      //
      // considering this input:
      // .a {
      //   .b /* comm */ {}
      //   color: hotpink;
      // }
      // we get output corresponding to this:
      // .a {
      //   & {
      //     /* comm */
      //     color: hotpink;
      //   }
      //   .b {}
      // }

      var commentContainer = isNested ? element.parent.children : // global rule at the root level
      children;

      for (var i = commentContainer.length - 1; i >= 0; i--) {
        var node = commentContainer[i];

        if (node.line < element.line) {
          break;
        } // it is quite weird but comments are *usually* put at `column: element.column - 1`
        // so we seek *from the end* for the node that is earlier than the rule's `element` and check that
        // this will also match inputs like this:
        // .a {
        //   /* comm */
        //   .b {}
        // }
        //
        // but that is fine
        //
        // it would be the easiest to change the placement of the comment to be the first child of the rule:
        // .a {
        //   .b { /* comm */ }
        // }
        // with such inputs we wouldn't have to search for the comment at all
        // TODO: consider changing this comment placement in the next major version


        if (node.column < element.column) {
          if (isIgnoringComment(node)) {
            return;
          }

          break;
        }
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

/* eslint-disable no-fallthrough */

function prefix(value, length) {
  switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.hash)(value, length)) {
    // color-adjust
    case 5103:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'print-' + value + value;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)

    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921: // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break

    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005: // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,

    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855: // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)

    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + value;
    // appearance, user-select, transform, hyphens, text-size-adjust

    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MOZ + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + value + value;
    // flex, flex-direction

    case 6828:
    case 4268:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + value + value;
    // order

    case 6165:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-' + value + value;
    // align-items

    case 5187:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(\w+).+(:[^]+)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'box-$1$2' + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-$1$2') + value;
    // align-self

    case 5443:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-item-' + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /flex-|-self/, '') + value;
    // align-content

    case 4675:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-line-pack' + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /align-content|flex-|-self/, '') + value;
    // flex-shrink

    case 5548:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, 'shrink', 'negative') + value;
    // flex-basis

    case 5292:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, 'basis', 'preferred-size') + value;
    // flex-grow

    case 6060:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'box-' + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, '-grow', '') + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, 'grow', 'positive') + value;
    // transition

    case 4554:
      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /([^-])(transform)/g, '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$2') + value;
    // cursor

    case 6187:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(zoom-|grab)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$1'), /(image-set)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$1'), value, '') + value;
    // background, background-image

    case 5495:
    case 3959:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(image-set\([^]*)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$1' + '$`$1');
    // justify-content

    case 4968:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)((0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(.+:)(flex-)?(.*)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'box-pack:$3' + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + value;
    // (margin|padding)-inline-(start|end)

    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(.+)-inline(.+)/, stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$1$2') + value;
    // (min|max)?(width|height|inline-size|block-size)

    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      // stretch, max-content, min-content, fill-available
      if ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.strlen)(value) - 1 - length > 6) switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 1)) {
        // (m)ax-content, (m)in-content
        case 109:
          // -
          if ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 4) !== 45) break;
        // (f)ill-available, (f)it-content

        case 102:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$2-$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.MOZ + ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value;
        // (s)tretch

        case 115:
          return ~(0,stylis__WEBPACK_IMPORTED_MODULE_4__.indexof)(value, 'stretch') ? prefix((0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, 'stretch', 'fill-available'), length) + value : value;
      }
      break;
    // position: sticky

    case 4949:
      // (s)ticky?
      if ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 1) !== 115) break;
    // display: (flex|inline-flex)

    case 6444:
      switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, (0,stylis__WEBPACK_IMPORTED_MODULE_4__.strlen)(value) - 3 - (~(0,stylis__WEBPACK_IMPORTED_MODULE_4__.indexof)(value, '!important') && 10))) {
        // stic(k)y
        case 107:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, ':', ':' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT) + value;
        // (inline-)?fl(e)x

        case 101:
          return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /(.+:)([^;!]+)(;|!.+)?/, '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + '$2$3' + '$1' + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + '$2box$3') + value;
      }

      break;
    // writing-mode

    case 5936:
      switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.charat)(value, length + 11)) {
        // vertical-l(r)
        case 114:
          return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value;
        // vertical-r(l)

        case 108:
          return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value;
        // horizontal(-)tb

        case 45:
          return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value;
      }

      return stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + value + stylis__WEBPACK_IMPORTED_MODULE_5__.MS + value + value;
  }

  return value;
}

var prefixer = function prefixer(element, index, children, callback) {
  if (element.length > -1) if (!element["return"]) switch (element.type) {
    case stylis__WEBPACK_IMPORTED_MODULE_5__.DECLARATION:
      element["return"] = prefix(element.value, element.length);
      break;

    case stylis__WEBPACK_IMPORTED_MODULE_5__.KEYFRAMES:
      return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
        value: (0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(element.value, '@', '@' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT)
      })], callback);

    case stylis__WEBPACK_IMPORTED_MODULE_5__.RULESET:
      if (element.length) return (0,stylis__WEBPACK_IMPORTED_MODULE_4__.combine)(element.props, function (value) {
        switch ((0,stylis__WEBPACK_IMPORTED_MODULE_4__.match)(value, /(::plac\w+|:read-\w+)/)) {
          // :read-(only|write)
          case ':read-only':
          case ':read-write':
            return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /:(read-\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_5__.MOZ + '$1')]
            })], callback);
          // :placeholder

          case '::placeholder':
            return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)([(0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /:(plac\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_5__.WEBKIT + 'input-$1')]
            }), (0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /:(plac\w+)/, ':' + stylis__WEBPACK_IMPORTED_MODULE_5__.MOZ + '$1')]
            }), (0,stylis__WEBPACK_IMPORTED_MODULE_3__.copy)(element, {
              props: [(0,stylis__WEBPACK_IMPORTED_MODULE_4__.replace)(value, /:(plac\w+)/, stylis__WEBPACK_IMPORTED_MODULE_5__.MS + 'input-$1')]
            })], callback);
        }

        return '';
      });
  }
};

var defaultStylisPlugins = [prefixer];
var getSourceMap;

{
  var sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;

  getSourceMap = function getSourceMap(styles) {
    var matches = styles.match(sourceMapPattern);
    if (!matches) return;
    return matches[matches.length - 1];
  };
}

var createCache = function createCache(options) {
  var key = options.key;

  if (!key) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if (key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }

      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  {
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {};
  var container;
  var nodesToHydrate = [];

  {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' ');

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  {
    var currentSheet;
    var finalizingPlugins = [stylis__WEBPACK_IMPORTED_MODULE_6__.stringify, function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== stylis__WEBPACK_IMPORTED_MODULE_5__.COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } ];
    var serializer = (0,stylis__WEBPACK_IMPORTED_MODULE_7__.middleware)(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return (0,stylis__WEBPACK_IMPORTED_MODULE_6__.serialize)((0,stylis__WEBPACK_IMPORTED_MODULE_8__.compile)(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if (getSourceMap) {
        var sourceMap = getSourceMap(serialized.styles);

        if (sourceMap) {
          currentSheet = {
            insert: function insert(rule) {
              sheet.insert(rule + sourceMap);
            }
          };
        }
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }

  var cache = {
    key: key,
    sheet: new _emotion_sheet__WEBPACK_IMPORTED_MODULE_0__.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend,
      insertionPoint: options.insertionPoint
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};




/***/ }),

/***/ "./node_modules/@emotion/hash/dist/emotion-hash.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@emotion/hash/dist/emotion-hash.esm.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ murmur2)
/* harmony export */ });
/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}




/***/ }),

/***/ "./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isPropValid)
/* harmony export */ });
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");


// eslint-disable-next-line no-undef
var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_0__["default"])(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);




/***/ }),

/***/ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memoize)
/* harmony export */ });
function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}




/***/ }),

/***/ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hoistNonReactStatics)
/* harmony export */ });
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hoist-non-react-statics */ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js");
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__);


// this file isolates this package that is not tree-shakeable
// and if this module doesn't actually contain any logic of its own
// then Rollup just use 'hoist-non-react-statics' directly in other chunks

var hoistNonReactStatics = (function (targetComponent, sourceComponent) {
  return hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default()(targetComponent, sourceComponent);
});




/***/ }),

/***/ "./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ CacheProvider),
/* harmony export */   E: () => (/* binding */ Emotion$1),
/* harmony export */   T: () => (/* binding */ ThemeContext),
/* harmony export */   _: () => (/* binding */ __unsafe_useEmotionCache),
/* harmony export */   a: () => (/* binding */ ThemeProvider),
/* harmony export */   b: () => (/* binding */ withTheme),
/* harmony export */   c: () => (/* binding */ createEmotionProps),
/* harmony export */   h: () => (/* binding */ hasOwn),
/* harmony export */   u: () => (/* binding */ useTheme),
/* harmony export */   w: () => (/* binding */ withEmotionCache)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/cache */ "./node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/weak-memoize */ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js");
/* harmony import */ var _isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js */ "./node_modules/@emotion/react/_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.development.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js");
/* harmony import */ var _emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @emotion/use-insertion-effect-with-fallbacks */ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js");










var EmotionCacheContext = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_0__.createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */(0,_emotion_cache__WEBPACK_IMPORTED_MODULE_1__["default"])({
  key: 'css'
}) : null);

{
  EmotionCacheContext.displayName = 'EmotionCacheContext';
}

var CacheProvider = EmotionCacheContext.Provider;
var __unsafe_useEmotionCache = function useEmotionCache() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
};

var withEmotionCache = function withEmotionCache(func) {
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, ref) {
    // the cache will never be null in the browser
    var cache = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

var ThemeContext = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_0__.createContext({});

{
  ThemeContext.displayName = 'EmotionThemeContext';
}

var useTheme = function useTheme() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);
};

var getTheme = function getTheme(outerTheme, theme) {
  if (typeof theme === 'function') {
    var mergedTheme = theme(outerTheme);

    if ((mergedTheme == null || typeof mergedTheme !== 'object' || Array.isArray(mergedTheme))) {
      throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
    }

    return mergedTheme;
  }

  if ((theme == null || typeof theme !== 'object' || Array.isArray(theme))) {
    throw new Error('[ThemeProvider] Please make your theme prop a plain object');
  }

  return (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({}, outerTheme, theme);
};

var createCacheWithTheme = /* #__PURE__ */(0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (outerTheme) {
  return (0,_emotion_weak_memoize__WEBPACK_IMPORTED_MODULE_3__["default"])(function (theme) {
    return getTheme(outerTheme, theme);
  });
});
var ThemeProvider = function ThemeProvider(props) {
  var theme = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);

  if (props.theme !== theme) {
    theme = createCacheWithTheme(theme)(props.theme);
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ThemeContext.Provider, {
    value: theme
  }, props.children);
};
function withTheme(Component) {
  var componentName = Component.displayName || Component.name || 'Component';
  var WithTheme = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(function render(props, ref) {
    var theme = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_2__["default"])({
      theme: theme,
      ref: ref
    }, props));
  });
  WithTheme.displayName = "WithTheme(" + componentName + ")";
  return (0,_isolated_hnrs_dist_emotion_react_isolated_hnrs_browser_development_esm_js__WEBPACK_IMPORTED_MODULE_7__["default"])(WithTheme, Component);
}

var hasOwn = {}.hasOwnProperty;

var getLastPart = function getLastPart(functionName) {
  // The match may be something like 'Object.createEmotionProps' or
  // 'Loader.prototype.render'
  var parts = functionName.split('.');
  return parts[parts.length - 1];
};

var getFunctionNameFromStackTraceLine = function getFunctionNameFromStackTraceLine(line) {
  // V8
  var match = /^\s+at\s+([A-Za-z0-9$.]+)\s/.exec(line);
  if (match) return getLastPart(match[1]); // Safari / Firefox

  match = /^([A-Za-z0-9$.]+)@/.exec(line);
  if (match) return getLastPart(match[1]);
  return undefined;
};

var internalReactFunctionNames = /* #__PURE__ */new Set(['renderWithHooks', 'processChild', 'finishClassComponent', 'renderToString']); // These identifiers come from error stacks, so they have to be valid JS
// identifiers, thus we only need to replace what is a valid character for JS,
// but not for CSS.

var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
  return identifier.replace(/\$/g, '-');
};

var getLabelFromStackTrace = function getLabelFromStackTrace(stackTrace) {
  if (!stackTrace) return undefined;
  var lines = stackTrace.split('\n');

  for (var i = 0; i < lines.length; i++) {
    var functionName = getFunctionNameFromStackTraceLine(lines[i]); // The first line of V8 stack traces is just "Error"

    if (!functionName) continue; // If we reach one of these, we have gone too far and should quit

    if (internalReactFunctionNames.has(functionName)) break; // The component name is the first function in the stack that starts with an
    // uppercase letter

    if (/^[A-Z]/.test(functionName)) return sanitizeIdentifier(functionName);
  }

  return undefined;
};

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
var createEmotionProps = function createEmotionProps(type, props) {
  if (typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + props.css + "`");
  }

  var newProps = {};

  for (var _key in props) {
    if (hasOwn.call(props, _key)) {
      newProps[_key] = props[_key];
    }
  }

  newProps[typePropName] = type; // Runtime labeling is an opt-in feature because:
  // - It causes hydration warnings when using Safari and SSR
  // - It can degrade performance if there are a huge number of elements
  //
  // Even if the flag is set, we still don't compute the label if it has already
  // been determined by the Babel plugin.

  if (typeof globalThis !== 'undefined' && !!globalThis.EMOTION_RUNTIME_AUTO_LABEL && !!props.css && (typeof props.css !== 'object' || !('name' in props.css) || typeof props.css.name !== 'string' || props.css.name.indexOf('-') === -1)) {
    var label = getLabelFromStackTrace(new Error().stack);
    if (label) newProps[labelPropName] = label;
  }

  return newProps;
};

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.registerStyles)(cache, serialized, isStringTag);
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_6__.useInsertionEffectAlwaysWithSyncFallback)(function () {
    return (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.insertStyles)(cache, serialized, isStringTag);
  });

  return null;
};

var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css; // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var WrappedComponent = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_4__.getRegisteredStyles)(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_5__.serializeStyles)(registeredStyles, undefined, react__WEBPACK_IMPORTED_MODULE_0__.useContext(ThemeContext));

  if (serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_5__.serializeStyles)([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var _key2 in props) {
    if (hasOwn.call(props, _key2) && _key2 !== 'css' && _key2 !== typePropName && (_key2 !== labelPropName)) {
      newProps[_key2] = props[_key2];
    }
  }

  newProps.className = className;

  if (ref) {
    newProps.ref = ref;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Insertion, {
    cache: cache,
    serialized: serialized,
    isStringTag: typeof WrappedComponent === 'string'
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(WrappedComponent, newProps));
});

{
  Emotion.displayName = 'EmotionCssPropInternal';
}

var Emotion$1 = Emotion;




/***/ }),

/***/ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serializeStyles: () => (/* binding */ serializeStyles)
/* harmony export */ });
/* harmony import */ var _emotion_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/hash */ "./node_modules/@emotion/hash/dist/emotion-hash.esm.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/unitless */ "./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js");
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");




var isDevelopment = true;

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_2__["default"])(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_emotion_unitless__WEBPACK_IMPORTED_MODULE_1__["default"][key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

{
  var contentValuePattern = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var noComponentSelectorMessage = 'Component selectors can only be used in conjunction with ' + '@emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware ' + 'compiler transform.';

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  var componentSelector = interpolation;

  if (componentSelector.__emotion_styles !== undefined) {
    if (String(componentSelector) === 'NO_COMPONENT_SELECTOR') {
      throw new Error(noComponentSelectorMessage);
    }

    return componentSelector;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        var keyframes = interpolation;

        if (keyframes.anim === 1) {
          cursor = {
            name: keyframes.name,
            styles: keyframes.styles,
            next: cursor
          };
          return keyframes.name;
        }

        var serializedStyles = interpolation;

        if (serializedStyles.styles !== undefined) {
          var next = serializedStyles.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = serializedStyles.styles + ";";
          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        } else {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (_match, _p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error("`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\nInstead of doing this:\n\n" + [].concat(matched, ["`" + replaced + "`"]).join('\n') + "\n\nYou should wrap it with `css` like this:\n\ncss`" + replaced + "`");
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  var asString = interpolation;

  if (registered == null) {
    return asString;
  }

  var cached = registered[asString];
  return cached !== undefined ? cached : asString;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var key in obj) {
      var value = obj[key];

      if (typeof value !== 'object') {
        var asString = value;

        if (registered != null && registered[asString] !== undefined) {
          string += key + "{" + registered[asString] + "}";
        } else if (isProcessableValue(asString)) {
          string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
        }
      } else {
        if (key === 'NO_COMPONENT_SELECTOR' && isDevelopment) {
          throw new Error(noComponentSelectorMessage);
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if (key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g; // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list

var cursor;
function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    var asTemplateStringsArr = strings;

    if (asTemplateStringsArr[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += asTemplateStringsArr[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      var templateStringsArr = strings;

      if (templateStringsArr[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += templateStringsArr[i];
    }
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + match[1];
  }

  var name = (0,_emotion_hash__WEBPACK_IMPORTED_MODULE_0__["default"])(styles) + identifierName;

  {
    var devStyles = {
      name: name,
      styles: styles,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
    return devStyles;
  }
}




/***/ }),

/***/ "./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@emotion/sheet/dist/emotion-sheet.development.esm.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StyleSheet: () => (/* binding */ StyleSheet)
/* harmony export */ });
var isDevelopment = true;

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/

function sheetForTag(tag) {
  if (tag.sheet) {
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  } // this function should always return with a value
  // TS can't understand it though so we make it stop complaining here


  return undefined;
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  // Using Node instead of HTMLElement since container may be a ShadowRoot
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        if (_this.insertionPoint) {
          before = _this.insertionPoint.nextSibling;
        } else if (_this.prepend) {
          before = _this.container.firstChild;
        } else {
          before = _this.before;
        }
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? !isDevelopment : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.insertionPoint = options.insertionPoint;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }

      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if (!/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear|-ms-expand|-ms-reveal){/.test(rule)) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    this.tags.forEach(function (tag) {
      var _tag$parentNode;

      return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;

    {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();




/***/ }),

/***/ "./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.development.esm.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.development.esm.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createStyled)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js");
/* harmony import */ var _emotion_serialize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/serialize */ "./node_modules/@emotion/serialize/dist/emotion-serialize.development.esm.js");
/* harmony import */ var _emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/use-insertion-effect-with-fallbacks */ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js");
/* harmony import */ var _emotion_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/utils */ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/is-prop-valid */ "./node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js");








var isDevelopment = true;

var testOmitPropsOnStringTag = _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_5__["default"];

var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
  return key !== 'theme';
};

var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
  return typeof tag === 'string' && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};
var composeShouldForwardProps = function composeShouldForwardProps(tag, options, isReal) {
  var shouldForwardProp;

  if (options) {
    var optionsShouldForwardProp = options.shouldForwardProp;
    shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function (propName) {
      return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
    } : optionsShouldForwardProp;
  }

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp;
  }

  return shouldForwardProp;
};

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";

var Insertion = function Insertion(_ref) {
  var cache = _ref.cache,
      serialized = _ref.serialized,
      isStringTag = _ref.isStringTag;
  (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_3__.registerStyles)(cache, serialized, isStringTag);
  (0,_emotion_use_insertion_effect_with_fallbacks__WEBPACK_IMPORTED_MODULE_2__.useInsertionEffectAlwaysWithSyncFallback)(function () {
    return (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_3__.insertStyles)(cache, serialized, isStringTag);
  });

  return null;
};

var createStyled = function createStyled(tag, options) {
  {
    if (tag === undefined) {
      throw new Error('You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.');
    }
  }

  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;
  var identifierName;
  var targetClassName;

  if (options !== undefined) {
    identifierName = options.label;
    targetClassName = options.target;
  }

  var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
  var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
  var shouldUseAs = !defaultShouldForwardProp('as');
  return function () {
    // eslint-disable-next-line prefer-rest-params
    var args = arguments;
    var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

    if (identifierName !== undefined) {
      styles.push("label:" + identifierName + ";");
    }

    if (args[0] == null || args[0].raw === undefined) {
      // eslint-disable-next-line prefer-spread
      styles.push.apply(styles, args);
    } else {
      var templateStringsArr = args[0];

      if (templateStringsArr[0] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles.push(templateStringsArr[0]);
      var len = args.length;
      var i = 1;

      for (; i < len; i++) {
        if (templateStringsArr[i] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
        }

        styles.push(args[i], templateStringsArr[i]);
      }
    }

    var Styled = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.w)(function (props, cache, ref) {
      var FinalTag = shouldUseAs && props.as || baseTag;
      var className = '';
      var classInterpolations = [];
      var mergedProps = props;

      if (props.theme == null) {
        mergedProps = {};

        for (var key in props) {
          mergedProps[key] = props[key];
        }

        mergedProps.theme = react__WEBPACK_IMPORTED_MODULE_4__.useContext(_emotion_react__WEBPACK_IMPORTED_MODULE_6__.T);
      }

      if (typeof props.className === 'string') {
        className = (0,_emotion_utils__WEBPACK_IMPORTED_MODULE_3__.getRegisteredStyles)(cache.registered, classInterpolations, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }

      var serialized = (0,_emotion_serialize__WEBPACK_IMPORTED_MODULE_1__.serializeStyles)(styles.concat(classInterpolations), cache.registered, mergedProps);
      className += cache.key + "-" + serialized.name;

      if (targetClassName !== undefined) {
        className += " " + targetClassName;
      }

      var finalShouldForwardProp = shouldUseAs && shouldForwardProp === undefined ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
      var newProps = {};

      for (var _key in props) {
        if (shouldUseAs && _key === 'as') continue;

        if (finalShouldForwardProp(_key)) {
          newProps[_key] = props[_key];
        }
      }

      newProps.className = className;

      if (ref) {
        newProps.ref = ref;
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(react__WEBPACK_IMPORTED_MODULE_4__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(Insertion, {
        cache: cache,
        serialized: serialized,
        isStringTag: typeof FinalTag === 'string'
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(FinalTag, newProps));
    });
    Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";
    Styled.defaultProps = tag.defaultProps;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles;
    Styled.__emotion_forwardProp = shouldForwardProp;
    Object.defineProperty(Styled, 'toString', {
      value: function value() {
        if (targetClassName === undefined && isDevelopment) {
          return 'NO_COMPONENT_SELECTOR';
        }

        return "." + targetClassName;
      }
    });

    Styled.withComponent = function (nextTag, nextOptions) {
      var newStyled = createStyled(nextTag, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, options, nextOptions, {
        shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
      }));
      return newStyled.apply(void 0, styles);
    };

    return Styled;
  };
};




/***/ }),

/***/ "./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@emotion/unitless/dist/emotion-unitless.esm.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ unitlessKeys)
/* harmony export */ });
var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  scale: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};




/***/ }),

/***/ "./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js":
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js ***!
  \***********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useInsertionEffectAlwaysWithSyncFallback: () => (/* binding */ useInsertionEffectAlwaysWithSyncFallback),
/* harmony export */   useInsertionEffectWithLayoutFallback: () => (/* binding */ useInsertionEffectWithLayoutFallback)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var syncFallback = function syncFallback(create) {
  return create();
};

var useInsertionEffect = react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] ? react__WEBPACK_IMPORTED_MODULE_0__['useInsertion' + 'Effect'] : false;
var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
var useInsertionEffectWithLayoutFallback = useInsertionEffect || react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect;




/***/ }),

/***/ "./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRegisteredStyles: () => (/* binding */ getRegisteredStyles),
/* harmony export */   insertStyles: () => (/* binding */ insertStyles),
/* harmony export */   registerStyles: () => (/* binding */ registerStyles)
/* harmony export */ });
var isBrowser = true;

function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else if (className) {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var registerStyles = function registerStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false ) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }
};
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  registerStyles(cache, serialized, isStringTag);
  var className = cache.key + "-" + serialized.name;

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};




/***/ }),

/***/ "./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ weakMemoize)
/* harmony export */ });
var weakMemoize = function weakMemoize(func) {
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // Use non-null assertion because we just checked that the cache `has` it
      // This allows us to remove `undefined` from the return value
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};




/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/calendar.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/calendar.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const calendar = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm.5 16c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5V7h15v12zM9 10H7v2h2v-2zm0 4H7v2h2v-2zm4-4h-2v2h2v-2zm4 0h-2v2h2v-2zm-4 4h-2v2h2v-2zm4 0h-2v2h2v-2z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calendar);
//# sourceMappingURL=calendar.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/lock.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/lock.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const lock = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M17 10h-1.2V7c0-2.1-1.7-3.8-3.8-3.8-2.1 0-3.8 1.7-3.8 3.8v3H7c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h10c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1zm-2.8 0H9.8V7c0-1.2 1-2.2 2.2-2.2s2.2 1 2.2 2.2v3z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (lock);
//# sourceMappingURL=lock.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/next.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/next.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const next = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M6.6 6L5.4 7l4.5 5-4.5 5 1.1 1 5.5-6-5.4-6zm6 0l-1.1 1 4.5 5-4.5 5 1.1 1 5.5-6-5.5-6z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next);
//# sourceMappingURL=next.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/tip.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/tip.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const tip = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M12 15.8c-3.7 0-6.8-3-6.8-6.8s3-6.8 6.8-6.8c3.7 0 6.8 3 6.8 6.8s-3.1 6.8-6.8 6.8zm0-12C9.1 3.8 6.8 6.1 6.8 9s2.4 5.2 5.2 5.2c2.9 0 5.2-2.4 5.2-5.2S14.9 3.8 12 3.8zM8 17.5h8V19H8zM10 20.5h4V22h-4z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tip);
//# sourceMappingURL=tip.js.map

/***/ }),

/***/ "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var reactIs = __webpack_require__(/*! react-is */ "./node_modules/hoist-non-react-statics/node_modules/react-is/index.js");

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ }),

/***/ "./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/hoist-non-react-statics/node_modules/react-is/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/node_modules/react-is/index.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/stylis/src/Enum.js":
/*!*****************************************!*\
  !*** ./node_modules/stylis/src/Enum.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHARSET: () => (/* binding */ CHARSET),
/* harmony export */   COMMENT: () => (/* binding */ COMMENT),
/* harmony export */   COUNTER_STYLE: () => (/* binding */ COUNTER_STYLE),
/* harmony export */   DECLARATION: () => (/* binding */ DECLARATION),
/* harmony export */   DOCUMENT: () => (/* binding */ DOCUMENT),
/* harmony export */   FONT_FACE: () => (/* binding */ FONT_FACE),
/* harmony export */   FONT_FEATURE_VALUES: () => (/* binding */ FONT_FEATURE_VALUES),
/* harmony export */   IMPORT: () => (/* binding */ IMPORT),
/* harmony export */   KEYFRAMES: () => (/* binding */ KEYFRAMES),
/* harmony export */   LAYER: () => (/* binding */ LAYER),
/* harmony export */   MEDIA: () => (/* binding */ MEDIA),
/* harmony export */   MOZ: () => (/* binding */ MOZ),
/* harmony export */   MS: () => (/* binding */ MS),
/* harmony export */   NAMESPACE: () => (/* binding */ NAMESPACE),
/* harmony export */   PAGE: () => (/* binding */ PAGE),
/* harmony export */   RULESET: () => (/* binding */ RULESET),
/* harmony export */   SUPPORTS: () => (/* binding */ SUPPORTS),
/* harmony export */   VIEWPORT: () => (/* binding */ VIEWPORT),
/* harmony export */   WEBKIT: () => (/* binding */ WEBKIT)
/* harmony export */ });
var MS = '-ms-'
var MOZ = '-moz-'
var WEBKIT = '-webkit-'

var COMMENT = 'comm'
var RULESET = 'rule'
var DECLARATION = 'decl'

var PAGE = '@page'
var MEDIA = '@media'
var IMPORT = '@import'
var CHARSET = '@charset'
var VIEWPORT = '@viewport'
var SUPPORTS = '@supports'
var DOCUMENT = '@document'
var NAMESPACE = '@namespace'
var KEYFRAMES = '@keyframes'
var FONT_FACE = '@font-face'
var COUNTER_STYLE = '@counter-style'
var FONT_FEATURE_VALUES = '@font-feature-values'
var LAYER = '@layer'


/***/ }),

/***/ "./node_modules/stylis/src/Middleware.js":
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Middleware.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   middleware: () => (/* binding */ middleware),
/* harmony export */   namespace: () => (/* binding */ namespace),
/* harmony export */   prefixer: () => (/* binding */ prefixer),
/* harmony export */   rulesheet: () => (/* binding */ rulesheet)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var _Serializer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Serializer.js */ "./node_modules/stylis/src/Serializer.js");
/* harmony import */ var _Prefixer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Prefixer.js */ "./node_modules/stylis/src/Prefixer.js");






/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(collection)

	return function (element, index, children, callback) {
		var output = ''

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || ''

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element)
	}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer (element, index, children, callback) {
	if (element.length > -1)
		if (!element.return)
			switch (element.type) {
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.DECLARATION: element.return = (0,_Prefixer_js__WEBPACK_IMPORTED_MODULE_2__.prefix)(element.value, element.length, children)
					return
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES:
					return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {value: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(element.value, '@', '@' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT)})], callback)
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET:
					if (element.length)
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.combine)(element.props, function (value) {
							switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /(::plac\w+|:read-\w+)/)) {
								// :read-(only|write)
								case ':read-only': case ':read-write':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(read-\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]})], callback)
								// :placeholder
								case '::placeholder':
									return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'input-$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]}),
										(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'input-$1')]})
									], callback)
							}

							return ''
						})
			}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 */
function namespace (element) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET:
			element.props = element.props.map(function (value) {
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.combine)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.tokenize)(value), function (value, index, children) {
					switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 0)) {
						// \f
						case 12:
							return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(value, 1, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value))
						// \0 ( + > ~
						case 0: case 40: case 43: case 62: case 126:
							return value
						// :
						case 58:
							if (children[++index] === 'global')
								children[index] = '', children[++index] = '\f' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(children[index], index = 1, -1)
						// \s
						case 32:
							return index === 1 ? '' : value
						default:
							switch (index) {
								case 0: element = value
									return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children) > 1 ? '' : value
								case index = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children) - 1: case 2:
									return index === 2 ? value + element + element : value + element
								default:
									return value
							}
					}
				})
			})
	}
}


/***/ }),

/***/ "./node_modules/stylis/src/Parser.js":
/*!*******************************************!*\
  !*** ./node_modules/stylis/src/Parser.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   comment: () => (/* binding */ comment),
/* harmony export */   compile: () => (/* binding */ compile),
/* harmony export */   declaration: () => (/* binding */ declaration),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   ruleset: () => (/* binding */ ruleset)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tokenizer.js */ "./node_modules/stylis/src/Tokenizer.js");




/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.dealloc)(parse('', null, null, null, [''], value = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.alloc)(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0
	var offset = 0
	var length = pseudo
	var atrule = 0
	var property = 0
	var previous = 0
	var variable = 1
	var scanning = 1
	var ampersand = 1
	var character = 0
	var type = ''
	var props = rules
	var children = rulesets
	var reference = rule
	var characters = type

	while (scanning)
		switch (previous = character, character = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)()) {
			// (
			case 40:
				if (previous != 108 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, length - 1) == 58) {
					if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)(character), '&', '&\f'), '&\f') != -1)
						ampersand = -1
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)(character)
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.whitespace)(previous)
				break
			// \
			case 92:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.escaping)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)() - 1, 7)
				continue
			// /
			case 47:
				switch ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)()) {
					case 42: case 47:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(comment((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.commenter)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)(), (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)()), root, parent), declarations)
						break
					default:
						characters += '/'
				}
				break
			// {
			case 123 * variable:
				points[index++] = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) * ampersand
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0
					// ;
					case 59 + offset: if (ampersand == -1) characters = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, /\f/g, '')
						if (property > 0 && ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - length))
							(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(property > 32 ? declaration(characters + ';', rule, parent, length - 1) : declaration((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, ' ', '') + ';', rule, parent, length - 2), declarations)
						break
					// @ ;
					case 59: characters += ';'
					// { rule/at-rule
					default:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets)

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children)
							else
								switch (atrule === 99 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse(value, reference, reference, rule && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children)
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children)
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo
				break
			// :
			case 58:
				length = 1 + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters), property = previous
			default:
				if (variable < 1)
					if (character == 123)
						--variable
					else if (character == 125 && variable++ == 0 && (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.prev)() == 125)
						continue

				switch (characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1)
						break
					// ,
					case 44:
						points[index++] = ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - 1) * ampersand, ampersand = 1
						break
					// @
					case 64:
						// -
						if ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)() === 45)
							characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)())

						atrule = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)(), offset = length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(type = characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.identifier)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)())), character++
						break
					// -
					case 45:
						if (previous === 45 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) == 2)
							variable = 0
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length) {
	var post = offset - 1
	var rule = offset === 0 ? rules : ['']
	var size = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(rule)

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, post + 1, post = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.abs)(j = points[i])), z = value; x < size; ++x)
			if (z = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.trim)(j > 0 ? rule[x] + ' ' + y : (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(y, /&\f/g, rule[x])))
				props[k++] = z

	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, offset === 0 ? _Enum_js__WEBPACK_IMPORTED_MODULE_2__.RULESET : type, props, children, length)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @return {object}
 */
function comment (value, root, parent) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_2__.COMMENT, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.char)()), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 2, -2), 0)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @return {object}
 */
function declaration (value, root, parent, length) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_2__.DECLARATION, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 0, length), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, length + 1, -1), length)
}


/***/ }),

/***/ "./node_modules/stylis/src/Prefixer.js":
/*!*********************************************!*\
  !*** ./node_modules/stylis/src/Prefixer.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {string} value
 * @param {number} length
 * @param {object[]} children
 * @return {string}
 */
function prefix (value, length, children) {
	switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.hash)(value, length)) {
		// color-adjust
		case 5103:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'print-' + value + value
		// animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
		case 5737: case 4201: case 3177: case 3433: case 1641: case 4457: case 2921:
		// text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
		case 5572: case 6356: case 5844: case 3191: case 6645: case 3005:
		// mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
		case 6391: case 5879: case 5623: case 6135: case 4599: case 4855:
		// background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
		case 4215: case 6389: case 5109: case 5365: case 5621: case 3829:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value
		// tab-size
		case 4789:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + value
		// appearance, user-select, transform, hyphens, text-size-adjust
		case 5349: case 4246: case 4810: case 6968: case 2756:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
		// writing-mode
		case 5936:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 11)) {
				// vertical-l(r)
				case 114:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value
				// vertical-r(l)
				case 108:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value
				// horizontal(-)tb
				case 45:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value
				// default: fallthrough to below
			}
		// flex, flex-direction, scroll-snap-type, writing-mode
		case 6828: case 4268: case 2903:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
		// order
		case 6165:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-' + value + value
		// align-items
		case 5187:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(\w+).+(:[^]+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-$1$2' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-$1$2') + value
		// align-self
		case 5443:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-item-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /flex-|-self/g, '') + (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /flex-|baseline/) ? _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-row-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /flex-|-self/g, '') : '') + value
		// align-content
		case 4675:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-line-pack' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /align-content|flex-|-self/g, '') + value
		// flex-shrink
		case 5548:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'shrink', 'negative') + value
		// flex-basis
		case 5292:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'basis', 'preferred-size') + value
		// flex-grow
		case 6060:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-grow', '') + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'grow', 'positive') + value
		// transition
		case 4554:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /([^-])(transform)/g, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2') + value
		// cursor
		case 6187:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(zoom-|grab)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), /(image-set)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), value, '') + value
		// background, background-image
		case 5495: case 3959:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(image-set\([^]*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1' + '$`$1')
		// justify-content
		case 4968:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)(flex-)?(.*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-pack:$3' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value
		// justify-self
		case 4200:
			if (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /flex-|baseline/)) return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-column-align' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(value, length) + value
			break
		// grid-template-(columns|rows)
		case 2592: case 3360:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'template-', '') + value
		// grid-(row|column)-start
		case 4384: case 3616:
			if (children && children.some(function (element, index) { return length = index, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(element.props, /grid-\w+-end/) })) {
				return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(value + (children = children[length].value), 'span') ? value : (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-start', '') + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-row-span:' + (~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(children, 'span') ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(children, /\d+/) : +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(children, /\d+/) - +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /\d+/)) + ';')
			}
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-start', '') + value
		// grid-(row|column)-end
		case 4896: case 4128:
			return (children && children.some(function (element) { return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(element.props, /grid-\w+-start/) })) ? value : _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-end', '-span'), 'span ', '') + value
		// (margin|padding)-inline-(start|end)
		case 4095: case 3583: case 4068: case 2532:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+)-inline(.+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1$2') + value
		// (min|max)?(width|height|inline-size|block-size)
		case 8116: case 7059: case 5753: case 5535:
		case 5445: case 5701: case 4933: case 4677:
		case 5533: case 5789: case 5021: case 4765:
			// stretch, max-content, min-content, fill-available
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value) - 1 - length > 6)
				switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 1)) {
					// (m)ax-content, (m)in-content
					case 109:
						// -
						if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 4) !== 45)
							break
					// (f)ill-available, (f)it-content
					case 102:
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2-$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value
					// (s)tretch
					case 115:
						return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(value, 'stretch') ? prefix((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'stretch', 'fill-available'), length, children) + value : value
				}
			break
		// grid-(column|row)
		case 5152: case 5920:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function (_, a, b, c, d, e, f) { return (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + a + ':' + b + f) + (c ? (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + a + '-span:' + (d ? e : +e - +b)) + f : '') + value })
		// position: sticky
		case 4949:
			// stick(y)?
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 6) === 121)
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT) + value
			break
		// display: (flex|inline-flex|grid|inline-grid)
		case 6444:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 14) === 45 ? 18 : 11)) {
				// (inline-)?fle(x)
				case 120:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + '$2box$3') + value
				// (inline-)?gri(d)
				case 100:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS) + value
			}
			break
		// scroll-margin, scroll-margin-(top|right|bottom|left)
		case 5719: case 2647: case 2135: case 3927: case 2391:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'scroll-', 'scroll-snap-') + value
	}

	return value
}


/***/ }),

/***/ "./node_modules/stylis/src/Serializer.js":
/*!***********************************************!*\
  !*** ./node_modules/stylis/src/Serializer.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   stringify: () => (/* binding */ stringify)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "./node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");



/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = ''
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children)

	for (var i = 0; i < length; i++)
		output += callback(children[i], i, children, callback) || ''

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.LAYER: if (element.children.length) break
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.IMPORT: case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.DECLARATION: return element.return = element.return || element.value
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.COMMENT: return ''
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET: element.value = element.props.join(',')
	}

	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}


/***/ }),

/***/ "./node_modules/stylis/src/Tokenizer.js":
/*!**********************************************!*\
  !*** ./node_modules/stylis/src/Tokenizer.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alloc: () => (/* binding */ alloc),
/* harmony export */   caret: () => (/* binding */ caret),
/* harmony export */   char: () => (/* binding */ char),
/* harmony export */   character: () => (/* binding */ character),
/* harmony export */   characters: () => (/* binding */ characters),
/* harmony export */   column: () => (/* binding */ column),
/* harmony export */   commenter: () => (/* binding */ commenter),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   dealloc: () => (/* binding */ dealloc),
/* harmony export */   delimit: () => (/* binding */ delimit),
/* harmony export */   delimiter: () => (/* binding */ delimiter),
/* harmony export */   escaping: () => (/* binding */ escaping),
/* harmony export */   identifier: () => (/* binding */ identifier),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   line: () => (/* binding */ line),
/* harmony export */   next: () => (/* binding */ next),
/* harmony export */   node: () => (/* binding */ node),
/* harmony export */   peek: () => (/* binding */ peek),
/* harmony export */   position: () => (/* binding */ position),
/* harmony export */   prev: () => (/* binding */ prev),
/* harmony export */   slice: () => (/* binding */ slice),
/* harmony export */   token: () => (/* binding */ token),
/* harmony export */   tokenize: () => (/* binding */ tokenize),
/* harmony export */   tokenizer: () => (/* binding */ tokenizer),
/* harmony export */   whitespace: () => (/* binding */ whitespace)
/* harmony export */ });
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "./node_modules/stylis/src/Utility.js");


var line = 1
var column = 1
var length = 0
var position = 0
var character = 0
var characters = ''

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: ''}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.assign)(node('', null, null, '', null, null, 0), root, {length: -root.length}, props)
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, --position) : 0

	if (column--, character === 10)
		column = 1, line--

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position++) : 0

	if (column++, character === 10)
		column = 1, line++

	return character
}

/**
 * @return {number}
 */
function peek () {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.trim)(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {string} value
 * @return {string[]}
 */
function tokenize (value) {
	return dealloc(tokenizer(alloc(value)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next()
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {string[]} children
 * @return {string[]}
 */
function tokenizer (children) {
	while (next())
		switch (token(character)) {
			case 0: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(identifier(position - 1), children)
				break
			case 2: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(delimit(character), children)
				break
			default: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(character), children)
		}

	return children
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character)
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type)
				break
			// \
			case 92:
				next()
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next()

	return slice(index, position)
}


/***/ }),

/***/ "./node_modules/stylis/src/Utility.js":
/*!********************************************!*\
  !*** ./node_modules/stylis/src/Utility.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   abs: () => (/* binding */ abs),
/* harmony export */   append: () => (/* binding */ append),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   charat: () => (/* binding */ charat),
/* harmony export */   combine: () => (/* binding */ combine),
/* harmony export */   from: () => (/* binding */ from),
/* harmony export */   hash: () => (/* binding */ hash),
/* harmony export */   indexof: () => (/* binding */ indexof),
/* harmony export */   match: () => (/* binding */ match),
/* harmony export */   replace: () => (/* binding */ replace),
/* harmony export */   sizeof: () => (/* binding */ sizeof),
/* harmony export */   strlen: () => (/* binding */ strlen),
/* harmony export */   substr: () => (/* binding */ substr),
/* harmony export */   trim: () => (/* binding */ trim)
/* harmony export */ });
/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @return {number}
 */
function indexof (value, search) {
	return value.indexOf(search)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}


/***/ }),

/***/ "./packages/components/src/components/advanced/index.ts":
/*!**************************************************************!*\
  !*** ./packages/components/src/components/advanced/index.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KeyValueRepeater: () => (/* reexport safe */ _key_value_repeater__WEBPACK_IMPORTED_MODULE_2__.KeyValueRepeater),
/* harmony export */   KeyValueRepeaterField: () => (/* reexport safe */ _key_value_repeater_field__WEBPACK_IMPORTED_MODULE_1__.KeyValueRepeaterField),
/* harmony export */   RemoteSettings: () => (/* reexport safe */ _remote_settings__WEBPACK_IMPORTED_MODULE_5__.RemoteSettings),
/* harmony export */   RepeaterControl: () => (/* reexport safe */ _repeater_control__WEBPACK_IMPORTED_MODULE_4__.RepeaterControl),
/* harmony export */   RepeaterItem: () => (/* reexport safe */ _repeater_item__WEBPACK_IMPORTED_MODULE_3__.RepeaterItem),
/* harmony export */   TinyMCESetting: () => (/* reexport safe */ _tinymce__WEBPACK_IMPORTED_MODULE_0__.TinyMCESetting)
/* harmony export */ });
/* harmony import */ var _tinymce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tinymce */ "./packages/components/src/components/advanced/tinymce.tsx");
/* harmony import */ var _key_value_repeater_field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./key-value-repeater-field */ "./packages/components/src/components/advanced/key-value-repeater-field.tsx");
/* harmony import */ var _key_value_repeater__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./key-value-repeater */ "./packages/components/src/components/advanced/key-value-repeater.tsx");
/* harmony import */ var _repeater_item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./repeater-item */ "./packages/components/src/components/advanced/repeater-item.tsx");
/* harmony import */ var _repeater_control__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./repeater-control */ "./packages/components/src/components/advanced/repeater-control.tsx");
/* harmony import */ var _remote_settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./remote-settings */ "./packages/components/src/components/advanced/remote-settings.tsx");







/***/ }),

/***/ "./packages/components/src/components/advanced/key-value-repeater-field.tsx":
/*!**********************************************************************************!*\
  !*** ./packages/components/src/components/advanced/key-value-repeater-field.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KeyValueRepeaterField: () => (/* binding */ KeyValueRepeaterField)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */

/**
 * Local dependancies.
 */


/**
 * Displays a key value repeater setting field.
 *
 */
const KeyValueRepeaterField = ({
  field,
  availableSmartTags,
  value,
  onChange
}) => {
  // On add merge tag...
  const onMergeTagClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(mergeTag => {
    // Add the merge tag to the value.
    if (onChange) {
      onChange(value ? `${value} ${mergeTag}`.trim() : mergeTag);
    }
  }, [value, onChange]);

  // Merge tags.
  const suffix = (0,_hooks__WEBPACK_IMPORTED_MODULE_2__.useMergeTags)({
    availableSmartTags,
    onMergeTagClick
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexBlock, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalInputControl, {
      label: field.label,
      type: field.type,
      value: value,
      className: "hizzlewp-component__field hizzlewp-condition-field",
      suffix: suffix,
      onChange: onChange,
      isPressEnterToChange: true,
      __next40pxDefaultSize: true
    })
  });
};

/***/ }),

/***/ "./packages/components/src/components/advanced/key-value-repeater.tsx":
/*!****************************************************************************!*\
  !*** ./packages/components/src/components/advanced/key-value-repeater.tsx ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KeyValueRepeater: () => (/* binding */ KeyValueRepeater)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! . */ "./packages/components/src/components/advanced/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */



/**
 * Local dependancies.
 */



/**
 * Key value repeater fields.
 */
const keyValueRepeaterFields = [{
  id: 'key',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Key', 'newsletter-optin-box'),
  type: 'text'
}, {
  id: 'value',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Value', 'newsletter-optin-box'),
  type: 'text'
}];
/**
 * Displays a key value repeater setting.
 *
 */
const KeyValueRepeater = ({
  setting,
  availableSmartTags,
  value,
  onChange,
  ...attributes
}) => {
  // The base props.
  const {
    baseControlProps,
    controlProps
  } = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.useBaseControlProps)(attributes);

  // Ensure the value is an array.
  if (!Array.isArray(value)) {
    value = [];
  }

  // Displays a single Item.
  const Item = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({
    item,
    index
  }) => {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
      className: "hizzlewp-repeater-item",
      wrap: true,
      children: [keyValueRepeaterFields.map((field, fieldIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(___WEBPACK_IMPORTED_MODULE_3__.KeyValueRepeaterField, {
        availableSmartTags: availableSmartTags,
        field: field,
        value: item[field.id] === undefined ? '' : item[field.id],
        onChange: newValue => {
          const newItems = [...value];
          newItems[index][field.id] = newValue;
          onChange(newItems);
        }
      }, fieldIndex)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          icon: "trash",
          variant: "tertiary",
          className: "hizzlewp-component__field",
          label: "Delete",
          showTooltip: true,
          onClick: () => {
            const newValue = [...value];
            newValue.splice(index, 1);
            onChange(newValue);
          },
          isDestructive: true
        })
      })]
    });
  }, [value, onChange]);

  // Render the control.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
    ...baseControlProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      ...controlProps,
      children: [value.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Item, {
        item: item,
        index: index
      }, index)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: () => {
          const newValue = [...value];
          newValue.push(keyValueRepeaterFields.reduce((acc, field) => {
            acc[field.id] = '';
            return acc;
          }, {}));
          onChange(newValue);
        },
        variant: "secondary",
        children: setting.add_field ? setting.add_field : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add', 'newsletter-optin-box')
      })]
    })
  });
};

/***/ }),

/***/ "./packages/components/src/components/advanced/remote-settings.tsx":
/*!*************************************************************************!*\
  !*** ./packages/components/src/components/advanced/remote-settings.tsx ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoteSettings: () => (/* binding */ RemoteSettings)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _setting__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setting */ "./packages/components/src/components/setting.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./packages/components/src/components/utils/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */




/**
 * Local dependencies.
 */



/**
 * Displays remote settings.
 *
 */

const RemoteSettings = ({
  setting,
  saved,
  settingKey,
  ...extra
}) => {
  // State for tracking loading status
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // State for storing fetched settings
  const [settings, setSettings] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});

  // State for storing any error messages
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Construct the remote URL with query parameters
  const remoteURL = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    // If no rest_route is provided, return empty string
    if (!setting.rest_route) {
      return '';
    }

    // Process rest_args to handle special values that start with '!'
    const args = Object.entries(setting.rest_args || {}).reduce((acc, [key, value]) => {
      acc[key] = 'string' === typeof value && value.startsWith('!') ? (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getNestedValue)(saved, value.slice(1)) : value;
      return acc;
    }, {});

    // Combine the route with processed arguments
    return (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_3__.addQueryArgs)(setting.rest_route, args);
  }, [setting.rest_route, setting.rest_args, saved]);

  // Effect to fetch settings from the remote URL
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Skip if no URL is available
    if (!remoteURL) {
      return;
    }

    // Set loading state and clear any previous errors
    setLoading(true);
    setError(null);

    // Fetch data from the WordPress REST API
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
      path: remoteURL
    }).then(data => {
      // Store the fetched settings
      setSettings(data);
    }).catch(error => {
      // Handle errors by clearing settings and displaying error message
      setSettings({});
      setError(error.message || 'An error occurred while fetching settings.');
      console.error(error);
    }).finally(() => {
      // Always mark loading as complete when done
      setLoading(false);
    });
  }, [remoteURL]);

  // If no URL is available, don't render anything
  if (!remoteURL) {
    return null;
  }

  // Show loading spinner while fetching data
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, {});
  }

  // Show error notice if an error occurred
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
      status: "error",
      children: error
    });
  }

  // Render each setting from the fetched data
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: Object.keys(settings).map(settingKey => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_setting__WEBPACK_IMPORTED_MODULE_4__.Setting, {
      settingKey: settingKey,
      saved: saved,
      setting: settings[settingKey],
      ...extra
    }, settingKey))
  });
};

/***/ }),

/***/ "./packages/components/src/components/advanced/repeater-control.tsx":
/*!**************************************************************************!*\
  !*** ./packages/components/src/components/advanced/repeater-control.tsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RepeaterControl: () => (/* binding */ RepeaterControl)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./packages/components/src/components/utils/index.ts");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! . */ "./packages/components/src/components/advanced/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */




/**
 * Local dependancies.
 */




/**
 * Displays a repeater setting.
 *
 */
const RepeaterControl = props => {
  const {
    availableSmartTags,
    value,
    onChange,
    button,
    fields = [],
    openModal,
    prepend,
    disable,
    disabled,
    onDisable,
    cardProps,
    repeaterKey,
    id,
    defaultItem,
    ...attributes
  } = props;
  const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Ensure the value is an array.
  const theValue = Array.isArray(value) ? value : [];

  // The base props.
  const theId = id || (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.useInstanceId)(RepeaterControl, 'hizzlewp-repeater');
  const {
    baseControlProps,
    controlProps
  } = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.useBaseControlProps)({
    ...attributes,
    id: theId
  });

  // Prepare the default value.
  const defaultValue = defaultItem || {};
  if (repeaterKey?.newOnly) {
    defaultValue['new'] = true;
  }
  if (!fields) {
    console.warn('No fields provided to repeater control.');
    return null;
  }
  Object.keys(fields).forEach(fieldKey => {
    if (undefined !== fields[fieldKey].default) {
      defaultValue[fieldKey] = fields[fieldKey].default;
    }
  });
  const showInModal = !!openModal;
  const keyOrIndex = (item, index) => item.key ? item.key : repeaterKey?.to && (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(item, repeaterKey.to) ? (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(item, repeaterKey.to) : index;

  // The actual fields.
  const el = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalVStack, {
    children: [prepend, theValue.map((item, index) => {
      // Move the item down.
      const onMoveDown = () => {
        // Create a copy of the current array
        const newItems = [...theValue];

        // Get the current item
        const item = newItems[index];

        // Remove the item from its current position
        newItems.splice(index, 1);

        // Insert the item at the next position
        newItems.splice(index + 1, 0, item);

        // Update the parent component with the new array
        onChange(newItems);
      };

      // Move the item up.
      const onMoveUp = () => {
        // Create a copy of the current array
        const newItems = [...theValue];

        // Get the current item
        const item = newItems[index];

        // Remove the item from its current position
        newItems.splice(index, 1);

        // Insert the item at the previous position
        newItems.splice(index - 1, 0, item);

        // Update the parent component with the new array
        onChange(newItems);
      };

      // Delete the item.
      const onDelete = () => {
        // Create a copy of the current array
        const newItems = [...theValue];

        // Remove the item from the array
        newItems.splice(index, 1);

        // Update the parent component with the new array
        onChange(newItems);
      };

      // Update the item.
      const localOnChange = newItemValue => {
        // Create a copy of the current item.
        let theNewItemValue = {
          ...newItemValue
        };

        // If the repeater key is set, and the item has a value at the 'from' path, and the item is not new only, or the item is new.
        if (repeaterKey?.to && repeaterKey.from && (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(theNewItemValue, repeaterKey.from)) {
          if (!repeaterKey.newOnly || theNewItemValue['new']) {
            // Generate a merge tag from the label.
            const label = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(theNewItemValue, repeaterKey.from);
            const mergeTag = label.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');

            // Limit to 64 characters.
            theNewItemValue = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.updateNestedValue)(theNewItemValue, repeaterKey.to, mergeTag.substring(0, repeaterKey.maxLength || 64));

            // Ensure the merge tag is unique.
            if (theValue.find((value, valueIndex) => index !== valueIndex && (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(value, repeaterKey.to) === (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(theNewItemValue, repeaterKey.to))) {
              theNewItemValue = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.updateNestedValue)(theNewItemValue, repeaterKey.to, `${(0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(theNewItemValue, repeaterKey.to)}_${index}`);
            }
          }
        }
        const newItems = [...theValue];
        newItems[index] = theNewItemValue;
        onChange(newItems);
      };
      return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Card, {
        size: "small",
        className: "hizzlewp-no-shadow",
        id: `${theId}__item-${keyOrIndex(item, index)}`,
        "data-index": index,
        borderBottom: true,
        borderLeft: true,
        borderRight: true,
        borderTop: true,
        ...(cardProps || {}),
        key: keyOrIndex(item, index)
      }, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(___WEBPACK_IMPORTED_MODULE_5__.RepeaterItem, {
        id: `${theId}__item-${keyOrIndex(item, index)}`,
        fields: fields,
        value: item,
        availableSmartTags: availableSmartTags,
        onChange: localOnChange,
        onDelete: onDelete,
        onMoveUp: index > 0 ? onMoveUp : undefined,
        onMoveDown: index < theValue.length - 1 ? onMoveDown : undefined,
        repeaterKey: repeaterKey
      }));
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: () => {
          const newValue = [...theValue];
          const timestamp = Date.now().toString(36);
          const randomStr = Math.random().toString(36).substring(2, 8);
          newValue.push({
            key: `${timestamp}_${randomStr}`,
            ...defaultValue
          });
          onChange(newValue);
        },
        variant: "primary",
        children: button || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add Item', 'newsletter-optin-box')
      }), showInModal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: () => setIsOpen(false),
        variant: "secondary",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Go Back', 'newsletter-optin-box')
      })]
    })]
  });

  // Render the control.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
    ...baseControlProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      ...controlProps,
      children: showInModal ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalVStack, {
        children: [disable && onDisable && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: disable,
          checked: disabled,
          onChange: onDisable,
          __nextHasNoMarginBottom: true
        }), (!disable || !disabled) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            onClick: () => setIsOpen(true),
            variant: "secondary",
            children: openModal
          }), isOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
            title: attributes.label || openModal,
            onRequestClose: () => setIsOpen(false),
            size: "medium",
            children: el
          })]
        })]
      }) : el
    })
  });
};

/***/ }),

/***/ "./packages/components/src/components/advanced/repeater-item.tsx":
/*!***********************************************************************!*\
  !*** ./packages/components/src/components/advanced/repeater-item.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RepeaterItem: () => (/* binding */ RepeaterItem)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _setting__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setting */ "./packages/components/src/components/setting.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./packages/components/src/components/utils/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */



/**
 * Local dependancies.
 */




/**
 * Displays a single item in a repeater field.
 */
const RepeaterItem = props => {
  // Destructure props to get necessary values
  const {
    fields,
    availableSmartTags,
    value,
    onChange,
    repeaterKey = undefined,
    onDelete,
    onMoveUp,
    onMoveDown,
    id
  } = props;

  // State to track if the repeater item is expanded or collapsed
  // Default to open if there's no label to display in the header.
  const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!repeaterKey?.from);

  // Toggle function to expand/collapse the repeater item
  const toggle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setIsOpen(!isOpen), [isOpen];
  }, [isOpen]);

  // Hide the body if the item is closed and we have a label to display in the header.
  const hideBody = !isOpen && repeaterKey?.from;

  // Initialize header as null, will be populated if repeaterKey exists
  let header = null;
  if (repeaterKey) {
    // Create a badge element if we have display text and a value at the 'to' path
    const badge = false !== repeaterKey.display && repeaterKey.to && value?.[repeaterKey.to] ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("code", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)(repeaterKey.display || '%s', value?.[repeaterKey.to])
    }) : null;

    // Style for the header button
    const style = {
      paddingLeft: 16,
      paddingRight: 16,
      height: 48
    };

    // Get the label for the card from the specified path, or fallback if provided
    const cardLabel = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(value, repeaterKey.from) || (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(value, repeaterKey.fallback);

    // Build the header component with toggle functionality
    header = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardHeader, {
      style: {
        padding: 0
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
        as: _wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button,
        onClick: toggle,
        style: style,
        "aria-controls": `${id}__body`,
        "aria-expanded": !hideBody,
        type: "button",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
          as: _wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexBlock,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalText, {
            weight: 600,
            children: cardLabel || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('(new)', 'newsletter-optin-box')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
            children: [badge, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
              icon: isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'
            })]
          })
        })]
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [header, !hideBody && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
      id: `${id}__body`,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalVStack, {
        children: [Object.keys(fields).map(fieldKey => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_setting__WEBPACK_IMPORTED_MODULE_3__.Setting, {
          settingKey: fieldKey,
          availableSmartTags: availableSmartTags,
          setting: fields[fieldKey],
          saved: value,
          setAttributes: attributes => {
            onChange({
              ...value,
              ...attributes
            });
          }
        }, fieldKey)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
          className: "hizzlewp-repeater-item__actions",
          justify: "flex-start",
          children: [onDelete && !value?.predefined && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            variant: "link",
            onClick: onDelete,
            text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove Item', 'newsletter-optin-box'),
            isDestructive: true
          }), onMoveUp && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            onClick: onMoveUp,
            icon: "arrow-up-alt",
            text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move Up', 'newsletter-optin-box'),
            size: "small",
            iconSize: 16
          }), onMoveDown && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            onClick: onMoveDown,
            icon: "arrow-down-alt",
            text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move Down', 'newsletter-optin-box'),
            size: "small",
            iconSize: 16
          })]
        })]
      })
    })]
  });
};

/***/ }),

/***/ "./packages/components/src/components/advanced/tinymce.tsx":
/*!*****************************************************************!*\
  !*** ./packages/components/src/components/advanced/tinymce.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TinyMCESetting: () => (/* binding */ TinyMCESetting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/keycodes */ "@wordpress/keycodes");
/* harmony import */ var _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */

/**
 * Wordpress dependancies.
 */




/**
 * Displays a TinyMCE editor.
 *
 * Users have to manually add the TinyMCE script to their page.
 */
const TinyMCESetting = ({
  value,
  onChange,
  ...attributes
}) => {
  // `useBaseControlProps` is a convenience hook to get the props for the `BaseControl`
  // and the inner control itself. Namely, it takes care of generating a unique `id`,
  // properly associating it with the `label` and `help` elements.
  const {
    baseControlProps,
    controlProps
  } = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.useBaseControlProps)({
    ...attributes,
    __nextHasNoMarginBottom: true
  });
  const id = attributes.id;
  const {
    wp,
    tinymce
  } = window;
  const didMount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const elRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // Reinitialize the editor when clicking on the tinyMCE tab.
  // Fixes a bug where the editor content resets when switching between visual and text mode.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!didMount.current) {
      return;
    }
    const setContent = e => {
      if (e?.target?.classList?.contains('wp-switch-editor')) {
        setTimeout(() => {
          const editor = tinymce?.get(id);
          if (editor) {
            editor.setContent(value || '');
            editor._lastChange = value;
          }
        }, 50);
      }
    };
    elRef.current?.addEventListener('click', setContent);
    return () => {
      elRef.current?.removeEventListener('click', setContent);
    };
  }, [elRef.current, value]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!didMount.current) {
      return;
    }
    const editor = tinymce?.get(id);
    if (editor && editor._lastChange !== value) {
      //editor.setContent( value || '' );
      //editor._lastChange = value;
    }
  }, [value]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    tinymce?.execCommand('mceRemoveEditor', true, id);
    function initialize() {
      wp.oldEditor.initialize(id, {
        tinymce: window.tinymce ? {
          content_css: false,
          theme_advanced_buttons: 'bold,italic,underline,|,bullist,numlist,blockquote,|,link,unlink,|,spellchecker,fullscreen,|,formatselect,styleselect',
          drag_drop_upload: true,
          toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,spellchecker,wp_adv,dfw',
          toolbar2: 'strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
          min_height: 400,
          wpautop: false,
          setup(editor) {
            if (value) {
              editor.on('loadContent', () => editor.setContent(value));
            }
            editor.on('blur', () => {
              onChange(editor.getContent());
              return false;
            });
            const debouncedOnChange = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.debounce)(() => {
              const value = editor.getContent();
              if (value !== editor._lastChange) {
                editor._lastChange = value;
                onChange(value);
              }
            }, 250);
            editor.on('Paste Change input Undo Redo', debouncedOnChange);

            // We need to cancel the debounce call because when we remove
            // the editor (onUnmount) this callback is executed in
            // another tick. This results in setting the content to empty.
            editor.on('remove', debouncedOnChange.cancel);
            editor.on('keydown', event => {
              if (_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_3__.isKeyboardEvent.primary(event, 'z')) {
                // Prevent the gutenberg undo kicking in so TinyMCE undo stack works as expected.
                event.stopPropagation();
              }

              // If ctrl+s or cmd+s is pressed, save pending content.
              if (_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_3__.isKeyboardEvent.primary(event, 's')) {
                debouncedOnChange.flush();
              }
              const {
                altKey
              } = event;
              /*
               * Prevent Mousetrap from kicking in: TinyMCE already uses its own
               * `alt+f10` shortcut to focus its toolbar.
               */
              if (altKey && event.keyCode === _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_3__.F10) {
                event.stopPropagation();
              }
            });
            didMount.current = true;
          },
          ...(window?.tinyMCEPreInit?.mceInit[id] || {})
        } : false,
        mediaButtons: true,
        quicktags: {
          buttons: 'strong,em,link,block,del,ins,img,ul,ol,li,code,close'
        }
      });
    }
    function onReadyStateChange() {
      if (document.readyState === 'complete') {
        initialize();
      }
    }
    if (document.readyState === 'complete') {
      initialize();
    } else {
      document.addEventListener('readystatechange', onReadyStateChange);
    }
    return () => {
      document.removeEventListener('readystatechange', onReadyStateChange);
      wp.oldEditor.remove(id);
    };
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
    ...baseControlProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      ref: elRef,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("textarea", {
        ...controlProps,
        className: "wp-editor-area",
        style: {
          width: '100%'
        },
        value: value,
        onChange: e => onChange(e.target.value),
        rows: 10
      })
    })
  });
};

/***/ }),

/***/ "./packages/components/src/components/conditional-logic/editor.tsx":
/*!*************************************************************************!*\
  !*** ./packages/components/src/components/conditional-logic/editor.tsx ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConditionalLogicEditor: () => (/* binding */ ConditionalLogicEditor)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! . */ "./packages/components/src/components/conditional-logic/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


/**
 * Displays the conditional logic editor.
 */
const ConditionalLogicEditor = props => {
  const {
    onChange,
    value,
    comparisons,
    toggleText,
    availableSmartTags,
    className,
    inModal = false,
    ...extra
  } = props;
  const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const theValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    // If value is not an Object, set it to the default.
    if (typeof value !== 'object') {
      return {
        enabled: false,
        action: 'allow',
        rules: [],
        type: 'all'
      };
    }
    return value;
  }, [value]);

  // Sets conditional logic attribute.
  const setConditionalLogicAttribute = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((prop, val) => {
    onChange({
      ...theValue,
      [prop]: val
    });
  }, [onChange, theValue]);
  if (!availableSmartTags) {
    return null;
  }
  const el = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalVStack, {
    spacing: 5,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(___WEBPACK_IMPORTED_MODULE_3__.ConditionalLogicTypeSelector, {
      ruleCount: Array.isArray(theValue.rules) ? theValue.rules.length : 0,
      type: theValue.type,
      action: theValue.action,
      setConditionalLogicAttribute: setConditionalLogicAttribute
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(___WEBPACK_IMPORTED_MODULE_3__.ConditionalLogicRules, {
      rules: theValue.rules,
      comparisons: comparisons,
      availableSmartTags: availableSmartTags,
      setConditionalLogicAttribute: setConditionalLogicAttribute,
      closeModal: inModal ? () => {
        setIsOpen(false);
      } : undefined,
      ...extra
    })]
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalVStack, {
    spacing: 5,
    className: className,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
      checked: theValue.enabled ? true : false,
      onChange: val => setConditionalLogicAttribute('enabled', val),
      label: toggleText ? toggleText : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Optionally enable/disable this trigger depending on specific conditions.', 'newsletter-optin-box'),
      __nextHasNoMarginBottom: true
    }), theValue.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      children: inModal ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [isOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Conditional Logic', 'newsletter-optin-box'),
          onRequestClose: () => setIsOpen(false),
          isFullScreen: true,
          children: el
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "secondary",
          className: "hizzlewp-block-button",
          onClick: () => setIsOpen(true),
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Edit Conditional Logic', 'newsletter-optin-box')
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: el
      })
    })]
  });
};

/***/ }),

/***/ "./packages/components/src/components/conditional-logic/index.ts":
/*!***********************************************************************!*\
  !*** ./packages/components/src/components/conditional-logic/index.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConditionalLogicEditor: () => (/* reexport safe */ _editor__WEBPACK_IMPORTED_MODULE_3__.ConditionalLogicEditor),
/* harmony export */   ConditionalLogicRule: () => (/* reexport safe */ _rule__WEBPACK_IMPORTED_MODULE_0__.ConditionalLogicRule),
/* harmony export */   ConditionalLogicRules: () => (/* reexport safe */ _rules__WEBPACK_IMPORTED_MODULE_1__.ConditionalLogicRules),
/* harmony export */   ConditionalLogicTypeSelector: () => (/* reexport safe */ _type_selector__WEBPACK_IMPORTED_MODULE_2__.ConditionalLogicTypeSelector)
/* harmony export */ });
/* harmony import */ var _rule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rule */ "./packages/components/src/components/conditional-logic/rule.tsx");
/* harmony import */ var _rules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rules */ "./packages/components/src/components/conditional-logic/rules.tsx");
/* harmony import */ var _type_selector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./type-selector */ "./packages/components/src/components/conditional-logic/type-selector.tsx");
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor */ "./packages/components/src/components/conditional-logic/editor.tsx");





/***/ }),

/***/ "./packages/components/src/components/conditional-logic/rule.tsx":
/*!***********************************************************************!*\
  !*** ./packages/components/src/components/conditional-logic/rule.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConditionalLogicRule: () => (/* binding */ ConditionalLogicRule)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */



/**
 * Local dependencies.
 */


/**
 * A single conditional logic rule.
 */

// Consider adding a type for the props

/**
 * Displays a single conditional logic rule.
 */
const ConditionalLogicRule = props => {
  var _rule$full;
  const {
    rule,
    comparisons,
    availableSmartTags,
    mergeTagsArray,
    index,
    updateRule,
    removeRule
  } = props;

  /**
   * Updates the value of the rule.
   *
   * @param value The value to update.
   */
  const updateValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(value => updateRule(index, {
    value
  }), [updateRule, index]);

  /**
   * Updates the condition of the rule.
   *
   * @param condition The condition to update.
   */
  const updateCondition = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(condition => updateRule(index, {
    condition
  }), [updateRule, index]);

  /**
   * Removes the rule.
   */
  const localRemoveRule = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => removeRule(index), [removeRule, index]);

  /**
   * The full rule.
   */
  const ruleFull = (_rule$full = rule.full) !== null && _rule$full !== void 0 ? _rule$full : rule.type ? `[[${rule.type}]]` : '';

  /**
   * The closing bracket index of the rule.
   */
  const closingBracketIndex = ruleFull.indexOf(']]');

  /**
   * The opening bracket index of the rule.
   */
  const openingBracketIndex = ruleFull.indexOf('[[', closingBracketIndex);

  /**
   * Whether the rule has multiple tags.
   */
  const hasMultipleTags = closingBracketIndex === -1 || openingBracketIndex !== -1 && openingBracketIndex > closingBracketIndex;

  // Handles update of the full rule.
  const onUpdateFull = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(fullMergeTag => {
    const toUpdate = {
      full: fullMergeTag
    };

    // Get first part between [[]].
    if (fullMergeTag) {
      const firstTag = fullMergeTag.match(/\[\[([^\s\]]+)/)?.[1] || '';
      if (firstTag) {
        toUpdate.type = firstTag.replace('[[', '').replace(']]', '');
      }
    }
    updateRule(index, toUpdate);
  }, [updateRule, index]);

  /**
   * On merge tag click.
   *
   * @param mergeTag The merge tag to click.
   */
  const onMergeTagClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(mergeTag => {
    onUpdateFull(ruleFull ? `${ruleFull} ${mergeTag}`.trim() : mergeTag);
  }, [onUpdateFull, ruleFull]);

  /**
   * The merge tag suffix.
   */
  const mergeTagSuffix = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useMergeTags)({
    availableSmartTags: mergeTagsArray,
    onMergeTagClick
  });

  // Value merge tag.
  const onValueMergeTagClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(mergeTag => {
    updateValue(rule.value ? `${rule.value} ${mergeTag}`.trim() : mergeTag);
  }, [updateValue, rule.value]);

  /**
   * The value merge tag suffix.
   */
  const valueMergeTagSuffix = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useMergeTags)({
    availableSmartTags: mergeTagsArray,
    onMergeTagClick: onValueMergeTagClick
  });

  /**
   * The smart tag.
   */
  const smartTag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const tag = rule.type;
    if (!tag) {
      return null;
    }
    if (availableSmartTags[tag] !== undefined) {
      return availableSmartTags[tag];
    }

    // Convert first occurrence of _ to .
    const altTag = tag.replace('_', '.');
    if (availableSmartTags[altTag] !== undefined) {
      return availableSmartTags[altTag];
    }
    for (const [key, value] of Object.entries(availableSmartTags)) {
      // Check without prefix.
      if (key.indexOf('.') !== -1) {
        const withoutPrefix = key.split('.').slice(1);
        if (withoutPrefix.join('.') === tag) {
          return value;
        }
      }

      // Converts a space or comma separated list to array.
      const split = string => Array.isArray(string) ? string : string.split(/[\s,]+/);

      // Check deprecated alternatives.
      if (value.deprecated && split(value.deprecated).includes(tag)) {
        return value;
      }
    }
    return null;
  }, [rule.type, availableSmartTags]);

  // Contains available options.
  const availableOptions = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.usePlaceholder)((0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useOptions)(smartTag?.options || []), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select a value', 'newsletter-optin-box'));

  // Checks whether the selected condition type has options.
  const hasOptions = !hasMultipleTags && availableOptions.length > 1;

  // Contains data type.
  const dataType = hasMultipleTags ? 'string' : smartTag?.conditional_logic || 'string';

  // Sets available comparisons for the selected condition.
  const availableComparisons = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.usePlaceholder)((0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const types = [];

    // Filter object of available condition types to include where key === rule.type.
    Object.keys(comparisons).forEach(key => {
      const comparison_type = comparisons[key].type;
      if (hasOptions) {
        if ('string' === dataType && 'is' != key && 'is_not' != key) {
          return;
        }
        if ('is_empty' === key || 'is_not_empty' === key || 'is_between' === key) {
          return;
        }
      }
      if ('any' === comparison_type || comparison_type == dataType) {
        types.push({
          label: comparisons[key].name,
          value: key
        });
      }
    });
    return types;
  }, [dataType, comparisons]), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select a comparison', 'newsletter-optin-box'));
  const skipValue = 'is_empty' === rule.condition || 'is_not_empty' === rule.condition;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
    justify: "flex-start",
    wrap: true,
    expanded: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      style: {
        minWidth: 320
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalInputControl, {
        type: "text",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Smart Tag', 'newsletter-optin-box'),
        hideLabelFromVision: true,
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enter a smart tag', 'newsletter-optin-box'),
        value: ruleFull,
        onChange: onUpdateFull,
        autoComplete: "off",
        suffix: mergeTagSuffix,
        __next40pxDefaultSize: true
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      style: {
        width: 150
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Comparison', 'newsletter-optin-box'),
        hideLabelFromVision: true,
        value: rule.condition ? rule.condition : 'is',
        options: availableComparisons,
        onChange: updateCondition,
        size: "default",
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      })
    }), !skipValue && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      style: {
        minWidth: 320
      },
      children: [hasOptions && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Value', 'newsletter-optin-box'),
        hideLabelFromVision: true,
        value: rule.value ? rule.value : '',
        options: availableOptions,
        onChange: updateValue,
        size: "default",
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true
      }), !hasOptions && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalInputControl, {
        type: 'number' === dataType ? 'number' : 'text',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Value', 'newsletter-optin-box'),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enter a value', 'newsletter-optin-box'),
        hideLabelFromVision: true,
        value: rule.value ? rule.value : '',
        onChange: updateValue,
        suffix: valueMergeTagSuffix,
        __next40pxDefaultSize: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      onClick: localRemoveRule,
      icon: "trash",
      variant: "tertiary",
      isDestructive: true
    })]
  });
};

/***/ }),

/***/ "./packages/components/src/components/conditional-logic/rules.tsx":
/*!************************************************************************!*\
  !*** ./packages/components/src/components/conditional-logic/rules.tsx ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConditionalLogicRules: () => (/* binding */ ConditionalLogicRules)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! . */ "./packages/components/src/components/conditional-logic/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */



/**
 * Local dependencies
 */



/**
 * Displays the available conditional logic rules.
 *
 */
const ConditionalLogicRules = props => {
  const {
    rules,
    comparisons,
    availableSmartTags,
    setConditionalLogicAttribute,
    disableTags = [],
    disableProps = [],
    closeModal = undefined
  } = props;

  // Filter available smart rules.
  const theRules = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!Array.isArray(rules)) {
      return [];
    }
    return rules.filter(rule => rule.type && rule.type !== '');
  }, [rules]);

  // Filter available smart tags to only include those that support conditional logic.
  const filteredSmartTags = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const types = {};
    availableSmartTags.forEach(smartTag => {
      if (smartTag.conditional_logic) {
        types[smartTag.smart_tag] = {
          ...smartTag,
          type: smartTag.conditional_logic,
          isPremium: Array.isArray(disableTags) && disableTags.some(tag => smartTag.smart_tag.startsWith(tag)) || Array.isArray(disableProps) && disableProps.some(prop => !!smartTag[prop])
        };
      }
    });
    return types;
  }, [availableSmartTags]);

  /**
   * Removes a rule from the conditional logic.
   *
   * @param {Number} index
   */
  const removeRule = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(index => {
    const newRules = [...theRules];
    newRules.splice(index, 1);
    setConditionalLogicAttribute('rules', newRules);
  }, [theRules, setConditionalLogicAttribute]);

  /**
   * Updates a rule in the conditional logic.
   *
   * @param {Number} index
   * @param {String} key
   * @param {String} value
   */
  const updateRule = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((index, value) => {
    const newRules = [...theRules];
    newRules[index] = {
      ...newRules[index],
      ...value
    };
    setConditionalLogicAttribute('rules', newRules);
  }, [theRules, setConditionalLogicAttribute]);

  // Merge tags array.
  const mergeTagsArray = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Object.values(filteredSmartTags), [filteredSmartTags]);

  /**
   * Adds a new conditional logic rule.
   */
  const addRule = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((smartTag, full) => {
    const smartTagObject = filteredSmartTags[smartTag];
    const options = smartTagObject?.options || [];
    const placeholder = smartTagObject?.placeholder || '';
    let value = Array.isArray(options) && options.length ? Object.keys(options)[0] : placeholder;

    // If the smartTag has a default value.
    if (smartTagObject?.default) {
      value = smartTagObject.default;
    }
    const newRules = [...theRules];
    newRules.push({
      type: smartTag,
      condition: 'is',
      full,
      value
    });
    setConditionalLogicAttribute('rules', newRules);
  }, [theRules]);

  // Button to add a new condition.
  const text = theRules.length === 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add a conditional logic rule', 'newsletter-optin-box') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add another rule', 'newsletter-optin-box');
  const addCondition = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useMergeTags)({
    availableSmartTags: mergeTagsArray,
    onMergeTagClick: addRule,
    raw: true,
    icon: 'plus',
    label: text,
    text,
    toggleProps: {
      variant: 'primary'
    }
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [theRules.map((rule, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.ConditionalLogicRule, {
      rule: rule,
      index: index,
      updateRule: updateRule,
      removeRule: removeRule,
      comparisons: comparisons,
      availableSmartTags: filteredSmartTags,
      mergeTagsArray: mergeTagsArray
    }, index)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
      justify: "flex-start",
      wrap: true,
      children: [addCondition, closeModal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: closeModal,
        variant: "secondary",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Return to editor', 'newsletter-optin-box')
      })]
    })]
  });
};

/***/ }),

/***/ "./packages/components/src/components/conditional-logic/type-selector.tsx":
/*!********************************************************************************!*\
  !*** ./packages/components/src/components/conditional-logic/type-selector.tsx ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConditionalLogicTypeSelector: () => (/* binding */ ConditionalLogicTypeSelector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */



// Action.

const ifOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Only run if', 'newsletter-optin-box'),
  value: 'allow'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Do not run if', 'newsletter-optin-box'),
  value: 'prevent'
}];

// Matches.
const typeOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('all', 'newsletter-optin-box'),
  value: 'all'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('any', 'newsletter-optin-box'),
  value: 'any'
}];
/**
 * Displays the conditional logic editor type selector.
 *
 */
const ConditionalLogicTypeSelector = props => {
  const {
    type,
    action,
    setConditionalLogicAttribute,
    ruleCount
  } = props;
  const hasMultiple = ruleCount > 1;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
    justify: "flex-start",
    wrap: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('If', 'newsletter-optin-box'),
      hideLabelFromVision: true,
      value: action ? action : 'allow',
      options: ifOptions,
      onChange: val => setConditionalLogicAttribute('action', val),
      size: "default",
      __nextHasNoMarginBottom: true,
      __next40pxDefaultSize: true
    }), hasMultiple && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('all', 'newsletter-optin-box'),
        hideLabelFromVision: true,
        value: type ? type : 'all',
        options: typeOptions,
        onChange: val => setConditionalLogicAttribute('type', val),
        size: "default",
        __nextHasNoMarginBottom: true,
        __next40pxDefaultSize: true
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalText, {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('of the following rules are true:', 'newsletter-optin-box')
      })]
    })]
  });
};

/***/ }),

/***/ "./packages/components/src/components/hooks/index.tsx":
/*!************************************************************!*\
  !*** ./packages/components/src/components/hooks/index.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCombineOptions: () => (/* reexport safe */ _use_combine_options__WEBPACK_IMPORTED_MODULE_1__.useCombineOptions),
/* harmony export */   useMergeTagGroups: () => (/* reexport safe */ _use_merge_tag_groups__WEBPACK_IMPORTED_MODULE_2__.useMergeTagGroups),
/* harmony export */   useMergeTags: () => (/* reexport safe */ _use_merge_tags__WEBPACK_IMPORTED_MODULE_0__.useMergeTags),
/* harmony export */   useOptions: () => (/* reexport safe */ _use_options__WEBPACK_IMPORTED_MODULE_4__.useOptions),
/* harmony export */   usePlaceholder: () => (/* reexport safe */ _use_placeholder__WEBPACK_IMPORTED_MODULE_3__.usePlaceholder)
/* harmony export */ });
/* harmony import */ var _use_merge_tags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-merge-tags */ "./packages/components/src/components/hooks/use-merge-tags.tsx");
/* harmony import */ var _use_combine_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-combine-options */ "./packages/components/src/components/hooks/use-combine-options.ts");
/* harmony import */ var _use_merge_tag_groups__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-merge-tag-groups */ "./packages/components/src/components/hooks/use-merge-tag-groups.ts");
/* harmony import */ var _use_placeholder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-placeholder */ "./packages/components/src/components/hooks/use-placeholder.ts");
/* harmony import */ var _use_options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./use-options */ "./packages/components/src/components/hooks/use-options.ts");






/***/ }),

/***/ "./packages/components/src/components/hooks/use-combine-options.ts":
/*!*************************************************************************!*\
  !*** ./packages/components/src/components/hooks/use-combine-options.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCombineOptions: () => (/* binding */ useCombineOptions)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./packages/components/src/components/hooks/index.tsx");
/**
 * External dependencies
 */


/**
 * Local dependencies
 */

/**
 * Combines options with dynamic value option.
 *
 * @param options The options.
 * @param availableSmartTags The available smart tags.
 */
const useCombineOptions = (options, availableSmartTags = []) => {
  const groups = (0,___WEBPACK_IMPORTED_MODULE_1__.useMergeTagGroups)(availableSmartTags);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!Array.isArray(availableSmartTags)) {
      return options;
    }
    const newOptions = [...options];
    Object.keys(groups).forEach(group => {
      if (!Array.isArray(groups[group]) || !groups[group].length) {
        return;
      }
      newOptions.push({
        value: `select_dynamic_value__${group}`,
        label: `${group} Dynamic Values`,
        disabled: true
      });
      groups[group].forEach(item => {
        newOptions.push({
          value: `[[${item.smart_tag}]]`,
          label: item.label,
          render: item.label,
          render_filtered: `${group} &gt;&gt; ${item.label}`,
          search: `${item.label} ${group} ${item.smart_tag} ${item.description}`
        });
      });
    });
    return newOptions;
  }, [groups, options]);
};

/***/ }),

/***/ "./packages/components/src/components/hooks/use-merge-tag-groups.ts":
/*!**************************************************************************!*\
  !*** ./packages/components/src/components/hooks/use-merge-tag-groups.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMergeTagGroups: () => (/* binding */ useMergeTagGroups)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External imports.
 */


/**
 * WordPress imports.
 */

/**
 * Prepares merge tag groups from the available merge tags.
 *
 */
const useMergeTagGroups = availableSmartTags => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!Array.isArray(availableSmartTags)) {
      return {};
    }
    const groups = {};
    availableSmartTags.forEach(smartTag => {
      const group = smartTag.group ? smartTag.group : 'General';
      if (!Array.isArray(groups[group])) {
        groups[group] = [];
      }
      groups[group].push(smartTag);
    });
    return groups;
  }, [availableSmartTags]);
};

/***/ }),

/***/ "./packages/components/src/components/hooks/use-merge-tags.tsx":
/*!*********************************************************************!*\
  !*** ./packages/components/src/components/hooks/use-merge-tags.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMergeTags: () => (/* binding */ useMergeTags)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/lock.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/next.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! . */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./packages/components/src/components/utils/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */




/**
 * Local dependencies
 */



/**
 * Makes it possible to use the merge tag selector in a field.
 *
 * @return {JSX.Element}
 */
const useMergeTags = ({
  availableSmartTags = [],
  onMergeTagClick = () => {},
  raw = false,
  icon = 'shortcode',
  label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Insert dynamic field', 'newsletter-optin-box'),
  ...dropdownProps
}) => {
  const [searchTerm, setSearchTerm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const groups = (0,___WEBPACK_IMPORTED_MODULE_4__.useMergeTagGroups)(availableSmartTags);
  const totalGroups = Object.keys(groups).length;

  // Filter groups based on search term
  const filteredGroups = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!searchTerm) return groups;
    const searchLower = searchTerm.toLowerCase();
    const filtered = {};
    Object.entries(groups).forEach(([groupName, items]) => {
      const matchingItems = items.filter(item => item.label.toLowerCase().includes(searchLower) || item.smart_tag.toLowerCase().includes(searchLower) || groupName.toLowerCase().includes(searchLower) || item.description?.toLowerCase().includes(searchLower));
      if (matchingItems.length > 0) {
        filtered[groupName] = matchingItems;
      }
    });
    return filtered;
  }, [groups, searchTerm]);
  const hasResults = Object.keys(filteredGroups).length > 0;

  // If we have merge tags, show the merge tags button.
  let inserter = null;
  if (totalGroups > 0) {
    inserter = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.DropdownMenu, {
      icon: icon,
      label: label,
      ...dropdownProps,
      children: ({
        onClose
      }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalVStack, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SearchControl, {
          __nextHasNoMarginBottom: true,
          value: searchTerm,
          onChange: setSearchTerm
        }), hasResults && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Tip, {
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Click a field to insert it.', 'newsletter-optin-box'), "\xA0", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('When your automation runs, each field will be replaced with actual data.', 'newsletter-optin-box')]
          }), Object.keys(filteredGroups).map(group => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.MenuGroup, {
            label: totalGroups > 1 ? group : undefined,
            children: filteredGroups[group].map(item => {
              const isPremium = item.isPremium;
              const itemLabel = isPremium ? `${item.label} - Premium` : item.label;
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.MenuItem, {
                icon: isPremium ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"] : item.icon || _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__["default"],
                iconPosition: "left",
                label: "Click to add dynamic value",
                showTooltip: true,
                disabled: isPremium,
                onClick: () => {
                  if (isPremium) return;
                  const tagValue = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getMergeTagValue)(item);
                  const value = raw ? item.smart_tag : `[[${tagValue}]]`;
                  onMergeTagClick?.(value, `[[${tagValue}]]`);
                  onClose();
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.RawHTML, {
                  children: itemLabel
                })
              }, item.smart_tag);
            })
          }, group))]
        }), !hasResults && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.MenuGroup, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.MenuItem, {
            disabled: true,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No matching items found', 'newsletter-optin-box')
          })
        })]
      })
    });
  }
  return inserter;
};

/***/ }),

/***/ "./packages/components/src/components/hooks/use-options.ts":
/*!*****************************************************************!*\
  !*** ./packages/components/src/components/hooks/use-options.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOptions: () => (/* binding */ useOptions)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */


/**
 * Local dependencies
 */

/**
 * Prepares the available options for the selected condition.
 *
 * @param options The options.
 */
const useOptions = options => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!options) {
      return [];
    }

    // Arrays.
    if (Array.isArray(options)) {
      // Check if the first option is an object (has label and value properties)
      if (options.length > 0 && typeof options[0] === 'object' && 'label' in options[0] && 'value' in options[0]) {
        return options;
      }
      return options.map(label => {
        return {
          label,
          value: label
        };
      });
    }

    // Objects.
    return Object.keys(options).map(value => {
      return {
        label: options[value],
        value
      };
    });
  }, [options]);
};

/***/ }),

/***/ "./packages/components/src/components/hooks/use-placeholder.ts":
/*!*********************************************************************!*\
  !*** ./packages/components/src/components/hooks/use-placeholder.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePlaceholder: () => (/* binding */ usePlaceholder)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies.
 */


/**
 * Local dependencies.
 */

/**
 * Adds a placeholder to the beginning of an array.
 *
 * @param options The options.
 * @param placeholder The placeholder text.
 */
const usePlaceholder = (options, placeholder) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return [{
      label: placeholder,
      value: '',
      disabled: true
    }, ...options];
  }, [options, placeholder]);
};

/***/ }),

/***/ "./packages/components/src/components/index.ts":
/*!*****************************************************!*\
  !*** ./packages/components/src/components/index.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorSetting: () => (/* reexport safe */ _input__WEBPACK_IMPORTED_MODULE_1__.ColorSetting),
/* harmony export */   ComboboxSetting: () => (/* reexport safe */ _select__WEBPACK_IMPORTED_MODULE_2__.ComboboxSetting),
/* harmony export */   ConditionalLogicEditor: () => (/* reexport safe */ _conditional_logic__WEBPACK_IMPORTED_MODULE_6__.ConditionalLogicEditor),
/* harmony export */   ConditionalLogicRule: () => (/* reexport safe */ _conditional_logic__WEBPACK_IMPORTED_MODULE_6__.ConditionalLogicRule),
/* harmony export */   ConditionalLogicRules: () => (/* reexport safe */ _conditional_logic__WEBPACK_IMPORTED_MODULE_6__.ConditionalLogicRules),
/* harmony export */   ConditionalLogicTypeSelector: () => (/* reexport safe */ _conditional_logic__WEBPACK_IMPORTED_MODULE_6__.ConditionalLogicTypeSelector),
/* harmony export */   ErrorBoundary: () => (/* reexport safe */ _ui__WEBPACK_IMPORTED_MODULE_7__.ErrorBoundary),
/* harmony export */   InputSetting: () => (/* reexport safe */ _input__WEBPACK_IMPORTED_MODULE_1__.InputSetting),
/* harmony export */   KeyValueRepeater: () => (/* reexport safe */ _advanced__WEBPACK_IMPORTED_MODULE_0__.KeyValueRepeater),
/* harmony export */   KeyValueRepeaterField: () => (/* reexport safe */ _advanced__WEBPACK_IMPORTED_MODULE_0__.KeyValueRepeaterField),
/* harmony export */   MultiCheckbox: () => (/* reexport safe */ _select__WEBPACK_IMPORTED_MODULE_2__.MultiCheckbox),
/* harmony export */   MultiSelectSetting: () => (/* reexport safe */ _select__WEBPACK_IMPORTED_MODULE_2__.MultiSelectSetting),
/* harmony export */   RemoteSettings: () => (/* reexport safe */ _advanced__WEBPACK_IMPORTED_MODULE_0__.RemoteSettings),
/* harmony export */   RepeaterControl: () => (/* reexport safe */ _advanced__WEBPACK_IMPORTED_MODULE_0__.RepeaterControl),
/* harmony export */   RepeaterItem: () => (/* reexport safe */ _advanced__WEBPACK_IMPORTED_MODULE_0__.RepeaterItem),
/* harmony export */   SelectSetting: () => (/* reexport safe */ _select__WEBPACK_IMPORTED_MODULE_2__.SelectSetting),
/* harmony export */   Setting: () => (/* reexport safe */ _setting__WEBPACK_IMPORTED_MODULE_3__.Setting),
/* harmony export */   TextareaSetting: () => (/* reexport safe */ _input__WEBPACK_IMPORTED_MODULE_1__.TextareaSetting),
/* harmony export */   TimeControl: () => (/* reexport safe */ _input__WEBPACK_IMPORTED_MODULE_1__.TimeControl),
/* harmony export */   TimeZone: () => (/* reexport safe */ _input__WEBPACK_IMPORTED_MODULE_1__.TimeZone),
/* harmony export */   TinyMCESetting: () => (/* reexport safe */ _advanced__WEBPACK_IMPORTED_MODULE_0__.TinyMCESetting),
/* harmony export */   ToggleGroupSetting: () => (/* reexport safe */ _input__WEBPACK_IMPORTED_MODULE_1__.ToggleGroupSetting),
/* harmony export */   checkConditions: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.checkConditions),
/* harmony export */   compare: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.compare),
/* harmony export */   getMergeTagValue: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.getMergeTagValue),
/* harmony export */   getNestedValue: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.getNestedValue),
/* harmony export */   operators: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.operators),
/* harmony export */   prepareAvailableSmartTags: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.prepareAvailableSmartTags),
/* harmony export */   randomColor: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.randomColor),
/* harmony export */   stringToColor: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.stringToColor),
/* harmony export */   updateNestedValue: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_5__.updateNestedValue),
/* harmony export */   useCombineOptions: () => (/* reexport safe */ _hooks__WEBPACK_IMPORTED_MODULE_4__.useCombineOptions),
/* harmony export */   useMergeTagGroups: () => (/* reexport safe */ _hooks__WEBPACK_IMPORTED_MODULE_4__.useMergeTagGroups),
/* harmony export */   useMergeTags: () => (/* reexport safe */ _hooks__WEBPACK_IMPORTED_MODULE_4__.useMergeTags),
/* harmony export */   useOptions: () => (/* reexport safe */ _hooks__WEBPACK_IMPORTED_MODULE_4__.useOptions),
/* harmony export */   usePlaceholder: () => (/* reexport safe */ _hooks__WEBPACK_IMPORTED_MODULE_4__.usePlaceholder),
/* harmony export */   withErrorBoundary: () => (/* reexport safe */ _ui__WEBPACK_IMPORTED_MODULE_7__.withErrorBoundary)
/* harmony export */ });
/* harmony import */ var _advanced__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./advanced */ "./packages/components/src/components/advanced/index.ts");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./input */ "./packages/components/src/components/input/index.ts");
/* harmony import */ var _select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./select */ "./packages/components/src/components/select/index.ts");
/* harmony import */ var _setting__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./setting */ "./packages/components/src/components/setting.tsx");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hooks */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./packages/components/src/components/utils/index.ts");
/* harmony import */ var _conditional_logic__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./conditional-logic */ "./packages/components/src/components/conditional-logic/index.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ui */ "./packages/components/src/components/ui/index.ts");









/***/ }),

/***/ "./packages/components/src/components/input/color.tsx":
/*!************************************************************!*\
  !*** ./packages/components/src/components/input/color.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorSetting: () => (/* binding */ ColorSetting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */


/**
 * Displays a color setting
 *
 */
const ColorSetting = ({
  value,
  onChange,
  ...attributes
}) => {
  const {
    baseControlProps,
    controlProps
  } = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.useBaseControlProps)({
    ...attributes
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
    ...baseControlProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Dropdown, {
      popoverProps: {
        placement: 'bottom-start'
      },
      renderToggle: ({
        isOpen,
        onToggle
      }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: onToggle,
        "aria-expanded": isOpen,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ColorIndicator, {
          colorValue: value
        })
      }),
      renderContent: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ColorPicker, {
        color: value,
        onChange: onChange
      }),
      ...controlProps
    })
  });
};

/***/ }),

/***/ "./packages/components/src/components/input/index.ts":
/*!***********************************************************!*\
  !*** ./packages/components/src/components/input/index.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorSetting: () => (/* reexport safe */ _color__WEBPACK_IMPORTED_MODULE_3__.ColorSetting),
/* harmony export */   InputSetting: () => (/* reexport safe */ _input__WEBPACK_IMPORTED_MODULE_0__.InputSetting),
/* harmony export */   TextareaSetting: () => (/* reexport safe */ _textarea__WEBPACK_IMPORTED_MODULE_1__.TextareaSetting),
/* harmony export */   TimeControl: () => (/* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_4__.TimeControl),
/* harmony export */   TimeZone: () => (/* reexport safe */ _time__WEBPACK_IMPORTED_MODULE_4__.TimeZone),
/* harmony export */   ToggleGroupSetting: () => (/* reexport safe */ _toggle_group__WEBPACK_IMPORTED_MODULE_2__.ToggleGroupSetting)
/* harmony export */ });
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./input */ "./packages/components/src/components/input/input.tsx");
/* harmony import */ var _textarea__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./textarea */ "./packages/components/src/components/input/textarea.tsx");
/* harmony import */ var _toggle_group__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toggle-group */ "./packages/components/src/components/input/toggle-group.tsx");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./color */ "./packages/components/src/components/input/color.tsx");
/* harmony import */ var _time__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./time */ "./packages/components/src/components/input/time.tsx");






/***/ }),

/***/ "./packages/components/src/components/input/input.tsx":
/*!************************************************************!*\
  !*** ./packages/components/src/components/input/input.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InputSetting: () => (/* binding */ InputSetting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/calendar.js");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */




/**
 * Local dependencies.
 */


/**
 * Input types.
 */

const inputTypes = ['number', 'search', 'email', 'password', 'tel', 'url', 'date'];
/**
 * Displays an input setting
 *
 * @param {Object} props
 * @param {Function} props.attributes The attributes
 * @param {Object} props.setting The setting object.
 * @param {Array} props.availableSmartTags The available smart tags.
 * @return {JSX.Element}
 */
const InputSetting = ({
  setting,
  availableSmartTags,
  isPressEnterToChange = true,
  ...attributes
}) => {
  // On add merge tag...
  const onMergeTagClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(mergeTag => {
    // Add the merge tag to the value.
    if (attributes.onChange) {
      // @ts-expect-error Event handler is not needed.
      attributes.onChange(attributes.value ? `${attributes.value} ${mergeTag}`.trim() : mergeTag);
    }
  }, [attributes.value, attributes.onChange]);
  const mergeTagSuffix = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useMergeTags)({
    availableSmartTags,
    onMergeTagClick
  });

  // Merge tags.
  if (typeof attributes.suffix === 'string' || attributes.suffix instanceof String) {
    attributes.suffix = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalInputControlSuffixWrapper, {
      children: attributes.suffix
    });
  } else if (!setting.disabled && mergeTagSuffix && !attributes.suffix) {
    attributes.suffix = mergeTagSuffix;
  }
  if ('datetime-local' === setting.type) {
    attributes.suffix = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalInputControlSuffixWrapper, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Dropdown, {
        popoverProps: {
          placement: 'bottom-start'
        },
        renderToggle: ({
          isOpen,
          onToggle
        }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          onClick: onToggle,
          "aria-expanded": isOpen,
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"]
        }),
        renderContent: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.DateTimePicker, {
          currentDate: attributes.value,
          onChange: newDate => {
            // Convert to ISO 8601 format.
            if (newDate) {
              newDate = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_2__.format)('c', newDate);
            }
            if (attributes.onChange) {
              // @ts-expect-error Event handler is not needed.
              attributes.onChange(newDate || '');
            }
          }
        })
      })
    });
  }
  if (setting.disabled) {
    attributes.readOnly = true;
    attributes.onFocus = e => e.target.select();
    if (setting.value) {
      attributes.value = setting.value;
    }
  }

  // Prefix.
  if (typeof attributes.prefix === 'string' || attributes.prefix instanceof String) {
    attributes.prefix = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalInputControlPrefixWrapper, {
      children: attributes.prefix
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalInputControl, {
    ...attributes,
    type: inputTypes.includes(setting.type) ? setting.type : 'text',
    placeholder: setting.placeholder ? setting.placeholder : '',
    isPressEnterToChange: isPressEnterToChange,
    __next40pxDefaultSize: true
  });
};

/***/ }),

/***/ "./packages/components/src/components/input/textarea.tsx":
/*!***************************************************************!*\
  !*** ./packages/components/src/components/input/textarea.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextareaSetting: () => (/* binding */ TextareaSetting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */



/**
 * Local dependencies.
 */



/**
 * The textarea setting props.
 */

/**
 * Displays a textarea setting
 *
 */
const TextareaSetting = ({
  availableSmartTags,
  autoGrow = false,
  label,
  id,
  setting,
  ...attributes
}) => {
  // On add merge tag...
  const onMergeTagClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(mergeTag => {
    // Add the merge tag to the value.
    if (attributes.onChange) {
      attributes.onChange(attributes.value ? `${attributes.value} ${mergeTag}`.trim() : mergeTag);
    }
  }, [attributes.value, attributes.onChange]);
  const mergeTagSuffix = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useMergeTags)({
    availableSmartTags,
    onMergeTagClick,
    toggleProps: {
      size: 'small'
    }
  });
  const newLabel = !setting.disabled && mergeTagSuffix ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
      children: label
    }), mergeTagSuffix]
  }) : label;
  const maybeId = id ? id : (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.useInstanceId)(TextareaSetting, 'hizzlewp-textarea');

  // Maybe auto grow.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (autoGrow) {
      const el = document.getElementById(maybeId);
      if (el) {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
      }
    }
  }, [attributes.value, autoGrow, maybeId]);
  if (setting.disabled) {
    attributes.readOnly = true;
    attributes.onFocus = e => e.target.select();
    if (setting.value) {
      attributes.value = setting.value;
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextareaControl, {
    ...attributes,
    id: maybeId,
    label: newLabel,
    __nextHasNoMarginBottom: true
  });
};

/***/ }),

/***/ "./packages/components/src/components/input/time.tsx":
/*!***********************************************************!*\
  !*** ./packages/components/src/components/input/time.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimeControl: () => (/* binding */ TimeControl),
/* harmony export */   TimeZone: () => (/* binding */ TimeZone)
/* harmony export */ });
/* harmony import */ var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/styled/base */ "./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.development.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */




/**
 * Creates an InputControl reducer used to pad an input so that it is always a
 * given width. For example, the hours and minutes inputs are padded to 2 so
 * that '4' appears as '04'.
 *
 * @param pad How many digits the value should be.
 */
function buildPadInputStateReducer(pad) {
  return (state, action) => {
    const nextState = {
      ...state
    };
    if (action.type === 'COMMIT' || action.type === 'PRESS_UP' || action.type === 'PRESS_DOWN') {
      if (nextState.value !== undefined) {
        nextState.value = nextState.value.toString().padStart(pad, '0');
      }
    }
    return nextState;
  };
}
const StyledTimeZone = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])("div",  false ? 0 : {
  target: "e1volm184",
  label: "StyledTimeZone"
})( false ? 0 : {
  name: "ebu3jh",
  styles: "text-decoration:underline dotted/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxhcHBcXGxhcmFnb25cXHd3d1xcbm9wdGluXFx3cC1jb250ZW50XFxwbHVnaW5zXFxoaXp6bGV3cFxccGFja2FnZXNcXGNvbXBvbmVudHNcXHNyY1xcY29tcG9uZW50c1xcaW5wdXRcXHRpbWUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXdEaUMiLCJmaWxlIjoiQzpcXGFwcFxcbGFyYWdvblxcd3d3XFxub3B0aW5cXHdwLWNvbnRlbnRcXHBsdWdpbnNcXGhpenpsZXdwXFxwYWNrYWdlc1xcY29tcG9uZW50c1xcc3JjXFxjb21wb25lbnRzXFxpbnB1dFxcdGltZS50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEV4dGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcblxuLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IF9fIH0gZnJvbSAnQHdvcmRwcmVzcy9pMThuJztcbmltcG9ydCB7IGdldFNldHRpbmdzIGFzIGdldERhdGVTZXR0aW5ncyB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0ZSc7XG5pbXBvcnQge1xuXHRfX2V4cGVyaW1lbnRhbE51bWJlckNvbnRyb2wgYXMgTnVtYmVyQ29udHJvbCxcblx0VG9vbHRpcCxcblx0QmFzZUNvbnRyb2wsXG5cdHVzZUJhc2VDb250cm9sUHJvcHMsXG5cdF9fZXhwZXJpbWVudGFsSFN0YWNrIGFzIEhTdGFjayxcbn0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzJztcblxuaW1wb3J0IHR5cGUgeyBCYXNlQ29udHJvbFByb3BzIH0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzL3NyYy9iYXNlLWNvbnRyb2wvdHlwZXMnO1xuXG5pbnRlcmZhY2UgVGltZUNvbnRyb2xQcm9wcyBleHRlbmRzIE9taXQ8QmFzZUNvbnRyb2xQcm9wcywgJ2NoaWxkcmVuJz4ge1xuXHQvKipcblx0ICogVGhlIHZhbHVlIG9mIHRoZSB0aW1lIGNvbnRyb2wuXG5cdCAqL1xuXHR2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgb25DaGFuZ2UgaGFuZGxlci5cblx0ICovXG5cdG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIElucHV0Q29udHJvbCByZWR1Y2VyIHVzZWQgdG8gcGFkIGFuIGlucHV0IHNvIHRoYXQgaXQgaXMgYWx3YXlzIGFcbiAqIGdpdmVuIHdpZHRoLiBGb3IgZXhhbXBsZSwgdGhlIGhvdXJzIGFuZCBtaW51dGVzIGlucHV0cyBhcmUgcGFkZGVkIHRvIDIgc29cbiAqIHRoYXQgJzQnIGFwcGVhcnMgYXMgJzA0Jy5cbiAqXG4gKiBAcGFyYW0gcGFkIEhvdyBtYW55IGRpZ2l0cyB0aGUgdmFsdWUgc2hvdWxkIGJlLlxuICovXG5mdW5jdGlvbiBidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKHBhZDogbnVtYmVyKSB7XG5cdHJldHVybiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuXHRcdGNvbnN0IG5leHRTdGF0ZSA9IHsgLi4uc3RhdGUgfTtcblx0XHRpZiAoXG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ0NPTU1JVCcgfHxcblx0XHRcdGFjdGlvbi50eXBlID09PSAnUFJFU1NfVVAnIHx8XG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ1BSRVNTX0RPV04nXG5cdFx0KSB7XG5cdFx0XHRpZiAobmV4dFN0YXRlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bmV4dFN0YXRlLnZhbHVlID0gbmV4dFN0YXRlLnZhbHVlLnRvU3RyaW5nKCkucGFkU3RhcnQocGFkLCAnMCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbmV4dFN0YXRlO1xuXHR9O1xufVxuXG5jb25zdCBTdHlsZWRUaW1lWm9uZSA9IHN0eWxlZC5kaXZgXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcbmA7XG5cbi8qKlxuICogRGlzcGxheXMgdGltZXpvbmUgaW5mb3JtYXRpb24gd2hlbiB1c2VyIHRpbWV6b25lIGlzIGRpZmZlcmVudCBmcm9tIHNpdGVcbiAqIHRpbWV6b25lLlxuICovXG5leHBvcnQgY29uc3QgVGltZVpvbmUgPSAoKSA9PiB7XG5cdGNvbnN0IHsgdGltZXpvbmUgfSA9IGdldERhdGVTZXR0aW5ncygpO1xuXG5cdC8vIENvbnZlcnQgdGltZXpvbmUgb2Zmc2V0IHRvIGhvdXJzLlxuXHRjb25zdCB1c2VyVGltZXpvbmVPZmZzZXQgPSAtMSAqIChuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG5cblx0Ly8gU3lzdGVtIHRpbWV6b25lIGFuZCB1c2VyIHRpbWV6b25lIG1hdGNoLCBub3RoaW5nIG5lZWRlZC5cblx0Ly8gQ29tcGFyZSBhcyBudW1iZXJzIGJlY2F1c2UgaXQgY29tZXMgb3ZlciBhcyBzdHJpbmcuXG5cdGlmIChOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA9PT0gdXNlclRpbWV6b25lT2Zmc2V0KSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRjb25zdCBvZmZzZXRTeW1ib2wgPSBOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA+PSAwID8gJysnIDogJyc7XG5cdGNvbnN0IHpvbmVBYmJyID1cblx0XHQnJyAhPT0gdGltZXpvbmUuYWJiciAmJiBpc05hTihOdW1iZXIodGltZXpvbmUuYWJicikpXG5cdFx0XHQ/IHRpbWV6b25lLmFiYnJcblx0XHRcdDogYFVUQyR7b2Zmc2V0U3ltYm9sfSR7dGltZXpvbmUub2Zmc2V0fWA7XG5cblx0Ly8gUmVwbGFjZSB1bmRlcnNjb3JlIHdpdGggc3BhY2UgaW4gc3RyaW5ncyBsaWtlIGBBbWVyaWNhL0Nvc3RhX1JpY2FgLlxuXHRjb25zdCBwcmV0dHlUaW1lem9uZVN0cmluZyA9IHRpbWV6b25lLnN0cmluZy5yZXBsYWNlKCdfJywgJyAnKTtcblxuXHRjb25zdCB0aW1lem9uZURldGFpbCA9XG5cdFx0J1VUQycgPT09IHRpbWV6b25lLnN0cmluZ1xuXHRcdFx0PyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnXG5cdFx0XHQ6IGAoJHt6b25lQWJicn0pICR7cHJldHR5VGltZXpvbmVTdHJpbmd9YDtcblxuXHQvLyBXaGVuIHRoZSBwcmV0dHlUaW1lem9uZVN0cmluZyBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gYWRkaXRpb25hbCB0aW1lem9uZVxuXHQvLyBkZXRhaWwgaW5mb3JtYXRpb24gdG8gc2hvdyBpbiBhIFRvb2x0aXAuXG5cdGNvbnN0IGhhc05vQWRkaXRpb25hbFRpbWV6b25lRGV0YWlsID1cblx0XHRwcmV0dHlUaW1lem9uZVN0cmluZy50cmltKCkubGVuZ3RoID09PSAwO1xuXG5cdHJldHVybiBoYXNOb0FkZGl0aW9uYWxUaW1lem9uZURldGFpbCA/IChcblx0XHQ8U3R5bGVkVGltZVpvbmUgY2xhc3NOYW1lPVwiY29tcG9uZW50cy1kYXRldGltZV9fdGltZXpvbmVcIj5cblx0XHRcdHt6b25lQWJicn1cblx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHQpIDogKFxuXHRcdDxUb29sdGlwIHBsYWNlbWVudD1cInRvcFwiIHRleHQ9e3RpbWV6b25lRGV0YWlsfT5cblx0XHRcdDxTdHlsZWRUaW1lWm9uZSBjbGFzc05hbWU9XCJjb21wb25lbnRzLWRhdGV0aW1lX190aW1lem9uZVwiPlxuXHRcdFx0XHR7em9uZUFiYnJ9XG5cdFx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHRcdDwvVG9vbHRpcD5cblx0KTtcbn07XG5cbmNvbnN0IFRpbWVTZXBhcmF0b3IgPSBzdHlsZWQuc3BhbmBcblx0Ym9yZGVyLXRvcDogMXB4IHNvbGlkICM3NTc1NzU7XG5cdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjNzU3NTc1O1xuXHRkaXNwbGF5OiBpbmxpbmUtZmxleDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmNvbnN0IEhvdXJzSW5wdXQgPSBzdHlsZWQoTnVtYmVyQ29udHJvbClgXG5cdHdpZHRoOiAzNnB4O1xuXG5cdCYmJiAuY29tcG9uZW50cy1pbnB1dC1jb250cm9sX19pbnB1dCB7XG5cdFx0cGFkZGluZy1yaWdodDogMDtcblx0XHRwYWRkaW5nLWxlZnQ6IDhweDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1yaWdodDogMDtcblx0XHRib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcblx0XHRib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgTWludXRlc0lucHV0ID0gc3R5bGVkKE51bWJlckNvbnRyb2wpYFxuXHR3aWR0aDogMzZweDtcblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9faW5wdXQge1xuXHRcdHBhZGRpbmctbGVmdDogMDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0cGFkZGluZy1sZWZ0OiA4cHg7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1sZWZ0OiAwO1xuXHRcdGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG5cdFx0Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgVGltZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuXHRkaXJlY3Rpb246IGx0cjtcblx0ZGlzcGxheTogZmxleDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUaW1lQ29udHJvbCA9ICh7XG5cdHZhbHVlLFxuXHRvbkNoYW5nZSxcblx0Li4uYXR0cmlidXRlc1xufTogVGltZUNvbnRyb2xQcm9wcykgPT4ge1xuXHQvLyBUaGUgYmFzZSBwcm9wcy5cblx0Y29uc3QgeyBiYXNlQ29udHJvbFByb3BzLCBjb250cm9sUHJvcHMgfSA9IHVzZUJhc2VDb250cm9sUHJvcHMoYXR0cmlidXRlcyk7XG5cdGNvbnN0IHBhcnRzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnOicpIDogWycwNycsICcwMCddO1xuXHRjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4ocGFydHNbMF0pO1xuXHRjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHBhcnRzWzFdKTtcblx0Y29uc3QgcGFkID0gKG46IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZCwgZmFsbGJhY2sgPSAnMDAnKSA9PiB7XG5cdFx0biA9IE51bWJlcihuKTtcblxuXHRcdGlmIChpc05hTihuKSkge1xuXHRcdFx0cmV0dXJuIGZhbGxiYWNrO1xuXHRcdH1cblxuXHRcdGlmIChuIDwgMTApIHtcblx0XHRcdHJldHVybiBgMCR7bn1gO1xuXHRcdH1cblxuXHRcdHJldHVybiBuO1xuXHR9O1xuXG5cdGNvbnN0IGxvY2FsVmFsdWUgPSBgJHtwYWQoaG91cnMpfToke3BhZChtaW51dGVzKX1gO1xuXG5cdHVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0aWYgKHZhbHVlICE9PSBsb2NhbFZhbHVlKSB7XG5cdFx0XHRvbkNoYW5nZShsb2NhbFZhbHVlKTtcblx0XHR9XG5cdH0sIFtsb2NhbFZhbHVlXSk7XG5cblx0Ly8gUmVuZGVyIHRoZSBjb250cm9sLlxuXHRyZXR1cm4gKFxuXHRcdDxCYXNlQ29udHJvbCB7Li4uYmFzZUNvbnRyb2xQcm9wc30+XG5cdFx0XHQ8SFN0YWNrPlxuXHRcdFx0XHQ8VGltZVdyYXBwZXI+XG5cdFx0XHRcdFx0PEhvdXJzSW5wdXRcblx0XHRcdFx0XHRcdHZhbHVlPXtwYWQoaG91cnMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldEhvdXJzfVxuXHRcdFx0XHRcdFx0bWluPXswfVxuXHRcdFx0XHRcdFx0bWF4PXsyM31cblx0XHRcdFx0XHRcdHN0ZXA9ezF9XG5cdFx0XHRcdFx0XHR7Li4uY29udHJvbFByb3BzfVxuXHRcdFx0XHRcdFx0bGFiZWw9e19fKCdIb3VycycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PFRpbWVTZXBhcmF0b3IgYXJpYS1oaWRkZW49XCJ0cnVlXCI+OjwvVGltZVNlcGFyYXRvcj5cblx0XHRcdFx0XHQ8TWludXRlc0lucHV0XG5cdFx0XHRcdFx0XHR2YWx1ZT17cGFkKG1pbnV0ZXMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldE1pbnV0ZXN9XG5cdFx0XHRcdFx0XHRtaW49ezB9XG5cdFx0XHRcdFx0XHRtYXg9ezU5fVxuXHRcdFx0XHRcdFx0c3RlcD17MX1cblx0XHRcdFx0XHRcdGxhYmVsPXtfXygnTWludXRlcycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvVGltZVdyYXBwZXI+XG5cdFx0XHRcdDxUaW1lWm9uZSAvPlxuXHRcdFx0PC9IU3RhY2s+XG5cdFx0PC9CYXNlQ29udHJvbD5cblx0KTtcbn07XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});

/**
 * Displays timezone information when user timezone is different from site
 * timezone.
 */
const TimeZone = () => {
  const {
    timezone
  } = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_3__.getSettings)();

  // Convert timezone offset to hours.
  const userTimezoneOffset = -1 * (new Date().getTimezoneOffset() / 60);

  // System timezone and user timezone match, nothing needed.
  // Compare as numbers because it comes over as string.
  if (Number(timezone.offset) === userTimezoneOffset) {
    return null;
  }
  const offsetSymbol = Number(timezone.offset) >= 0 ? '+' : '';
  const zoneAbbr = '' !== timezone.abbr && isNaN(Number(timezone.abbr)) ? timezone.abbr : `UTC${offsetSymbol}${timezone.offset}`;

  // Replace underscore with space in strings like `America/Costa_Rica`.
  const prettyTimezoneString = timezone.string.replace('_', ' ');
  const timezoneDetail = 'UTC' === timezone.string ? 'Coordinated Universal Time' : `(${zoneAbbr}) ${prettyTimezoneString}`;

  // When the prettyTimezoneString is empty, there is no additional timezone
  // detail information to show in a Tooltip.
  const hasNoAdditionalTimezoneDetail = prettyTimezoneString.trim().length === 0;
  return hasNoAdditionalTimezoneDetail ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(StyledTimeZone, {
    className: "components-datetime__timezone",
    children: zoneAbbr
  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Tooltip, {
    placement: "top",
    text: timezoneDetail,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(StyledTimeZone, {
      className: "components-datetime__timezone",
      children: zoneAbbr
    })
  });
};
const TimeSeparator = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])("span",  false ? 0 : {
  target: "e1volm183",
  label: "TimeSeparator"
})( false ? 0 : {
  name: "19v4w20",
  styles: "border-top:1px solid #757575;border-bottom:1px solid #757575;display:inline-flex;align-items:center/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxhcHBcXGxhcmFnb25cXHd3d1xcbm9wdGluXFx3cC1jb250ZW50XFxwbHVnaW5zXFxoaXp6bGV3cFxccGFja2FnZXNcXGNvbXBvbmVudHNcXHNyY1xcY29tcG9uZW50c1xcaW5wdXRcXHRpbWUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTRHaUMiLCJmaWxlIjoiQzpcXGFwcFxcbGFyYWdvblxcd3d3XFxub3B0aW5cXHdwLWNvbnRlbnRcXHBsdWdpbnNcXGhpenpsZXdwXFxwYWNrYWdlc1xcY29tcG9uZW50c1xcc3JjXFxjb21wb25lbnRzXFxpbnB1dFxcdGltZS50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEV4dGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcblxuLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IF9fIH0gZnJvbSAnQHdvcmRwcmVzcy9pMThuJztcbmltcG9ydCB7IGdldFNldHRpbmdzIGFzIGdldERhdGVTZXR0aW5ncyB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0ZSc7XG5pbXBvcnQge1xuXHRfX2V4cGVyaW1lbnRhbE51bWJlckNvbnRyb2wgYXMgTnVtYmVyQ29udHJvbCxcblx0VG9vbHRpcCxcblx0QmFzZUNvbnRyb2wsXG5cdHVzZUJhc2VDb250cm9sUHJvcHMsXG5cdF9fZXhwZXJpbWVudGFsSFN0YWNrIGFzIEhTdGFjayxcbn0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzJztcblxuaW1wb3J0IHR5cGUgeyBCYXNlQ29udHJvbFByb3BzIH0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzL3NyYy9iYXNlLWNvbnRyb2wvdHlwZXMnO1xuXG5pbnRlcmZhY2UgVGltZUNvbnRyb2xQcm9wcyBleHRlbmRzIE9taXQ8QmFzZUNvbnRyb2xQcm9wcywgJ2NoaWxkcmVuJz4ge1xuXHQvKipcblx0ICogVGhlIHZhbHVlIG9mIHRoZSB0aW1lIGNvbnRyb2wuXG5cdCAqL1xuXHR2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgb25DaGFuZ2UgaGFuZGxlci5cblx0ICovXG5cdG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIElucHV0Q29udHJvbCByZWR1Y2VyIHVzZWQgdG8gcGFkIGFuIGlucHV0IHNvIHRoYXQgaXQgaXMgYWx3YXlzIGFcbiAqIGdpdmVuIHdpZHRoLiBGb3IgZXhhbXBsZSwgdGhlIGhvdXJzIGFuZCBtaW51dGVzIGlucHV0cyBhcmUgcGFkZGVkIHRvIDIgc29cbiAqIHRoYXQgJzQnIGFwcGVhcnMgYXMgJzA0Jy5cbiAqXG4gKiBAcGFyYW0gcGFkIEhvdyBtYW55IGRpZ2l0cyB0aGUgdmFsdWUgc2hvdWxkIGJlLlxuICovXG5mdW5jdGlvbiBidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKHBhZDogbnVtYmVyKSB7XG5cdHJldHVybiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuXHRcdGNvbnN0IG5leHRTdGF0ZSA9IHsgLi4uc3RhdGUgfTtcblx0XHRpZiAoXG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ0NPTU1JVCcgfHxcblx0XHRcdGFjdGlvbi50eXBlID09PSAnUFJFU1NfVVAnIHx8XG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ1BSRVNTX0RPV04nXG5cdFx0KSB7XG5cdFx0XHRpZiAobmV4dFN0YXRlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bmV4dFN0YXRlLnZhbHVlID0gbmV4dFN0YXRlLnZhbHVlLnRvU3RyaW5nKCkucGFkU3RhcnQocGFkLCAnMCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbmV4dFN0YXRlO1xuXHR9O1xufVxuXG5jb25zdCBTdHlsZWRUaW1lWm9uZSA9IHN0eWxlZC5kaXZgXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcbmA7XG5cbi8qKlxuICogRGlzcGxheXMgdGltZXpvbmUgaW5mb3JtYXRpb24gd2hlbiB1c2VyIHRpbWV6b25lIGlzIGRpZmZlcmVudCBmcm9tIHNpdGVcbiAqIHRpbWV6b25lLlxuICovXG5leHBvcnQgY29uc3QgVGltZVpvbmUgPSAoKSA9PiB7XG5cdGNvbnN0IHsgdGltZXpvbmUgfSA9IGdldERhdGVTZXR0aW5ncygpO1xuXG5cdC8vIENvbnZlcnQgdGltZXpvbmUgb2Zmc2V0IHRvIGhvdXJzLlxuXHRjb25zdCB1c2VyVGltZXpvbmVPZmZzZXQgPSAtMSAqIChuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG5cblx0Ly8gU3lzdGVtIHRpbWV6b25lIGFuZCB1c2VyIHRpbWV6b25lIG1hdGNoLCBub3RoaW5nIG5lZWRlZC5cblx0Ly8gQ29tcGFyZSBhcyBudW1iZXJzIGJlY2F1c2UgaXQgY29tZXMgb3ZlciBhcyBzdHJpbmcuXG5cdGlmIChOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA9PT0gdXNlclRpbWV6b25lT2Zmc2V0KSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRjb25zdCBvZmZzZXRTeW1ib2wgPSBOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA+PSAwID8gJysnIDogJyc7XG5cdGNvbnN0IHpvbmVBYmJyID1cblx0XHQnJyAhPT0gdGltZXpvbmUuYWJiciAmJiBpc05hTihOdW1iZXIodGltZXpvbmUuYWJicikpXG5cdFx0XHQ/IHRpbWV6b25lLmFiYnJcblx0XHRcdDogYFVUQyR7b2Zmc2V0U3ltYm9sfSR7dGltZXpvbmUub2Zmc2V0fWA7XG5cblx0Ly8gUmVwbGFjZSB1bmRlcnNjb3JlIHdpdGggc3BhY2UgaW4gc3RyaW5ncyBsaWtlIGBBbWVyaWNhL0Nvc3RhX1JpY2FgLlxuXHRjb25zdCBwcmV0dHlUaW1lem9uZVN0cmluZyA9IHRpbWV6b25lLnN0cmluZy5yZXBsYWNlKCdfJywgJyAnKTtcblxuXHRjb25zdCB0aW1lem9uZURldGFpbCA9XG5cdFx0J1VUQycgPT09IHRpbWV6b25lLnN0cmluZ1xuXHRcdFx0PyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnXG5cdFx0XHQ6IGAoJHt6b25lQWJicn0pICR7cHJldHR5VGltZXpvbmVTdHJpbmd9YDtcblxuXHQvLyBXaGVuIHRoZSBwcmV0dHlUaW1lem9uZVN0cmluZyBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gYWRkaXRpb25hbCB0aW1lem9uZVxuXHQvLyBkZXRhaWwgaW5mb3JtYXRpb24gdG8gc2hvdyBpbiBhIFRvb2x0aXAuXG5cdGNvbnN0IGhhc05vQWRkaXRpb25hbFRpbWV6b25lRGV0YWlsID1cblx0XHRwcmV0dHlUaW1lem9uZVN0cmluZy50cmltKCkubGVuZ3RoID09PSAwO1xuXG5cdHJldHVybiBoYXNOb0FkZGl0aW9uYWxUaW1lem9uZURldGFpbCA/IChcblx0XHQ8U3R5bGVkVGltZVpvbmUgY2xhc3NOYW1lPVwiY29tcG9uZW50cy1kYXRldGltZV9fdGltZXpvbmVcIj5cblx0XHRcdHt6b25lQWJicn1cblx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHQpIDogKFxuXHRcdDxUb29sdGlwIHBsYWNlbWVudD1cInRvcFwiIHRleHQ9e3RpbWV6b25lRGV0YWlsfT5cblx0XHRcdDxTdHlsZWRUaW1lWm9uZSBjbGFzc05hbWU9XCJjb21wb25lbnRzLWRhdGV0aW1lX190aW1lem9uZVwiPlxuXHRcdFx0XHR7em9uZUFiYnJ9XG5cdFx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHRcdDwvVG9vbHRpcD5cblx0KTtcbn07XG5cbmNvbnN0IFRpbWVTZXBhcmF0b3IgPSBzdHlsZWQuc3BhbmBcblx0Ym9yZGVyLXRvcDogMXB4IHNvbGlkICM3NTc1NzU7XG5cdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjNzU3NTc1O1xuXHRkaXNwbGF5OiBpbmxpbmUtZmxleDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmNvbnN0IEhvdXJzSW5wdXQgPSBzdHlsZWQoTnVtYmVyQ29udHJvbClgXG5cdHdpZHRoOiAzNnB4O1xuXG5cdCYmJiAuY29tcG9uZW50cy1pbnB1dC1jb250cm9sX19pbnB1dCB7XG5cdFx0cGFkZGluZy1yaWdodDogMDtcblx0XHRwYWRkaW5nLWxlZnQ6IDhweDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1yaWdodDogMDtcblx0XHRib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcblx0XHRib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgTWludXRlc0lucHV0ID0gc3R5bGVkKE51bWJlckNvbnRyb2wpYFxuXHR3aWR0aDogMzZweDtcblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9faW5wdXQge1xuXHRcdHBhZGRpbmctbGVmdDogMDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0cGFkZGluZy1sZWZ0OiA4cHg7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1sZWZ0OiAwO1xuXHRcdGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG5cdFx0Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgVGltZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuXHRkaXJlY3Rpb246IGx0cjtcblx0ZGlzcGxheTogZmxleDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUaW1lQ29udHJvbCA9ICh7XG5cdHZhbHVlLFxuXHRvbkNoYW5nZSxcblx0Li4uYXR0cmlidXRlc1xufTogVGltZUNvbnRyb2xQcm9wcykgPT4ge1xuXHQvLyBUaGUgYmFzZSBwcm9wcy5cblx0Y29uc3QgeyBiYXNlQ29udHJvbFByb3BzLCBjb250cm9sUHJvcHMgfSA9IHVzZUJhc2VDb250cm9sUHJvcHMoYXR0cmlidXRlcyk7XG5cdGNvbnN0IHBhcnRzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnOicpIDogWycwNycsICcwMCddO1xuXHRjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4ocGFydHNbMF0pO1xuXHRjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHBhcnRzWzFdKTtcblx0Y29uc3QgcGFkID0gKG46IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZCwgZmFsbGJhY2sgPSAnMDAnKSA9PiB7XG5cdFx0biA9IE51bWJlcihuKTtcblxuXHRcdGlmIChpc05hTihuKSkge1xuXHRcdFx0cmV0dXJuIGZhbGxiYWNrO1xuXHRcdH1cblxuXHRcdGlmIChuIDwgMTApIHtcblx0XHRcdHJldHVybiBgMCR7bn1gO1xuXHRcdH1cblxuXHRcdHJldHVybiBuO1xuXHR9O1xuXG5cdGNvbnN0IGxvY2FsVmFsdWUgPSBgJHtwYWQoaG91cnMpfToke3BhZChtaW51dGVzKX1gO1xuXG5cdHVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0aWYgKHZhbHVlICE9PSBsb2NhbFZhbHVlKSB7XG5cdFx0XHRvbkNoYW5nZShsb2NhbFZhbHVlKTtcblx0XHR9XG5cdH0sIFtsb2NhbFZhbHVlXSk7XG5cblx0Ly8gUmVuZGVyIHRoZSBjb250cm9sLlxuXHRyZXR1cm4gKFxuXHRcdDxCYXNlQ29udHJvbCB7Li4uYmFzZUNvbnRyb2xQcm9wc30+XG5cdFx0XHQ8SFN0YWNrPlxuXHRcdFx0XHQ8VGltZVdyYXBwZXI+XG5cdFx0XHRcdFx0PEhvdXJzSW5wdXRcblx0XHRcdFx0XHRcdHZhbHVlPXtwYWQoaG91cnMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldEhvdXJzfVxuXHRcdFx0XHRcdFx0bWluPXswfVxuXHRcdFx0XHRcdFx0bWF4PXsyM31cblx0XHRcdFx0XHRcdHN0ZXA9ezF9XG5cdFx0XHRcdFx0XHR7Li4uY29udHJvbFByb3BzfVxuXHRcdFx0XHRcdFx0bGFiZWw9e19fKCdIb3VycycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PFRpbWVTZXBhcmF0b3IgYXJpYS1oaWRkZW49XCJ0cnVlXCI+OjwvVGltZVNlcGFyYXRvcj5cblx0XHRcdFx0XHQ8TWludXRlc0lucHV0XG5cdFx0XHRcdFx0XHR2YWx1ZT17cGFkKG1pbnV0ZXMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldE1pbnV0ZXN9XG5cdFx0XHRcdFx0XHRtaW49ezB9XG5cdFx0XHRcdFx0XHRtYXg9ezU5fVxuXHRcdFx0XHRcdFx0c3RlcD17MX1cblx0XHRcdFx0XHRcdGxhYmVsPXtfXygnTWludXRlcycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvVGltZVdyYXBwZXI+XG5cdFx0XHRcdDxUaW1lWm9uZSAvPlxuXHRcdFx0PC9IU3RhY2s+XG5cdFx0PC9CYXNlQ29udHJvbD5cblx0KTtcbn07XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});
const HoursInput = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalNumberControl,  false ? 0 : {
  target: "e1volm182",
  label: "HoursInput"
})( false ? 0 : {
  name: "hzif79",
  styles: "width:36px;&&& .components-input-control__input{padding-right:0;padding-left:8px;text-align:center;}&&& .components-input-control__backdrop{border-right:0;border-top-right-radius:0;border-bottom-right-radius:0;}/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxhcHBcXGxhcmFnb25cXHd3d1xcbm9wdGluXFx3cC1jb250ZW50XFxwbHVnaW5zXFxoaXp6bGV3cFxccGFja2FnZXNcXGNvbXBvbmVudHNcXHNyY1xcY29tcG9uZW50c1xcaW5wdXRcXHRpbWUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1Id0MiLCJmaWxlIjoiQzpcXGFwcFxcbGFyYWdvblxcd3d3XFxub3B0aW5cXHdwLWNvbnRlbnRcXHBsdWdpbnNcXGhpenpsZXdwXFxwYWNrYWdlc1xcY29tcG9uZW50c1xcc3JjXFxjb21wb25lbnRzXFxpbnB1dFxcdGltZS50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEV4dGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcblxuLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IF9fIH0gZnJvbSAnQHdvcmRwcmVzcy9pMThuJztcbmltcG9ydCB7IGdldFNldHRpbmdzIGFzIGdldERhdGVTZXR0aW5ncyB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0ZSc7XG5pbXBvcnQge1xuXHRfX2V4cGVyaW1lbnRhbE51bWJlckNvbnRyb2wgYXMgTnVtYmVyQ29udHJvbCxcblx0VG9vbHRpcCxcblx0QmFzZUNvbnRyb2wsXG5cdHVzZUJhc2VDb250cm9sUHJvcHMsXG5cdF9fZXhwZXJpbWVudGFsSFN0YWNrIGFzIEhTdGFjayxcbn0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzJztcblxuaW1wb3J0IHR5cGUgeyBCYXNlQ29udHJvbFByb3BzIH0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzL3NyYy9iYXNlLWNvbnRyb2wvdHlwZXMnO1xuXG5pbnRlcmZhY2UgVGltZUNvbnRyb2xQcm9wcyBleHRlbmRzIE9taXQ8QmFzZUNvbnRyb2xQcm9wcywgJ2NoaWxkcmVuJz4ge1xuXHQvKipcblx0ICogVGhlIHZhbHVlIG9mIHRoZSB0aW1lIGNvbnRyb2wuXG5cdCAqL1xuXHR2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgb25DaGFuZ2UgaGFuZGxlci5cblx0ICovXG5cdG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIElucHV0Q29udHJvbCByZWR1Y2VyIHVzZWQgdG8gcGFkIGFuIGlucHV0IHNvIHRoYXQgaXQgaXMgYWx3YXlzIGFcbiAqIGdpdmVuIHdpZHRoLiBGb3IgZXhhbXBsZSwgdGhlIGhvdXJzIGFuZCBtaW51dGVzIGlucHV0cyBhcmUgcGFkZGVkIHRvIDIgc29cbiAqIHRoYXQgJzQnIGFwcGVhcnMgYXMgJzA0Jy5cbiAqXG4gKiBAcGFyYW0gcGFkIEhvdyBtYW55IGRpZ2l0cyB0aGUgdmFsdWUgc2hvdWxkIGJlLlxuICovXG5mdW5jdGlvbiBidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKHBhZDogbnVtYmVyKSB7XG5cdHJldHVybiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuXHRcdGNvbnN0IG5leHRTdGF0ZSA9IHsgLi4uc3RhdGUgfTtcblx0XHRpZiAoXG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ0NPTU1JVCcgfHxcblx0XHRcdGFjdGlvbi50eXBlID09PSAnUFJFU1NfVVAnIHx8XG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ1BSRVNTX0RPV04nXG5cdFx0KSB7XG5cdFx0XHRpZiAobmV4dFN0YXRlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bmV4dFN0YXRlLnZhbHVlID0gbmV4dFN0YXRlLnZhbHVlLnRvU3RyaW5nKCkucGFkU3RhcnQocGFkLCAnMCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbmV4dFN0YXRlO1xuXHR9O1xufVxuXG5jb25zdCBTdHlsZWRUaW1lWm9uZSA9IHN0eWxlZC5kaXZgXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcbmA7XG5cbi8qKlxuICogRGlzcGxheXMgdGltZXpvbmUgaW5mb3JtYXRpb24gd2hlbiB1c2VyIHRpbWV6b25lIGlzIGRpZmZlcmVudCBmcm9tIHNpdGVcbiAqIHRpbWV6b25lLlxuICovXG5leHBvcnQgY29uc3QgVGltZVpvbmUgPSAoKSA9PiB7XG5cdGNvbnN0IHsgdGltZXpvbmUgfSA9IGdldERhdGVTZXR0aW5ncygpO1xuXG5cdC8vIENvbnZlcnQgdGltZXpvbmUgb2Zmc2V0IHRvIGhvdXJzLlxuXHRjb25zdCB1c2VyVGltZXpvbmVPZmZzZXQgPSAtMSAqIChuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG5cblx0Ly8gU3lzdGVtIHRpbWV6b25lIGFuZCB1c2VyIHRpbWV6b25lIG1hdGNoLCBub3RoaW5nIG5lZWRlZC5cblx0Ly8gQ29tcGFyZSBhcyBudW1iZXJzIGJlY2F1c2UgaXQgY29tZXMgb3ZlciBhcyBzdHJpbmcuXG5cdGlmIChOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA9PT0gdXNlclRpbWV6b25lT2Zmc2V0KSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRjb25zdCBvZmZzZXRTeW1ib2wgPSBOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA+PSAwID8gJysnIDogJyc7XG5cdGNvbnN0IHpvbmVBYmJyID1cblx0XHQnJyAhPT0gdGltZXpvbmUuYWJiciAmJiBpc05hTihOdW1iZXIodGltZXpvbmUuYWJicikpXG5cdFx0XHQ/IHRpbWV6b25lLmFiYnJcblx0XHRcdDogYFVUQyR7b2Zmc2V0U3ltYm9sfSR7dGltZXpvbmUub2Zmc2V0fWA7XG5cblx0Ly8gUmVwbGFjZSB1bmRlcnNjb3JlIHdpdGggc3BhY2UgaW4gc3RyaW5ncyBsaWtlIGBBbWVyaWNhL0Nvc3RhX1JpY2FgLlxuXHRjb25zdCBwcmV0dHlUaW1lem9uZVN0cmluZyA9IHRpbWV6b25lLnN0cmluZy5yZXBsYWNlKCdfJywgJyAnKTtcblxuXHRjb25zdCB0aW1lem9uZURldGFpbCA9XG5cdFx0J1VUQycgPT09IHRpbWV6b25lLnN0cmluZ1xuXHRcdFx0PyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnXG5cdFx0XHQ6IGAoJHt6b25lQWJicn0pICR7cHJldHR5VGltZXpvbmVTdHJpbmd9YDtcblxuXHQvLyBXaGVuIHRoZSBwcmV0dHlUaW1lem9uZVN0cmluZyBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gYWRkaXRpb25hbCB0aW1lem9uZVxuXHQvLyBkZXRhaWwgaW5mb3JtYXRpb24gdG8gc2hvdyBpbiBhIFRvb2x0aXAuXG5cdGNvbnN0IGhhc05vQWRkaXRpb25hbFRpbWV6b25lRGV0YWlsID1cblx0XHRwcmV0dHlUaW1lem9uZVN0cmluZy50cmltKCkubGVuZ3RoID09PSAwO1xuXG5cdHJldHVybiBoYXNOb0FkZGl0aW9uYWxUaW1lem9uZURldGFpbCA/IChcblx0XHQ8U3R5bGVkVGltZVpvbmUgY2xhc3NOYW1lPVwiY29tcG9uZW50cy1kYXRldGltZV9fdGltZXpvbmVcIj5cblx0XHRcdHt6b25lQWJicn1cblx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHQpIDogKFxuXHRcdDxUb29sdGlwIHBsYWNlbWVudD1cInRvcFwiIHRleHQ9e3RpbWV6b25lRGV0YWlsfT5cblx0XHRcdDxTdHlsZWRUaW1lWm9uZSBjbGFzc05hbWU9XCJjb21wb25lbnRzLWRhdGV0aW1lX190aW1lem9uZVwiPlxuXHRcdFx0XHR7em9uZUFiYnJ9XG5cdFx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHRcdDwvVG9vbHRpcD5cblx0KTtcbn07XG5cbmNvbnN0IFRpbWVTZXBhcmF0b3IgPSBzdHlsZWQuc3BhbmBcblx0Ym9yZGVyLXRvcDogMXB4IHNvbGlkICM3NTc1NzU7XG5cdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjNzU3NTc1O1xuXHRkaXNwbGF5OiBpbmxpbmUtZmxleDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmNvbnN0IEhvdXJzSW5wdXQgPSBzdHlsZWQoTnVtYmVyQ29udHJvbClgXG5cdHdpZHRoOiAzNnB4O1xuXG5cdCYmJiAuY29tcG9uZW50cy1pbnB1dC1jb250cm9sX19pbnB1dCB7XG5cdFx0cGFkZGluZy1yaWdodDogMDtcblx0XHRwYWRkaW5nLWxlZnQ6IDhweDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1yaWdodDogMDtcblx0XHRib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcblx0XHRib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgTWludXRlc0lucHV0ID0gc3R5bGVkKE51bWJlckNvbnRyb2wpYFxuXHR3aWR0aDogMzZweDtcblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9faW5wdXQge1xuXHRcdHBhZGRpbmctbGVmdDogMDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0cGFkZGluZy1sZWZ0OiA4cHg7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1sZWZ0OiAwO1xuXHRcdGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG5cdFx0Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgVGltZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuXHRkaXJlY3Rpb246IGx0cjtcblx0ZGlzcGxheTogZmxleDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUaW1lQ29udHJvbCA9ICh7XG5cdHZhbHVlLFxuXHRvbkNoYW5nZSxcblx0Li4uYXR0cmlidXRlc1xufTogVGltZUNvbnRyb2xQcm9wcykgPT4ge1xuXHQvLyBUaGUgYmFzZSBwcm9wcy5cblx0Y29uc3QgeyBiYXNlQ29udHJvbFByb3BzLCBjb250cm9sUHJvcHMgfSA9IHVzZUJhc2VDb250cm9sUHJvcHMoYXR0cmlidXRlcyk7XG5cdGNvbnN0IHBhcnRzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnOicpIDogWycwNycsICcwMCddO1xuXHRjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4ocGFydHNbMF0pO1xuXHRjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHBhcnRzWzFdKTtcblx0Y29uc3QgcGFkID0gKG46IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZCwgZmFsbGJhY2sgPSAnMDAnKSA9PiB7XG5cdFx0biA9IE51bWJlcihuKTtcblxuXHRcdGlmIChpc05hTihuKSkge1xuXHRcdFx0cmV0dXJuIGZhbGxiYWNrO1xuXHRcdH1cblxuXHRcdGlmIChuIDwgMTApIHtcblx0XHRcdHJldHVybiBgMCR7bn1gO1xuXHRcdH1cblxuXHRcdHJldHVybiBuO1xuXHR9O1xuXG5cdGNvbnN0IGxvY2FsVmFsdWUgPSBgJHtwYWQoaG91cnMpfToke3BhZChtaW51dGVzKX1gO1xuXG5cdHVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0aWYgKHZhbHVlICE9PSBsb2NhbFZhbHVlKSB7XG5cdFx0XHRvbkNoYW5nZShsb2NhbFZhbHVlKTtcblx0XHR9XG5cdH0sIFtsb2NhbFZhbHVlXSk7XG5cblx0Ly8gUmVuZGVyIHRoZSBjb250cm9sLlxuXHRyZXR1cm4gKFxuXHRcdDxCYXNlQ29udHJvbCB7Li4uYmFzZUNvbnRyb2xQcm9wc30+XG5cdFx0XHQ8SFN0YWNrPlxuXHRcdFx0XHQ8VGltZVdyYXBwZXI+XG5cdFx0XHRcdFx0PEhvdXJzSW5wdXRcblx0XHRcdFx0XHRcdHZhbHVlPXtwYWQoaG91cnMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldEhvdXJzfVxuXHRcdFx0XHRcdFx0bWluPXswfVxuXHRcdFx0XHRcdFx0bWF4PXsyM31cblx0XHRcdFx0XHRcdHN0ZXA9ezF9XG5cdFx0XHRcdFx0XHR7Li4uY29udHJvbFByb3BzfVxuXHRcdFx0XHRcdFx0bGFiZWw9e19fKCdIb3VycycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PFRpbWVTZXBhcmF0b3IgYXJpYS1oaWRkZW49XCJ0cnVlXCI+OjwvVGltZVNlcGFyYXRvcj5cblx0XHRcdFx0XHQ8TWludXRlc0lucHV0XG5cdFx0XHRcdFx0XHR2YWx1ZT17cGFkKG1pbnV0ZXMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldE1pbnV0ZXN9XG5cdFx0XHRcdFx0XHRtaW49ezB9XG5cdFx0XHRcdFx0XHRtYXg9ezU5fVxuXHRcdFx0XHRcdFx0c3RlcD17MX1cblx0XHRcdFx0XHRcdGxhYmVsPXtfXygnTWludXRlcycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvVGltZVdyYXBwZXI+XG5cdFx0XHRcdDxUaW1lWm9uZSAvPlxuXHRcdFx0PC9IU3RhY2s+XG5cdFx0PC9CYXNlQ29udHJvbD5cblx0KTtcbn07XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});
const MinutesInput = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalNumberControl,  false ? 0 : {
  target: "e1volm181",
  label: "MinutesInput"
})( false ? 0 : {
  name: "uykxvl",
  styles: "width:36px;&&& .components-input-control__input{padding-left:0;text-align:center;padding-left:8px;}&&& .components-input-control__backdrop{border-left:0;border-top-left-radius:0;border-bottom-left-radius:0;}/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxhcHBcXGxhcmFnb25cXHd3d1xcbm9wdGluXFx3cC1jb250ZW50XFxwbHVnaW5zXFxoaXp6bGV3cFxccGFja2FnZXNcXGNvbXBvbmVudHNcXHNyY1xcY29tcG9uZW50c1xcaW5wdXRcXHRpbWUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1JMEMiLCJmaWxlIjoiQzpcXGFwcFxcbGFyYWdvblxcd3d3XFxub3B0aW5cXHdwLWNvbnRlbnRcXHBsdWdpbnNcXGhpenpsZXdwXFxwYWNrYWdlc1xcY29tcG9uZW50c1xcc3JjXFxjb21wb25lbnRzXFxpbnB1dFxcdGltZS50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEV4dGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcblxuLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IF9fIH0gZnJvbSAnQHdvcmRwcmVzcy9pMThuJztcbmltcG9ydCB7IGdldFNldHRpbmdzIGFzIGdldERhdGVTZXR0aW5ncyB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0ZSc7XG5pbXBvcnQge1xuXHRfX2V4cGVyaW1lbnRhbE51bWJlckNvbnRyb2wgYXMgTnVtYmVyQ29udHJvbCxcblx0VG9vbHRpcCxcblx0QmFzZUNvbnRyb2wsXG5cdHVzZUJhc2VDb250cm9sUHJvcHMsXG5cdF9fZXhwZXJpbWVudGFsSFN0YWNrIGFzIEhTdGFjayxcbn0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzJztcblxuaW1wb3J0IHR5cGUgeyBCYXNlQ29udHJvbFByb3BzIH0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzL3NyYy9iYXNlLWNvbnRyb2wvdHlwZXMnO1xuXG5pbnRlcmZhY2UgVGltZUNvbnRyb2xQcm9wcyBleHRlbmRzIE9taXQ8QmFzZUNvbnRyb2xQcm9wcywgJ2NoaWxkcmVuJz4ge1xuXHQvKipcblx0ICogVGhlIHZhbHVlIG9mIHRoZSB0aW1lIGNvbnRyb2wuXG5cdCAqL1xuXHR2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgb25DaGFuZ2UgaGFuZGxlci5cblx0ICovXG5cdG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIElucHV0Q29udHJvbCByZWR1Y2VyIHVzZWQgdG8gcGFkIGFuIGlucHV0IHNvIHRoYXQgaXQgaXMgYWx3YXlzIGFcbiAqIGdpdmVuIHdpZHRoLiBGb3IgZXhhbXBsZSwgdGhlIGhvdXJzIGFuZCBtaW51dGVzIGlucHV0cyBhcmUgcGFkZGVkIHRvIDIgc29cbiAqIHRoYXQgJzQnIGFwcGVhcnMgYXMgJzA0Jy5cbiAqXG4gKiBAcGFyYW0gcGFkIEhvdyBtYW55IGRpZ2l0cyB0aGUgdmFsdWUgc2hvdWxkIGJlLlxuICovXG5mdW5jdGlvbiBidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKHBhZDogbnVtYmVyKSB7XG5cdHJldHVybiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuXHRcdGNvbnN0IG5leHRTdGF0ZSA9IHsgLi4uc3RhdGUgfTtcblx0XHRpZiAoXG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ0NPTU1JVCcgfHxcblx0XHRcdGFjdGlvbi50eXBlID09PSAnUFJFU1NfVVAnIHx8XG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ1BSRVNTX0RPV04nXG5cdFx0KSB7XG5cdFx0XHRpZiAobmV4dFN0YXRlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bmV4dFN0YXRlLnZhbHVlID0gbmV4dFN0YXRlLnZhbHVlLnRvU3RyaW5nKCkucGFkU3RhcnQocGFkLCAnMCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbmV4dFN0YXRlO1xuXHR9O1xufVxuXG5jb25zdCBTdHlsZWRUaW1lWm9uZSA9IHN0eWxlZC5kaXZgXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcbmA7XG5cbi8qKlxuICogRGlzcGxheXMgdGltZXpvbmUgaW5mb3JtYXRpb24gd2hlbiB1c2VyIHRpbWV6b25lIGlzIGRpZmZlcmVudCBmcm9tIHNpdGVcbiAqIHRpbWV6b25lLlxuICovXG5leHBvcnQgY29uc3QgVGltZVpvbmUgPSAoKSA9PiB7XG5cdGNvbnN0IHsgdGltZXpvbmUgfSA9IGdldERhdGVTZXR0aW5ncygpO1xuXG5cdC8vIENvbnZlcnQgdGltZXpvbmUgb2Zmc2V0IHRvIGhvdXJzLlxuXHRjb25zdCB1c2VyVGltZXpvbmVPZmZzZXQgPSAtMSAqIChuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG5cblx0Ly8gU3lzdGVtIHRpbWV6b25lIGFuZCB1c2VyIHRpbWV6b25lIG1hdGNoLCBub3RoaW5nIG5lZWRlZC5cblx0Ly8gQ29tcGFyZSBhcyBudW1iZXJzIGJlY2F1c2UgaXQgY29tZXMgb3ZlciBhcyBzdHJpbmcuXG5cdGlmIChOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA9PT0gdXNlclRpbWV6b25lT2Zmc2V0KSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRjb25zdCBvZmZzZXRTeW1ib2wgPSBOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA+PSAwID8gJysnIDogJyc7XG5cdGNvbnN0IHpvbmVBYmJyID1cblx0XHQnJyAhPT0gdGltZXpvbmUuYWJiciAmJiBpc05hTihOdW1iZXIodGltZXpvbmUuYWJicikpXG5cdFx0XHQ/IHRpbWV6b25lLmFiYnJcblx0XHRcdDogYFVUQyR7b2Zmc2V0U3ltYm9sfSR7dGltZXpvbmUub2Zmc2V0fWA7XG5cblx0Ly8gUmVwbGFjZSB1bmRlcnNjb3JlIHdpdGggc3BhY2UgaW4gc3RyaW5ncyBsaWtlIGBBbWVyaWNhL0Nvc3RhX1JpY2FgLlxuXHRjb25zdCBwcmV0dHlUaW1lem9uZVN0cmluZyA9IHRpbWV6b25lLnN0cmluZy5yZXBsYWNlKCdfJywgJyAnKTtcblxuXHRjb25zdCB0aW1lem9uZURldGFpbCA9XG5cdFx0J1VUQycgPT09IHRpbWV6b25lLnN0cmluZ1xuXHRcdFx0PyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnXG5cdFx0XHQ6IGAoJHt6b25lQWJicn0pICR7cHJldHR5VGltZXpvbmVTdHJpbmd9YDtcblxuXHQvLyBXaGVuIHRoZSBwcmV0dHlUaW1lem9uZVN0cmluZyBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gYWRkaXRpb25hbCB0aW1lem9uZVxuXHQvLyBkZXRhaWwgaW5mb3JtYXRpb24gdG8gc2hvdyBpbiBhIFRvb2x0aXAuXG5cdGNvbnN0IGhhc05vQWRkaXRpb25hbFRpbWV6b25lRGV0YWlsID1cblx0XHRwcmV0dHlUaW1lem9uZVN0cmluZy50cmltKCkubGVuZ3RoID09PSAwO1xuXG5cdHJldHVybiBoYXNOb0FkZGl0aW9uYWxUaW1lem9uZURldGFpbCA/IChcblx0XHQ8U3R5bGVkVGltZVpvbmUgY2xhc3NOYW1lPVwiY29tcG9uZW50cy1kYXRldGltZV9fdGltZXpvbmVcIj5cblx0XHRcdHt6b25lQWJicn1cblx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHQpIDogKFxuXHRcdDxUb29sdGlwIHBsYWNlbWVudD1cInRvcFwiIHRleHQ9e3RpbWV6b25lRGV0YWlsfT5cblx0XHRcdDxTdHlsZWRUaW1lWm9uZSBjbGFzc05hbWU9XCJjb21wb25lbnRzLWRhdGV0aW1lX190aW1lem9uZVwiPlxuXHRcdFx0XHR7em9uZUFiYnJ9XG5cdFx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHRcdDwvVG9vbHRpcD5cblx0KTtcbn07XG5cbmNvbnN0IFRpbWVTZXBhcmF0b3IgPSBzdHlsZWQuc3BhbmBcblx0Ym9yZGVyLXRvcDogMXB4IHNvbGlkICM3NTc1NzU7XG5cdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjNzU3NTc1O1xuXHRkaXNwbGF5OiBpbmxpbmUtZmxleDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmNvbnN0IEhvdXJzSW5wdXQgPSBzdHlsZWQoTnVtYmVyQ29udHJvbClgXG5cdHdpZHRoOiAzNnB4O1xuXG5cdCYmJiAuY29tcG9uZW50cy1pbnB1dC1jb250cm9sX19pbnB1dCB7XG5cdFx0cGFkZGluZy1yaWdodDogMDtcblx0XHRwYWRkaW5nLWxlZnQ6IDhweDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1yaWdodDogMDtcblx0XHRib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcblx0XHRib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgTWludXRlc0lucHV0ID0gc3R5bGVkKE51bWJlckNvbnRyb2wpYFxuXHR3aWR0aDogMzZweDtcblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9faW5wdXQge1xuXHRcdHBhZGRpbmctbGVmdDogMDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0cGFkZGluZy1sZWZ0OiA4cHg7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1sZWZ0OiAwO1xuXHRcdGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG5cdFx0Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgVGltZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuXHRkaXJlY3Rpb246IGx0cjtcblx0ZGlzcGxheTogZmxleDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUaW1lQ29udHJvbCA9ICh7XG5cdHZhbHVlLFxuXHRvbkNoYW5nZSxcblx0Li4uYXR0cmlidXRlc1xufTogVGltZUNvbnRyb2xQcm9wcykgPT4ge1xuXHQvLyBUaGUgYmFzZSBwcm9wcy5cblx0Y29uc3QgeyBiYXNlQ29udHJvbFByb3BzLCBjb250cm9sUHJvcHMgfSA9IHVzZUJhc2VDb250cm9sUHJvcHMoYXR0cmlidXRlcyk7XG5cdGNvbnN0IHBhcnRzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnOicpIDogWycwNycsICcwMCddO1xuXHRjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4ocGFydHNbMF0pO1xuXHRjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHBhcnRzWzFdKTtcblx0Y29uc3QgcGFkID0gKG46IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZCwgZmFsbGJhY2sgPSAnMDAnKSA9PiB7XG5cdFx0biA9IE51bWJlcihuKTtcblxuXHRcdGlmIChpc05hTihuKSkge1xuXHRcdFx0cmV0dXJuIGZhbGxiYWNrO1xuXHRcdH1cblxuXHRcdGlmIChuIDwgMTApIHtcblx0XHRcdHJldHVybiBgMCR7bn1gO1xuXHRcdH1cblxuXHRcdHJldHVybiBuO1xuXHR9O1xuXG5cdGNvbnN0IGxvY2FsVmFsdWUgPSBgJHtwYWQoaG91cnMpfToke3BhZChtaW51dGVzKX1gO1xuXG5cdHVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0aWYgKHZhbHVlICE9PSBsb2NhbFZhbHVlKSB7XG5cdFx0XHRvbkNoYW5nZShsb2NhbFZhbHVlKTtcblx0XHR9XG5cdH0sIFtsb2NhbFZhbHVlXSk7XG5cblx0Ly8gUmVuZGVyIHRoZSBjb250cm9sLlxuXHRyZXR1cm4gKFxuXHRcdDxCYXNlQ29udHJvbCB7Li4uYmFzZUNvbnRyb2xQcm9wc30+XG5cdFx0XHQ8SFN0YWNrPlxuXHRcdFx0XHQ8VGltZVdyYXBwZXI+XG5cdFx0XHRcdFx0PEhvdXJzSW5wdXRcblx0XHRcdFx0XHRcdHZhbHVlPXtwYWQoaG91cnMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldEhvdXJzfVxuXHRcdFx0XHRcdFx0bWluPXswfVxuXHRcdFx0XHRcdFx0bWF4PXsyM31cblx0XHRcdFx0XHRcdHN0ZXA9ezF9XG5cdFx0XHRcdFx0XHR7Li4uY29udHJvbFByb3BzfVxuXHRcdFx0XHRcdFx0bGFiZWw9e19fKCdIb3VycycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PFRpbWVTZXBhcmF0b3IgYXJpYS1oaWRkZW49XCJ0cnVlXCI+OjwvVGltZVNlcGFyYXRvcj5cblx0XHRcdFx0XHQ8TWludXRlc0lucHV0XG5cdFx0XHRcdFx0XHR2YWx1ZT17cGFkKG1pbnV0ZXMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldE1pbnV0ZXN9XG5cdFx0XHRcdFx0XHRtaW49ezB9XG5cdFx0XHRcdFx0XHRtYXg9ezU5fVxuXHRcdFx0XHRcdFx0c3RlcD17MX1cblx0XHRcdFx0XHRcdGxhYmVsPXtfXygnTWludXRlcycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvVGltZVdyYXBwZXI+XG5cdFx0XHRcdDxUaW1lWm9uZSAvPlxuXHRcdFx0PC9IU3RhY2s+XG5cdFx0PC9CYXNlQ29udHJvbD5cblx0KTtcbn07XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});
const TimeWrapper = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])("div",  false ? 0 : {
  target: "e1volm180",
  label: "TimeWrapper"
})( false ? 0 : {
  name: "pd0mhc",
  styles: "direction:ltr;display:flex/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxhcHBcXGxhcmFnb25cXHd3d1xcbm9wdGluXFx3cC1jb250ZW50XFxwbHVnaW5zXFxoaXp6bGV3cFxccGFja2FnZXNcXGNvbXBvbmVudHNcXHNyY1xcY29tcG9uZW50c1xcaW5wdXRcXHRpbWUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1KOEIiLCJmaWxlIjoiQzpcXGFwcFxcbGFyYWdvblxcd3d3XFxub3B0aW5cXHdwLWNvbnRlbnRcXHBsdWdpbnNcXGhpenpsZXdwXFxwYWNrYWdlc1xcY29tcG9uZW50c1xcc3JjXFxjb21wb25lbnRzXFxpbnB1dFxcdGltZS50c3giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEV4dGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJztcblxuLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IF9fIH0gZnJvbSAnQHdvcmRwcmVzcy9pMThuJztcbmltcG9ydCB7IGdldFNldHRpbmdzIGFzIGdldERhdGVTZXR0aW5ncyB9IGZyb20gJ0B3b3JkcHJlc3MvZGF0ZSc7XG5pbXBvcnQge1xuXHRfX2V4cGVyaW1lbnRhbE51bWJlckNvbnRyb2wgYXMgTnVtYmVyQ29udHJvbCxcblx0VG9vbHRpcCxcblx0QmFzZUNvbnRyb2wsXG5cdHVzZUJhc2VDb250cm9sUHJvcHMsXG5cdF9fZXhwZXJpbWVudGFsSFN0YWNrIGFzIEhTdGFjayxcbn0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzJztcblxuaW1wb3J0IHR5cGUgeyBCYXNlQ29udHJvbFByb3BzIH0gZnJvbSAnQHdvcmRwcmVzcy9jb21wb25lbnRzL3NyYy9iYXNlLWNvbnRyb2wvdHlwZXMnO1xuXG5pbnRlcmZhY2UgVGltZUNvbnRyb2xQcm9wcyBleHRlbmRzIE9taXQ8QmFzZUNvbnRyb2xQcm9wcywgJ2NoaWxkcmVuJz4ge1xuXHQvKipcblx0ICogVGhlIHZhbHVlIG9mIHRoZSB0aW1lIGNvbnRyb2wuXG5cdCAqL1xuXHR2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBUaGUgb25DaGFuZ2UgaGFuZGxlci5cblx0ICovXG5cdG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIElucHV0Q29udHJvbCByZWR1Y2VyIHVzZWQgdG8gcGFkIGFuIGlucHV0IHNvIHRoYXQgaXQgaXMgYWx3YXlzIGFcbiAqIGdpdmVuIHdpZHRoLiBGb3IgZXhhbXBsZSwgdGhlIGhvdXJzIGFuZCBtaW51dGVzIGlucHV0cyBhcmUgcGFkZGVkIHRvIDIgc29cbiAqIHRoYXQgJzQnIGFwcGVhcnMgYXMgJzA0Jy5cbiAqXG4gKiBAcGFyYW0gcGFkIEhvdyBtYW55IGRpZ2l0cyB0aGUgdmFsdWUgc2hvdWxkIGJlLlxuICovXG5mdW5jdGlvbiBidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKHBhZDogbnVtYmVyKSB7XG5cdHJldHVybiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuXHRcdGNvbnN0IG5leHRTdGF0ZSA9IHsgLi4uc3RhdGUgfTtcblx0XHRpZiAoXG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ0NPTU1JVCcgfHxcblx0XHRcdGFjdGlvbi50eXBlID09PSAnUFJFU1NfVVAnIHx8XG5cdFx0XHRhY3Rpb24udHlwZSA9PT0gJ1BSRVNTX0RPV04nXG5cdFx0KSB7XG5cdFx0XHRpZiAobmV4dFN0YXRlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bmV4dFN0YXRlLnZhbHVlID0gbmV4dFN0YXRlLnZhbHVlLnRvU3RyaW5nKCkucGFkU3RhcnQocGFkLCAnMCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbmV4dFN0YXRlO1xuXHR9O1xufVxuXG5jb25zdCBTdHlsZWRUaW1lWm9uZSA9IHN0eWxlZC5kaXZgXG5cdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcbmA7XG5cbi8qKlxuICogRGlzcGxheXMgdGltZXpvbmUgaW5mb3JtYXRpb24gd2hlbiB1c2VyIHRpbWV6b25lIGlzIGRpZmZlcmVudCBmcm9tIHNpdGVcbiAqIHRpbWV6b25lLlxuICovXG5leHBvcnQgY29uc3QgVGltZVpvbmUgPSAoKSA9PiB7XG5cdGNvbnN0IHsgdGltZXpvbmUgfSA9IGdldERhdGVTZXR0aW5ncygpO1xuXG5cdC8vIENvbnZlcnQgdGltZXpvbmUgb2Zmc2V0IHRvIGhvdXJzLlxuXHRjb25zdCB1c2VyVGltZXpvbmVPZmZzZXQgPSAtMSAqIChuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG5cblx0Ly8gU3lzdGVtIHRpbWV6b25lIGFuZCB1c2VyIHRpbWV6b25lIG1hdGNoLCBub3RoaW5nIG5lZWRlZC5cblx0Ly8gQ29tcGFyZSBhcyBudW1iZXJzIGJlY2F1c2UgaXQgY29tZXMgb3ZlciBhcyBzdHJpbmcuXG5cdGlmIChOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA9PT0gdXNlclRpbWV6b25lT2Zmc2V0KSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRjb25zdCBvZmZzZXRTeW1ib2wgPSBOdW1iZXIodGltZXpvbmUub2Zmc2V0KSA+PSAwID8gJysnIDogJyc7XG5cdGNvbnN0IHpvbmVBYmJyID1cblx0XHQnJyAhPT0gdGltZXpvbmUuYWJiciAmJiBpc05hTihOdW1iZXIodGltZXpvbmUuYWJicikpXG5cdFx0XHQ/IHRpbWV6b25lLmFiYnJcblx0XHRcdDogYFVUQyR7b2Zmc2V0U3ltYm9sfSR7dGltZXpvbmUub2Zmc2V0fWA7XG5cblx0Ly8gUmVwbGFjZSB1bmRlcnNjb3JlIHdpdGggc3BhY2UgaW4gc3RyaW5ncyBsaWtlIGBBbWVyaWNhL0Nvc3RhX1JpY2FgLlxuXHRjb25zdCBwcmV0dHlUaW1lem9uZVN0cmluZyA9IHRpbWV6b25lLnN0cmluZy5yZXBsYWNlKCdfJywgJyAnKTtcblxuXHRjb25zdCB0aW1lem9uZURldGFpbCA9XG5cdFx0J1VUQycgPT09IHRpbWV6b25lLnN0cmluZ1xuXHRcdFx0PyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnXG5cdFx0XHQ6IGAoJHt6b25lQWJicn0pICR7cHJldHR5VGltZXpvbmVTdHJpbmd9YDtcblxuXHQvLyBXaGVuIHRoZSBwcmV0dHlUaW1lem9uZVN0cmluZyBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gYWRkaXRpb25hbCB0aW1lem9uZVxuXHQvLyBkZXRhaWwgaW5mb3JtYXRpb24gdG8gc2hvdyBpbiBhIFRvb2x0aXAuXG5cdGNvbnN0IGhhc05vQWRkaXRpb25hbFRpbWV6b25lRGV0YWlsID1cblx0XHRwcmV0dHlUaW1lem9uZVN0cmluZy50cmltKCkubGVuZ3RoID09PSAwO1xuXG5cdHJldHVybiBoYXNOb0FkZGl0aW9uYWxUaW1lem9uZURldGFpbCA/IChcblx0XHQ8U3R5bGVkVGltZVpvbmUgY2xhc3NOYW1lPVwiY29tcG9uZW50cy1kYXRldGltZV9fdGltZXpvbmVcIj5cblx0XHRcdHt6b25lQWJicn1cblx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHQpIDogKFxuXHRcdDxUb29sdGlwIHBsYWNlbWVudD1cInRvcFwiIHRleHQ9e3RpbWV6b25lRGV0YWlsfT5cblx0XHRcdDxTdHlsZWRUaW1lWm9uZSBjbGFzc05hbWU9XCJjb21wb25lbnRzLWRhdGV0aW1lX190aW1lem9uZVwiPlxuXHRcdFx0XHR7em9uZUFiYnJ9XG5cdFx0XHQ8L1N0eWxlZFRpbWVab25lPlxuXHRcdDwvVG9vbHRpcD5cblx0KTtcbn07XG5cbmNvbnN0IFRpbWVTZXBhcmF0b3IgPSBzdHlsZWQuc3BhbmBcblx0Ym9yZGVyLXRvcDogMXB4IHNvbGlkICM3NTc1NzU7XG5cdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjNzU3NTc1O1xuXHRkaXNwbGF5OiBpbmxpbmUtZmxleDtcblx0YWxpZ24taXRlbXM6IGNlbnRlcjtcbmA7XG5cbmNvbnN0IEhvdXJzSW5wdXQgPSBzdHlsZWQoTnVtYmVyQ29udHJvbClgXG5cdHdpZHRoOiAzNnB4O1xuXG5cdCYmJiAuY29tcG9uZW50cy1pbnB1dC1jb250cm9sX19pbnB1dCB7XG5cdFx0cGFkZGluZy1yaWdodDogMDtcblx0XHRwYWRkaW5nLWxlZnQ6IDhweDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1yaWdodDogMDtcblx0XHRib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcblx0XHRib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgTWludXRlc0lucHV0ID0gc3R5bGVkKE51bWJlckNvbnRyb2wpYFxuXHR3aWR0aDogMzZweDtcblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9faW5wdXQge1xuXHRcdHBhZGRpbmctbGVmdDogMDtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0cGFkZGluZy1sZWZ0OiA4cHg7XG5cdH1cblxuXHQmJiYgLmNvbXBvbmVudHMtaW5wdXQtY29udHJvbF9fYmFja2Ryb3Age1xuXHRcdGJvcmRlci1sZWZ0OiAwO1xuXHRcdGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG5cdFx0Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcblx0fVxuYDtcblxuY29uc3QgVGltZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuXHRkaXJlY3Rpb246IGx0cjtcblx0ZGlzcGxheTogZmxleDtcbmA7XG5cbmV4cG9ydCBjb25zdCBUaW1lQ29udHJvbCA9ICh7XG5cdHZhbHVlLFxuXHRvbkNoYW5nZSxcblx0Li4uYXR0cmlidXRlc1xufTogVGltZUNvbnRyb2xQcm9wcykgPT4ge1xuXHQvLyBUaGUgYmFzZSBwcm9wcy5cblx0Y29uc3QgeyBiYXNlQ29udHJvbFByb3BzLCBjb250cm9sUHJvcHMgfSA9IHVzZUJhc2VDb250cm9sUHJvcHMoYXR0cmlidXRlcyk7XG5cdGNvbnN0IHBhcnRzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnOicpIDogWycwNycsICcwMCddO1xuXHRjb25zdCBbaG91cnMsIHNldEhvdXJzXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4ocGFydHNbMF0pO1xuXHRjb25zdCBbbWludXRlcywgc2V0TWludXRlc10gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHBhcnRzWzFdKTtcblx0Y29uc3QgcGFkID0gKG46IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZCwgZmFsbGJhY2sgPSAnMDAnKSA9PiB7XG5cdFx0biA9IE51bWJlcihuKTtcblxuXHRcdGlmIChpc05hTihuKSkge1xuXHRcdFx0cmV0dXJuIGZhbGxiYWNrO1xuXHRcdH1cblxuXHRcdGlmIChuIDwgMTApIHtcblx0XHRcdHJldHVybiBgMCR7bn1gO1xuXHRcdH1cblxuXHRcdHJldHVybiBuO1xuXHR9O1xuXG5cdGNvbnN0IGxvY2FsVmFsdWUgPSBgJHtwYWQoaG91cnMpfToke3BhZChtaW51dGVzKX1gO1xuXG5cdHVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0aWYgKHZhbHVlICE9PSBsb2NhbFZhbHVlKSB7XG5cdFx0XHRvbkNoYW5nZShsb2NhbFZhbHVlKTtcblx0XHR9XG5cdH0sIFtsb2NhbFZhbHVlXSk7XG5cblx0Ly8gUmVuZGVyIHRoZSBjb250cm9sLlxuXHRyZXR1cm4gKFxuXHRcdDxCYXNlQ29udHJvbCB7Li4uYmFzZUNvbnRyb2xQcm9wc30+XG5cdFx0XHQ8SFN0YWNrPlxuXHRcdFx0XHQ8VGltZVdyYXBwZXI+XG5cdFx0XHRcdFx0PEhvdXJzSW5wdXRcblx0XHRcdFx0XHRcdHZhbHVlPXtwYWQoaG91cnMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldEhvdXJzfVxuXHRcdFx0XHRcdFx0bWluPXswfVxuXHRcdFx0XHRcdFx0bWF4PXsyM31cblx0XHRcdFx0XHRcdHN0ZXA9ezF9XG5cdFx0XHRcdFx0XHR7Li4uY29udHJvbFByb3BzfVxuXHRcdFx0XHRcdFx0bGFiZWw9e19fKCdIb3VycycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PFRpbWVTZXBhcmF0b3IgYXJpYS1oaWRkZW49XCJ0cnVlXCI+OjwvVGltZVNlcGFyYXRvcj5cblx0XHRcdFx0XHQ8TWludXRlc0lucHV0XG5cdFx0XHRcdFx0XHR2YWx1ZT17cGFkKG1pbnV0ZXMpfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9e3NldE1pbnV0ZXN9XG5cdFx0XHRcdFx0XHRtaW49ezB9XG5cdFx0XHRcdFx0XHRtYXg9ezU5fVxuXHRcdFx0XHRcdFx0c3RlcD17MX1cblx0XHRcdFx0XHRcdGxhYmVsPXtfXygnTWludXRlcycpfVxuXHRcdFx0XHRcdFx0c3BpbkNvbnRyb2xzPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRpc0RyYWdFbmFibGVkPXtmYWxzZX1cblx0XHRcdFx0XHRcdGlzU2hpZnRTdGVwRW5hYmxlZD17ZmFsc2V9XG5cdFx0XHRcdFx0XHRpc1ByZXNzRW50ZXJUb0NoYW5nZVxuXHRcdFx0XHRcdFx0aGlkZUxhYmVsRnJvbVZpc2lvblxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRfX3Vuc3RhYmxlU3RhdGVSZWR1Y2VyPXtidWlsZFBhZElucHV0U3RhdGVSZWR1Y2VyKDIpfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvVGltZVdyYXBwZXI+XG5cdFx0XHRcdDxUaW1lWm9uZSAvPlxuXHRcdFx0PC9IU3RhY2s+XG5cdFx0PC9CYXNlQ29udHJvbD5cblx0KTtcbn07XG4iXX0= */",
  toString: _EMOTION_STRINGIFIED_CSS_ERROR__
});
const TimeControl = ({
  value,
  onChange,
  ...attributes
}) => {
  // The base props.
  const {
    baseControlProps,
    controlProps
  } = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.useBaseControlProps)(attributes);
  const parts = value ? value.split(':') : ['07', '00'];
  const [hours, setHours] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(parts[0]);
  const [minutes, setMinutes] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(parts[1]);
  const pad = (n, fallback = '00') => {
    n = Number(n);
    if (isNaN(n)) {
      return fallback;
    }
    if (n < 10) {
      return `0${n}`;
    }
    return n;
  };
  const localValue = `${pad(hours)}:${pad(minutes)}`;
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (value !== localValue) {
      onChange(localValue);
    }
  }, [localValue]);

  // Render the control.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
    ...baseControlProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalHStack, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(TimeWrapper, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(HoursInput, {
          value: pad(hours),
          onChange: setHours,
          min: 0,
          max: 23,
          step: 1,
          ...controlProps,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Hours'),
          spinControls: "none",
          isDragEnabled: false,
          isShiftStepEnabled: false,
          isPressEnterToChange: true,
          hideLabelFromVision: true,
          __next40pxDefaultSize: true,
          __unstableStateReducer: buildPadInputStateReducer(2)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(TimeSeparator, {
          "aria-hidden": "true",
          children: ":"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(MinutesInput, {
          value: pad(minutes),
          onChange: setMinutes,
          min: 0,
          max: 59,
          step: 1,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Minutes'),
          spinControls: "none",
          isDragEnabled: false,
          isShiftStepEnabled: false,
          isPressEnterToChange: true,
          hideLabelFromVision: true,
          __next40pxDefaultSize: true,
          __unstableStateReducer: buildPadInputStateReducer(2)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(TimeZone, {})]
    })
  });
};

/***/ }),

/***/ "./packages/components/src/components/input/toggle-group.tsx":
/*!*******************************************************************!*\
  !*** ./packages/components/src/components/input/toggle-group.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToggleGroupSetting: () => (/* binding */ ToggleGroupSetting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */


/**
 * Displays a toggle group setting
 *
 */
const ToggleGroupSetting = ({
  options,
  ...attributes
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControl, {
    __next40pxDefaultSize: true,
    __nextHasNoMarginBottom: true,
    isBlock: true,
    ...attributes,
    children: options.map((option, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
      ...option
    }, index))
  });
};

/***/ }),

/***/ "./packages/components/src/components/select/combobox.tsx":
/*!****************************************************************!*\
  !*** ./packages/components/src/components/select/combobox.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComboboxSetting: () => (/* binding */ ComboboxSetting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */

/**
 * Local dependancies.
 */


/**
 * A single select option.
 */

/**
 * Displays a combobox setting
 *
 */
const ComboboxSetting = ({
  options,
  availableSmartTags,
  ...attributes
}) => {
  const allOptions = (0,_hooks__WEBPACK_IMPORTED_MODULE_2__.useCombineOptions)(options, availableSmartTags);
  const [filteredOptions, setFilteredOptions] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(allOptions);
  const hasFilteredOptions = filteredOptions.length !== allOptions.length;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ComboboxControl, {
    ...attributes,
    options: filteredOptions,
    onFilterValueChange: inputValue => {
      if (!inputValue) {
        setFilteredOptions(allOptions);
        return;
      }
      const filterOption = option => {
        // Abort for disabled and placeholder options.
        if (option.disabled || option.value === '') {
          return false;
        }
        const search = option.search ? option.search.toLowerCase() : option.label.toLowerCase();
        return search.includes(inputValue.toLowerCase());
      };
      setFilteredOptions(allOptions.filter(filterOption));
    },
    __experimentalRenderItem: ({
      item,
      ...props
    }) => {
      if (item.render_filtered && hasFilteredOptions) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          ...props,
          dangerouslySetInnerHTML: {
            __html: item.render_filtered
          }
        });
      }
      if (item.render) {
        // Check if we have a string or a component.
        if (typeof item.render === 'string') {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            ...props,
            dangerouslySetInnerHTML: {
              __html: item.render
            }
          });
        }
        return item.render;
      }
      return item.label;
    }
  });
};

/***/ }),

/***/ "./packages/components/src/components/select/index.ts":
/*!************************************************************!*\
  !*** ./packages/components/src/components/select/index.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComboboxSetting: () => (/* reexport safe */ _combobox__WEBPACK_IMPORTED_MODULE_0__.ComboboxSetting),
/* harmony export */   MultiCheckbox: () => (/* reexport safe */ _multi_checkbox__WEBPACK_IMPORTED_MODULE_1__.MultiCheckbox),
/* harmony export */   MultiSelectSetting: () => (/* reexport safe */ _multi_select__WEBPACK_IMPORTED_MODULE_2__.MultiSelectSetting),
/* harmony export */   SelectSetting: () => (/* reexport safe */ _select__WEBPACK_IMPORTED_MODULE_3__.SelectSetting)
/* harmony export */ });
/* harmony import */ var _combobox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./combobox */ "./packages/components/src/components/select/combobox.tsx");
/* harmony import */ var _multi_checkbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multi-checkbox */ "./packages/components/src/components/select/multi-checkbox.tsx");
/* harmony import */ var _multi_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./multi-select */ "./packages/components/src/components/select/multi-select.tsx");
/* harmony import */ var _select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./select */ "./packages/components/src/components/select/select.tsx");





/***/ }),

/***/ "./packages/components/src/components/select/multi-checkbox.tsx":
/*!**********************************************************************!*\
  !*** ./packages/components/src/components/select/multi-checkbox.tsx ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MultiCheckbox: () => (/* binding */ MultiCheckbox)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */


/**
 * Local dependencies.
 */

/**
 * The multi checkbox setting props.
 */

/**
 * Displays a multi-checkbox setting.
 *
 */
const MultiCheckbox = ({
  value,
  options,
  onChange,
  ...attributes
}) => {
  // The base props.
  const {
    baseControlProps,
    controlProps
  } = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.useBaseControlProps)(attributes);

  // Ensure the value is an array.
  if (!Array.isArray(value)) {
    value = value ? [value] : [];
  }

  // Render the control.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
    ...baseControlProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      ...controlProps,
      children: options.map((option, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
        label: option.label,
        checked: value.includes(option.value),
        onChange: newValue => {
          if (newValue) {
            onChange([...value, option.value]);
          } else {
            onChange(value.filter(v => v !== option.value));
          }
        }
      }, index))
    })
  });
};

/***/ }),

/***/ "./packages/components/src/components/select/multi-select.tsx":
/*!********************************************************************!*\
  !*** ./packages/components/src/components/select/multi-select.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MultiSelectSetting: () => (/* binding */ MultiSelectSetting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */



/**
 * Local dependencies.
 */

/**
 * The multi checkbox setting props.
 */

/**
 * Multi select control.
 *
 */
const MultiSelectSetting = ({
  options,
  value,
  onChange,
  ...attributes
}) => {
  const theValue = Array.isArray(value) ? value : [];
  const suggestions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => options.map(option => option.label), [options]);
  const validate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(input => suggestions.includes(input), [suggestions]);
  const valueLabels = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => theValue.map(value => {
    const option = options.find(option => option.value === value);
    return option ? option.label : value;
  }), [value, options]);
  const onValueChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(labels => {
    const newValues = new Set();
    for (const label of labels) {
      // Search for option with this label.
      const option = options.find(option => option.label === label);
      if (undefined !== option) {
        newValues.add(option.value);
      }
    }
    if (onChange) {
      onChange(Array.from(newValues));
    }
  }, [onChange, options]);
  const render = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(args => {
    const option = options.find(option => option.label === args.item);
    if (option && option.render) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.RawHTML, {
        children: option.render
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
      children: args.item
    });
  }, [options]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
    value: valueLabels,
    suggestions: suggestions,
    onChange: onValueChange,
    __experimentalShowHowTo: false,
    __experimentalExpandOnFocus: true,
    __nextHasNoMarginBottom: true,
    __next40pxDefaultSize: true,
    __experimentalValidateInput: validate,
    __experimentalRenderItem: render,
    ...attributes
  });
};

/***/ }),

/***/ "./packages/components/src/components/select/select.tsx":
/*!**************************************************************!*\
  !*** ./packages/components/src/components/select/select.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectSetting: () => (/* binding */ SelectSetting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks */ "./packages/components/src/components/hooks/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */


/**
 * Local dependencies.
 */



/**
 * The select setting props.
 */

/**
 * Displays a select setting
 *
 */
const SelectSetting = ({
  options,
  availableSmartTags,
  ...attributes
}) => {
  const allOptions = (0,_hooks__WEBPACK_IMPORTED_MODULE_2__.useCombineOptions)(options, availableSmartTags);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
    ...attributes,
    options: allOptions
  });
};

/***/ }),

/***/ "./packages/components/src/components/setting.tsx":
/*!********************************************************!*\
  !*** ./packages/components/src/components/setting.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Setting: () => (/* binding */ Setting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/tip.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! . */ "./packages/components/src/components/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */


/**
 * Wordpress dependancies.
 */





/**
 * Local dependancies.
 */


/**
 * Displays a single setting.
 *
 * @return {JSX.Element}
 */
function Setting({
  settingKey,
  setting,
  availableSmartTags = undefined,
  prop = undefined,
  saved,
  setAttributes
}) {
  const settingPath = (prop ? `${prop}.${settingKey}` : settingKey).split('.');
  const sanitize = setting.sanitize ? setting.sanitize : value => value;
  const theAvailableSmartTags = 'trigger_settings' === prop || false === setting.can_map || false === setting.map_field || !Array.isArray(availableSmartTags) ? [] : availableSmartTags;

  /**
   * Updates an object setting.
   *
   * @param {mixed} value The new value.
   */
  const updateSetting = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(value => {
    // Get the current value.
    const currentValue = (0,___WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(saved, settingPath);

    // If the value is the same, abort.
    if (currentValue === value) {
      return;
    }
    const newAttributes = {};
    if (setting.resetOnChange) {
      setting.resetOnChange.forEach(key => {
        const [currentKey, ...remainingPath] = key.split('.');
        if (remainingPath.length === 0) {
          newAttributes[currentKey] = '';
        } else {
          newAttributes[currentKey] = (0,___WEBPACK_IMPORTED_MODULE_4__.updateNestedValue)(saved[currentKey] || {}, remainingPath, '');
        }
      });
    }
    const [currentKey, ...remainingPath] = settingPath;
    if (remainingPath.length === 0) {
      newAttributes[currentKey] = value;
    } else {
      newAttributes[currentKey] = (0,___WEBPACK_IMPORTED_MODULE_4__.updateNestedValue)(newAttributes[currentKey] || saved[currentKey] || {}, remainingPath, value);
    }
    return setAttributes(sanitize(newAttributes));
  }, [saved, settingPath, setAttributes, sanitize]);

  // If we have options, convert from object to array.
  const options = (0,___WEBPACK_IMPORTED_MODULE_4__.useOptions)(setting.options || []);

  // Simple condition.
  if (setting.if || setting.restrict) {
    // Check if we're separating with period.
    const parts = setting.restrict ? setting.restrict.split('.') : setting.if.split('.');
    if (!(0,___WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(saved, parts)) {
      return null;
    }
  }

  // Key value conditions.
  if (Array.isArray(setting.conditions) && !(0,___WEBPACK_IMPORTED_MODULE_4__.checkConditions)(setting.conditions, saved)) {
    return null;
  }

  // Abort early if condition is not met.
  if (setting.condition && !setting.condition(saved)) {
    return null;
  }

  // Remote settings.
  if ('remote' === setting.el) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.RemoteSettings, {
      settingKey: settingKey,
      setting: setting,
      availableSmartTags: availableSmartTags,
      saved: saved,
      prop: prop,
      setAttributes: setAttributes
    });
  }

  // Prepare the current value.
  let value = (0,___WEBPACK_IMPORTED_MODULE_4__.getNestedValue)(saved, settingPath);

  // If undefined, use the default value.
  if (value === undefined || setting.disabled) {
    value = setting.default;
  }

  // Do we have a value?
  const hasValue = value !== undefined && value !== '' && value !== null;

  // Classname for the field.
  const className = `hizzlewp-component__field-${settingKey}`;

  // Help text.
  const help = typeof setting.description === 'string' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
    dangerouslySetInnerHTML: {
      __html: setting.description
    }
  }) : setting.description;

  // Default attributes.
  const customAttributes = setting.customAttributes ? setting.customAttributes : {};
  const defaultAttributes = {
    label: setting.label,
    value: hasValue ? value : '',
    onChange: updateSetting,
    className,
    help: help,
    ...customAttributes
  };

  // Maybe add tooltip to the label.
  if (setting.tooltip) {
    defaultAttributes.label = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalHStack, {
      justify: "flex-start",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        children: setting.label
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
        delay: 0,
        placement: "top",
        text: setting.tooltip,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
            icon: "info",
            style: {
              color: '#454545'
            }
          })
        })
      })]
    });
  }

  // If we have setting.type but no setting.el, set setting.el to setting.type.
  if (setting.type && !setting.el) {
    setting.el = setting.type;
    if (['toggle', 'switch', 'checkbox', 'checkbox_alt', 'checkbox_real', 'text', 'number', 'email', 'tel', 'date', 'color', 'image'].includes(setting.type)) {
      setting.el = 'input';
    }
  }

  // Displays a button.
  if (setting.el === 'button') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        ...(setting.buttonProps || {})
      })
    });
  }

  // Toggle group.
  if (setting.el === 'toggle_group') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.ToggleGroupSetting, {
      ...defaultAttributes,
      options: options
    });
  }

  // Display select control.
  if (setting.el === 'select') {
    // Multi select.
    if (setting.multiple) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.MultiSelectSetting, {
        ...defaultAttributes,
        options: options
      });
    }

    // Add a placeholder option if there's no option with an empty value.
    if (!options.find(option => option?.value === '')) {
      options.unshift({
        label: setting.placeholder ? setting.placeholder : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Select an option', 'newsletter-optin-box'),
        value: '',
        disabled: !setting.canSelectPlaceholder
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.SelectSetting, {
      ...defaultAttributes,
      availableSmartTags: theAvailableSmartTags,
      options: options,
      __nextHasNoMarginBottom: true,
      __next40pxDefaultSize: true
    });
  }

  // Display combobox control.
  if (setting.el === 'combobox') {
    // Ensure all option values are strings
    const stringOptions = options.map(option => ({
      ...option,
      value: String(option.value)
    }));

    // Ensure current value is a string
    const stringValue = 0 === defaultAttributes.value ? '0' : defaultAttributes.value ? String(defaultAttributes.value) : '';
    defaultAttributes.value = stringValue;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.ComboboxSetting, {
      ...defaultAttributes,
      options: stringOptions,
      allowReset: setting.canSelectPlaceholder,
      availableSmartTags: theAvailableSmartTags,
      __nextHasNoMarginBottom: true,
      __next40pxDefaultSize: true
    });
  }

  // Display a form token field.
  if (setting.el === 'form_token' || setting.el === 'token') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
      ...defaultAttributes,
      value: Array.isArray(defaultAttributes.value) ? defaultAttributes.value : [],
      suggestions: Array.isArray(setting.suggestions) ? setting.suggestions : [],
      __nextHasNoMarginBottom: true,
      __next40pxDefaultSize: true,
      __experimentalShowHowTo: false,
      __experimentalExpandOnFocus: true,
      tokenizeOnBlur: true
    });
  }

  // Displays a multi-checkbox control.
  if (setting.el === 'multi_checkbox' || setting.el === 'multi_checkbox_alt') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.MultiCheckbox, {
      ...defaultAttributes,
      options: options
    });
  }

  // Conditional logic editor.
  if (setting.el === 'conditional_logic') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.ConditionalLogicEditor, {
      ...defaultAttributes,
      availableSmartTags: availableSmartTags,
      comparisons: setting.comparisons,
      toggleText: setting.toggle_text,
      inModal: setting.in_modal
    });
  }

  // Time input field.
  if (setting.el === 'time') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.TimeControl, {
      ...defaultAttributes
    });
  }
  if ('color' === setting.el || setting.el === 'input' && 'color' === setting.type) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.ColorSetting, {
      ...defaultAttributes,
      __nextHasNoMarginBottom: true
    });
  }

  // Unit control.
  if (setting.el === 'unit') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalUnitControl, {
      labelPosition: "edge",
      __unstableInputWidth: "80px",
      __next40pxDefaultSize: true,
      isPressEnterToChange: true,
      ...defaultAttributes
    });
  }

  // Text input field.
  if (setting.el === 'input') {
    // Checkbox or toggle.
    if (setting.type && ['toggle', 'switch', 'checkbox', 'checkbox_alt'].includes(setting.type)) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
        ...defaultAttributes,
        checked: hasValue ? !!value : false,
        __nextHasNoMarginBottom: true
      });
    }
    if (setting.type && ['checkbox_real'].includes(setting.type)) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
        ...defaultAttributes,
        checked: hasValue ? !!value : false,
        __nextHasNoMarginBottom: true
      });
    }

    // Number.
    if ('number' === setting.type) {
      const addSuffix = suffix => {
        if (!suffix) {
          return undefined;
        }
        if (typeof suffix === 'string' || suffix instanceof String) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalInputControlSuffixWrapper, {
            children: suffix
          });
        }
        return suffix;
      };
      const addPrefix = prefix => {
        if (!prefix) {
          return undefined;
        }
        if (typeof prefix === 'string' || prefix instanceof String) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalInputControlPrefixWrapper, {
            children: prefix
          });
        }
        return prefix;
      };

      // Singular / Plural suffix.
      if (Array.isArray(defaultAttributes.suffix)) {
        defaultAttributes.suffix = 1 === value || '1' === value ? addSuffix(defaultAttributes.suffix[0]) : addSuffix(defaultAttributes.suffix[1]);
      } else {
        defaultAttributes.suffix = addSuffix(defaultAttributes.suffix);
      }

      // Singular / Plural prefix.
      if (Array.isArray(defaultAttributes.prefix)) {
        defaultAttributes.prefix = 1 === value || '1' === value ? addPrefix(defaultAttributes.prefix[0]) : addPrefix(defaultAttributes.prefix[1]);
      } else {
        defaultAttributes.prefix = addPrefix(defaultAttributes.prefix);
      }
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalNumberControl, {
        ...defaultAttributes,
        placeholder: setting.placeholder ? setting.placeholder : '',
        __next40pxDefaultSize: true
      });
    }

    // Image upload.
    if ('image' === setting.type && window.wp?.media) {
      defaultAttributes.suffix = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        onClick: () => {
          // Init the media uploader script.
          const image = window.wp.media({
            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Upload Image', 'newsletter-optin-box'),
            multiple: false,
            library: {
              type: 'image'
            }
          })

          // The open the media uploader modal.
          .open()

          // Update the associated key with the selected image's url
          .on('select', () => {
            const uploaded_image = image.state().get('selection').first();
            updateSetting(uploaded_image.toJSON().sizes['full'].url);
          });
        },
        icon: "upload",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Upload Image', 'newsletter-optin-box'),
        showTooltip: true
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.InputSetting, {
      ...defaultAttributes,
      setting: setting,
      availableSmartTags: theAvailableSmartTags,
      isPressEnterToChange: setting.isInputToChange ? false : true
    });
  }

  // Textarea field.
  if (setting.el === 'textarea') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.TextareaSetting, {
      ...defaultAttributes,
      setting: setting,
      placeholder: setting.placeholder ? setting.placeholder : '',
      availableSmartTags: theAvailableSmartTags
    });
  }

  // TinyMCE editor.
  if (setting.el === 'tinymce') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.TinyMCESetting, {
      ...defaultAttributes
    });
  }

  // Paragraph.
  if (setting.el === 'paragraph') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: className,
      children: setting.raw ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "components-tip",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.RawHTML, {
          children: setting.content
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Tip, {
        children: setting.content
      })
    });
  }

  // Heading.
  if (setting.el === 'hero') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: className,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
        children: setting.content
      })
    });
  }

  // Key value repeater.
  if (setting.el === 'key_value_repeater' || setting.el === 'webhook_key_value_repeater') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.KeyValueRepeater, {
      ...defaultAttributes,
      setting: setting,
      availableSmartTags: theAvailableSmartTags,
      __nextHasNoMarginBottom: true
    });
  }

  // Dynamic repeater, will eventually replace key value repeater.
  if (setting.el === 'repeater') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(___WEBPACK_IMPORTED_MODULE_4__.RepeaterControl, {
      ...defaultAttributes,
      __nextHasNoMarginBottom: true,
      availableSmartTags: theAvailableSmartTags
    });
  }
  console.log(setting);
  return settingKey;
}

/***/ }),

/***/ "./packages/components/src/components/ui/error-boundary.tsx":
/*!******************************************************************!*\
  !*** ./packages/components/src/components/ui/error-boundary.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorBoundary: () => (/* binding */ ErrorBoundary),
/* harmony export */   withErrorBoundary: () => (/* binding */ withErrorBoundary)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies.
 */


/**
 * WordPress dependencies.
 */


/**
 * Props for the ErrorBoundary component.
 */

/**
 * State interface for the ErrorBoundary component.
 */

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree.
 * It displays a fallback UI instead of crashing the whole application.
 */
class ErrorBoundary extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  /**
   * Constructor for the ErrorBoundary component.
   * 
   * @param {Props} props - Component props
   */
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Static method called during rendering when an error is thrown.
   * Used to update the component state.
   * 
   * @param {Error} error - The error that was caught
   * @returns {Partial<State>} Partial state object to update the component
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Lifecycle method called after an error has been thrown by a descendant component.
   * Used for logging errors or sending them to an error reporting service.
   * 
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - Additional information about the error
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Resets the error state to allow re-rendering the children.
   */
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Renders either the error UI or the children components.
   * 
   * @returns {ReactNode} The rendered component
   */
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(FallbackComponent, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetErrorBoundary: this.resetErrorBoundary
        });
      }
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          style: {
            backgroundColor: '#FEE2E2',
            border: '1px solid #F87171',
            color: '#B91C1C',
            padding: '0.75rem 1rem',
            borderRadius: '0.25rem',
            position: 'relative'
          },
          role: "alert",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalText, {
            as: "strong",
            weight: 500,
            color: "#B91C1C",
            children: "Oops! Something went wrong."
          }), "\xA0", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalText, {
            color: "#B91C1C",
            children: "This error is being logged."
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("details", {
            style: {
              marginTop: '0.5rem',
              fontSize: '0.875rem'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("summary", {
              children: "Click for error details"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("pre", {
              style: {
                overflow: 'auto',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              },
              children: [this.state.error && this.state.error.toString(), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("br", {}), this.state.errorInfo?.componentStack]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
            onClick: this.resetErrorBoundary,
            variant: "primary",
            __next40pxDefaultSize: true,
            children: "Try Again"
          })]
        })
      });
    }
    return this.props.children;
  }
}

/**
 * HOC to wrap a component with the ErrorBoundary
 * 
 * @param Component - The component to wrap
 * @param errorBoundaryProps - Props to pass to the ErrorBoundary
 */
const withErrorBoundary = (Component, errorBoundaryProps) => {
  const Wrapped = props => {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ErrorBoundary, {
      ...errorBoundaryProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Component, {
        ...props
      })
    });
  };

  // Set display name for better debugging
  const displayName = Component.displayName || Component.name || 'Component';
  Wrapped.displayName = `withErrorBoundary(${displayName})`;
  return Wrapped;
};

/***/ }),

/***/ "./packages/components/src/components/ui/index.ts":
/*!********************************************************!*\
  !*** ./packages/components/src/components/ui/index.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorBoundary: () => (/* reexport safe */ _error_boundary__WEBPACK_IMPORTED_MODULE_0__.ErrorBoundary),
/* harmony export */   withErrorBoundary: () => (/* reexport safe */ _error_boundary__WEBPACK_IMPORTED_MODULE_0__.withErrorBoundary)
/* harmony export */ });
/* harmony import */ var _error_boundary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error-boundary */ "./packages/components/src/components/ui/error-boundary.tsx");


/***/ }),

/***/ "./packages/components/src/components/utils/colors.ts":
/*!************************************************************!*\
  !*** ./packages/components/src/components/utils/colors.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   randomColor: () => (/* binding */ randomColor),
/* harmony export */   stringToColor: () => (/* binding */ stringToColor)
/* harmony export */ });
const SATURATION_BOUND = [0, 100];
const LIGHTNESS_BOUND = [0, 100];
const pad2 = str => `${str.length === 1 ? '0' : ''}${str}`;
const clamp = (num, min, max) => Math.max(Math.min(num, max), min);
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomExclude = (min, max, exclude) => {
  const r = random(min, max);
  for (let i = 0; i < exclude?.length; i++) {
    const value = exclude[i];
    if (value?.length === 2 && r >= value[0] && r <= value[1]) {
      return randomExclude(min, max, exclude);
    }
  }
  return r;
};

/**
 * Generate hashCode
 * @param  {string} str
 * @return {number}
 */
const hashCode = str => {
  const len = str.length;
  let hash = 0;
  for (let i = 0; i < len; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
};

/**
 * Clamps `num` within the inclusive `range` bounds
 * @param  {number}       num
 * @param  {number|Array} range
 * @return {number}
 */
const boundHashCode = (num, range) => {
  if (typeof range === 'number') {
    return range;
  }
  return num % Math.abs(range[1] - range[0]) + range[0];
};

/**
 * Sanitizing the `range`
 * @param  {number|Array} range
 * @param  {Array}        bound
 * @return {number|Array}
 */
const sanitizeRange = (range, bound) => {
  if (typeof range === 'number') {
    return clamp(Math.abs(range), ...bound);
  }
  if (range.length === 1 || range[0] === range[1]) {
    return clamp(Math.abs(range[0]), ...bound);
  }
  return [Math.abs(clamp(range[0], ...bound)), clamp(Math.abs(range[1]), ...bound)];
};

/**
 * @param  {number} p
 * @param  {number} q
 * @param  {number} t
 * @return {number}
 */
const hueToRgb = (p, q, t) => {
  if (t < 0) {
    t += 1;
  } else if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
};

/**
 * Converts an HSL color to RGB
 * @param  {number} h Hue
 * @param  {number} s Saturation
 * @param  {number} l Lightness
 * @return {Array}
 */
const hslToRgb = (h, s, l) => {
  let r;
  let g;
  let b;
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    // achromatic
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Determines whether the RGB color is light or not
 * http://www.w3.org/TR/AERT#color-contrast
 * @param  {number}  r               Red
 * @param  {number}  g               Green
 * @param  {number}  b               Blue
 * @param  {number}  differencePoint
 * @return {boolean}
 */
const rgbIsLight = (r, g, b, differencePoint) => (r * 299 + g * 587 + b * 114) / 1000 >= differencePoint; // eslint-disable-line max-len

/**
 * Converts an HSL color to string format
 * @param  {number} h Hue
 * @param  {number} s Saturation
 * @param  {number} l Lightness
 * @return {string}
 */
const hslToString = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/**
 * Converts RGB color to string format
 * @param  {number}  r      Red
 * @param  {number}  g      Green
 * @param  {number}  b      Blue
 * @param  {string}  format Color format
 * @return {string}
 */
const rgbFormat = (r, g, b, format) => {
  switch (format) {
    case 'rgb':
      return `rgb(${r}, ${g}, ${b})`;
    case 'hex':
    default:
      return `#${pad2(r.toString(16))}${pad2(g.toString(16))}${pad2(b.toString(16))}`;
  }
};

/**
 * Generate unique color from `value`
 * @param  {string|number} value
 * @param  {Object}        [options={}]
 * @param  {string}        [options.format='hex']
 *  The color format, it can be one of `hex`, `rgb` or `hsl`
 * @param  {number|Array}  [options.saturation=[50, 55]]
 *  Determines the color saturation, it can be a number or a range between 0 and 100
 * @param  {number|Array}  [options.lightness=[50, 60]]
 *  Determines the color lightness, it can be a number or a range between 0 and 100
 * @param  {number}        [options.differencePoint=130]
 *  Determines the color brightness difference point. We use it to obtain the `isLight` value
 *  in the output, it can be a number between 0 and 255
 * @return {Object}
 * @example
 *
 * ```js
 * stringToColor('Hello world!')
 * // { color: "#5cc653", isLight: true }
 *
 * stringToColor('Hello world!', { format: 'rgb' })
 * // { color: "rgb(92, 198, 83)", isLight: true }
 *
 * stringToColor('Hello world!', {
 *   saturation: 30,
 *   lightness: [70, 80],
 * })
 * // { color: "#afd2ac", isLight: true }
 *
 * stringToColor('Hello world!', {
 *   saturation: 30,
 *   lightness: [70, 80],
 *   differencePoint: 200,
 * })
 * // { color: "#afd2ac", isLight: false }
 * ```
 */
const stringToColor = (value, {
  format = 'hex',
  saturation = [50, 55],
  lightness = [50, 60],
  differencePoint = 130
} = {}) => {
  const hash = Math.abs(hashCode(String(value)));
  const h = boundHashCode(hash, [0, 360]);
  const s = boundHashCode(hash, sanitizeRange(saturation, SATURATION_BOUND));
  const l = boundHashCode(hash, sanitizeRange(lightness, LIGHTNESS_BOUND));
  const [r, g, b] = hslToRgb(h, s, l);
  return {
    color: format === 'hsl' ? hslToString(h, s, l) : rgbFormat(r, g, b, format),
    isLight: rgbIsLight(r, g, b, differencePoint)
  };
};

/**
 * Generate random color
 * @param  {Object}       [options={}]
 * @param  {string}       [options.format='hex']
 *  The color format, it can be one of `hex`, `rgb` or `hsl`
 * @param  {number|Array} [options.saturation=[50, 55]]
 *  Determines the color saturation, it can be a number or a range between 0 and 100
 * @param  {number|Array} [options.lightness=[50, 60]]
 *  Determines the color lightness, it can be a number or a range between 0 and 100
 * @param  {number}       [options.differencePoint=130]
 *  Determines the color brightness difference point. We use it to obtain the `isLight` value
 *  in the output, it can be a number between 0 and 255
 * @param  {Array}        [options.excludeHue]
 *  Exclude certain hue ranges. For example to exclude red color range: `[[0, 20], [325, 359]]`
 * @return {Object}
 * @example
 *
 * ```js
 * // Generate random color
 * uniqolor.random()
 * // { color: "#644cc8", isLight: false }
 *
 * // Generate a random color with HSL format
 * uniqolor.random({ format: 'hsl' })
 * // { color: "hsl(89, 55%, 60%)", isLight: true }
 *
 * // Generate a random color in specific saturation and lightness
 * uniqolor.random({
 *   saturation: 80,
 *   lightness: [70, 80],
 * })
 * // { color: "#c7b9da", isLight: true }
 *
 * // Generate a random color but exclude red color range
 * uniqolor.random({
 *   excludeHue: [[0, 20], [325, 359]],
 * })
 * // {color: '#53caab', isLight: true}
 * ```
 */
const randomColor = ({
  format = 'hex',
  saturation = [50, 55],
  lightness = [50, 60],
  differencePoint = 130,
  excludeHue
} = {}) => {
  const sanitizedSaturation = sanitizeRange(saturation, SATURATION_BOUND);
  const sanitizedLightness = sanitizeRange(lightness, LIGHTNESS_BOUND);
  const h = excludeHue ? randomExclude(0, 359, excludeHue) : random(0, 359);
  const s = typeof sanitizedSaturation === 'number' ? sanitizedSaturation : random(sanitizedSaturation[0], sanitizedSaturation[1]);
  const l = typeof sanitizedLightness === 'number' ? sanitizedLightness : random(sanitizedLightness[0], sanitizedLightness[1]);
  const [r, g, b] = hslToRgb(h, s, l);
  return {
    color: format === 'hsl' ? hslToString(h, s, l) : rgbFormat(r, g, b, format),
    isLight: rgbIsLight(r, g, b, differencePoint)
  };
};

/***/ }),

/***/ "./packages/components/src/components/utils/get-merge-tag-value.ts":
/*!*************************************************************************!*\
  !*** ./packages/components/src/components/utils/get-merge-tag-value.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMergeTagValue: () => (/* binding */ getMergeTagValue)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * Returns a merge tag's value.
 *
 * @param {smartTag} smartTag - The smart tag to get the value of.
 * @returns {string} The value of the smart tag.
 */
const getMergeTagValue = smartTag => {
  if (smartTag.example) {
    return smartTag.example;
  }
  if (!smartTag.default) {
    return `${smartTag.smart_tag}`;
  }
  return `${smartTag.smart_tag} default="${smartTag.default}"`;
};

/***/ }),

/***/ "./packages/components/src/components/utils/get-nested-value.ts":
/*!**********************************************************************!*\
  !*** ./packages/components/src/components/utils/get-nested-value.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getNestedValue: () => (/* binding */ getNestedValue)
/* harmony export */ });
/**
 * Fetches a nested value from an object.
 *
 * @param obj - The object to fetch the value from.
 * @param path - The nested path as an array of keys.
 */
const getNestedValue = (obj, path) => {
  // Return undefined if path is empty or null
  if (!path || path.length === 0) {
    return undefined;
  }

  // Convert string path to array by splitting on periods (e.g., "user.address.city" -> ["user", "address", "city"])
  if (typeof path === 'string') {
    path = path.split('.');
  }

  // Return undefined if path is empty after splitting or if obj is not a valid object
  if (path.length === 0 || !obj || typeof obj !== 'object') {
    return undefined;
  }

  // Destructure the path into the current key and the remaining path
  const [currentKey, ...remainingPath] = path;

  // If we've reached the end of the path, return the value at the current key
  if (remainingPath.length === 0) {
    return obj[currentKey];
  }

  // Otherwise, recursively traverse deeper into the object
  return getNestedValue(obj[currentKey], remainingPath);
};

/***/ }),

/***/ "./packages/components/src/components/utils/index.ts":
/*!***********************************************************!*\
  !*** ./packages/components/src/components/utils/index.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkConditions: () => (/* reexport safe */ _operators__WEBPACK_IMPORTED_MODULE_3__.checkConditions),
/* harmony export */   compare: () => (/* reexport safe */ _operators__WEBPACK_IMPORTED_MODULE_3__.compare),
/* harmony export */   getMergeTagValue: () => (/* reexport safe */ _get_merge_tag_value__WEBPACK_IMPORTED_MODULE_1__.getMergeTagValue),
/* harmony export */   getNestedValue: () => (/* reexport safe */ _get_nested_value__WEBPACK_IMPORTED_MODULE_0__.getNestedValue),
/* harmony export */   operators: () => (/* reexport safe */ _operators__WEBPACK_IMPORTED_MODULE_3__.operators),
/* harmony export */   prepareAvailableSmartTags: () => (/* reexport safe */ _prepare_available_merge_tags__WEBPACK_IMPORTED_MODULE_4__.prepareAvailableSmartTags),
/* harmony export */   randomColor: () => (/* reexport safe */ _colors__WEBPACK_IMPORTED_MODULE_5__.randomColor),
/* harmony export */   stringToColor: () => (/* reexport safe */ _colors__WEBPACK_IMPORTED_MODULE_5__.stringToColor),
/* harmony export */   updateNestedValue: () => (/* reexport safe */ _update_nested_value__WEBPACK_IMPORTED_MODULE_2__.updateNestedValue)
/* harmony export */ });
/* harmony import */ var _get_nested_value__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-nested-value */ "./packages/components/src/components/utils/get-nested-value.ts");
/* harmony import */ var _get_merge_tag_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get-merge-tag-value */ "./packages/components/src/components/utils/get-merge-tag-value.ts");
/* harmony import */ var _update_nested_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./update-nested-value */ "./packages/components/src/components/utils/update-nested-value.ts");
/* harmony import */ var _operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./operators */ "./packages/components/src/components/utils/operators.ts");
/* harmony import */ var _prepare_available_merge_tags__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./prepare-available-merge-tags */ "./packages/components/src/components/utils/prepare-available-merge-tags.ts");
/* harmony import */ var _colors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./colors */ "./packages/components/src/components/utils/colors.ts");







/***/ }),

/***/ "./packages/components/src/components/utils/operators.ts":
/*!***************************************************************!*\
  !*** ./packages/components/src/components/utils/operators.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkConditions: () => (/* binding */ checkConditions),
/* harmony export */   compare: () => (/* binding */ compare),
/* harmony export */   operators: () => (/* binding */ operators)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./packages/components/src/components/utils/index.ts");
/**
 * Internal dependencies.
 */


/**
 * Defines a function type for comparison operators.
 *
 * @template A - The type of the first value to compare.
 * @template B - The type of the second value to compare.
 * @param {unknown} a - The first value to compare.
 * @param {unknown} b - The second value to compare.
 * @return {boolean} The result of the comparison.
 */

/**
 * A record of comparison operators with their corresponding functions.
 *
 * @type {Record<Operators, OperatorFn>}
 */
const operators = {
  '==': (conditionValue, savedValue) => conditionValue == savedValue,
  '===': (conditionValue, savedValue) => conditionValue === savedValue,
  '!=': (conditionValue, savedValue) => conditionValue != savedValue,
  '!==': (conditionValue, savedValue) => conditionValue !== savedValue,
  '>': (conditionValue, savedValue) => conditionValue > savedValue,
  '>=': (conditionValue, savedValue) => conditionValue >= savedValue,
  '<': (conditionValue, savedValue) => conditionValue < savedValue,
  '<=': (conditionValue, savedValue) => conditionValue <= savedValue,
  includes: (conditionValue, savedValue) => savedValue.includes(conditionValue),
  '!includes': (conditionValue, savedValue) => !savedValue.includes(conditionValue),
  '^includes': (conditionValue, savedValue) => conditionValue.includes(savedValue),
  '^!includes': (conditionValue, savedValue) => !conditionValue.includes(savedValue),
  empty: (conditionValue, savedValue) => Boolean(!savedValue),
  '!empty': (conditionValue, savedValue) => Boolean(savedValue)
};

// a is the value of the condition, b is the saved value.
/**
 * Compares two values using the specified operator.
 *
 * @param {any} conditionValue - The value to compare against (left side of the comparison).
 * @param {Operators} operator - The operator to use for comparison.
 * @param {any} savedValue - The saved value to compare with (right side of the comparison).
 * @return {boolean} The result of the comparison.
 */
const compare = (conditionValue, operator, savedValue) => {
  // If the condition value is a boolean and the saved value is undefined, convert the saved value to a boolean.
  return operators[operator] ? operators[operator](conditionValue, typeof conditionValue === 'boolean' && savedValue === undefined ? Boolean(savedValue) : savedValue) : false;
};

/**
 * Interface for a comparison condition.
 */

/**
 * Checks if the saved object matches the conditions.
 * 
 * @param conditions The conditions to check.
 * @param saved The saved object.
 * @returns True if the saved object matches the conditions, false otherwise.
 */
function checkConditions(conditions, saved) {
  // If no conditions are provided, return true.
  if (!Array.isArray(conditions)) {
    return true;
  }
  return conditions.every(condition => {
    return compare(condition.value, condition.operator ? condition.operator : '==', (0,___WEBPACK_IMPORTED_MODULE_0__.getNestedValue)(saved, condition.key));
  });
}

/***/ }),

/***/ "./packages/components/src/components/utils/prepare-available-merge-tags.ts":
/*!**********************************************************************************!*\
  !*** ./packages/components/src/components/utils/prepare-available-merge-tags.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prepareAvailableSmartTags: () => (/* binding */ prepareAvailableSmartTags)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./packages/components/src/components/utils/index.ts");


/**
 * Returns a list of available smart tags.
 *
 * @param {Record<string, any>} smartTags - The smart tags to prepare.
 * @param {Record<string, any>} savedSettings - The saved settings to use for conditional logic.
 * @return {smartTag[]} The prepared smart tags.
 */
function prepareAvailableSmartTags(smartTags, savedSettings = {}) {
  const tags = [];
  if (!smartTags) {
    return tags;
  }
  Object.keys(smartTags).forEach(key => {
    const smartTag = smartTags[key];

    // Abort if the smartTag is hidden.
    if (smartTag.hidden) {
      return;
    }

    // Check if conditions have been met.
    if (smartTag.conditions) {
      // Check if all conditions have been met.
      const condition_matched = smartTag.conditions.every(condition => {
        let matched = false;
        const savedValue = (0,___WEBPACK_IMPORTED_MODULE_0__.getNestedValue)(savedSettings, condition.key);
        if (Array.isArray(condition.value)) {
          matched = condition.value.some(val => val == savedValue);
        } else {
          matched = condition.value == savedValue;
        }
        const should_match = condition.operator === 'is';
        return matched === should_match;
      });
      if (!condition_matched) {
        return;
      }
    }
    let label = key;
    if (smartTag.label) {
      label = smartTag.label;
    } else if (smartTag.description) {
      label = smartTag.description;
    }
    tags.push({
      ...smartTag,
      smart_tag: key,
      label,
      example: smartTag.example ? smartTag.example : '',
      description: smartTag.description ? smartTag.description : '',
      placeholder: smartTag.placeholder ? smartTag.placeholder : '',
      conditional_logic: smartTag.conditional_logic ? smartTag.conditional_logic : false,
      options: smartTag.options ? smartTag.options : []
    });
  });
  return tags;
}

/***/ }),

/***/ "./packages/components/src/components/utils/update-nested-value.ts":
/*!*************************************************************************!*\
  !*** ./packages/components/src/components/utils/update-nested-value.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateNestedValue: () => (/* binding */ updateNestedValue)
/* harmony export */ });
/**
 * Updates a value of any nested path in an object.
 *
 * @param obj - The object to update.
 * @param path - The nested path as an array of keys.
 * @param value - The new value.
 * @returns {Record<string, unknown>} - The updated object.
 */
const updateNestedValue = (obj, path, value) => {
  // Return the original object if path is empty or invalid
  if (!path || path.length === 0) {
    return obj;
  }

  // If path is a string, split it on periods to create an array of keys
  if (typeof path === 'string') {
    path = path.split('.');
  }

  // Destructure the path into the current key and the remaining path
  const [currentKey, ...remainingPath] = path;

  // If we've reached the end of the path, update the value at the current key
  if (remainingPath.length === 0) {
    return {
      ...obj,
      // Preserve all existing properties
      [currentKey]: value // Update or add the value at the current key
    };
  }

  // If we haven't reached the end of the path, recursively update the nested object
  return {
    ...obj,
    // Preserve all existing properties
    [currentKey]: updateNestedValue(obj[currentKey] || {},
    // Use existing object or create a new one
    remainingPath,
    // Continue with the remaining path
    value // Pass the value to be set at the end of the path
    )
  };
};

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

/***/ "@wordpress/date":
/*!******************************!*\
  !*** external ["wp","date"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["date"];

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

/***/ "@wordpress/keycodes":
/*!**********************************!*\
  !*** external ["wp","keycodes"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["keycodes"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************************!*\
  !*** ./packages/components/src/index.ts ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorSetting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ColorSetting),
/* harmony export */   ComboboxSetting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ComboboxSetting),
/* harmony export */   ConditionalLogicEditor: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ConditionalLogicEditor),
/* harmony export */   ConditionalLogicRule: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ConditionalLogicRule),
/* harmony export */   ConditionalLogicRules: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ConditionalLogicRules),
/* harmony export */   ConditionalLogicTypeSelector: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ConditionalLogicTypeSelector),
/* harmony export */   ErrorBoundary: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ErrorBoundary),
/* harmony export */   InputSetting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.InputSetting),
/* harmony export */   KeyValueRepeater: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.KeyValueRepeater),
/* harmony export */   KeyValueRepeaterField: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.KeyValueRepeaterField),
/* harmony export */   MultiCheckbox: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.MultiCheckbox),
/* harmony export */   MultiSelectSetting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.MultiSelectSetting),
/* harmony export */   RemoteSettings: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.RemoteSettings),
/* harmony export */   RepeaterControl: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.RepeaterControl),
/* harmony export */   RepeaterItem: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.RepeaterItem),
/* harmony export */   SelectSetting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.SelectSetting),
/* harmony export */   Setting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.Setting),
/* harmony export */   TextareaSetting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.TextareaSetting),
/* harmony export */   TimeControl: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.TimeControl),
/* harmony export */   TimeZone: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.TimeZone),
/* harmony export */   TinyMCESetting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.TinyMCESetting),
/* harmony export */   ToggleGroupSetting: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.ToggleGroupSetting),
/* harmony export */   checkConditions: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.checkConditions),
/* harmony export */   compare: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.compare),
/* harmony export */   getMergeTagValue: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.getMergeTagValue),
/* harmony export */   getNestedValue: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.getNestedValue),
/* harmony export */   operators: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.operators),
/* harmony export */   prepareAvailableSmartTags: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.prepareAvailableSmartTags),
/* harmony export */   randomColor: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.randomColor),
/* harmony export */   stringToColor: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.stringToColor),
/* harmony export */   updateNestedValue: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.updateNestedValue),
/* harmony export */   useCombineOptions: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.useCombineOptions),
/* harmony export */   useMergeTagGroups: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.useMergeTagGroups),
/* harmony export */   useMergeTags: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.useMergeTags),
/* harmony export */   useOptions: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.useOptions),
/* harmony export */   usePlaceholder: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.usePlaceholder),
/* harmony export */   withErrorBoundary: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_0__.withErrorBoundary)
/* harmony export */ });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ "./packages/components/src/components/index.ts");

})();

(window.hizzlewp = window.hizzlewp || {}).components = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map