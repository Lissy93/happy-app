
// Import the Mongo config, then connect (by calling init())
import DBConfig from '../../server/config/db.conf';
const TeamRecordModel = require('../../server/api/records/record.model');
DBConfig.init();


// The schema for TeamRecord, that data is formated to, before insert
const TeamMembersSchema = require('../../server/api/teams/team-members.model');


/**
 * Main starting script.
 * One optional param, the path of pre-generated sample data
 * e.g: const sampleDataLocation = 'tasks/setup/sample-data.json';
 * If not specified, new sample data will be generate, with random values
 * @param sampleDataLocation
 */
function executeInsertScript(sampleDataLocation = undefined){

  sampleDataLocation = undefined; //todo investigate, then delete

  // If sample data specified, then read it, and insert into db
  if(sampleDataLocation){
    const fs = require('fs');
    fs.readFile(sampleDataLocation, function read(err, data) {
      if (err) throw err;
      insertJsonData(JSON.parse(data));
    });
  }

  // If no data, then call generate new sample data, then insert into db
  else{

    // Fetch current team names
    let teamNames = [];
    TeamRecordModel.find({}, function(err, teams) {
      teams.forEach((team)=> teamNames.push(team.teamName));

      // If no team names were returned, then undefined will cause us to use defaults
      if(err || teamNames.length < 1) teamNames = undefined;

      // Generate the rest of the sample responses
      const randomSampleData = generateSomeRandomSampleData(teamNames);

      // And finally, insert into the db
      insertJsonData(randomSampleData);

    });
  }

}


/**
 * Adds each record from sample data into MongoDB
 * When all data is inserted (or promise resolved),
 * the connection is closed, by calling cleanUp()
 * @param jsonData
 */
function insertJsonData (jsonData) {

  // Set of a promise for each team record
  let promises = jsonData.map(function(teamData) {
    return new Promise(function(resolve) {
      let teamObject = new TeamMembersSchema(teamData);
      teamObject.save((err)=> {
        if (err) throw err;
        console.log(`Team (${teamData.teamName}, with ${teamData.members.length} members) saved successfully`);
        resolve();
      });
    });
  });

  // When all promises have resolved
  Promise.all(promises)
    .then(cleanUp)
    .catch(console.error);
}


/**
 * Closes Mongo connection, and prints out a little message message.
 * Called when all data insert operations are done
 */
function cleanUp(){
  console.log('\nDone. Closing Mongo connection...');
  DBConfig.closeConnection();
  console.log('... disconnected.');
}



/**
 * Generates a set of random sample data
 */
function generateSomeRandomSampleData(teamNames = undefined){

  // Set the team names (if they weren't passed as a parameter)
  if (!teamNames){
    teamNames = ['atlanta', 'brisbane', 'budapest', 'chicago', 'delhi',
      'detroit', 'istanbul', 'lisbon', 'london', 'mexico', 'mumbai', 'paris',
      'rio', 'rome', 'san-francisco', 'tokyo', 'vancouver', 'vienna'];
  }

  // Define some ranges
  const numTeams = {min: 4,  max: 6 };  // The number of teams to generate
  const numUsers = {min: 6,  max: 30};  // The number of user responses per day

  // Takes {min: x, max: y} object and returns int within range
  function getNumInRange(range){
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  // Returns a certain number (num) or elements from a given array (arr)
  function getRandomSnippetFromArr(arr, num){
    return shuffle(arr).splice(0, num);
  }

  // Returns a random element from given array
  function getRandomElemFromArr(arr){
    return shuffle(arr)[0];
  }

  // Shuffles a given array
  function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  let results = []; // This will store the final generated data, to return

  const actualTeamNames  = getRandomSnippetFromArr(teamNames, getNumInRange(numTeams));
  actualTeamNames.forEach((teamName)=>{
    let userListArr = [];
    for(let userNum = 0; userNum < getNumInRange(numUsers); userNum++ ){
      userListArr.push({name: "Bob", email: "email123@mail.com"});
    }
    results.push({teamName: teamName, members: userListArr});
  });

  return results;
}

module.exports = executeInsertScript;
