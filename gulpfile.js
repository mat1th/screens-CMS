var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    // notify = require('gulp-notify'),
    cssnano = require('gulp-cssnano'),
    postcss = require('gulp-postcss'),
    critical = require('critical'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    responsive = require('gulp-responsive-images'),
    svgmin = require('gulp-svgmin'),
    nodemon = require('gulp-nodemon'),
    cssnext = require('cssnext'),
    csswring = require('csswring'),
    sourcemaps = require('gulp-sourcemaps'),
    called = false,
    faviconConfig = [{
        width: 310,
        rename: {
            suffix: '-310'
        }
    }, {
        width: 192,
        rename: {
            suffix: '-192'
        }
    }, {
        width: 180,
        rename: {
            suffix: '-180'
        }
    }, {
        width: 160,
        rename: {
            suffix: '-160'
        }
    }, {
        width: 152,
        rename: {
            suffix: '-152'
        }
    }, {
        width: 150,
        rename: {
            suffix: '-150'
        }
    }, {
        width: 144,
        rename: {
            suffix: '-144'
        }
    }, {
        width: 120,
        rename: {
            suffix: '-120'
        }
    }, {
        width: 114,
        rename: {
            suffix: '-114'
        }
    }, {
        width: 96,
        rename: {
            suffix: '-96'
        }
    }, {
        width: 76,
        rename: {
            suffix: '-76'
        }
    }, {
        width: 72,
        rename: {
            suffix: '-72'
        }
    }, {
        width: 70,
        rename: {
            suffix: '-70'
        }
    }, {
        width: 64,
        rename: {
            suffix: '-64'
        }
    }, {
        width: 60,
        rename: {
            suffix: '-60'
        }
    }, {
        width: 57,
        rename: {
            suffix: '-57'
        }
    }, {
        width: 32,
        rename: {
            suffix: '-32'
        }
    }, {
        width: 16,
        rename: {
            suffix: '-16'
        }
    }];

gulp.task('build', function() {
    gulp.start('icons', 'images', 'copy', 'favicons', 'styles-app', 'styles-slider', 'scripts-app', 'scripts-slideshow');
});

gulp.task('icons', function() {
    return gulp.src('public/src/img/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('public/dist/img/'));
});

gulp.task('copy', function() {
    return gulp.src(['./public/src/manifest.json', './public/src/browserconfig.xml'])
        .pipe(gulp.dest('public/dist'));
});


gulp.task('favicons', function() {
    return gulp.src(['./public/src/favicon.jpg'])
        .pipe(responsive({
            '*': faviconConfig
        }, {
            quality: 95,
            progressive: true,
            compressionLevel: 6,
            withMetadata: false
        }))
        .pipe(gulp.dest('./public/dist/'));
});
gulp.task('images', function() {
    return gulp.src(['./public/src/img/*.jpg', './public/src/img/*.png'])
        .pipe(responsive({
            '*': {
                quality: 85,
                progressive: true,
                compressionLevel: 6,
                withMetadata: false
            }
        }))
        .pipe(gulp.dest('./public/dist/img'));
});

// Styles
gulp.task('styles-app', function() {
    var processors = [
        autoprefixer({
            browsers: ['> 10%', 'IE 11']
        }),
        //        mqpacker,
        csswring,
        cssnext()
    ];
    return gulp.src([
            './public/src/css/reset.css',
            './public/src/css/variables.css',
            './public/src/css/base.css',
            './public/src/css/webfonts.css',
            './public/src/css/typography.css',
            './public/src/css/components/buttons.css',
            './public/src/css/components/animations.css',
            './public/src/css/components/loader.css',
            './public/src/css/components/form.css',
            './public/src/css/components/nav.css',
            './public/src/css/components/login.css',
            './public/src/css/components/content.css',
            './public/src/css/components/screens.css',
            './public/src/css/components/edit.css',
            './public/src/css/components/table.css',
            './public/src/css/components/slideshow-editor.css',
            './public/src/css/components/home.css',
            './public/src/css/components/footer.css',
            './public/src/css/components/fallbackflexbox.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(postcss(processors))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/dist/css/'))
});

gulp.task('styles-slider', function() {
    var processors = [
        autoprefixer({
            browsers: ['> 10%', 'IE 11']
        }),
        //        mqpacker,
        csswring,
        cssnext()
    ];
    return gulp.src([
            './public/src/css/reset.css',
            './public/src/css/variables.css',
            './public/src/css/base.css',
            './public/src/css/webfonts.css',
            './public/src/css/typography.css',
            './public/src/css/components/slider.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('slider.css'))
        .pipe(postcss(processors))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/dist/css/'))
});

// Scripts app
gulp.task('scripts-app', function() {
    // './node_modules/gsap/src/minified/TweenMax.min.js'
    return gulp.src([
            './public/src/js/app/DPstart.js',
            './public/src/js/app/DPhelper.js',
            './public/src/js/app/modernizr.js',
            './public/src/js/app/DPusers.js',
            './public/src/js/app/DPscreen.js',
            './public/src/js/app/DProutes.js',
            './public/src/js/app/DPslideshows.js',
            './public/src/js/app/DPserviceworker.js',
            './public/src/js/app/DPsupport.js',
            './public/src/js/app/DPvalidate.js',
            './public/src/js/app/DPinit.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/dist/js/'))
});
// Scripts slideshow
gulp.task('scripts-slideshow', function(cb) {
    return gulp.src(['./node_modules/gsap/src/minified/TweenMax.min.js', './public/src/js/slideshow/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('slideshow.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/dist/js/'))
});

gulp.task('critical', function(cb) {
    return critical.generate({
        base: './',
        src: 'index.html',
        css: ['./public/dist/css/style.css'],
        dimensions: [{
            width: 320,
            height: 480
        }, {
            width: 768,
            height: 400
        }, {
            width: 1280,
            height: 400
        }],
        dest: 'public/dist/css/critical.css',
        ignore: ['@font-face', /url\(/],
        minify: true,
        extract: false
    });
});

gulp.task('browser-sync', ['nodemon', 'watch'], function() {
    browserSync.init({
        proxy: 'http://localhost:3010',
        files: ['**/*.*'],
        port: 7000
    });
});

// Default task
gulp.task('default', function() {
    gulp.start('styles-app', 'styles-slider', 'scripts-app', 'scripts-slideshow');
});

gulp.task('nodemon', function(cb) {
    nodemon({
            script: './app.js'
        })
        .on('start', function() {
            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false
                });
            }, 500);
        })
        .on('error', function(err) {
            // Make sure failure causes gulp to exit
            throw err;
        });
});

// Watch
gulp.task('watch', function() {
    gulp.watch('./public/src/css/**/*.css', ['styles-app'], browserSync.reload);
    gulp.watch('./public/src/css/**/*.css', ['styles-slider'], browserSync.reload);
    gulp.watch('./public/src/js/app/*.js', ['scripts-app'], browserSync.reload);
    gulp.watch('./public/src/js/slideshow/*.js', ['scripts-slideshow'], browserSync.reload);
});
