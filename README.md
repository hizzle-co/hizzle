# HizzleWP Monorepo

A monorepo containing shared packages for WordPress plugin development.

## Packages

- `@hizzlewp/components`: Reusable React UI components extending @wordpress/components
- `@hizzlewp/interface`: Shared UI Interface extending @wordpress/interface
- `@hizzlewp/dependency-extraction-webpack-plugin`: Custom Webpack plugin for dependency extraction

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd hizzlewp-monorepo
```

2. Install dependencies:
```bash
npm install
```

3. Build all packages:
```bash
npm run build
```

## Development

- `npm run build`: Build all packages
- `npm run test`: Run tests across all packages
- `npm run lint`: Run ESLint across all packages
- `npm run format`: Format code using Prettier

## Adding a new package

1. Add the package to the `packages` directory.
2. Add the package to the `dependency-extraction-webpack-plugin/assets/packages.js` file.
3. Install npm packages:
```bash
npm install react --workspace=@hizzlewp/your-package
```


## Usage in WordPress Plugins

1. Install the required packages:
```bash
npm install @hizzlewp/components @hizzlewp/interface
```

2. Configure your webpack build to use the dependency extraction plugin:
```js
const HizzleWPDependencyExtractionPlugin = require('@hizzlewp/dependency-extraction-webpack-plugin');

module.exports = {
  // ... other webpack config
  plugins: [
    new HizzleWPDependencyExtractionPlugin(),
  ],
};
```

3. Import components in your code:
```tsx
import { Button } from '@hizzlewp/components';
```

The imports will be automatically transformed to use the global `window.hizzlewp` object at runtime.

## License

MIT 