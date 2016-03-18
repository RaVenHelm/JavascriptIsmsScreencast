var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    sourcestream = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util');

gulp.task('es5', function() {
    gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            basename: 'app.min',
            extname: '.js'
        }))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./js'));
});

gulp.task('babel', function() {
    var b = browserify({
        entries: './src/es2015/app.js',
        transform: [babelify]
    })
    return b.bundle()
        .pipe(sourcestream('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./es2015'));
});

gulp.task('html', function() {
    gulp.src('./*.html');
});

gulp.task('watch', function() {
    gulp.watch('./src/js/**/*.js', ['es5']);
    gulp.watch('./src/es2015/**/*.js', ['babel']);
    gulp.watch('./*.html', ['html']);
});

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('default', ['html', 'es5', 'webserver', 'watch']);
