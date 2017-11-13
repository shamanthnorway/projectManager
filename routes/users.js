var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var passport = require('./../authenticate/init');
var bcrypt=require('bcrypt');

var Users = require('./../models/users');
var Teams = require('./../models/teams');
var userRouter = express.Router();
userRouter.use(bodyParser.json());

dummyUser = {
    "username": "user11",
    "password": "password",
    "firstName":"user1_fn",
    "lastName": "user1_ln",
    "emailAddress": "user1@gmail.com",
    "team": []
}

sampleUser = mongoose.Types.ObjectId('59e26b707f0a59348cf6742d');

userRouter.route('/')
.get(function (req, res, next) {
    console.log(req.session, req.sessionOptions);
    Users.findById(sampleUser, function (err, user) {
        if (err) throw err;
        var ids = user.team;
        var size = ids.length;
        var count = 0;
        var teams = [];
        var finalJSON = JSON.parse(JSON.stringify(user));
        ids.forEach(function(id){
            Teams.findById(id, function(err, team){
                count++;
                if(err) throw err;
                teams.push({"_id":team._id, "name":team.teamName});
                if(count == size) {
                    finalJSON.team = teams;
                    res.json(finalJSON);
                }
            });
        });
    });
})

.post(function (req, res, next) {
    Users.create(req.body, function (err, user) {
        if (err) {
            res.writeHead(400,{'Content-Type':'text/plain'});
            res.end('Duplicate found');
        }
        else {
            console.log('Dish created!');
            var id = user._id;
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('Added the team with id: ' + id);
        }
    });
})

.delete(function (req, res, next) {
    Users.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
// Temporary
userRouter.route('/:userId/getUserProfile')
.get(function (req, res, next) {
    Users.findById(mongoose.Types.ObjectId(req.params.userId), function (err, user) {
        if (err) throw err;
        // console.log(user);
        var finalJSON = JSON.parse(JSON.stringify(user));
        if(user) {
            res.json({
                'firstName': finalJSON.firstName,
                'lastName': finalJSON.lastName,
                'emailAddress': finalJSON.emailAddress
            });
        }
        else res.json(user);
    });
});

userRouter.route('/:userId')
.get(function (req, res, next) {
    Users.findById(mongoose.Types.ObjectId(req.params.userId), function (err, user) {
        if (err) throw err;
        var finalJSON = JSON.parse(JSON.stringify(user));
        finalJSON.passport = '';
        res.json(finalJSON);
    });
});
module.exports = userRouter;