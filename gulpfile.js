// Defining requirements
var gulp = require( 'gulp' );
var plumber = require( 'gulp-plumber' );
var sass = require( 'gulp-sass' );
var rename = require( 'gulp-rename' );
var ignore = require( 'gulp-ignore' );
var sourcemaps = require( 'gulp-sourcemaps' );
var cleanCSS = require( 'gulp-clean-css' );
var autoprefixer = require( 'gulp-autoprefixer' );

var concat = require('gulp-concat');

// Configuration file to keep your code DRY
var cfg = require( './gulpconfig.json' );
var paths = cfg.paths;

// Run:
// gulp sass
// Compiles SCSS files in CSS
gulp.task( 'sass', function() {
    var stream = gulp.src( `${paths.sass}/*.scss` )
        .pipe( sourcemaps.init( { loadMaps: true } ) )
        .pipe( plumber( {
            errorHandler: function( err ) {
                console.log( err );
                this.emit( 'end' );
            }
        } ) )
        .pipe( sass( { errLogToConsole: true } ) )
        .pipe( autoprefixer( 'last 2 versions' ) )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( paths.css ) )
        .pipe( rename( 'custom-editor-style.css' ) );
    return stream;
});

// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task( 'watch', function() {
    gulp.watch( `${paths.sass}/**/*.scss`, gulp.series('styles') );
});


gulp.task( 'minifycss', function() {
    return gulp.src( paths.css + '/style.css' )
        .pipe( sourcemaps.init( { loadMaps: true } ) )
        .pipe( cleanCSS( { compatibility: '*' } ) )
        .pipe( plumber( {
            errorHandler: function( err ) {
                console.log( err ) ;
                this.emit( 'end' );
            }
        } ) )
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( paths.css ) );
});


gulp.task( 'styles', gulp.series( 'sass', 'minifycss' ));


gulp.task( 'build', gulp.series( 'styles' ));


gulp.task( 'wemap-prod', function() {
    return gulp.src('dist/css/**/*.css')
        .pipe( sourcemaps.init( { loadMaps: true } ) )
        .pipe( cleanCSS( { compatibility: '*' } ) )
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(concat('wemap.min.css'))
        .pipe(gulp.dest('dist/css'));
});
