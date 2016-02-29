module.exports = function(config) {
    config.set({
        basePath: '',
        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: true,
        browsers: ['PhantomJS'],
        frameworks: ['jspm','jasmine'],
        plugins: [
            'karma-jspm',
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher'
        ],

        reporters: ['progress'],

        // ES6 polyfills needed for Phantom
        files: [
            'jspm_packages/github/es-shims/es6-shim@0.34.2/es6-shim.js'
        ],

        // karma-jspm plugin: https://www.npmjs.com/package/karma-jspm
        jspm: {
            config: 'jspm-config.js',
            // test files will be loaded as script tags on karma test page
            loadFiles: [
                'dist/**/*.spec.js'
            ],
            // files that are served or available for page includes to request
            serveFiles: [
                'dist/**/*.js',
                'dist/**/*.js.map'
            ],
            // since karma serves everything off of base/,
            // need to override paths from jspm-config.js for karma
            // these will probably need to stay in sync!
            paths: {
                'app': 'base/dist/app',
                'dist/*': 'base/dist/*',
                "github:*": "base/jspm_packages/github/*",
                "npm:*": "base/jspm_packages/npm/*"
            }
        },

        // levels of logging: config.LOG_DISABLE, config.LOG_ERROR, config.LOG_WARN, config.LOG_INFO, config.LOG_DEBUG
        logLevel: config.LOG_INFO
    })
};
