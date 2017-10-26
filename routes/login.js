var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Users = require('./../models/users');
var Teams = require('./../models/teams');
var cookieSession = require('cookie-session');
var passport = require('./../authenticate/init');
var bcrypt=require('bcrypt');
var loginRouter = express.Router();
loginRouter.use(bodyParser.json());

const sampleUser = {
	"username" : "user13",
    "password" : "user13",
    "firstName" : "user13_fn",
    "lastName" : "user13_ln",
    "emailAddress" : "user14@gmail.com",
    "team" : ["59e26b9e7f0a59348cf67421" ]
};
loginRouter.get('/',function(req, res){
    res.render('./../views/login');
});

loginRouter.get('/:userID', function(req, res){
    var teams = [];
    Users.findById(mongoose.Types.ObjectId(req.params.userID), function (err, user) {
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
                if(count == size) {
                    res.json(teams);}
            });
        });
    });
    function sendResponse() {
        res.json(teams);
    }
});

loginRouter.post('/signup', function(req, res){
    req.body.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(8));
    Users.create(req.body, function (err, user) {
        if (err) {
            const response = {
                status:'failed',
                message: 'Error from MongoDB',
                errorMessage: err,
                user: ''
            }
            res.status(400).json(response);
        } else {            
            // console.log('user created!');
            const response = {
                status:'success',
                message: 'User was successfully created',
                errorMessage: '',
                user: user
            }
            // res.writeHead(200,{'Content-Type':'text/plain'});
            res.status(202).json(response);
        }
        // res.end('New User create with id: ' + id + '\nClick here to login http://localhost:3000/users/local-login');
    });
});

loginRouter.post('/loginFailed', function(req, res){
    res.status(302).send('login failed');
});

loginRouter.post(
    '/login', 
    passport.authenticate('local', { failureRedirect: '/loginFailed' }), 
    function(req, res){
        // console.log(req.user);
        // console.log(req.session, req.sessionOptions);
        if(!req.session.userID) {
            req.session.userID = req.body._id;   
        }
        req.sessionOptions.maxAge = 1000*60*10;
        var session = JSON.stringify(req.session).concat(JSON.stringify(req.sessionOptions));
        // res.end(`cookie is set to ${session}`);
        const response = {
            status:'success',
            message: 'User was successfully authenticated',
            errorMessage: '',
            user: req.user
        }
        // res.writeHead(200,{'Content-Type':'text/plain'});
        res.status(202).json(response);
});
module.exports = loginRouter;