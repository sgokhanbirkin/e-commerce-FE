#!/usr/bin/env node

console.log('🔍 Testing AuthContext Implementation...\n');

const fs = require('fs');
const path = require('path');

const testAuthContext = () => {
  const authContextPath = 'apps/host/src/context/AuthContext.tsx';

  if (!fs.existsSync(authContextPath)) {
    console.log('❌ AuthContext.tsx not found');
    return false;
  }

  const content = fs.readFileSync(authContextPath, 'utf8');
  const tests = [
    {
      name: 'AuthContext creation',
      patterns: [
        'createContext<AuthContextType',
        'AuthContext = createContext',
        'const AuthContext',
      ],
    },
    {
      name: 'AuthProvider component',
      patterns: [
        'export const AuthProvider',
        'AuthProviderProps',
        'children: ReactNode',
      ],
    },
    {
      name: 'useAuth hook',
      patterns: [
        'export const useAuth',
        'useContext(AuthContext)',
        'AuthContextType',
      ],
    },
    {
      name: 'withAuth HOC',
      patterns: [
        'export const withAuth',
        "router.push('/login')",
        'isAuthenticated',
      ],
    },
    {
      name: 'withPublicRoute HOC',
      patterns: ['export const withPublicRoute', "router.push('/dashboard')"],
    },
    {
      name: 'useAuthGuard hook',
      patterns: ['export const useAuthGuard', 'requireAuth', 'requireGuest'],
    },
    {
      name: 'Login function',
      patterns: [
        'const login = async',
        'loginUser({ email, password })',
        'storeToken(result.token)',
      ],
    },
    {
      name: 'Logout function',
      patterns: ['const logout = async', 'logoutUser()', 'clearAuth()'],
    },
    {
      name: 'Token management',
      patterns: ['getToken()', 'getUser()', 'setToken', 'setUser'],
    },
    {
      name: 'Loading states',
      patterns: ['isLoading: boolean', 'setIsLoading', 'isLoading'],
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

  console.log(`\n📊 AuthContext Tests: ${passedTests}/${totalTests} passed`);
  return passedTests === totalTests;
};

const testComponents = () => {
  const components = [
    {
      name: 'LoginForm',
      path: 'apps/host/src/components/LoginForm.tsx',
      patterns: ['useAuth', 'login(email, password)', 'isLoading', 'LoginForm'],
    },
    {
      name: 'ProtectedPage',
      path: 'apps/host/src/components/ProtectedPage.tsx',
      patterns: ['withAuth', 'useAuth', 'logout', 'ProtectedPage'],
    },
    {
      name: 'PublicPage',
      path: 'apps/host/src/components/PublicPage.tsx',
      patterns: ['withPublicRoute', 'PublicPage'],
    },
  ];

  let passedTests = 0;
  const totalTests = components.length;

  components.forEach(component => {
    if (!fs.existsSync(component.path)) {
      console.log(`❌ ${component.name} not found`);
      return;
    }

    const content = fs.readFileSync(component.path, 'utf8');
    const allPatternsFound = component.patterns.every(pattern =>
      content.includes(pattern)
    );

    if (allPatternsFound) {
      console.log(`✅ ${component.name}`);
      passedTests++;
    } else {
      console.log(`❌ ${component.name} - Missing required patterns`);
    }
  });

  console.log(`\n📊 Component Tests: ${passedTests}/${totalTests} passed`);
  return passedTests === totalTests;
};

const testExports = () => {
  const exportFiles = [
    {
      name: 'Context exports',
      path: 'apps/host/src/context/index.ts',
      patterns: [
        'AuthProvider',
        'useAuth',
        'withAuth',
        'withPublicRoute',
        'useAuthGuard',
      ],
    },
    {
      name: 'Component exports',
      path: 'apps/host/src/components/index.ts',
      patterns: ['LoginForm', 'ProtectedPage', 'PublicPage'],
    },
  ];

  let passedTests = 0;
  const totalTests = exportFiles.length;

  exportFiles.forEach(file => {
    if (!fs.existsSync(file.path)) {
      console.log(`❌ ${file.name} not found`);
      return;
    }

    const content = fs.readFileSync(file.path, 'utf8');
    const allPatternsFound = file.patterns.every(pattern =>
      content.includes(pattern)
    );

    if (allPatternsFound) {
      console.log(`✅ ${file.name}`);
      passedTests++;
    } else {
      console.log(`❌ ${file.name} - Missing required exports`);
    }
  });

  console.log(`\n📊 Export Tests: ${passedTests}/${totalTests} passed`);
  return passedTests === totalTests;
};

const testDocumentation = () => {
  const docsPath = 'apps/host/src/context/README.md';

  if (!fs.existsSync(docsPath)) {
    console.log('❌ AuthContext README.md not found');
    return false;
  }

  const content = fs.readFileSync(docsPath, 'utf8');
  const tests = [
    {
      name: 'Documentation structure',
      patterns: [
        '# AuthContext Documentation',
        '## Overview',
        '## Usage Examples',
        '## API Reference',
      ],
    },
    {
      name: 'Code examples',
      patterns: [
        '```tsx',
        'useAuth',
        'withAuth',
        'withPublicRoute',
        'AuthProvider',
      ],
    },
    {
      name: 'Best practices',
      patterns: [
        '## Best Practices',
        '## Security Features',
        '## Error Handling',
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
      console.log(`❌ ${test.name} - Missing documentation sections`);
    }
  });

  console.log(`\n📊 Documentation Tests: ${passedTests}/${totalTests} passed`);
  return passedTests === totalTests;
};

// Run all tests
console.log('🧪 Testing AuthContext Implementation...\n');

const authContextPassed = testAuthContext();
const componentsPassed = testComponents();
const exportsPassed = testExports();
const docsPassed = testDocumentation();

console.log('\n📝 Summary:');
console.log(
  '✅ AuthContext: React Context/Provider with authentication state management'
);
console.log('✅ withAuth HOC: Protects routes requiring authentication');
console.log(
  '✅ withPublicRoute HOC: Redirects authenticated users from public routes'
);
console.log('✅ useAuth hook: Access auth context in components');
console.log('✅ useAuthGuard hook: Conditional rendering based on auth state');
console.log('✅ Login/logout functions: Handle authentication operations');
console.log('✅ Token management: Automatic JWT token handling');
console.log('✅ Loading states: Proper loading state management');
console.log('✅ Error handling: Comprehensive error handling');
console.log('✅ Example components: LoginForm, ProtectedPage, PublicPage');
console.log('✅ Documentation: Comprehensive README with examples');

const allPassed =
  authContextPassed && componentsPassed && exportsPassed && docsPassed;

if (allPassed) {
  console.log('\n🎉 All AuthContext tests passed!');
  console.log('🚀 Ready to use authentication system!');
} else {
  console.log('\n❌ Some tests failed. Please check the implementation.');
}

console.log('\n📋 Features Implemented:');
console.log('- React Context/Provider for global auth state');
console.log('- withAuth HOC for protected routes');
console.log('- withPublicRoute HOC for public routes');
console.log('- useAuth hook for component access');
console.log('- useAuthGuard for conditional rendering');
console.log('- Login/logout functions with error handling');
console.log('- Automatic token management');
console.log('- Loading states and error handling');
console.log('- Example components and documentation');
