var test_site_name = 'vagrant.bradford-abbas.uk';
var test_site_alias = '@badev';

var sassSources = ['./scss/**/*.scss'];
var drupalPHPSources = ['**/*.{php,inc,theme}'];
var drupalTemplateSources = ['**/*.html.twig'];
var drush = 'drush '

var gulp = require('gulp');
var browserSync = require('browser-sync');

var sass = require('gulp-sass');
var shell = require('gulp-shell');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');

var browserSyncConfig = {
    proxy: test_site_name,
    browser: '/Applications/Firefox Developer Edition.app',
    notify: false
};

const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init(browserSyncConfig);
  done();
}


// Sass processing
function sass2css() {
    return gulp.src(sassSources)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'] }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./styles'));
}

function drushPHP(done) {
    shell.task(["drush " + test_site_alias + " cr"],  { ignoreErrors: true });
    done();
}

function watch() {
  gulp.watch(sassSources, gulp.series(sass2css, reload));
  gulp.watch(drupalPHPSources, gulp.series(drushPHP, reload));
}

exports.default = gulp.series(sass2css, serve, drushPHP, watch);
