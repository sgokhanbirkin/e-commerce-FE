#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment files...\n');

const setupEnvironment = () => {
  const files = [
    {
      source: 'env.example',
      target: '.env',
      description: 'Root environment file',
    },
    {
      source: 'apps/host/env.example',
      target: 'apps/host/.env.local',
      description: 'Host app environment file',
    },
    {
      source: 'apps/products/env.example',
      target: 'apps/products/.env.local',
      description: 'Products app environment file',
    },
    {
      source: 'apps/basket/env.example',
      target: 'apps/basket/.env.local',
      description: 'Basket app environment file',
    },
  ];

  let successCount = 0;
  let skipCount = 0;

  files.forEach(({ source, target, description }) => {
    const sourcePath = path.join(process.cwd(), source);
    const targetPath = path.join(process.cwd(), target);

    if (!fs.existsSync(sourcePath)) {
      console.log(`❌ ${description}: Source file ${source} not found`);
      return;
    }

    if (fs.existsSync(targetPath)) {
      console.log(`⏭️  ${description}: ${target} already exists (skipping)`);
      skipCount++;
      return;
    }

    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ ${description}: Created ${target}`);
      successCount++;
    } catch (error) {
      console.log(`❌ ${description}: Failed to create ${target}`);
      console.error(error);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`✅ Created: ${successCount} files`);
  console.log(`⏭️  Skipped: ${skipCount} files (already exist)`);
};

const updateApiUrls = () => {
  console.log('\n🔗 Updating API URLs to local backend...');

  const envFiles = [
    '.env',
    'apps/host/.env.local',
    'apps/products/.env.local',
    'apps/basket/.env.local',
  ];

  envFiles.forEach(envFile => {
    const filePath = path.join(process.cwd(), envFile);

    if (!fs.existsSync(filePath)) {
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');

      // Update API URLs
      content = content.replace(
        /NEXT_PUBLIC_API_URL=https:\/\/fakestoreapi\.com/g,
        'NEXT_PUBLIC_API_URL=http://localhost:8080/api'
      );

      content = content.replace(
        /VITE_API_URL=https:\/\/fakestoreapi\.com/g,
        'VITE_API_URL=http://localhost:8080/api'
      );

      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated API URLs in ${envFile}`);
    } catch (error) {
      console.log(`❌ Failed to update ${envFile}:`, error.message);
    }
  });
};

const validateEnvironment = () => {
  console.log('\n🔍 Validating environment setup...');

  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_HOST_URL',
    'NEXT_PUBLIC_PRODUCTS_URL',
    'NEXT_PUBLIC_BASKET_URL',
  ];

  const envFile = path.join(process.cwd(), '.env');

  if (!fs.existsSync(envFile)) {
    console.log('❌ Root .env file not found');
    return;
  }

  const content = fs.readFileSync(envFile, 'utf8');
  const missingVars = requiredVars.filter(
    varName => !content.includes(varName)
  );

  if (missingVars.length === 0) {
    console.log('✅ All required environment variables are present');
  } else {
    console.log('❌ Missing environment variables:', missingVars.join(', '));
  }
};

// Run setup
setupEnvironment();
updateApiUrls();
validateEnvironment();

console.log('\n📝 Next steps:');
console.log('1. Review the created .env files');
console.log('2. Update API endpoints if needed');
console.log('3. Start your local backend server on port 8080');
console.log('4. Run: pnpm dev:all');
console.log('5. Check: http://localhost:3000 (host)');
console.log('6. Check: http://localhost:3001 (products)');
console.log('7. Check: http://localhost:3002 (basket)');
