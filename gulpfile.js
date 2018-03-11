"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var del = require("del");
var rename = require("gulp-rename");
var run = require("run-sequence");
var strip = require("gulp-strip-comments");
var uglify = require('gulp-uglify');
var pump = require('pump');
const webp = require('gulp-webp');

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**.{png,jpg,svg,webp}"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("style", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("images", function () {
  return gulp.src("build/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("build/img/*.{jpg,png}")
    .pipe(webp({
      quality: 90,
      method: 6
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("stripHtml", function () {
  return gulp.src("source/*.html")
    .pipe(strip.html())
    .pipe(gulp.dest("build"));
});

gulp.task("minJs", function (cb) {
  pump([
      gulp.src("source/js/*.js"),
      uglify(),
      rename({
        suffix: ".min"
      }),
      gulp.dest("build/js/")
    ],
    cb
  );
});

gulp.task("serve", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]).on("change", server.reload);
  gulp.watch("source/js/*.js", ["minJs"]).on("change", server.reload);
  gulp.watch("source/*.html", ["stripHtml"]).on("change", server.reload);
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "webp",
    "stripHtml",
    "minJs",
    done
  );
});
