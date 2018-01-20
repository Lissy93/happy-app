import Promise from "bluebird";

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

teamRecordSchema.statics.insertUserResponse = (userResponse) => {

  return new Promise((resolve, reject) => {

    // TODO check if valid json object

    // TODO check if userhash is part of a valid team

    // TODO check user has not already responded today

    // TODO update record with new response

    // TODO return appropriate message

    let teamUserResponse = {
      teamName:  "demo",
      data: [
        {
          date: new Date(),
          userResults: [ userResponse ]
        }
      ]
    };

    const _userResponse = new TeamRecordSchema(teamUserResponse);

    _userResponse.save((err, saved) => {
      err ? reject(err)
        : resolve(saved);
    });
  });
};


const TeamRecordSchema = mongoose.model('TeamRecord', teamRecordSchema);

module.exports = TeamRecordSchema;
