var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');
var htmlmin = require('gulp-htmlmin');
var ngAnnotate = require('gulp-ng-annotate');

var jsMinifyOptions = {
    noSource: true,
    ext: {
        src: '-debug.js',
        min: '.js'
    },
    mangle: false
};

// Copy images
gulp.task('copy-images', function () {
    return gulp.src(['client/images/*.*'])
        .pipe(gulp.dest('build/images'));
});

// Copy fonts
gulp.task('copy-fonts', function () {
    return gulp.src(['client/fonts/**'])
        .pipe(gulp.dest('build/fonts'));
});

// Minify html
gulp.task('minify-html', function () {
    return gulp.src('client/views/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('build/views'));
});

// Minify css
gulp.task('minify-css', function () {
    return gulp.src('client/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('build/css/'));
});

// Minify JS folder
gulp.task('minify-js', function () {
    gulp.src('client/js/**/*.js')
        .pipe(ngAnnotate())
        .pipe(minify(jsMinifyOptions))
        .pipe(gulp.dest('build/js'));
});

gulp.task('default', ['copy-images', 'copy-fonts', 'minify-css', 'minify-html', 'minify-js'], function() {
    console.log('***DONE*****')
});