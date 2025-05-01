module.exports = {
    testEnvironment: 'node', // Backend tests typically run in Node environment
    testMatch: [
      '<rootDir>/tests/**/*.test.js', // Only run tests in the 'tests' directory (or adjust to your backend test location)
    ],
    testPathIgnorePatterns: [
      '/parking-frontend/', // Ignore frontend tests
      '/node_modules/',
    ],
    testTimeout: 20000, 
  };