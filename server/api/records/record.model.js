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

const TeamRecordSchema = mongoose.model('TeamRecord', teamRecordSchema);
module.exports = TeamRecordSchema;
