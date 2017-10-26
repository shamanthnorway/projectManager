var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bcrypt=require('bcrypt');
var mongoose = require('mongoose');
var Users = require('./../models/users');

// const user = {
//   "_id":mongoose.Types.ObjectId('59e26b707f0a59348cf6742d'),
//   "username":"user1",
//   "password":"password"
// }

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    // console.log('Inside passport function', username, passport);
    Users.findOne({"username":username}, function(err, user){
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if(!bcrypt.compareSync(password,user.password)) {
        console.log("User authentication failed!");
        console.log(password+"User authentication failed!"+user.password+" status: "+bcrypt.compareSync(password,user.password));
        return cb(null, false);
      };
      return cb(null, user);
    });
}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(id, cb) {
  // console.log('Inside deserializeUser',id);
  Users.findById(id._id, function(err, user){
    if(err) {
      return cb(err);
    }
    cb(null, user);
  });
});

module.exports=passport;