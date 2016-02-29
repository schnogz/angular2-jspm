# Angular2-JSPM

## Overview
An Angular2 seed application that employs the following tech stack:

 - Node/NPM
 - Angular 2 (Typescript)
 - SystemJs & JSPM
 - Gulp
 - SASS
 - Karma & Jasmine

#### Current Features:
 - Typescript transpiling & linting
 - SASS compiling
 - Unit testing (PhantomJS & Browsers)
 - File Watching/live page reload
 - Documentation

#### Future Features
 - Bundling
 - Minification
 - Dependency Trees
 - Code Coverage

## Getting Started
### Dependencies
 - Node 5.4.0
 - NPM 3
 - A Modern IDE

### Developer Setup
 1. Install Node 5.4.0 is available at https://nodejs.org/en/
 2. Clone or download the repo to desired location on machine.
 3. Open a command prompt, navigate to project root and run `npm install gulp -g` and `npm install jspm -g`.
 4. From the same prompt, now run `npm install`** followed by `jspm install`. This will install all required dependencies 
 needed developing and running the app locally.
 5. Finally run `gulp serve`.  This should automatically build/compile the project and launch the app in a browser.

** Error's during npm install
If you get any errors reguarding Python or msbuild you will need to delete your node_modules directory and re-run with the no-optional param:

`npm install --no-optional`

There are some packages that have optional dependencies that cause these issues.

#### Run the `gulp` command at anytime to display a list of available tasks to assist with development.