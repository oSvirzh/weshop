var gulp          = require('gulp'),
    scss          = require('gulp-sass'),
    cleanCSS      = require('gulp-clean-css'),
    pug           = require('gulp-pug'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    autoprefixer  = require('gulp-autoprefixer'),
    sourcemaps    = require('gulp-sourcemaps'),

    spritesmith   = require('gulp.spritesmith'),

    runSequence   = require('run-sequence'),
    browserSync   = require('browser-sync').create(),

    paths   = {
        js          : './src/js/',
        images      : './src/images/',
        fonts       : './src/fonts/',
        scss        : './src/styles/',
        pug         : './src/',
        dest        : {
            root        : './build/'
        }
    },
    sources = {
        jsSrc   : function() {
            return gulp.src([paths.js + 'main.js'])
        },
        imgSrc      : function() { return gulp.src([
            paths.images + '**/*.png',
            paths.images + '**/*.jpg',
            paths.images + '**/*.gif',
            paths.images + '**/*.jpeg',
            paths.images + '**/*.svg',
            paths.images + '**/*.ico',
            '!' + paths.images + 'sprites/*.*'
        ])},
        sprSrc      : function() { return gulp.src([
            paths.images + 'sprites/*.png',
        ])},
        fontsSrc      : function() { return gulp.src([
            paths.fonts + '**/*.woff',
            paths.fonts + '**/*.woff2',
            paths.fonts + '**/*.ttf',
            paths.fonts + '**/*.eot'
        ])},
        scssSrc     : function() {
            return gulp.src([paths.scss + 'main.scss'])
        },
        pugSrc     : function() {
            return gulp.src([paths.pug + '*.pug'])
        }
    };

gulp.task('js', function() {
    sources.jsSrc()
        .pipe(concat('main.js'))
        .on('error', console.log)
        .pipe(gulp.dest(paths.dest.root + 'js'));
});

gulp.task('scss', function() {
    sources.scssSrc()
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest.root + 'css'));
});

gulp.task('pug', function() {
    var locals = {};

    sources.pugSrc()
        .pipe(pug({ locals: locals }))
        .on('error', console.log)
        .pipe(gulp.dest(paths.dest.root));
});

gulp.task('images', function() {
    sources.imgSrc()
        .on('error', console.log)
        .pipe(gulp.dest(paths.dest.root + 'images'));
});

gulp.task('fonts', function() {
    sources.fontsSrc()
        .on('error', console.log)
        .pipe(gulp.dest(paths.dest.root + 'fonts'));
});

gulp.task('sprite', function() {
    var spriteData =
        sources.sprSrc()
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_sprite.scss',
                cssFormat: 'scss',
                algorithm: 'top-down',
                padding: 2,
                cssTemplate: 'spritset.maprules',
                cssVarMap: function(sprite) {
                    sprite.name = 'spr-' + sprite.name
                }

            }));

    spriteData.img.pipe(gulp.dest(paths.dest.root + 'images/sprites')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(paths.scss +'base')); // путь, куда сохраняем стили
});

gulp.task('server',     function() {
    browserSync.init({
        server: {
            baseDir: paths.dest.root
        },
        files: [
            paths.app + '**/*.*',
            paths.dest.root + '**/*.*'
        ],
        port: 8000,
        ui: { port: 8001 }
    });
});

gulp.task('compile', [ 'sprite', 'pug', 'scss', 'js', 'images', 'fonts']);

gulp.task('default',    function() {
    runSequence('sprite' , 'watch', 'server');
});

gulp.task('watch',  ['compile'], function () {
    gulp.watch([paths.images    + 'sprites/*.*'],    ['sprite'],   browserSync.reload);
    gulp.watch([paths.images    + '**/*.*'],    ['img'],   browserSync.reload);
    gulp.watch([paths.fonts     + '**/*.*'],    ['fonts'], browserSync.reload);
    gulp.watch([paths.pug       + 'pug/**/*.pug'],  ['pug'],   browserSync.reload);
    gulp.watch([paths.scss      + '**/*.scss'], ['scss'],  browserSync.reload);
    gulp.watch([paths.js        + '**/*.js'],   ['js'],    browserSync.reload);
});