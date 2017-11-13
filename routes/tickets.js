var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Tickets = require('./../models/tickets');
var Teams = require('./../models/teams');
var Users = require('./../models/users');
var ticketRouter = express.Router();
ticketRouter.use(bodyParser.json());

const sampleTeam = mongoose.Types.ObjectId("59e26b9e7f0a59348cf67421");
var dummyTicket = {
    description: 'This is a test. Check if there is an issue',
    createBy: mongoose.Types.ObjectId('59e26b707f0a59348cf6742d'),
    status: 'Open',
    serverity: 'high',
}

ticketRouter.route('/')
.get(function (req, res, next) {
    Teams.findById(sampleTeam, function(err, team){
        if (err) throw err;
        var ticketIds = team.tickets;
        var ticketCount = 0;
        var ticketSize = ticketIds.length;
        console.log(ticketIds);
        var resultTickets = [];
        ticketIds.forEach(function(ticketId){
            Tickets.findById(mongoose.Types.ObjectId(ticketId), function(err, ticket){
                if (err) throw err;
                ticketCount++;
                resultTickets.push(ticket);
                if(ticketCount == ticketSize) res.json({
                    "teamId": ticket.teamId,
                    "title": ticket.title,
                    "createBy": ticket.createBy,
                    "resolvedBy": ticket.resolvedBy,
                    "status": ticket.status,
                    "checkedBy": ticket.checkedBy,
                    "serverity": ticket.serverity
                });
            });
        });
    });
})

ticketRouter.route('/')
.post(function (req, res, next) {
    console.log(req.body);
    Tickets.create(req.body, function (err, ticket) {
        if (err) {
            // throw err;
            res.writeHead(400,{'Content-Type':'text/plain'});
            res.end('Duplicate found');
        }
        else {
            console.log('ticket created!');
            const id = ticket._id;
            Teams.findByIdAndUpdate(
                mongoose.Types.ObjectId(req.body.teamId), 
                {$push: {"tickets":id}}, 
                {new : true} , 
                function(err, resp){
                    res.json(resp);
                });
            // res.writeHead(200,{'Content-Type':'text/plain'});
            // res.end('Added the task with id: ' + id);
        }
    });
})

.delete(function (req, res, next) {
    Tickets.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

//
ticketRouter.route('/:ticketId')
.get(function (req, res, next) {
    Tickets.findById(mongoose.Types.ObjectId(req.params.ticketId), function(err, ticket){
        if (err) throw err;
        res.json(ticket);
    });
})
.put(function(req, res, next){
    var query = '{';
    query = query.concat(`"createBy":"${mongoose.Types.ObjectId(req.body.createBy)}"`);
    if(req.body.resolvedBy) query = query.concat(`, "resolvedBy":"${mongoose.Types.ObjectId(req.body.resolvedBy)}"`);
    if(req.body.status) {
        if(req.body.status === 'closed') query = query.concat(`, "closedOn":"${new Date()}"`);
        query = query.concat(`, "status":"${req.body.status}"`);
    }
    if(req.body.checkedBy) query = query.concat(`, "checkedBy":"${mongoose.Types.ObjectId(req.body.checkedBy)}"`);
    if(req.body.serverity) query = query.concat(`, "serverity":"${req.body.serverity}"`);
    // query = query.concat('}'); 
    if(req.body.updates) {
        query = query.concat(`, "$push":{"updates":{"updatedBy":"${mongoose.Types.ObjectId(req.body.updates.updatedBy)}", "updateDescription":"${req.body.updates.updateDescription}"}}`);
    }
    query = query.concat('}'); 
    // console.log(query);
    query = JSON.parse(query);
    Tickets.findByIdAndUpdate(
        req.params.ticketId, 
        query,
        {new: true, upsert: true},
        function(err, resp){
            if(err) throw err;
            res.json(resp);
    });
})
.delete(function(req, res, next){
    Tickets.findByIdAndRemove(req.params.ticketId, function(err, resp){
        if(err) throw err;
        Teams.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.body.teamId),
            {$pull: {"tickets": req.body._id}},
            {new: true},
            function(err, response2) {
                if(err) throw err;
                res.json(response2);
            }
        );
    });
});
module.exports = ticketRouter;