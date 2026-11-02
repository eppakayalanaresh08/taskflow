module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.ts'],
  testTimeout: 15000,
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|@react-native-async-storage|react-redux|@reduxjs|immer|redux|redux-thunk|reselect)/)',
  ],
};
