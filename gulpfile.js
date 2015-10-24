var gulp = require('gulp'),
	sass = require('gulp-sass'),
	glob = require('glob'),
	minify = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	argv = require('minimist')(process.argv.slice(2));

// If in dev mode, type 'gulp <task> -d'
// If in production mode, omit '-d'
var dev = typeof(argv.d) !== 'undefined';

/*
	Finds .scss files in public/css/src and any of its
	subdirectories and compiles them to css. If -d is
	not specified, minifies and concatenates all source
	files. Then, places file(s) in public/css/dist
*/
gulp.task('sass', function() {
	return gulp.src(['./public/css/src/**/*.scss'])
		.pipe(sass())
		.pipe(gulpif(!dev, minify()))
		.pipe(gulpif(!dev, concat('main.min.css')))
		.pipe(gulp.dest('./public/css/dist'));
});

/*
	Finds .js files in public/js/src and resoves 'require' 
	dependencies with browserify. If -d is not specified, 
	uglifies and concatenates all source files. Then places
	file(s) in public/js/dist
*/
gulp.task('js', function(cb) {
	glob('./public/js/src/*.js', function(err, files) {
		var browserifier = browserify();
		files.forEach(function(file) {
			browserifier.add(file)
			if(dev) {
				// Individually process each file and reset browserifier
				_processor(browserifier.bundle(), _filename(file));
				browserifier = browserify();
			}
		});
		if(!dev) {
			// Process all files at once
			_processor(browserifier.bundle(), 'main.min.js');
		}
	});
});

/*
	Gulp processor function to compile and browserify
	individual files. If -d is not specified, uglifies 
	and concatenates all source files. Places output 
	files in ./public/js/dist

	bundle - a browserify bundle
	dist_name - specifies name of output file
*/
function _processor(bundle, dist_name) {
	bundle
		.pipe(source(dist_name))
		.pipe(gulpif(!dev, buffer()))
		.pipe(gulpif(!dev, uglify()))
		.pipe(gulp.dest('./public/js/dist'));
}

/*
	Given an absolute or relative path of a javascript
	file, returns the name by removing parent directories
	from the path string.

	file_path - path to file
*/
function _filename(file_path) {
	return file_path.match(/\w+\.js/)[0];
}