#!/usr/bin/env node

const { program } = require('commander');
const { publishLatest, publishNext } = require('./release');

program
  .name('hizzlewp-release')
  .description('CLI tool for managing HizzleWP package releases')
  .version('1.0.0');

program
  .command('latest')
  .description('Publish a new latest version of packages')
  .option('-c, --ci', 'Run in CI mode (non-interactive)')
  .option('-s, --semver <type>', 'Version bump type (major|minor|patch)', 'patch')
  .action(async (options) => {
    try {
      await publishLatest(options);
    } catch (error) {
      console.error('Release failed:', error);
      process.exit(1);
    }
  });

program
  .command('next')
  .description('Publish a new next version of packages')
  .option('-c, --ci', 'Run in CI mode (non-interactive)')
  .option('-s, --semver <type>', 'Version bump type (major|minor|patch)', 'patch')
  .action(async (options) => {
    try {
      await publishNext(options);
    } catch (error) {
      console.error('Release failed:', error);
      process.exit(1);
    }
  });

program.parse(); 