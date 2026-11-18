const assert = require( 'node:assert/strict' );
const { existsSync } = require( 'node:fs' );
const path = require( 'node:path' );
const { before, after, test } = require( 'node:test' );
const { transformFileSync } = require( '@babel/core' );
const puppeteer = require( 'puppeteer-core' );

let browser;
let page;

before( async () => {
	// Use an installed browser; CHROME_BIN supports other platforms and CI.
	const executablePath = [
		process.env.CHROME_BIN,
		'C:/Program Files/Google/Chrome/Application/chrome.exe',
		'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
		'/usr/bin/google-chrome',
		'/usr/bin/chromium',
	].find( candidate => candidate && existsSync( candidate ) );
	assert.ok( executablePath, 'Set CHROME_BIN to an installed Chromium browser.' );
	browser = await puppeteer.launch( { executablePath, headless: true } );
	page = await browser.newPage();
	await page.setRequestInterception( true );
	page.on( 'request', request => request.abort() );
	await page.addScriptTag( { path: path.join( path.dirname( require.resolve( 'dompurify' ) ), 'purify.js' ) } );
	const { code } = transformFileSync(
		path.join( __dirname, '../src/components/utils/sanitize-html.ts' ),
		{
			babelrc: false,
			configFile: false,
			presets: [ '@babel/preset-typescript' ],
			plugins: [ '@babel/plugin-transform-modules-commonjs' ],
		}
	);
	await page.evaluate( compiled => {
		const exports = {};
		new Function( 'require', 'exports', compiled )( () => window.DOMPurify, exports );
		window.sanitizeHtml = exports.sanitizeHtml;
	}, code );
} );

after( async () => browser?.close() );

const inspect = html => page.evaluate( input => {
	const cell = document.createElement( 'div' );
	cell.innerHTML = window.sanitizeHtml( input );
	document.body.replaceChildren( cell );
	return { html: cell.innerHTML, text: cell.textContent };
}, html );

test( 'removes executable content from interpolated click lists and rendered fields', async () => {
	const dirty = '<img src=x onerror="window.__cellXss = true"><svg onload="window.__cellXss = true"></svg><script>window.__cellXss = true</script><a href="javascript:window.__cellXss = true">click</a> - yesterday';
	const { html, text } = await inspect( dirty );
	assert.doesNotMatch( html, /onerror|onload|javascript:|<script|<svg/i );
	assert.match( text, /click - yesterday/ );
	assert.equal( await page.evaluate( () => window.__cellXss ), undefined );
} );

test( 'preserves formatted prices, entities, and license markup', async () => {
	const { html, text } = await inspect( '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&pound;</span>12.00</bdi></span> &times; 2 &mdash; <a href="/license/1"><code>key</code></a><br><small>Activations: 1/2</small>' );
	assert.match( html, /class="woocommerce-Price-amount amount"/ );
	assert.match( html, /<a href="\/license\/1"><code>key<\/code><\/a><br><small>/ );
	assert.equal( text, '£12.00 × 2 — keyActivations: 1/2' );
} );

test( 'preserves prepared collection navigation links while removing handlers', async () => {
	const { html } = await inspect( '<a href="#" data-navigate-collection="/hpay/plans/12" onclick="window.__cellXss = true">Plan</a>' );
	assert.equal( html, '<a href="#" data-navigate-collection="/hpay/plans/12">Plan</a>' );
} );

test( 'handles absent and numeric values and escaped literal markup', async () => {
	assert.equal( ( await inspect( null ) ).html, '' );
	assert.equal( ( await inspect( 0 ) ).text, '0' );
	assert.equal( ( await inspect( '&lt;img src=x onerror=alert(1)&gt;' ) ).text, '<img src=x onerror=alert(1)>' );
	assert.doesNotMatch( ( await inspect( '<style>body { display:none }</style>Visible' ) ).html, /<style/i );
} );

test( 'preserves overview and settings formatting while removing active content', async () => {
	const { html, text } = await inspect( '<h3>Account</h3><p><strong>Revenue</strong>: &pound;12 &mdash; 25%</p><a href="/docs" onclick="alert(1)">Help</a><code>{subscriber.email}</code><iframe src="/admin"></iframe>' );
	assert.match( html, /<h3>Account<\/h3><p><strong>Revenue<\/strong>/ );
	assert.match( html, /<a href="\/docs">Help<\/a><code>\{subscriber.email\}<\/code>/ );
	assert.match( text, /£12 — 25%/ );
	assert.doesNotMatch( html, /onclick|iframe/i );
} );

// Exercise the real consumers with small WordPress/React stand-ins, so these
// checks catch an omitted sanitizer call as well as sanitizer policy regressions.
const renderConsumer = async ( relativePath, exportName, args, operation ) => {
	const { code } = transformFileSync( path.resolve( __dirname, relativePath ), {
		babelrc: false,
		configFile: false,
		presets: [ '@babel/preset-typescript', [ '@babel/preset-react', { runtime: 'classic' } ] ],
		plugins: [ '@babel/plugin-transform-modules-commonjs' ],
	} );
	return page.evaluate( ( { code, exportName, args, operation } ) => {
		const React = {
			createElement: ( type, props, ...children ) => ( { type, props: { ...props, children } } ),
			useMemo: fn => fn(),
			useCallback: fn => fn,
			useEffect: () => {},
			useState: initial => [ operation === 'filtered' ? initial.slice( 0, 1 ) : initial, () => {} ],
		};
		window.React = React;
		const local = new Proxy( {
			sanitizeHtml: window.sanitizeHtml,
			useOptions: options => options,
			useCombineOptions: options => options,
			getNestedValue: () => undefined,
		}, { get: ( target, name ) => name === '__esModule' ? true : target[ name ] || name } );
		const wp = new Proxy( { RawHTML: 'RawHTML' }, { get: ( target, name ) => target[ name ] || name } );
		const exports = {};
		new Function( 'require', 'exports', code )( name => name === 'react' ? React : name.startsWith( '@wordpress/' ) ? wp : local, exports );
		let tree = exports[ exportName ]( args );
		if ( operation === 'option' || operation === 'filtered' ) {
			tree = tree.props.__experimentalRenderItem( { item: args.options[ 0 ] } );
		} else if ( operation === 'multi' ) {
			tree = tree.props.__experimentalRenderItem( { item: args.options[ 0 ].label } );
		}
		const html = [];
		const visit = node => {
			if ( !node || typeof node !== 'object' ) return;
			if ( node.props?.dangerouslySetInnerHTML ) html.push( node.props.dangerouslySetInnerHTML.__html );
			if ( node.type === 'RawHTML' ) html.push( node.props.children.join( '' ) );
			Object.values( node ).forEach( visit );
		};
		visit( tree );
		return { html, tree };
	}, { code, exportName, args, operation } );
};

const payload = '<strong>Safe</strong><img src=x onerror="alert(1)"><script>alert(1)</script>';
const assertSafe = ( html, expectedCount ) => {
	assert.equal( html.length, expectedCount );
	for ( const value of html ) {
		assert.match( value, /<strong>Safe<\/strong>/ );
		assert.doesNotMatch( value, /onerror|<script/i );
	}
};

test( 'overview stats and cards sanitize values at their HTML sinks', async () => {
	const base = '../../store-ui/src/components/routes/view-record/overview/';
	assertSafe( ( await renderConsumer( base + 'stats.tsx', 'Stats', { cards: [ { title: 'Revenue', value: payload } ] } ) ).html, 1 );
	assertSafe( ( await renderConsumer( base + 'card.tsx', 'Card', { content: payload } ) ).html, 1 );
} );

test( 'settings sanitize string labels, descriptions, and raw paragraphs', async () => {
	const args = { settingKey: 'name', saved: {}, setting: { el: 'input', label: payload, description: payload } };
	assertSafe( ( await renderConsumer( '../src/components/setting.tsx', 'Setting', args ) ).html, 2 );
	args.setting = { el: 'paragraph', raw: true, content: payload };
	assertSafe( ( await renderConsumer( '../src/components/setting.tsx', 'Setting', args ) ).html, 1 );
	const node = { type: 'em', props: { children: [ 'React label' ] } };
	args.setting = { el: 'input', label: node, description: node };
	const { tree, html } = await renderConsumer( '../src/components/setting.tsx', 'Setting', args );
	assert.deepEqual( tree.props.label, node );
	assert.deepEqual( tree.props.help, node );
	assert.deepEqual( html, [] );
} );

test( 'combobox and multi-select sanitize option HTML and preserve React options', async () => {
	const args = { options: [ { label: 'Choice', value: '1', render: payload, render_filtered: payload }, { label: 'Other', value: '2' } ] };
	const base = '../src/components/select/';
	for ( const operation of [ 'option', 'filtered' ] ) {
		assertSafe( ( await renderConsumer( base + 'combobox.tsx', 'ComboboxSetting', args, operation ) ).html, 1 );
	}
	assertSafe( ( await renderConsumer( base + 'multi-select.tsx', 'MultiSelectSetting', args, 'multi' ) ).html, 1 );
	const node = { type: 'em', props: { children: [ 'React option' ] } };
	args.options[ 0 ].render = node;
	for ( const [ file, name, operation ] of [ [ 'combobox.tsx', 'ComboboxSetting', 'option' ], [ 'multi-select.tsx', 'MultiSelectSetting', 'multi' ] ] ) {
		const result = await renderConsumer( base + file, name, args, operation );
		assert.deepEqual( result.tree, node );
		assert.deepEqual( result.html, [] );
	}
} );
