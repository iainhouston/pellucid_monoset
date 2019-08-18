const test_site_name = 'vagrant.bradford-abbas.uk';
const test_site_alias = '@badev';

const sassSources = ['./scss/**/*.scss'];
const drupalPHPSources = ['**/*.{php,inc,theme}'];
const drupalTemplateSources = ['**/*.html.twig'];
const drush = 'drush '

const gulp = require('gulp');
const browserSync = require('browser-sync');

const sass = require('gulp-sass');
const shell = require('gulp-shell');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');

const browserSyncConfig = {
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
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./styles'));
}

function drushPHP(done) {
    shell.task(["drush " + test_site_alias + " cr"],  { ignoreErrors: true });
    notify({message: "Cache rebuild complete", sound: true}).write('');
    done();
}

function watch() {
  gulp.watch(sassSources, gulp.series(sass2css, reload));
  gulp.watch(drupalPHPSources, gulp.series(drushPHP, reload));
}

exports.default = gulp.series(sass2css, serve, drushPHP, watch);
