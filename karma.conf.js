const isCI = require("process").env.CI;

// Karma configuration
module.exports = function(config) {
    config.set({
        // frameworks to use
        frameworks: ["mocha", "chai"],

        // list of files / patterns to load in the browser
        files: [
            "./test/**/*.spec.js"
        ],

        // preprocessors for files
        preprocessors: {
            "./test/**/*.spec.js": ["webpack"]
        },

        webpackServer: {
            quiet: true
        },

        // test results reporter to use
        reporters: ["mocha"/*, "notify"*/],

        // web server port
        port: 9876,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        browsers: ["Chrome-NoFollow", "Firefox-NoFollow"],

        // how many browser should be started simultaneous
        concurrency: 2,

        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // custom browsers
        customLaunchers: {
            "Chrome-NoFollow": {
                base: "Chrome",
                flags: ["--class=Chrome-NoFollow", isCI ? "--no-sandbox" : ""]
            },
            "Firefox-NoFollow": {
                base: "Firefox",
                flags: ["--class=Firefox-NoFollow"]
            }
        }
    });
};
