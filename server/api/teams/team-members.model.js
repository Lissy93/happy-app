const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let teamMembersSchema = new Schema({
  teamName:  String,
  members: [
    {
      name: String,
      email: String
    }
  ]
});

const TeamMembersSchema = mongoose.model('TeamMembers', teamMembersSchema);
module.exports = TeamMembersSchema;
