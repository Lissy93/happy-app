import gulp from "gulp";

const populateDemoDb = require('./populate-demo-db');

gulp.task('populate-sample-data', () => {
  populateDemoDb();
});
