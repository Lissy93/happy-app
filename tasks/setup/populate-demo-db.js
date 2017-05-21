
const fs = require('fs');

import DBConfig from "../../server/config/db.conf";
DBConfig.init();

const TeamRecordSchema = require('../../server/api/records/record.model');

const defaultSampleDataLocation = 'tasks/setup/sample-data.json';

function executeInsertScript(sampleDataLocation = defaultSampleDataLocation){

  // Read the sample JSON file
  fs.readFile(sampleDataLocation, function read(err, data) {
    if (err) throw err;
    insertJsonData(JSON.parse(data));
  });

}

// Add each record from sample file into MongoDB
function insertJsonData (jsonData) {

  // Set of a promise for each record
  let promises = jsonData.map(function(teamData) {
    return new Promise(function(resolve) {
      let teamObject = new TeamRecordSchema(teamData);
      teamObject.save((err)=> {
        if (err) throw err;
        console.log(`Team (${teamData.teamName}) saved successfully`);
        resolve();
      });
    });
  });

  // When all promises have resolved
  Promise.all(promises)
    .then(cleanUp)
    .catch(console.error);

}

// Closes Mongo connection, and prints message. Called when all done
function cleanUp(){
  console.log('\nDone. Closing Mongo connection...');
  DBConfig.closeConnection();
  console.log('... disconnected.');
}


module.exports = executeInsertScript;
