var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sourcemap = require("gulp-sourcemaps");
var Karma = require("karma").Server;

gulp.task("js", function(){
  return gulp.src("flippy.js")
		.pipe(sourcemap.init())
		.pipe(uglify())
		.pipe(rename("flippy.min.js"))
		.pipe(sourcemap.write("maps"))
		.pipe(gulp.dest("dist/"));
});
gulp.task("test", ["js"], function(done){
  new Karma({
    configFile: __dirname + "/karma.conf.js",
    singleRun: true
  }, () => done()).start();
});

gulp.task("watch", function(){
  gulp.watch("flippy.js", ["js", "test"]);
});
gulp.task("default", ["watch", "js", "test"]);
