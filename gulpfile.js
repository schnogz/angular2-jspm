//////////////////////////////////
// Dependencies
//////////////////////////////////s
const gulp = require('gulp');
const _ = require('lodash');
const del = require('del');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tscConfig = require('./tsconfig.json');
const browserSync = require('browser-sync');
const tslint = require('gulp-tslint');
const karmaServer = require('karma').Server;
const prompt = require('gulp-prompt');
const typedoc = require("gulp-typedoc");
const sass = require('gulp-sass');
const inlineNg2Templates = require('gulp-inline-ng2-template');


//////////////////////////////////
// Variables
//////////////////////////////////

// filepath definitions
const paths = {
    distAssetsFolder: 'dist/assets',
    distFolder: 'dist',
    distLibFolder: 'dist/lib',
    distFiles: 'dist/**/*',
    srcMapFolder: './maps',
    srcFiles: 'src/**/*',
    srcAssetFolder: 'src/assets/**/*',
    srcMainSassFile: 'src/**/main.scss',
    srcTsFiles: 'src/**/*.ts',
    srcTestFiles : 'src/**/*.spec.ts'
};

// tasklist definitions
const userTasks = {
    serve: 'Start Local Dev Server',
    build: 'Run Build',
    test: 'Run Unit Tests',
    promptUserForDebugBrowser: 'Debug Unit Tests In Browser',
    generateDocs: 'Generate Source Documentation'
};



//////////////////////////////////
// Tasklists (Developers & Build)
//////////////////////////////////

// default task
gulp.task('default', ['promptUserForTask']);

// developer tasks
gulp.task('build', ['assemble', 'test']);
gulp.task('assemble', ['clean:dist', 'transpile-typescript', 'copy:assets', 'compile-sass', 'copy:templates']);

// css/sass tasks
gulp.task('sass', ['copy:assets', 'compile-sass']);

// nightly tasks
gulp.task('build-nightly', ['coverageReport', 'typedoc']);



//////////////////////////////////
// Single Task Definitions
//////////////////////////////////

// browsersync tasks
gulp.task('reloadBrowser', ['assemble'], browserSync.reload);

// run unit tests in Phantom (CI builds)
gulp.task('test', ['assemble'], function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.config.js'
    }, done).start();
});

// debug unit tests in Chrome
gulp.task('testDebugChrome', ['assemble'], function (done) {
    new karmaServer({
        browsers: ['Chrome'],
        configFile: __dirname + '/karma.config.js',
        singleRun: false
    }, done).start();
});

// debug unit tests in Firefox
gulp.task('testDebugFirefox', ['assemble'], function (done) {
    new karmaServer({
        browsers: ['Firefox'],
        configFile: __dirname + '/karma.config.js',
        singleRun: false
    }, done).start();
});

// clean the contents of the distribution directory
gulp.task('clean:dist', function () {
    return del(paths.distFiles);
});

// clean coverage files
gulp.task('clean:coverage', function () {
    return del(paths.coverageFiles);
});

// copy assets (css, images, fonts) to dist folder
gulp.task('copy:assets', ['clean:dist'], function() {
    return gulp
      .src([
        paths.srcAssetFolder
      ])
      .pipe(gulp.dest(paths.distAssetsFolder));
});

// copy application templates, and status file for prana
gulp.task('copy:templates', ['clean:dist'], function() {
  return gulp
    .src(['src/**/*.html', 'src/status'])
    .pipe(gulp.dest(paths.distFolder));
});

// transpile Typescript to ES5 JavaScript
gulp.task('transpile-typescript', ['clean:dist'], function () {
    return gulp
        .src(paths.srcTsFiles)
        .pipe(inlineNg2Templates({ useRelativePaths: true}))
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write(paths.srcMapFolder))
        .pipe(gulp.dest(paths.distFolder));
});

// compile SASS to CSS
gulp.task('compile-sass', ['clean:dist'], function () {
  return gulp
    .src(paths.srcMainSassFile)
    .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError))
    .pipe(gulp.dest(paths.distFolder));
});

// lint only app typescript files (no tests)
gulp.task('tslint', function(){
    return gulp
      .src([
        paths.srcTsFiles,
        '!' + paths.srcTestFiles
      ])
      .pipe(tslint())
      .pipe(tslint.report('verbose'));
});

// Run browsersync for development
gulp.task('serve', ['assemble'], function() {
    browserSync({
        server: {
            baseDir: paths.distFolder,
            routes: {
              '/jspm-config.js': './jspm-config.js',
              '/jspm_packages': './jspm_packages'
            }
        }
    });

    gulp.watch(paths.srcFiles, ['reloadBrowser']);
});

// generate app documentation
gulp.task("generateDocs", function() {
    return gulp
        .src([paths.srcTsFiles, '!' + paths.srcTestFiles])
        .pipe(typedoc({
            // TypeScript options (see typescript docs)
            module: "system",
            target: "ES5",
            includeDeclarations: true,
            out: "./documentation",
            json: "documentation/data/data.json",
            name: "Pricing Application",
            theme: "default",
            ignoreCompilerErrors: true,
            version: true,
            experimentalDecorators: true
        }));
});

// prompt user for a browser to debug tests in
gulp.task('promptUserForDebugBrowser', function() {
    return gulp.src('')
        .pipe(prompt.prompt({
            type: 'list',
            name: 'browser',
            message: 'What browser would you like to debug with?',
            choices: ['Chrome', 'Firefox']
        }, function(response) {
            if (response.browser === 'Chrome') {
                gulp.start('testDebugChrome');
            } else if (response.browser === 'Firefox') {
                gulp.start('testDebugFirefox');
            }
        }));
});

// prompt user for task to run
gulp.task('promptUserForTask', function() {
    return gulp.src('')
        .pipe(prompt.prompt({
                type: 'list',
                name: 'task',
                message: 'What would you like to do?',
                choices: _.values(userTasks)
            }, function(response) {
                gulp.start(_.invert(userTasks)[response.task]);
            }
        ));
});

