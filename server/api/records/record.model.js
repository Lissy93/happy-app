
const ResponseSaver = require("../../commons/response-saver");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let teamRecordSchema = new Schema({
  teamName:  String,
  data: [
    {
      date: Date,
      userResults: [{
        userHash: String,
        score: String,
        comment: String
      }]
    }
  ]
});

function checkInputIsValidJson(input) {
  return (/^[\],:{}\s]*$/.test(input.replace(/\\["\\\/bfnrtu]/g, '@').
  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
}

teamRecordSchema.statics.insertUserResponse = (userResponse) => {
  const rs = new ResponseSaver();
  return rs.insertUserResponse(userResponse);
};


const TeamRecordSchema = mongoose.model('TeamRecord', teamRecordSchema);

module.exports = TeamRecordSchema;
