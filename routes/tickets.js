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
            console.log('ticketId', ticketIds);
            Tickets.findById(ticketId, function(err, ticket){
                console.log('ticket', ticket);
                if (err) throw err;
                ticketCount++;
                Users.findById(ticket.createBy, function(err, creator){
                    if (err) throw err;                    
                    Users.findById(ticket.checkedBy, function(err, checker){
                        if (err) throw err;
                        Users.findById(ticket.resolvedBy, function(err, resolver){
                            if (err) throw err;
                            var convertedJSON = JSON.parse(JSON.stringify(ticket));
                            if(creator)
                            convertedJSON.createBy = creator;
                            convertedJSON.checkedBy = checker;
                            convertedJSON.resolvedBy = resolver;
                            console.log('convertedJSON', convertedJSON);
                            resultTickets.push(convertedJSON);
                            if(ticketCount == ticketSize) res.json(resultTickets);
                        });
                    });
                });
            });
        });
    });
})

.post(function (req, res, next) {
    Tickets.create(req.body, function (err, ticket) {
        if (err) {
            res.writeHead(400,{'Content-Type':'text/plain'});
            res.end('Duplicate found');
        }
        else {
            console.log('Dish created!');
            var id = ticket._id;
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('Added the ticket with id: ' + id);
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
        // console.log('ticket', ticket);
        var resultTickets = [];
        Users.findById(ticket.createBy, function(err, creator){
            if (err) throw err;                    
            Users.findById(ticket.checkedBy, function(err, checker){
                if (err) throw err;
                Users.findById(ticket.resolvedBy, function(err, resolver){
                    if (err) throw err;
                    var finalJSON = JSON.parse(JSON.stringify(ticket));
                    if(creator)
                    if(creator)
                    finalJSON.createBy = {
                        "_id":creator._id, 
                        "username": creator.username, 
                        "firstName": creator.firstName,
                        "lastName": creator.lastName
                    };
                    if(checker)
                    finalJSON.checkedBy = {
                        "_id":checker._id, 
                        "username": checker.username, 
                        "firstName": checker.firstName,
                        "lastName": checker.lastName
                    };
                    if(resolver)
                    finalJSON.resolvedBy = {
                        "_id":checker._id, 
                        "username": resolver.username, 
                        "firstName": resolver.firstName,
                        "lastName": resolver.lastName
                    };
                    console.log('finalJSON', finalJSON);
                    resultTickets.push(finalJSON);
                    res.json(resultTickets);
                });
            });
        });
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
            // console.log(query);
            if(err) throw err;
            res.json(resp);
    });
    // {"createBy":59e26b707f0a59348cf6742d, "status":"in progress"}
    // console.log(query);
    // res.end(`query: ${query}`);
})
.delete(function(req, res, next){
    Tickets.findByIdAndRemove(req.params.ticketId, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});
module.exports = ticketRouter;