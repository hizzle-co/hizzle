const { command } = require('execa');
const path = require('path');
const fs = require('fs');
const { inc: semverInc } = require('semver');
const SimpleGit = require('simple-git');

/**
 * Logger utilities
 */
const log = (...args) => console.log(...args);
const formats = {
  success: (text) => `\x1b[32m${text}\x1b[0m`,
  title: (text) => `\x1b[1m${text}\x1b[0m`,
};

/**
 * Release type names.
 * @typedef {('latest'|'next')} ReleaseType
 */

/**
 * Semantic Versioning labels.
 * @typedef {('major'|'minor'|'patch')} SemVer
 */

/**
 * @typedef ReleaseConfig
 * @property {boolean} interactive Whether to run in interactive mode
 * @property {SemVer} minimumVersionBump The selected minimum version bump
 * @property {ReleaseType} releaseType The selected release type
 * @property {string} distTag The dist-tag used for npm publishing
 */

/**
 * Gets config object.
 * @param {ReleaseType} releaseType The selected release type
 * @param {Object} options Command options
 * @return {ReleaseConfig} The config object
 */
function getConfig(releaseType, { ci = false, semver = 'patch' } = {}) {
  return {
    interactive: !ci,
    minimumVersionBump: semver,
    releaseType,
    distTag: releaseType === 'next' ? 'next' : 'latest',
  };
}

/**
 * Updates package versions based on the release type
 * @param {ReleaseConfig} config Release configuration
 */
async function updatePackageVersions(config) {
  const { interactive, minimumVersionBump, releaseType } = config;
  const packages = ['components', 'interface', 'dependency-extraction-webpack-plugin'];

  log('>> Updating package versions...');

  for (const packageName of packages) {
    const packageJsonPath = path.resolve(__dirname, '../packages', packageName, 'package.json');
    const packageJson = require(packageJsonPath);
    const currentVersion = packageJson.version;
    const nextVersion = semverInc(currentVersion, minimumVersionBump);

    if (releaseType === 'next') {
      packageJson.version = `${nextVersion}-next.0`;
    } else {
      packageJson.version = nextVersion;
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    log(`   - @hizzlewp/${packageName}: ${currentVersion} -> ${packageJson.version}`);
  }

  if (interactive) {
    await askForConfirmation('All package versions have been updated. Continue?');
  }
}

/**
 * Publishes packages to npm
 * @param {ReleaseConfig} config Release configuration
 */
async function publishPackages(config) {
  const { distTag, interactive } = config;

  log('>> Installing npm packages...');
  await command('npm ci', { cwd: path.resolve(__dirname, '..') });

  log('>> Current npm user:');
  await command('npm whoami', { stdio: 'inherit' });

  const yesFlag = interactive ? '' : '--yes';
  const noVerifyAccessFlag = interactive ? '' : '--no-verify-access';

  if (config.releaseType === 'next') {
    log('>> Publishing next version of packages...');
    await command(
      `npx lerna publish from-package --dist-tag ${distTag} ${yesFlag} ${noVerifyAccessFlag}`,
      { stdio: 'inherit' }
    );
  } else {
    log('>> Publishing latest version of packages...');
    await command(
      `npx lerna publish ${config.minimumVersionBump} --dist-tag ${distTag} ${yesFlag} ${noVerifyAccessFlag}`,
      { stdio: 'inherit' }
    );
  }
}

/**
 * Asks for user confirmation
 * @param {string} message Confirmation message
 * @returns {Promise<boolean>} User's response
 */
async function askForConfirmation(message) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question(`${message} (y/N) `, (answer) => {
      readline.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Runs the release process
 * @param {ReleaseType} releaseType The type of release to perform
 * @param {Object} options Release options
 */
async function runRelease(releaseType, options = {}) {
  const config = getConfig(releaseType, options);

  log(
    formats.title('\n🚀 Starting HizzleWP packages release process\n\n'),
    'To perform a release you need to be logged in to npm.\n'
  );

  if (config.interactive) {
    const confirmed = await askForConfirmation('Ready to proceed?');
    if (!confirmed) {
      log('Release process aborted.');
      process.exit(1);
    }
  }

  await updatePackageVersions(config);
  await publishPackages(config);

  log('\n>> 🎉 HizzleWP packages have been published successfully!\n');
}

// Export release functions
module.exports = {
  publishLatest: (options) => runRelease('latest', options),
  publishNext: (options) => runRelease('next', options),
}; 