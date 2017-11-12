var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var Teams = require('./../models/teams');
var Users = require('./../models/users');
var Tasks = require('./../models/tasks');
var Tickets = require('./../models/tickets');
var Wikis = require('./../models/wikis');
var teamRouter = express.Router();
teamRouter.use(bodyParser.json());

var dummyTeam = {
    teamName: 'team1',
    createdBy: mongoose.Types.ObjectId('59e26b707f0a59348cf6742d')
}
const sampleUser = mongoose.Types.ObjectId("59e26b707f0a59348cf6742d");
teamRouter.route('/')
.get(function (req, res, next) {
    // console.log('cookie:', req.session.passport.user._id, req.sessionOptions);
    var teams = [];
    Users.findById(mongoose.Types.ObjectId(req.session.passport.user._id), function (err, user) {
        if (err) throw err;
        var ids = user.team;
        var size = ids.length;
        var count = 0;
        ids.forEach(function(id) {
            Teams.findById(id, function(err, team){
                console.log(count);
                count++;
                if(err) throw err;
                if(team) {
                    teams.push(team);
                }
                if(count == size) {
                    console.log(teams);
                    res.json(teams);
                }
            });
        });
    });
})

.post(function (req, res, next) {
    Teams.create(req.body, function (err, team) {
        if (err) {
            const response = {
                status:'failed',
                message: 'Error from MongoDB',
                errorMessage: err,
                user: ''
            }
            res.status(400).json(response);
        }
        else {
            // console.log('Dish created!');
            var id = team._id;
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('Added the team with id: ' + id);
        }
    });
})

.delete(function (req, res, next) {
    Teams.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

teamRouter.route('/:teamId/getTasks')
.get(function(req, res, next){
    Teams.findById(req.params.teamId, function (err, team) {
        // console.log(team);
        if (err) throw err;
        if(!req.session.teamID) {
            req.session.teamID = req.params.teamId;
        }
        Tasks.find({"_id":{$in: team.tasks}}, function(err, tasksList) {
            res.json(tasksList);
        });
    });
});

teamRouter.route('/:teamId/getTickets')
.get(function(req, res, next){
    Teams.findById(req.params.teamId, function (err, team) {
        // console.log(team);
        if (err) throw err;
        if(!req.session.teamID) {
            req.session.teamID = req.params.teamId;
        }
        Tickets.find({"_id":{$in: team.tickets}}, function(err, ticketsList){
            res.json(ticketsList);
        });
    });
});

teamRouter.route('/:teamId/getWikis')
.get(function(req, res, next){
    Teams.findById(req.params.teamId, function (err, team) {
        // console.log(team);
        if (err) throw err;
        if(!req.session.teamID) {
            req.session.teamID = req.params.teamId;
        }
        Wikis.find({"_id":{$in: team.wikis}}, function(err, wikisList){
            res.json(wikisList);
        });
    });
});

//
teamRouter.route('/:teamId')
.get(function (req, res, next) {
    Teams.findById(req.params.teamId, function (err, team) {
        if (err) throw err;
        if(!req.session.teamID) {
            req.session.teamID = req.params.teamId;
        }
        // console.log('testing: ',mongoose.Types.ObjectId("59e26b707f0a59348cf6742d"))
        var objUser = team.users.map(function(user){ 
            return mongoose.Types.ObjectId(user);
        });
        objUser.push(mongoose.Types.ObjectId(team.createdBy));

        // console.log(objUser);

        Users.find({"_id":{$in:objUser}}, function(err, usersList){
            Tasks.find({"_id":{$in: team.tasks}}, function(err, tasksList) {
                Tickets.find({"_id":{$in: team.tickets}}, function(err, ticketsList){
                    Wikis.find({"_id":{$in: team.wikis}}, function(err, wikisList){
                        var finalJSON = JSON.parse(JSON.stringify(team));
                        if(usersList) {                            
                            finalJSON["users"] = [];
                            usersList.forEach(function(user){
                                if(user._id == team.createdBy) {
                                    finalJSON["createdBy"] = user;
                                } 
                                finalJSON["users"].push(user);
                                
                            });
                        }
                        if(tasksList) {
                            finalJSON["tasks"] = tasksList;
                        }
                        if(ticketsList) {
                            finalJSON["tickets"] = ticketsList;
                        }
                        if(wikisList) {
                            finalJSON["wikis"] = wikisList;
                        }
                        // console.log(finalJSON);
                        res.json(finalJSON);
                    });
                });
            });
        });

        
    });


    // if(!req.session.passport.user._id) {
    //     res.redirect('/');
    // } else {
    //     Users.findById(mongoose.Types.ObjectId(req.session.passport.user._id), function(err, user){
    //         if(err) throw err;
    //         for(var i = 0; i < user.team.length; i++) {
    //             if(user.team[i] === req.params.teamId) {
    //                 Teams.findById(req.params.teamId, function (err, team) {
    //                     if (err) throw err;
    //                     if(!req.session.teamID) {
    //                         req.session.teamID = req.params.teamId;
    //                     }
    //                     res.json(team);
    //                 });
    //             }
    //         }
    //         res.end(`User is not associated with the team: ${req.params.teamId}`);
    //     })
        
    // }    
})
module.exports = teamRouter;