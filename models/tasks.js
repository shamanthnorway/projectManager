var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var taskSchema = new Schema({
    title: String,
    description: String,
    teamId: String,
    createdBy: {
        userId: String,
        firstName: String,
        lastName: String
    },
    status: String,
    users:[{
        userId: String,
        firstName: String,
        lastName: String
    }],
    updates:[{
        timestamps: { 
            type : Date, 
            default: Date.now 
        },
        updatedBy: {
            userId: String,
            firstName: String,
            lastName: String
        },
        updateDescription: String
    }]
}, {
    timestamps: true
});

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;