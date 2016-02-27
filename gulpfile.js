var gulp = require("gulp"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	sourcemap = require("gulp-sourcemaps");

gulp.task("js", function(){
	return gulp.src("flippy.js")
		.pipe(sourcemap.init())
		.pipe(uglify())
		.pipe(rename("flippy.min.js"))
		.pipe(sourcemap.write("maps"))
		.pipe(gulp.dest("dist/"));
});

gulp.task("watch", function(){
	gulp.watch("flippy.js", ["js"]);
});
gulp.task("default", ["watch", "js"]);