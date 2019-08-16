var test_site_name = 'vagrant.bradford-abbas.uk';
var test_site_alias = '@badev'
var sassSources = ['./scss/**/*.scss'];
var drupalPHPSources = ['**/*.{php,inc,theme}'];
var drupalTemplateSources = ['**/*.html.twig'];
var drush = 'drush '

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');


// // Error notifications
// var reportError = function (error) {
//   notify({
//     title: 'Gulp Task Error',
//     message: 'Check the console.'
//   }).write(error);
//   console.log(error.toString());
//   this.emit('end');
// }

// Sass processing
gulp.task('sass', (done) => {
  return gulp.src(sassSources)
    .pipe(sourcemaps.init())
    // Convert sass into css
    .pipe(sass().on('error', sass.logError))
    // Autoprefix properties
    .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'] }))
    // Write sourcemaps
    .pipe(sourcemaps.write())
    // Save css
    .pipe(gulp.dest('./styles'))
    .pipe(browserSync.stream());
    done();
});

// Run drush to clear the theme registry; render; css; and js caches
gulp.task('drushPHP', shell.task(["drush " + test_site_alias + " cr"],  { ignoreErrors: true }));


gulp.task('watch-server', 
  gulp.series('sass', 'drushPHP', (done) => {
    browserSync.init({
      proxy: test_site_name,
      // reloadOnRestart: true,
      browser: '/Applications/Firefox Developer Edition.app'
    });
  gulp.watch(sassSources, gulp.series('sass'));
  gulp.watch(drupalPHPSources, gulp.series('drushPHP', reload));
  gulp.watch(drupalTemplateSources, gulp.series('drushPHP', reload));
  done();
}));

// Default task to be run with `gulp`
gulp.task('default', gulp.series('watch-server'));

