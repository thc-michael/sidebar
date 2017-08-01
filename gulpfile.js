var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var wait = require('gulp-wait');

var srcDir = 'src';
var distDir = 'dist';

gulp.task('css', function(){
	del([
		distDir + '/css/**/*'
	]);
	return gulp.src(srcDir + '/css/**/*.scss', { style: 'expanded' })
	.pipe(wait(1500)) // workaround to prevent Visual Studio Code from locking scss files
	.pipe(sass())
	.pipe(autoprefixer('last 4 version'))
	.pipe(rename('app.css'))
	.pipe(gulp.dest(distDir + '/css'))
	.pipe(rename({ suffix: '.min' }))
	.pipe(cleanCSS({ compatibility: 'ie8' }))
	.pipe(gulp.dest(distDir + '/css'));
});

gulp.task('js', function(){
	del([
		distDir + '/js/**/*'
	]);
	return gulp.src([
		srcDir + '/js/*.js',
	])
	.pipe(concat('app.js'))
	.pipe(gulp.dest(distDir + '/js'))
	.pipe(rename({ suffix: '.min' }))
	.pipe(uglify())
	.pipe(gulp.dest(distDir + '/js'));
});

gulp.task('watch', function(){
	gulp.watch(srcDir + '/css/**/*.scss', ['css']);
	gulp.watch(srcDir + '/js/**/*.js', ['js']);
});

gulp.task('build', ['css', 'js']);

gulp.task('default', ['watch']);
