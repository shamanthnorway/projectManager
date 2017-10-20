var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ticketSchema = new Schema({
    description: String,
    createBy: {
        type: ObjectId,
        ref: 'User'
    },
    resolvedBy: {
        type: ObjectId,
        ref: 'User'
    },
    status: String,
    checkedBy: {
        type: ObjectId,
        ref: 'User'
    },
    serverity: String,
    updates:[{
        timestamps: { 
            type : Date, 
            default: Date.now 
        },
        updatedBy: {
            type: ObjectId,
            ref: 'User'
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