var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var Teams = require('./../models/teams');
var Users = require('./../models/users');
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
                count++;
                if(err) throw err;
                if(team) {
                    teams.push(team);
                }
                if(count == size) sendResponse();
            });
        });
    });
    function sendResponse() {
        res.json(teams);
    }
})

.post(function (req, res, next) {
    Teams.create(req.body, function (err, team) {
        if (err) {
            res.writeHead(400,{'Content-Type':'text/plain'});
            res.end('Duplicate found');
        }
        else {
            console.log('Dish created!');
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

//
teamRouter.route('/:teamId')
.get(function (req, res, next) {
    if(!req.session.passport.user._id) {
        res.redirect('/');
    } else {
        Users.findById(mongoose.Types.ObjectId(req.session.passport.user._id), function(err, user){
            if(err) throw err;
            for(var i = 0; i < user.team.length; i++) {
                if(user.team[i] === req.params.teamId) {
                    Teams.findById(req.params.teamId, function (err, team) {
                        if (err) throw err;
                        if(!req.session.teamID) {
                            req.session.teamID = req.params.teamId;
                        }
                        res.json(team);
                    });
                }
            }
            res.end(`User is not associated with the team: ${req.params.teamId}`);
        })
        
    }    
})
module.exports = teamRouter;