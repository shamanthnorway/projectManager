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

userRouter.get('/login', function(req, res){
    res.end(`login failed`);
});

userRouter.post('/signup', function(req, res){
    req.body.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(8));
    Users.create(req.body, function (err, user) {
        if (err) throw err;
        console.log('user created!');
        var id = user._id;
		res.writeHead(200,{'Content-Type':'text/plain'});
        res.end('New User create with id: ' + id + '\nClick here to login http://localhost:3000/users/local-login');
    });
});

userRouter.post(
    '/login', 
    passport.authenticate('local', { failureRedirect: '/login' }), 
    function(req, res){
        // console.log(req.session, req.sessionOptions);
        if(!req.session.userID) {
            req.session.userID = req.body._id;   
        }
        req.sessionOptions.maxAge = 1000*60*10;
        var session = JSON.stringify(req.session).concat(JSON.stringify(req.sessionOptions));
        res.end(`cookie is set to ${session}`);
});
//
userRouter.route('/:userId')
.get(function (req, res, next) {
    Users.findById(mongoose.Types.ObjectId(req.params.userId), function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});
module.exports = userRouter;