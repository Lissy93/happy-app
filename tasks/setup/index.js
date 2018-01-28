import gulp from "gulp";

/* Include gulp scripts, which do stuff */
const populateDemoDb = require('./populate-demo-db');
const deleteDemoDb   = require('./delete-demo-db');
const populateDemoTeamMembers   = require('./populate-demo-team-members');

/**
 * Deletes current DB
 * USE WITH CAUTION (obvs!)
 */
gulp.task('delete-database', () => {
  deleteDemoDb(()=>{});
});

/**
 * Populates random team data from scratch
 */
gulp.task('populate-sample-data', () => {
  populateDemoDb();
});

/**
 * Populates a random team config file
 * optionally BASED on the random sample data already populated
 */
gulp.task('populate-demo-team-members', () => {
  populateDemoTeamMembers(()=>{});
});
