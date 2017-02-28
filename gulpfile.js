/*global -$ */

/*
 * This gulp file is designed to be used on the host OS
 * on the development machine and not in the guest OS in a Vagrant setup
 */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var outputPath = 'styleguide';
var test_site_name = 'bradford-abbas.drupal8vm.dev';
var drush = '/Users/iainhouston/Drupal8Platforms/pellucid_compose/web/drush '
var test_site_alias = '@badev';

// Error notifications
var reportError = function (error) {
  $.notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(error);
  console.log(error.toString());
  this.emit('end');
}

// Sass processing
gulp.task('sass', function () {
  return gulp.src('scss/**/*.scss')
    .pipe($.sourcemaps.init())
    // Convert sass into css
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10
    }))
    // Show errors
    .on('error', reportError)
    // Autoprefix properties
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    // Write sourcemaps
    .pipe($.sourcemaps.write())
    // Save css
    .pipe(gulp.dest('styles'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// process JS files and return the stream.
gulp.task('js', function () {
  return gulp.src('scripts/**/*.js')
    .pipe(gulp.dest('scripts'));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest('images'));
});

// JS hint
gulp.task('jshint', function () {
  return gulp.src('scripts/*.js')
    .pipe(reload({
      stream: true,
      once: true
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({
      title: "JS Hint",
      message: "JS Hint says all is good.",
      onLast: true
    }));
});

// Beautify JS
gulp.task('beautify', function () {
  gulp.src('scripts/*.js')
    .pipe($.beautify({indentSize: 2}))
    .pipe(gulp.dest('scripts'))
    .pipe($.notify({
      title: "JS Beautified",
      message: "JS files in the theme have been beautified.",
      onLast: true
    }));
});

// Compress JS
gulp.task('compress', function () {
  return gulp.src('scripts/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.uglify())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('scripts'))
    .pipe($.notify({
      title: "JS Minified",
      message: "JS files in the theme have been minified.",
      onLast: true
    }));
});

// Run drush to clear the theme registry; render; css; and js caches
gulp.task('drush', function () {
  return gulp.src('', {
      read: false
    })
    .pipe($.shell([
        drush + test_site_alias + ' cc css-js',
        drush + test_site_alias + ' cc theme-registry',
        drush + test_site_alias + ' cc render',
    ]))
    .pipe($.notify({
      title: "Caches cleared",
      message: "Selected Drupal caches cleared.",
      onLast: true
    }));
});

// BrowserSync
gulp.task('browser-sync', function () {
  //watch files
  var files = [
    'styles/main.css',
    'scripts/**/*.js',
    'images/**/*',
    'templates/**/*.twig'
  ];
  //initialize browsersync
  browserSync.init(files, {
    proxy: test_site_name,
    // reloadOnRestart: true,
     browser: ['/Applications/Google Chrome.app']
  });
});

// Default task to be run with `gulp`
  gulp.task('default', ['sass', 'drush', 'browser-sync'], function () {
  gulp.watch("scss/**/*.scss", ['sass']);
  gulp.watch("scripts/**/*.js", ['js']);
  gulp.watch("templates/**/*.twig", ['drush']);
});
