var gulp   = require( 'gulp' );
var jshint = require('gulp-jshint');

var jsFiles = ['gruntfile.js', 'server.js', "config/*.js", "controllers/**/*.js", "db-connection/*.js", "helpers/*.js", "models/*.js","routes/*.js"];

/**
* Check for code quality error.
**/
gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('default', ['lint']);