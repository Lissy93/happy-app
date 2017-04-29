import gulp from "gulp";
import cssmin from "gulp-clean-css";
import {join} from "path";
import {base, tasks} from "./const";


  import sass from "gulp-sass";


const CSS = base.DIST + "**/*.css";


const SASS = [
  base.DEV + "**/*.{sass,scss}",
  "!" + base.DEV + "bower_components/**/*.{sass,scss}",
  "!node_modules/**/*.{sass,scss}",
];



gulp.task(tasks.CLIENT_COMPILE_TO_CSS, () => {
  
  
  return gulp.src(SASS)
             .pipe(sass())
             .on("error", sass.logError)
             .pipe(gulp.dest(base.DEV));
  
});


gulp.task(tasks.CLIENT_BUILD_CSS_DIST, () => {
  return gulp.src(CSS, {base: base.DIST})
             .pipe(cssmin())
             .pipe(gulp.dest(base.DIST));
});