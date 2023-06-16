## Commands
- `npm run start` - Start watching file changes in development mode
- `npm run build` - Build the project for production
- `npm run test` - Run tests

You can also pass --scope=PACKAGE_NAME to any of the above commands to run them only for a specific package.

**Example:** `npm run start --scope=store`

## Packages
- [store](./packages/store/README.md) - State management

## Contributing

- Commits MUST be prefixed with a type, which consists of a noun, feat, fix, etc., followed by the OPTIONAL scope, OPTIONAL !, and REQUIRED terminal colon and space.
- The type feat MUST be used when a commit adds a new feature to this library.
- The type fix MUST be used when a commit represents a bug fix for your application.
- A scope MAY be provided after a type. A scope MUST consist of a noun describing a section of the codebase surrounded by parenthesis, e.g., fix(store):
- A description MUST immediately follow the colon and space after the type/scope prefix. The description is a short summary of the code changes, e.g., fix: array parsing issue when multiple spaces were contained in string.

https://www.conventionalcommits.org/en/v1.0.0

**Installing a dependancy to a specific package**
```bash
npm install abbrev -w packages/store
```

## License
GPL-3.0

npm install @wordpress/i18n -w packages/setting