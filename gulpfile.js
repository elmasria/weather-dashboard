/*eslint-env node*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var sourcemap = require('gulp-sourcemaps');

gulp.task('default', ['dist'], function(){

});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'scripts-dist',
	'server'
]);

gulp.task('copy-html', function(){
	gulp.src('./index.html')
	.pipe(gulp.dest('./dist'))
	.pipe(reload({stream: true}));

	gulp.src('./templates')
	.pipe(gulp.dest('./dist'))
	.pipe(reload({stream: true}));

	gulp.src('./templates/**/*')
	.pipe(gulp.dest('./dist/templates'))
	.pipe(reload({stream: true}));

	gulp.src('./vendors')
	.pipe(gulp.dest('./dist'))
	.pipe(reload({stream: true}));

	gulp.src('./vendors/**/*')
	.pipe(gulp.dest('./dist/vendors'))
	.pipe(reload({stream: true}));
});

gulp.task('copy-images', function(){
	gulp.src('images/**/*')
	.pipe(gulp.dest('dist/images'));
});

gulp.task('styles', function () {
	gulp.src('styles/sass/**/*.scss')
	.pipe(sass({
		outputStyle: 'compressed'
	}).on('error', sass.logError))
	.pipe(autoprefixer({
		browser: ['last 2 versions']
	}))
	.pipe(minifyCSS())
	.pipe(gulp.dest('dist/styles'))
	.pipe(reload({stream: true}));
});

gulp.task('scripts-dist', function(){
	gulp.src(['vendors/angular/angular.js',
		'vendors/angular/angular-route.min.js',
		'vendors/angular/angular-resource.min.js',
		'vendors/angular/angular-animate.min.js',
		'javascript/**/*.js'])
	.pipe(sourcemap.init())
	.pipe(concat('app.js'))
	.pipe(gulp.dest('dist/javascript'))
	.pipe(reload({stream: true}));
});

gulp.task('server', function(){
	browserSync.init({
		server: {
			baseDir: './dist/'
		}
	});

	gulp.watch('./Styles/sass/**/*.scss',['styles']);
	gulp.watch('./javascript/**/*.js', ['scripts-dist']);
	gulp.watch('./index.html', ['copy-html']);
	gulp.watch('./templates/**/*.html', ['copy-html']);
});