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


teamMembersSchema.statics.addNewTeamMember = (todo) => {
  return new Promise((resolve, reject) => {
    if (!_.isObject(todo)) {
      return reject(new TypeError("Todo is not a valid object."));
    }

    let _todo = new TeamMembersSchema(todo);

    _todo.save((err, saved) => {
      err ? reject(err)
        : resolve(saved);
    });
  });
};

const TeamMembersSchema = mongoose.model('TeamMembers', teamMembersSchema);
module.exports = TeamMembersSchema;
