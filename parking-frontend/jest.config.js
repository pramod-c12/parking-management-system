module.exports = {
    testEnvironment: 'jsdom', // Required for React testing
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios)/', // Transform axios in node_modules (as a fallback)
    ],
    moduleNameMapper: {
      '^axios$': '<rootDir>/__mocks__/axios.js', // Use the mock for axios
    },
  };