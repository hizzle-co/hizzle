(()=>{"use strict";var e,t={85:(e,t,r)=>{e.exports=r(335)},335:(e,t,r)=>{var i=r(609),n=Symbol.for("react.element"),a=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),s=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var i,c={},l=null,d=null;for(i in void 0!==r&&(l=""+r),void 0!==t.key&&(l=""+t.key),void 0!==t.ref&&(d=t.ref),t)a.call(t,i)&&!o.hasOwnProperty(i)&&(c[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps)void 0===c[i]&&(c[i]=t[i]);return{$$typeof:n,type:e,key:l,ref:d,props:c,_owner:s.current}}t.jsx=c,t.jsxs=c},609:e=>{e.exports=window.React},779:(e,t,r)=>{r.r(t),r.d(t,{Footer:()=>V,Header:()=>B,NoptinInterface:()=>H});var i={};r.r(i),r.d(i,{closeModal:()=>R,disableComplementaryArea:()=>O,enableComplementaryArea:()=>j,openModal:()=>M,pinItem:()=>E,setDefaultComplementaryArea:()=>A,setFeatureDefaults:()=>L,setFeatureValue:()=>S,toggleFeature:()=>k,unpinItem:()=>N});var n={};function a(e){var t,r,i="";if("string"==typeof e||"number"==typeof e)i+=e;else if("object"==typeof e)if(Array.isArray(e)){var n=e.length;for(t=0;t<n;t++)e[t]&&(r=a(e[t]))&&(i&&(i+=" "),i+=r)}else for(r in e)e[r]&&(i&&(i+=" "),i+=r);return i}r.r(n),r.d(n,{getActiveComplementaryArea:()=>C,isComplementaryAreaLoading:()=>T,isFeatureActive:()=>P,isItemPinned:()=>F,isModalActive:()=>D}),r(609);const s=function(){for(var e,t,r=0,i="",n=arguments.length;r<n;r++)(e=arguments[r])&&(t=a(e))&&(i&&(i+=" "),i+=t);return i},o=window.wp.element,c=window.wp.components,l=window.wp.i18n,d=window.wp.compose;var p=r(85);const f=(0,o.forwardRef)((({children:e,className:t,ariaLabel:r,as:i="div",...n},a)=>(0,p.jsx)(i,{ref:a,className:s("interface-navigable-region",t),"aria-label":r,role:"region",tabIndex:"-1",...n,children:e})));f.displayName="NavigableRegion";const u=f,m={type:"tween",duration:.25,ease:[.6,0,.4,1]},_={hidden:{opacity:1,marginTop:-60},visible:{opacity:1,marginTop:0},distractionFreeHover:{opacity:1,marginTop:0,transition:{...m,delay:.2,delayChildren:.2}},distractionFreeHidden:{opacity:0,marginTop:-60},distractionFreeDisabled:{opacity:0,marginTop:0,transition:{...m,delay:.8,delayChildren:.8}}},h=(0,o.forwardRef)((function({isDistractionFree:e,footer:t,header:r,editorNotices:i,sidebar:n,secondarySidebar:a,content:f,actions:m,labels:h,className:y},v){const[b,g]=(0,d.useResizeObserver)(),x=(0,d.useViewportMatch)("medium","<"),w={type:"tween",duration:(0,d.useReducedMotion)()?0:.25,ease:[.6,0,.4,1]};!function(e){(0,o.useEffect)((()=>{const t=document&&document.querySelector(`html:not(.${e})`);if(t)return t.classList.toggle(e),()=>{t.classList.toggle(e)}}),[e])}("interface-interface-skeleton__html-container");const A={
/* translators: accessibility text for the top bar landmark region. */
header:(0,l._x)("Header","header landmark area"),
/* translators: accessibility text for the content landmark region. */
body:(0,l.__)("Content"),
/* translators: accessibility text for the secondary sidebar landmark region. */
secondarySidebar:(0,l.__)("Block Library"),
/* translators: accessibility text for the settings landmark region. */
sidebar:(0,l._x)("Settings","settings landmark area"),
/* translators: accessibility text for the publish landmark region. */
actions:(0,l.__)("Publish"),
/* translators: accessibility text for the footer landmark region. */
footer:(0,l.__)("Footer"),...h};return(0,p.jsxs)("div",{ref:v,className:s(y,"interface-interface-skeleton",!!t&&"has-footer"),children:[(0,p.jsxs)("div",{className:"interface-interface-skeleton__editor",children:[(0,p.jsx)(c.__unstableAnimatePresence,{initial:!1,children:!!r&&(0,p.jsx)(u,{as:c.__unstableMotion.div,className:"interface-interface-skeleton__header","aria-label":A.header,initial:e&&!x?"distractionFreeHidden":"hidden",whileHover:e&&!x?"distractionFreeHover":"visible",animate:e&&!x?"distractionFreeDisabled":"visible",exit:e&&!x?"distractionFreeHidden":"hidden",variants:_,transition:w,children:r})}),e&&(0,p.jsx)("div",{className:"interface-interface-skeleton__header",children:i}),(0,p.jsxs)("div",{className:"interface-interface-skeleton__body",children:[(0,p.jsx)(c.__unstableAnimatePresence,{initial:!1,children:!!a&&(0,p.jsx)(u,{className:"interface-interface-skeleton__secondary-sidebar",ariaLabel:A.secondarySidebar,as:c.__unstableMotion.div,initial:"closed",animate:"open",exit:"closed",variants:{open:{width:g.width},closed:{width:0}},transition:w,children:(0,p.jsxs)(c.__unstableMotion.div,{style:{position:"absolute",width:x?"100vw":"fit-content",height:"100%",left:0},variants:{open:{x:0},closed:{x:"-100%"}},transition:w,children:[b,a]})})}),(0,p.jsx)(u,{className:"interface-interface-skeleton__content",ariaLabel:A.body,children:f}),!!n&&(0,p.jsx)(u,{className:"interface-interface-skeleton__sidebar",ariaLabel:A.sidebar,children:n}),!!m&&(0,p.jsx)(u,{className:"interface-interface-skeleton__actions",ariaLabel:A.actions,children:m})]})]}),!!t&&(0,p.jsx)(u,{className:"interface-interface-skeleton__footer",ariaLabel:A.footer,children:t})]})})),y=window.wp.data,v=window.wp.deprecated;var b=r.n(v);const g=window.wp.preferences;function x(e){return["core/edit-post","core/edit-site"].includes(e)?(b()(`${e} interface scope`,{alternative:"core interface scope",hint:"core/edit-post and core/edit-site are merging.",version:"6.6"}),"core"):e}function w(e,t){return"core"===e&&"edit-site/template"===t?(b()("edit-site/template sidebar",{alternative:"edit-post/document",version:"6.6"}),"edit-post/document"):"core"===e&&"edit-site/block-inspector"===t?(b()("edit-site/block-inspector sidebar",{alternative:"edit-post/block",version:"6.6"}),"edit-post/block"):t}const A=(e,t)=>({type:"SET_DEFAULT_COMPLEMENTARY_AREA",scope:e=x(e),area:t=w(e,t)}),j=(e,t)=>({registry:r,dispatch:i})=>{t&&(e=x(e),t=w(e,t),r.select(g.store).get(e,"isComplementaryAreaVisible")||r.dispatch(g.store).set(e,"isComplementaryAreaVisible",!0),i({type:"ENABLE_COMPLEMENTARY_AREA",scope:e,area:t}))},O=e=>({registry:t})=>{e=x(e),t.select(g.store).get(e,"isComplementaryAreaVisible")&&t.dispatch(g.store).set(e,"isComplementaryAreaVisible",!1)},E=(e,t)=>({registry:r})=>{if(!t)return;e=x(e),t=w(e,t);const i=r.select(g.store).get(e,"pinnedItems");!0!==i?.[t]&&r.dispatch(g.store).set(e,"pinnedItems",{...i,[t]:!0})},N=(e,t)=>({registry:r})=>{if(!t)return;e=x(e),t=w(e,t);const i=r.select(g.store).get(e,"pinnedItems");r.dispatch(g.store).set(e,"pinnedItems",{...i,[t]:!1})};function k(e,t){return function({registry:r}){b()("dispatch( 'core/interface' ).toggleFeature",{since:"6.0",alternative:"dispatch( 'core/preferences' ).toggle"}),r.dispatch(g.store).toggle(e,t)}}function S(e,t,r){return function({registry:i}){b()("dispatch( 'core/interface' ).setFeatureValue",{since:"6.0",alternative:"dispatch( 'core/preferences' ).set"}),i.dispatch(g.store).set(e,t,!!r)}}function L(e,t){return function({registry:r}){b()("dispatch( 'core/interface' ).setFeatureDefaults",{since:"6.0",alternative:"dispatch( 'core/preferences' ).setDefaults"}),r.dispatch(g.store).setDefaults(e,t)}}function M(e){return{type:"OPEN_MODAL",name:e}}function R(){return{type:"CLOSE_MODAL"}}const C=(0,y.createRegistrySelector)((e=>(t,r)=>{r=x(r);const i=e(g.store).get(r,"isComplementaryAreaVisible");if(void 0!==i)return!1===i?null:t?.complementaryAreas?.[r]})),T=(0,y.createRegistrySelector)((e=>(t,r)=>{r=x(r);const i=e(g.store).get(r,"isComplementaryAreaVisible"),n=t?.complementaryAreas?.[r];return i&&void 0===n})),F=(0,y.createRegistrySelector)((e=>(t,r,i)=>{var n;i=w(r=x(r),i);const a=e(g.store).get(r,"pinnedItems");return null===(n=a?.[i])||void 0===n||n})),P=(0,y.createRegistrySelector)((e=>(t,r,i)=>(b()("select( 'core/interface' ).isFeatureActive( scope, featureName )",{since:"6.0",alternative:"select( 'core/preferences' ).get( scope, featureName )"}),!!e(g.store).get(r,i))));function D(e,t){return e.activeModal===t}const z=(0,y.combineReducers)({complementaryAreas:function(e={},t){switch(t.type){case"SET_DEFAULT_COMPLEMENTARY_AREA":{const{scope:r,area:i}=t;return e[r]?e:{...e,[r]:i}}case"ENABLE_COMPLEMENTARY_AREA":{const{scope:r,area:i}=t;return{...e,[r]:i}}}return e},activeModal:function(e=null,t){switch(t.type){case"OPEN_MODAL":return t.name;case"CLOSE_MODAL":return null}return e}}),I=(0,y.createReduxStore)("core/interface",{reducer:z,actions:i,selectors:n});(0,y.register)(I);const H=e=>(0,p.jsx)(h,{className:"noptin-app__interface",...e}),V=({children:e})=>e?(0,p.jsx)(c.__experimentalSurface,{style:{padding:"10px 20px"},children:e}):null,B=({brand:e,actions:t,extra:r})=>e||t||r?(0,p.jsxs)(c.__experimentalHStack,{as:c.__experimentalSurface,style:{padding:"10px 20px",zIndex:1e3},wrap:!0,children:[e&&(0,p.jsx)("div",{children:(0,p.jsxs)(c.__experimentalHStack,{children:[e?.logo&&(0,p.jsx)("img",{src:e.logo,alt:e.name,style:{width:"auto",height:"40px"}}),e?.name&&(0,p.jsx)(c.__experimentalText,{weight:600,size:14,children:e?.name}),e?.version&&(0,p.jsx)(c.__experimentalText,{weight:600,size:14,variant:"muted",children:e?.version})]})}),r&&(0,p.jsx)("div",{children:r}),t&&(0,p.jsx)("div",{children:(0,p.jsx)(c.__experimentalHStack,{children:t.map(((e,t)=>(0,p.jsx)(c.Button,{...e},t)))})}),(0,p.jsx)(c.Slot,{name:"hizzle-interface__header"})]}):null}},r={};function i(e){var n=r[e];if(void 0!==n)return n.exports;var a=r[e]={exports:{}};return t[e](a,a.exports,i),a.exports}i.m=t,e=[],i.O=(t,r,n,a)=>{if(!r){var s=1/0;for(d=0;d<e.length;d++){for(var[r,n,a]=e[d],o=!0,c=0;c<r.length;c++)(!1&a||s>=a)&&Object.keys(i.O).every((e=>i.O[e](r[c])))?r.splice(c--,1):(o=!1,a<s&&(s=a));if(o){e.splice(d--,1);var l=n();void 0!==l&&(t=l)}}return t}a=a||0;for(var d=e.length;d>0&&e[d-1][2]>a;d--)e[d]=e[d-1];e[d]=[r,n,a]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={57:0,350:0};i.O.j=t=>0===e[t];var t=(t,r)=>{var n,a,[s,o,c]=r,l=0;if(s.some((t=>0!==e[t]))){for(n in o)i.o(o,n)&&(i.m[n]=o[n]);if(c)var d=c(i)}for(t&&t(r);l<s.length;l++)a=s[l],i.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return i.O(d)},r=globalThis.webpackChunkhizzlewp_interface=globalThis.webpackChunkhizzlewp_interface||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var n=i.O(void 0,[350],(()=>i(779)));n=i.O(n),(window.hizzlewp=window.hizzlewp||{}).interface=n})();