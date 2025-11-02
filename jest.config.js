// ESM-style Jest config so it can be imported when package.json uses "type":"module"
export default {
  testEnvironment: 'node',
  // Use babel-jest to transform src files (ESM) to CommonJS so Jest can run without experimental flags
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  // package.json declares "type":"module" for runtime; babel-jest will transform modules for tests
  testMatch: ['**/test/**/*.test.js'],
  moduleFileExtensions: ['js', 'json', 'node']
};
