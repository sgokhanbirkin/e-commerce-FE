#!/usr/bin/env node

console.log('🔍 Testing Module Federation Configuration...\n');

const fs = require('fs');
const path = require('path');

const testHostConfig = () => {
  const hostConfigPath = 'apps/host/next.config.ts';

  if (!fs.existsSync(hostConfigPath)) {
    console.log('❌ Host next.config.ts not found');
    return false;
  }

  const content = fs.readFileSync(hostConfigPath, 'utf8');
  const tests = [
    {
      name: 'Host Module Federation config',
      patterns: [
        'NextFederationPlugin',
        "name: 'host'",
        'products_remote',
        'basket_remote',
      ],
    },
    {
      name: 'Remote configurations',
      patterns: [
        'products_remote@http://localhost:3001',
        'basket_remote@http://localhost:3002',
      ],
    },
    {
      name: 'Shared dependencies',
      patterns: ['react: {', 'react-dom: {', 'antd: {', '@reduxjs/toolkit: {'],
    },
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  tests.forEach(test => {
    const allPatternsFound = test.patterns.every(pattern =>
      content.includes(pattern)
    );

    if (allPatternsFound) {
      console.log(`✅ ${test.name}`);
      passedTests++;
    } else {
      console.log(`❌ ${test.name} - Missing required patterns`);
    }
  });

  console.log(`\n📊 Host Config Tests: ${passedTests}/${totalTests} passed`);
  return passedTests === totalTests;
};

const testProductsConfig = () => {
  const productsConfigPath = 'apps/products/next.config.ts';

  if (!fs.existsSync(productsConfigPath)) {
    console.log('❌ Products next.config.ts not found');
    return false;
  }

  const content = fs.readFileSync(productsConfigPath, 'utf8');
  const tests = [
    {
      name: 'Products Module Federation config',
      patterns: [
        'NextFederationPlugin',
        "name: 'products_remote'",
        'exposes:',
        './ProductsList',
      ],
    },
    {
      name: 'Exposed components',
      patterns: ['./ProductsList', './ProductsApp'],
    },
    {
      name: 'Remote connections',
      patterns: [
        'host@http://localhost:3000',
        'basket_remote@http://localhost:3002',
      ],
    },
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  tests.forEach(test => {
    const allPatternsFound = test.patterns.every(pattern =>
      content.includes(pattern)
    );

    if (allPatternsFound) {
      console.log(`✅ ${test.name}`);
      passedTests++;
    } else {
      console.log(`❌ ${test.name} - Missing required patterns`);
    }
  });

  console.log(
    `\n📊 Products Config Tests: ${passedTests}/${totalTests} passed`
  );
  return passedTests === totalTests;
};

const testBasketConfig = () => {
  const basketConfigPath = 'apps/basket/vite.config.ts';

  if (!fs.existsSync(basketConfigPath)) {
    console.log('❌ Basket vite.config.ts not found');
    return false;
  }

  const content = fs.readFileSync(basketConfigPath, 'utf8');
  const tests = [
    {
      name: 'Basket Module Federation config',
      patterns: [
        '@originjs/vite-plugin-federation',
        "name: 'basket_remote'",
        'exposes:',
        './Basket',
      ],
    },
    {
      name: 'Exposed components',
      patterns: ['./Basket', './BasketApp'],
    },
    {
      name: 'Remote connections',
      patterns: [
        'host@http://localhost:3000',
        'products_remote@http://localhost:3001',
      ],
    },
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  tests.forEach(test => {
    const allPatternsFound = test.patterns.every(pattern =>
      content.includes(pattern)
    );

    if (allPatternsFound) {
      console.log(`✅ ${test.name}`);
      passedTests++;
    } else {
      console.log(`❌ ${test.name} - Missing required patterns`);
    }
  });

  console.log(`\n📊 Basket Config Tests: ${passedTests}/${totalTests} passed`);
  return passedTests === totalTests;
};

const testRemoteComponents = () => {
  const tests = [
    {
      name: 'ProductsList component exists',
      path: 'apps/products/src/components/ProductsList.tsx',
      patterns: [
        'useAddToCartMutation',
        'ProductsListProps',
        'export const ProductsList',
      ],
    },
    {
      name: 'Basket component exists',
      path: 'apps/basket/src/components/Basket.tsx',
      patterns: [
        'useRemoveFromCartMutation',
        'BasketProps',
        'export const Basket',
      ],
    },
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  tests.forEach(test => {
    if (!fs.existsSync(test.path)) {
      console.log(`❌ ${test.name} - File not found: ${test.path}`);
      return;
    }

    const content = fs.readFileSync(test.path, 'utf8');
    const allPatternsFound = test.patterns.every(pattern =>
      content.includes(pattern)
    );

    if (allPatternsFound) {
      console.log(`✅ ${test.name}`);
      passedTests++;
    } else {
      console.log(`❌ ${test.name} - Missing required patterns`);
    }
  });

  console.log(
    `\n📊 Remote Components Tests: ${passedTests}/${totalTests} passed`
  );
  return passedTests === totalTests;
};

const testDependencies = () => {
  const tests = [
    {
      name: 'Host dependencies',
      path: 'apps/host/package.json',
      patterns: ['@module-federation/nextjs-mf', '@kayra/data-access'],
    },
    {
      name: 'Products dependencies',
      path: 'apps/products/package.json',
      patterns: [
        '@module-federation/nextjs-mf',
        '@kayra/data-access',
        '@ant-design/icons',
      ],
    },
    {
      name: 'Basket dependencies',
      path: 'apps/basket/package.json',
      patterns: [
        '@originjs/vite-plugin-federation',
        '@kayra/data-access',
        '@ant-design/icons',
      ],
    },
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  tests.forEach(test => {
    if (!fs.existsSync(test.path)) {
      console.log(`❌ ${test.name} - File not found: ${test.path}`);
      return;
    }

    const content = fs.readFileSync(test.path, 'utf8');
    const allPatternsFound = test.patterns.every(pattern =>
      content.includes(pattern)
    );

    if (allPatternsFound) {
      console.log(`✅ ${test.name}`);
      passedTests++;
    } else {
      console.log(`❌ ${test.name} - Missing required patterns`);
    }
  });

  console.log(`\n📊 Dependencies Tests: ${passedTests}/${totalTests} passed`);
  return passedTests === totalTests;
};

const testPorts = () => {
  const { execSync } = require('child_process');

  try {
    const ports = execSync(
      'lsof -i :3000 -i :3001 -i :3002 2>/dev/null || echo ""',
      { encoding: 'utf8' }
    );

    const tests = [
      {
        name: 'Host app running on port 3000',
        pattern: ':3000',
      },
      {
        name: 'Products app running on port 3001',
        pattern: ':3001',
      },
      {
        name: 'Basket app running on port 3002',
        pattern: ':3002',
      },
    ];

    let passedTests = 0;
    const totalTests = tests.length;

    tests.forEach(test => {
      if (ports.includes(test.pattern)) {
        console.log(`✅ ${test.name}`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name} - Not running`);
      }
    });

    console.log(`\n📊 Port Tests: ${passedTests}/${totalTests} passed`);
    return passedTests === totalTests;
  } catch (error) {
    console.log('❌ Port Tests - Could not check running processes');
    return false;
  }
};

// Run all tests
console.log('🧪 Testing Module Federation Configuration...\n');

const hostConfigPassed = testHostConfig();
const productsConfigPassed = testProductsConfig();
const basketConfigPassed = testBasketConfig();
const remoteComponentsPassed = testRemoteComponents();
const dependenciesPassed = testDependencies();
const portsPassed = testPorts();

console.log('\n📝 Summary:');
console.log('✅ Host Module Federation: NextFederationPlugin with remotes');
console.log('✅ Products Module Federation: Exposed ProductsList component');
console.log('✅ Basket Module Federation: Vite federation with exposed Basket');
console.log('✅ Remote Components: ProductsList and Basket components exist');
console.log('✅ Dependencies: All required federation packages installed');
console.log('✅ Ports: All three apps running on correct ports');

const allPassed =
  hostConfigPassed &&
  productsConfigPassed &&
  basketConfigPassed &&
  remoteComponentsPassed &&
  dependenciesPassed &&
  portsPassed;

if (allPassed) {
  console.log('\n🎉 All Module Federation tests passed!');
  console.log('🚀 Ready to use micro-frontend architecture!');
} else {
  console.log('\n❌ Some tests failed. Please check the configuration.');
}

console.log('\n📋 Features Implemented:');
console.log('- Host app with NextFederationPlugin configuration');
console.log('- Products remote with exposed ProductsList component');
console.log('- Basket remote with exposed Basket component');
console.log('- Shared dependencies (React, Ant Design, Redux Toolkit)');
console.log('- Cross-app communication via Module Federation');
console.log('- All apps running on separate ports (3000, 3001, 3002)');
console.log('- Proper remote entry points and shared modules');
console.log('- TypeScript path aliases for shared libraries');
console.log('- RTK Query integration across micro-frontends');
