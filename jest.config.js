module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "jest-axe/extend-expect",
  ],
  moduleDirectories: ["node_modules"],
  modulePathIgnorePatterns: ["<rootDir>/.cache"],
  testPathIgnorePatterns: ["/node_modules/", "/.cache/"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
