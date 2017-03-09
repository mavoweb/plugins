/*
Build file to concat & minify files, compile SCSS and so on.
npm install gulp gulp-util gulp-uglify gulp-rename gulp-concat gulp-sourcemaps gulp-babel gulp-sass gulp-autoprefixer --save-dev
*/
// grab our gulp packages
var gulp  = require("gulp");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var notify = require("gulp-notify");

gulp.task("sass", function() {
	gulp.src(["src-css/*.scss", "!**/_*.scss"])
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"],
			cascade: false
		}))
		.pipe(rename({ extname: ".css" }))
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist"));

	return gulp.src(["**/*.scss", "!node_modules/**", "!src-css/*.scss"])
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"],
			cascade: false
		}))
		.pipe(rename({ extname: ".css" }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("."))
		.pipe(notify({
			message: "Sass done!",
			onLast: true
		}));
});

gulp.task("update", function() {
	gulp.src(["../mavo/dist/**/*"]).pipe(gulp.dest("mavo"));
});

gulp.task("watch", function() {
	gulp.watch(["../mavo/dist/*"], ["update"]);
	gulp.watch(["**/*.scss"], ["sass"]);
});

gulp.task("default", ["sass", "update"]);
