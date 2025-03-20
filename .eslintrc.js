module.exports = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended', 'prettier'],
	env: {
		browser: true,
		jquery: true,
		node: true,
		es6: true,
	},
	globals: {
		wp: true,
	},
	rules: {
		camelcase: 'warn',
		eqeqeq: 'warn',
		'no-console': 'warn',
		'@wordpress/no-unused-vars-before-return': 'off',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
	},
};
