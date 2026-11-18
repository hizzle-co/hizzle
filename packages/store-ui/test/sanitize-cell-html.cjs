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
		path.join( __dirname, '../src/components/routes/records-table/sanitize-cell-html.ts' ),
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
		window.sanitizeCellHtml = exports.sanitizeCellHtml;
	}, code );
} );

after( async () => browser?.close() );

const inspect = html => page.evaluate( input => {
	const cell = document.createElement( 'div' );
	cell.innerHTML = window.sanitizeCellHtml( input );
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
