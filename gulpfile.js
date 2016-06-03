var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cssnano = require('gulp-cssnano'),
    postcss = require('gulp-postcss'),
    critical = require('critical'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    svgmin = require('gulp-svgmin'),
    nodemon = require('gulp-nodemon'),
    cssnext = require('cssnext'),
    mqpacker = require('css-mqpacker'),
    csswring = require('csswring'),
    sourcemaps = require('gulp-sourcemaps'),
    called = false,
    // responsive = require('gulp-responsive'),
    imgConfig = [{
        width: 1500,
        rename: {
            suffix: '-1500'
        }
    }, {
        width: 1280,
        rename: {
            suffix: '-1280'
        }
    }, {
        width: 960,
        rename: {
            suffix: '-960'
        }
    }, {
        width: 640,
        rename: {
            suffix: '-640'
        }
    }, {
        width: 480,
        rename: {
            suffix: '-480'
        }
    }];

gulp.task('icons', function() {
    return gulp.src('public/src/img/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('public/dist/img'));
});

// Styles
gulp.task('styles-app', function(cb) {
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
            './public/src/css/components/form.css',
            './public/src/css/components/nav.css',
            './public/src/css/components/login.css',
            './public/src/css/components/content.css',
            './public/src/css/components/screens.css',
            './public/src/css/components/edit.css',
            './public/src/css/components/slideshow-editor.css',
            './public/src/css/components/home.css',
            './public/src/css/components/footer.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(postcss(processors))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/dist/css/'))
        .pipe(notify({
            message: 'styles task complete'
        }));
});
gulp.task('styles-slider', function(cb) {
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
        .pipe(notify({
            message: 'styles task complete'
        }));
});

// Scripts app
gulp.task('scripts-app', function(cb) {
    // './node_modules/gsap/src/minified/TweenMax.min.js'
    return gulp.src([
            './public/src/js/app/DPstart.js',
            './public/src/js/app/DPhelper.js',
            './public/src/js/app/DPfiledrag.js',
            './public/src/js/app/DPscreen.js',
            './public/src/js/app/DProutes.js',
            './public/src/js/app/DPslideshows.js',
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
        .pipe(notify({
            message: 'Scripts-app task complete'
        }));
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
        .pipe(notify({
            message: 'Scripts-slideshow task complete'
        }));
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


gulp.task('images', function() {
    gulp.start('homeimg', 'projectimg', 'layoutimg', 'toggleimg');
});

gulp.task('homeimg', function() {
    return gulp.src('public/src/img/home/*.jpg')
        .pipe(responsive({
            '*': imgConfig
        }, {
            quality: 95,
            progressive: true,
            compressionLevel: 6,
            withMetadata: false
        }))
        .pipe(gulp.dest('public/dist/img/home/'));
});
gulp.task('projectimg', function() {
    return gulp.src('public/src/img/projects/*.{jpg,png}')
        .pipe(responsive({
            '*': imgConfig
        }, {
            quality: 95,
            progressive: true,
            compressionLevel: 6,
            withMetadata: false
        }))
        .pipe(gulp.dest('public/dist/img/projects/'));
});

gulp.task('layoutimg', function() {
    return gulp.src('public/src/img/layout/*.jpg')
        .pipe(responsive({
            '*': imgConfig
        }, {
            quality: 95,
            progressive: true,
            compressionLevel: 6,
            withMetadata: false
        }))
        .pipe(gulp.dest('public/dist/img/layout/'));
});


gulp.task('toggleimg', function() {
    return gulp.src('public/src/img/togglebuttons/*.{jpg,png}')
        .pipe(responsive({
            '*': [{
                width: 1500,
                rename: {
                    extname: '.jpg'
                }
            }]
        }, {
            quality: 95,
            progressive: true,
            compressionLevel: 6,
            withMetadata: false
        }))
        .pipe(gulp.dest('public/dist/img/togglebuttons/'));
});

gulp.task('browser-sync', ['nodemon', 'watch'], function() {
    browserSync.init({
        proxy: "http://localhost:3010",
        files: ["**/*.*"],
        port: 7000
    });
});

// Default task
gulp.task('default', function() {
    gulp.start('styles', 'scripts');
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
