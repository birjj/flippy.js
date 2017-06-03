// Karma configuration
module.exports = function(config) {
  config.set({
    // frameworks to use
    frameworks: ["mocha", "chai"],

    // list of files / patterns to load in the browser
    files: [
      "./dist/flippy.bundle.js",
      "./test/**/*.js"
    ],

    // test results reporter to use
    reporters: ["mocha", "notify"],

    // web server port
    port: 9876,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    browsers: ["Chrome", "Firefox"],

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 2,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
