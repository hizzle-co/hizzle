module.exports = (api) => {
	api.cache(true);

	return {
		presets: ['@wordpress/babel-preset-default'],
		plugins: ['@emotion/babel-plugin'],
	};
};
