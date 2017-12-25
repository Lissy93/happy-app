const schedule = require('node-schedule');

const adminConfig = require('./config/happy-app-admin-config');

schedule.scheduleJob(adminConfig.emailCronTime, function(){
  console.log('The answer to life, the universe, and everything!');
});
