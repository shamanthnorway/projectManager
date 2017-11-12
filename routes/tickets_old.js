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
                var finalTickets = JSON.parse(JSON.stringify(ticket));
                var users = [ticket.createBy, ticket.resolvedBy, ticket.checkedBy];
                Users.find({"_id":{$in: users}}, function(err, res_users){                    
                    for(var i = 0; i < res_users.length; i++) {
                        if(res_users[i]._id.toString() === ticket.createBy.toString()) {
                            finalTickets.createBy = res_users[i];
                        }
                        else if(res_users[i]._id._id.toString() == ticket.checkedBy._id.toString()) {
                            finalTickets.checkedBy = res_users[i];
                        }
                        else if(res_users[i]._id._id.toString() == ticket.resolvedBy._id.toString()) {
                            finalTickets.resolvedBy = res_users[i];
                        }
                    }
                    resultTickets.push(finalTickets);
                    if(ticketCount == ticketSize) res.json(resultTickets);
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
        var resultTickets = JSON.parse(JSON.stringify(ticket));
        var users = [ticket.createBy, ticket.resolvedBy, ticket.checkedBy];
        var updates = {};
        
        ticket.updates.forEach(function(update){
            users.push(update.updatedBy);
            updates[update.updatedBy] = update;
        });
        Users.find({"_id":{$in: users}}, function(err, res_users){
            for(var i = 0; i < res_users.length; i++) {
                if(res_users[i]._id.toString() === ticket.createBy.toString()) {
                    resultTickets.createBy = res_users[i];
                }
                if(ticket.checkedBy && res_users[i]._id.toString() === ticket.checkedBy.toString()) {
                    resultTickets.checkedBy = res_users[i];
                }
                if(ticket.resolvedBy && res_users[i]._id.toString() === ticket.resolvedBy.toString()) {
                    resultTickets.resolvedBy = res_users[i];
                }
                if(updates[res_users[i]._id.toString()]) {                    
                    updates[res_users[i]._id].updatedBy = res_users[i];
                }
            }
            resultTickets.updates = updates;
            res.json(resultTickets);
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
            if(err) throw err;
            res.json(resp);
    });
})
.delete(function(req, res, next){
    Tickets.findByIdAndRemove(req.params.ticketId, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});
module.exports = ticketRouter;