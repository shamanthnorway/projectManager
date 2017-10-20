var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var wikiSchema = new Schema({
    name: String,
    heading: String,
    descrption: String
}, {
    timestamps: true
});

var Wiki = mongoose.model('Wiki', wikiSchema);
module.exports = Wiki;