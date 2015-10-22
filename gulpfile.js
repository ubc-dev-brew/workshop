var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var argv = require('minimist')(process.argv.slice(2));

// If in dev mode, type 'gulp <task> -d'
// If in production mode, omit '-d'
var dev = typeof(argv.d) !== 'undefined';

/*
	Finds .scss files in public/css/src and any of its
	subdirectories, compiles them to css, and puts the
	compiled .css files into the public/css/dist directory.
*/
gulp.task('sass', function() {
	return gulp.src('./public/css/src/**/*.scss')
		.pipe(sass())
		.pipe(gulpif(!dev, minifyCSS()))
		.pipe(gulpif(!dev, concat('main.min.css')))
		.pipe(gulp.dest('./public/css/dist'));
});
