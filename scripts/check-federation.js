#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Module Federation Configuration...\n');

// Check if all required files exist
const requiredFiles = [
  'apps/host/next.config.ts',
  'apps/products/next.config.ts',
  'apps/basket/vite.config.ts',
  'libs/data-access/src/federation.ts',
  'libs/data-access/src/federation-loader.ts',
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

// Check federation configuration
const checkFederationConfig = () => {
  try {
    const hostConfig = fs.readFileSync(
      path.join(process.cwd(), 'apps/host/next.config.ts'),
      'utf8'
    );
    const productsConfig = fs.readFileSync(
      path.join(process.cwd(), 'apps/products/next.config.ts'),
      'utf8'
    );
    const basketConfig = fs.readFileSync(
      path.join(process.cwd(), 'apps/basket/vite.config.ts'),
      'utf8'
    );

    const checks = [
      {
        name: 'Host Federation Config',
        file: hostConfig,
        patterns: ['NextFederationPlugin', 'remotes:', 'exposes:'],
      },
      {
        name: 'Products Federation Config',
        file: productsConfig,
        patterns: ['NextFederationPlugin', 'name:', 'exposes:'],
      },
      {
        name: 'Basket Federation Config',
        file: basketConfig,
        patterns: ['ModuleFederationPlugin', 'name:', 'exposes:', 'remotes:'],
      },
    ];

    checks.forEach(check => {
      const allPatternsFound = check.patterns.every(pattern =>
        check.file.includes(pattern)
      );

      if (allPatternsFound) {
        console.log(`✅ ${check.name}`);
      } else {
        console.log(`❌ ${check.name} - Missing required patterns`);
      }
    });
  } catch (error) {
    console.log('❌ Error reading federation configuration files');
    console.error(error);
  }
};

// Check environment variables
const checkEnvironmentVariables = () => {
  const envFile = path.join(process.cwd(), '.env');
  const envExampleFile = path.join(process.cwd(), 'env.example');

  if (fs.existsSync(envExampleFile)) {
    console.log('✅ env.example exists');
  } else {
    console.log('❌ env.example missing');
  }

  if (fs.existsSync(envFile)) {
    console.log('✅ .env file exists');
  } else {
    console.log('⚠️  .env file missing (copy from env.example)');
  }
};

// Check package.json scripts
const checkPackageScripts = () => {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
    );
    const requiredScripts = [
      'dev',
      'build',
      'start',
      'lint',
      'test',
      'clean',
      'dev:host',
      'dev:products',
      'dev:basket',
      'build:host',
      'build:products',
      'build:basket',
      'federation:check',
      'federation:build',
    ];

    const missingScripts = requiredScripts.filter(
      script => !packageJson.scripts[script]
    );

    if (missingScripts.length === 0) {
      console.log('✅ All required scripts present in package.json');
    } else {
      console.log(
        '❌ Missing scripts in package.json:',
        missingScripts.join(', ')
      );
    }
  } catch (error) {
    console.log('❌ Error reading package.json');
  }
};

// Run all checks
console.log('\n📋 Federation Configuration:');
checkFederationConfig();

console.log('\n🌍 Environment Variables:');
checkEnvironmentVariables();

console.log('\n📦 Package Scripts:');
checkPackageScripts();

console.log('\n🎯 Summary:');
if (allFilesExist) {
  console.log('✅ All required files exist');
  console.log('✅ Federation configuration looks good');
  console.log('\n🚀 Ready to run: pnpm dev:all');
} else {
  console.log('❌ Some files are missing');
  console.log('Please ensure all required files are present');
}

console.log('\n📝 Next steps:');
console.log('1. Copy env.example to .env and update values');
console.log('2. Run: pnpm install');
console.log('3. Run: pnpm dev:all');
console.log('4. Check: http://localhost:3000 (host)');
console.log('5. Check: http://localhost:3001 (products)');
console.log('6. Check: http://localhost:3002 (basket)');
