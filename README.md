# HizzleWP Monorepo

A monorepo containing shared packages for WordPress plugin development.

## Packages

Check out the [packages the directory](https://github.com/hizzle-co/hizzle/tree/main/packages) for information on each package and how to create/use them.

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/hizzle-co/hizzle.git
cd hizzle
```

2. Install dependencies:

```bash
npm install
```

3. Start development watcher:

```bash
npm run dev
```

4. Build all packages:

```bash
npm run build
```

## Usage in WordPress Plugins

1. Install the HizzleWP package:

```bash
composer require hizzle/wp
```

2. Install the required npm packages:

```bash
npm install @hizzlewp/components
npm install --save-dev @hizzlewp/dependency-extraction-webpack-plugin
```

3. Configure your webpack build to use the dependency extraction plugin:

```js
const HizzleWPDependencyExtractionPlugin = require('@hizzlewp/dependency-extraction-webpack-plugin');

module.exports = {
	// ... other webpack config
	plugins: [new HizzleWPDependencyExtractionPlugin()],
};
```

4. Import components in your code:

```tsx
import { Setting } from '@hizzlewp/components';
```

The imports will be automatically transformed to use the global `window.hizzlewp` object at runtime.

## License

GPL-2.0-or-later

## Release (to npm and composer)

```bash
npm run release --type=minor
```

type accepts: major, minor, patch, premajor, preminor, prepatch, prerelease

This will:

- Build the packages
- Update the composer.json file with the new version
- Update the npm package version
- Generate the docs
- Commit and push the changes
- Create a new release on GitHub
- Release changed packages to npm
- Update the changelogs
- Update the composer package

NOTE:-

- You must have the GitHub CLI installed.
- You must be authenticated with sufficient permissions.
