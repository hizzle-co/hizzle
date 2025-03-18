module.exports = (env) => {
	// Set NODE_ENV to development when watching, otherwise production.
	process.env.NODE_ENV = env.WEBPACK_WATCH ? 'development' : 'production';

	// Load configs.
	const {
		generateBrowserConfigs,
		generateNodeConfigs,
	} = require('./tools/webpack/index.js');

	// Generate configs.
	return env.target === 'node'
		? generateNodeConfigs(__dirname)
		: generateBrowserConfigs(__dirname);
};
