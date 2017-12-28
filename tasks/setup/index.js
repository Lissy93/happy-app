import gulp from "gulp";

const populateDemoDb = require('./populate-demo-db');
const deleteDemoDb   = require('./delete-demo-db');
const populateDemoTeamMembers   = require('./populate-demo-team-members');


gulp.task('populate-sample-data', () => {
  populateDemoDb();
});

gulp.task('delete-database', () => {
  deleteDemoDb(()=>{});
});

gulp.task('populate-demo-team-members', () => {
  populateDemoTeamMembers(()=>{});
});
