var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var teamSchema = new Schema({
    teamName: {
        type: String,
        required: true
    },
    createdBy: String,
    users: [String],
    tasks:[String],
    wikis:[String],
    tickets:[String]
}, {
    timestamps: true
});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;