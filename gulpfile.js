// imports
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const tsb = require("gulp-tsb");
const del = require("del");

const project = {
    src: () => gulp.src(project.globs),
    dest: () => gulp.dest("dist"),
    globs: ["src/**/*.ts"],
    compile: tsb.create("tsconfig.json")
};

gulp.task("clean", () => del("dist"));

gulp.task("build", () => project.src()
    .pipe(sourcemaps.init())
    .pipe(project.compile())
    .pipe(sourcemaps.write(".", { includeContent: false, destPath: "dist" }))
    .pipe(project.dest()));

gulp.task("watch", ["build"], () => gulp.watch(project.globs, ["build"]));

gulp.task("default", ["build"]);