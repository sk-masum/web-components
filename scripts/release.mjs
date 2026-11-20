import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const bumpType = process.argv[2] || 'patch'; // patch | minor | major
const isDryRun = process.argv.includes('--dry-run');

if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error(`Invalid bump type "${bumpType}". Use: patch | minor | major`);
  process.exit(1);
}

const root = process.cwd();
const paths = {
  core: resolve(root, 'packages/stencil-library/package.json'),
  react: resolve(root, 'packages/react-library/package.json'),
  angular: resolve(root, 'packages/angular-library/package.json'),
};

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, data) => writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

const bumpVersion = (version, type) => {
  const [major, minor, patch] = version.split('.').map(Number);
  if (type === 'major') return `${major + 1}.0.0`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
};

const run = (cmd) => {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

// 1. Calculate next version from @seakh/ui-core
const corePkg = readJson(paths.core);
const reactPkg = readJson(paths.react);
const angularPkg = readJson(paths.angular);

const nextVersion = bumpVersion(corePkg.version, bumpType);
console.log(`\nReleasing v${nextVersion}${isDryRun ? ' (DRY RUN)' : ''}...`);

// 2. Sync versions & internal @seakh/ui-core dependency
corePkg.version = nextVersion;

reactPkg.version = nextVersion;
reactPkg.dependencies = { ...reactPkg.dependencies, '@seakh/ui-core': `^${nextVersion}` };

angularPkg.version = nextVersion;
angularPkg.dependencies = { ...angularPkg.dependencies, '@seakh/ui-core': `^${nextVersion}` };

if (!isDryRun) {
  writeJson(paths.core, corePkg);
  writeJson(paths.react, reactPkg);
  writeJson(paths.angular, angularPkg);
}

// 3. Build in dependency order
run('npm run build --workspace=packages/stencil-library');
run('npm run build --workspace=packages/react-library');
run('npm run build --workspace=packages/angular-library');

// 4. Publish in dependency order (Angular publishes from ./dist)
const dryFlag = isDryRun ? ' --dry-run' : '';
run(`npm publish --workspace=packages/stencil-library --access public${dryFlag}`);
run(`npm publish --workspace=packages/react-library --access public${dryFlag}`);
run(`npm publish ./packages/angular-library/dist --access public${dryFlag}`);

console.log(`\n✅ Done! ${isDryRun ? 'Dry run passed for' : 'Published'} v${nextVersion}`);