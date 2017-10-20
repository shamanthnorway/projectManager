var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var taskSchema = new Schema({
    description: String,
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    status: String,
    users:[{
        type: ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;