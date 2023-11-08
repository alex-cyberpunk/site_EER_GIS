module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov", "clover"],
  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["js", "mjs", "cjs", "jsx", "ts", "tsx", "json", "node"],
  moduleNameMapper: {},
  modulePathIgnorePatterns: [],
  notify: false,
  notifyMode: "failure-change",
  setupFiles: ['<rootDir>/node_modules/dotenv-safe/config'],
  //testTimeout: 60000,
};



/*coverageDirectory: "coverage",
   coveragePathIgnorePatterns: [
    "/node_modules/",
  "mapaPedidos.test.js",
  "formsPedidos.test.js" ],
  //transformIgnorePatterns: ['node_modules/(?!(@arcgis|@esri|@stencil|@popperjs)/)'],
  moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx', 'vue'],
  setupFiles: ['./jest.setup.js'],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  moduleNameMapper: {
    '^@arcgis/core/core/domUtils.js$': '<rootDir>/__mocks__/emptyModule.js',
    '^@arcgis/core/widgets/Widget.js$': '<rootDir>/__mocks__/emptyModule.js',
  },
  allowJS: true */


