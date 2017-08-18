import gulp from "gulp";

const populateDemoDb = require('./populate-demo-db');
const deleteDemoDb   = require('./delete-demo-db');


gulp.task('populate-sample-data', () => {
  populateDemoDb();
});

gulp.task('delete-database', () => {
  deleteDemoDb(()=>{});
});
