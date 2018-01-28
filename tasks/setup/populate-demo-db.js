
// Import the Mongo config, then connect (by calling init())
import DBConfig from '../../server/config/db.conf';
DBConfig.init();


// The schema for TeamRecord, that data is formated to, before insert
const TeamRecordSchema = require('../../server/api/records/record.model');

// Includes common helper functions
import Helpers from '../../server/commons/helpers';


/**
 * Main starting script.
 * One optional param, the path of pre-generated sample data
 * e.g: const sampleDataLocation = 'tasks/setup/sample-data.json';
 * If not specified, new sample data will be generate, with random values
 * @param sampleDataLocation
 */
function executeInsertScript(sampleDataLocation = undefined){

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
    const randomSampleData = generateSomeRandomSampleData();
    insertJsonData(randomSampleData);
  }
}


/**
 * Adds each record from sample data into MongoDB
 * When all data is inserted (or promise resolved),
 * the connection is closed, by calling cleanUp()
 * @param jsonData
 */
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
function generateSomeRandomSampleData(){

  // Define some random string data
  const moods = ['good', 'good', 'good', 'average', 'bad', 'bad'];
  const teamNames = ['atlanta', 'brisbane', 'budapest', 'chicago', 'delhi',
    'detroit', 'istanbul', 'lisbon', 'london', 'mexico', 'mumbai', 'paris',
    'rio', 'rome', 'san-francisco', 'tokyo', 'vancouver', 'vienna'];
  let positiveComments = ['productive day', 'great progress', '+1',
    'new review process working well', 'team lunch was fun!', 'no blockers',
    'the new UI visuals came through sooner than expected, and look good',
    'no meetings!', 'all MR\'s were closed', 'good feedback from client meeting'];
  let negativeComments = ['slow progress', 'too many open dup bugs', 'server down',
    'blocked by other team', 'a lot of UI rework', 'office too hot!', 'CI broken, again',
    'acceptance criteria still to vague', 'unrealistic story estimates', 'not so good'];

  // Format and pad out the positive and negative comments
  const blanks = Array.apply(null, new Array(300)).map(String.prototype.valueOf,'');
  positiveComments = shuffle(positiveComments.concat(blanks));
  negativeComments = shuffle(negativeComments.concat(blanks));

  // Define some ranges
  const numTeams = {min: 4,  max: 6 };  // The number of teams to generate
  const numDates = {min: 45, max: 90};  // The number of days to make data for
  const numUsers = {min: 6,  max: 30};  // The number of user responses per day
  const numMoods = {min: 1,  max: 10};  // Used to make moods less random

  // Takes {min: x, max: y} object and returns int within range
  function getNumInRange(range){
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  // Returns a certain number (num) or elements from a given array (arr)
  function getRandomSnippetFromArr(arr, num){
    return shuffle(arr).splice(0, num);
  }

  // Returns a unique string for given user
  function makeFakeUserHash(userNum = 0){
    return `USR${(parseInt(userNum+10, 16)*1234).toString()}`;
  }

  // Returns a random element from given array
  function getRandomElemFromArr(arr){
    return shuffle(arr)[0];
  }

  // Returns an array of moods, that is less random than 1 in 3
  function makeLessRandomMoods(){
    let todaysMoods = [];
    moods.forEach((mood)=>{
      let newMs = Array.apply(null, new Array(getNumInRange(numMoods))).map(String.prototype.valueOf, mood);
      newMs.forEach((m)=> todaysMoods.push(m));
    });
    return todaysMoods;
  }

  /* Shuffles a given array */
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
    let dataArr = [];
    for(let dayNum = 0; dayNum < getNumInRange(numDates); dayNum++ ){
      let date = new Date();
      date.setDate(date.getDate()-dayNum);
      date = Helpers.roundDate(date);

      let todaysMoods = makeLessRandomMoods();
      let userResults = [];
      for(let userNum = 0; userNum < getNumInRange(numUsers); userNum++ ){
        let userHash = makeFakeUserHash(userNum);
        let mood = getRandomElemFromArr(todaysMoods);
        let comment = '';
        if(mood === 'good'){ comment = getRandomElemFromArr(positiveComments); }
        else if(mood === 'bad'){ comment = getRandomElemFromArr(negativeComments); }
        userResults.push({userHash: userHash, score: mood, comment: comment})
      }
      dataArr.push({date: date, userResults: userResults});
    }
    results.push({teamName: teamName, data: dataArr});
  });

  return results;
}

module.exports = executeInsertScript;
