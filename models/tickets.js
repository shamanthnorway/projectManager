var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ticketSchema = new Schema({
    description: String,
    teamId: String,
    title: String,
    createBy: {
        userId: String,
        firstName: String,
        lastName: String
    },
    resolvedBy: {
        userId: String,
        firstName: String,
        lastName: String
    },
    status: String,
    checkedBy: {
        userId: String,
        firstName: String,
        lastName: String
    },
    serverity: String,
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
    }],
    closedOn: { 
        type : Date
    }
}, {
    timestamps: true
});

var Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;