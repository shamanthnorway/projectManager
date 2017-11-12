var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var wikiSchema = new Schema({    
    title: String,
    teamId: String,
    createdBy: {
        userId: String,
        firstName: String,
        lastName: String
    },
    body: String
}, {
    timestamps: true
});

var Wiki = mongoose.model('Wiki', wikiSchema);
module.exports = Wiki;