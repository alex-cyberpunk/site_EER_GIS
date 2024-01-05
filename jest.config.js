module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov", "clover"],
  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["js", "mjs", "cjs", "jsx", "ts", "tsx", "json", "node"],
  moduleNameMapper: {
    "^@arcgis/core/(.*)": "jest-transform-stub"
  },
  modulePathIgnorePatterns: [],
  notify: false,
  notifyMode: "failure-change",
  setupFiles: ['<rootDir>/node_modules/dotenv-safe/config'],
  transform: {
    "\\.(css|less|scss|sass|styl)$": "jest-transform-stub",
    "^.+\\.js$": "babel-jest",
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios).+\\.js$"
  ]
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


