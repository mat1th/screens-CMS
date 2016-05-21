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
    svgmin = require('gulp-svgmin'),
    cssnext = require('cssnext'),
    mqpacker = require('css-mqpacker'),
    csswring = require('csswring'),
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
gulp.task('styles', function(cb) {
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
            './public/src/css/components/nav.css',
            './public/src/css/components/about.css',
            './public/src/css/components/slider.css',
            './public/src/css/components/home.css',
            './public/src/css/components/skills.css',
            './public/src/css/components/project.css',
            './public/src/css/components/projectcolors.css',
            './public/src/css/components/footer.css'
        ])
        .pipe(concat('style.css'))
        .pipe(postcss(processors))
        .pipe(cssnano())
        .pipe(gulp.dest('./public/dist/css/'))
        .pipe(notify({
            message: 'styles task complete'
        }));
});

// Scripts
gulp.task('scripts', function(cb) {
    return gulp.src(['./node_modules/gsap/src/minified/TweenMax.min.js', './public/src/js/script.js'])
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./public/dist/js/'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

gulp.task('critical', function (cb) {
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


// Default task
gulp.task('default', function() {
    gulp.start('styles', 'scripts');
});

// Watch
gulp.task('watch', function() {
    gulp.watch('./public/src/css/**/*.css', ['styles']);
    gulp.watch('./public/src/js/*.js', ['scripts']);
});
