'use strict';

var /* var */
  gulp = require('gulp'),
  minifyCSS = require('gulp-minify-css'),
  browserify = require('browserify'),
  transform = require('vinyl-transform'),
  uglify = require('gulp-uglify');


gulp.task('styles', function() {
  return gulp.src('./private/css/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css'));
});


gulp.task('scripts', function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src('./private/js/app.js')
    .pipe(browserified)
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});


gulp.task('default', ['styles', 'scripts'], function() {
  console.log('Running default gulp task!');
});