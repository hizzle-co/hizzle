# **Project Requirements Document**  
**Project:** Monorepo for WordPress Plugin Development  
**Audience:** Junior Engineer  
**Tech Stack:** TypeScript, Webpack, npm

---

## **1. Introduction**

### **Overview**  
We are developing a **monorepo** under the namespace `@hizzlewp`, which will house packages intended for use within WordPress plugins. These packages will be consumable in development via standard ES module imports but will resolve as global `window.hizzlewp` references at runtime using a custom **dependency extraction Webpack plugin**.  

### **Objective**  
- **Monorepo Structure:** Organize packages under a unified repository.  
- **Package Compilation:** Build each package as both **CommonJS (CJS) and ES Modules (ESM)** for flexibility.  
- **Dependency Handling:** Allow WordPress plugins to use TypeScript type hints at dev time, but reference global variables (`window.hizzlewp.*`) at runtime.  
- **Scalability:** Enable easy addition of future `@hizzlewp` packages with the same dependency resolution system.  

---

## **2. Project Scope**  

### **Included:**  
✔ A **monorepo** using npm workspaces.  
✔ Three main packages:  
   - **`@hizzlewp/components`** → Reusable React UI components - Extends @wordpress/components
   - **`@hizzlewp/interface`** → Shared UI Interface - Extends @wordpress/interface
   - **`@hizzlewp/dependency-extraction-webpack-plugin`** → Custom Webpack plugin to map imports to `window.hizzlewp`. - Extends @wordpress/dependency-extraction-webpack-plugin
✔ Webpack configuration to **build both CommonJS and ESM versions** of each package.  
✔ Automatic TypeScript type generation (`.d.ts` files).  

### **Excluded:**  
❌ Backend services.  
❌ Direct Gutenberg block development (the monorepo is for shared utilities).  

---

## **3. Architecture Overview**

### **Monorepo Structure**  
```sh
/hizzlewp-monorepo
│── package.json (defines npm workspaces)
│── tsconfig.base.json (shared TypeScript config)
│── webpack.config.js (shared Webpack config)
│── packages/
│   ├── components/ (React UI components)
│   ├── interface/ (Shared UI Interface)
│   ├── dependency-extraction-webpack-plugin/ (Custom Webpack plugin)
│── scripts/ (Automation scripts)
│── .eslintrc.js (Linting rules)
│── .prettierrc (Code formatting rules)
```

---

## **4. Package Details**

### **4.1 `@hizzlewp/components` (Reusable UI Components)**  
**Purpose:**
- Provides reusable UI components for WordPress plugins.
- Extends @wordpress/components

**Requirements:**
✔ Written in TypeScript.
✔ Compiled into **CJS (`.cjs`) and ESM (`.mjs`)** versions.  
✔ Provides `d.ts` type definitions for IDE support.

---

### **4.2 `@hizzlewp/interface` (TypeScript Interfaces)**
**Purpose:**  
- Shared UI Interface
- Extends @wordpress/interface

**Requirements:**  
✔ Written in TypeScript.
✔ Compiled into **CJS (`.cjs`) and ESM (`.mjs`)** versions.  
✔ Provides `d.ts` type definitions for IDE support.

---

### **4.3 `@hizzlewp/dependency-extraction-webpack-plugin` (Custom Webpack Plugin)**
**Purpose:**  
- **Extends** the WordPress Gutenberg Dependency Extraction Webpack Plugin.  
- **Automatically replaces imports** like:  
  ```js
  import { Button } from '@hizzlewp/components';
  ```
  with:  
  ```js
  const { Button } = window.hizzlewp.components;
  ```
- **Ensures tree-shaking compatibility** while keeping `@hizzlewp/*` packages out of final plugin builds.  

**Requirements:**  
✔ Inherits from Gutenberg's existing plugin.  
✔ Configurable to support additional `@hizzlewp/*` packages.  
✔ Ensures `window.hizzlewp` is defined before using extracted dependencies.  

---

## **5. Technical Implementation**

### **5.1 Build & Compilation**  
Each package must output:  
1. **npm Package Build**
   - CommonJS (`.cjs`) → For compatibility with older environments
   - ESM (`.mjs`) → For modern JavaScript modules
   - TypeScript `.d.ts` → For IDE type hinting
2. **Browser Build**
   - UMD bundle (`.min.js`) → Auto-registers to `window.hizzlewp.[packageName]`
   - Source map (`.min.js.map`) → For debugging

#### **Example Webpack Config for Packages**
```js
const path = require('path');

// NPM Package Build Config
const npmConfig = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: '@hizzlewp/[package-name]',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
    ],
  },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
};

// Browser Build Config
const browserConfig = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist/browser'),
    filename: '[name].min.js',
    library: ['hizzlewp', '[package-name]'],
    libraryTarget: 'window',
  },
  optimization: {
    minimize: true,
  },
  // ... rest of config
};

module.exports = [npmConfig, browserConfig];
```

---

### **5.2 Dependency Extraction Webpack Plugin**
- This will **extend** Gutenberg's `@wordpress/dependency-extraction-webpack-plugin`.  
- It will scan for `@hizzlewp/*` imports and replace them with global references.  

#### **Example Webpack Plugin Logic**
```js
class HizzleWPDependencyExtractionPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HizzleWPDependencyExtractionPlugin', (compilation) => {
      compilation.hooks.optimizeModules.tap('HizzleWPDependencyExtractionPlugin', (modules) => {
        modules.forEach((module) => {
          if (module.resource && module.resource.includes('@hizzlewp/')) {
            // Replace with window.hizzlewp reference
            const packageName = module.resource.match(/@hizzlewp\/([^/]+)/)[1];
            module.request = `window.hizzlewp.${packageName}`;
          }
        });
      });
    });
  }
}
```

---

## **6. Workflow & CI/CD**

### **Development Workflow**  
1. Clone the monorepo and install dependencies:
   ```sh
   git clone [repo-url]
   cd hizzlewp-monorepo
   npm install
   ```
2. Build all packages:
   ```sh
   npm run build
   ```
3. Run tests:
   ```sh
   npm test
   ```

### **CI/CD Pipeline**  
- **Lint & Test on PRs** → Prevent bad code from merging.  
- **Auto-publish to npm** → Publish on `main` branch merge with version bumps.  
