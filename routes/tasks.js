var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Tasks = require('./../models/tasks');
var Teams = require('./../models/teams');
var Users = require('./../models/users');
var taskRouter = express.Router();
taskRouter.use(bodyParser.json());

const sampleTeam = mongoose.Types.ObjectId("59e26b9e7f0a59348cf67421");

var dummyTask = {
    description: 'task2 is for testing purpose',
    createdBy: mongoose.Types.ObjectId('59e26b707f0a59348cf67435'),
    status: 'Not Started',
    users:[mongoose.Types.ObjectId('59e26b707f0a59348cf67435'),mongoose.Types.ObjectId('59e26b707f0a59348cf67434')]
}

taskRouter.route('/')
.get(function (req, res, next) {
    Teams.findById(mongoose.Types.ObjectId(req.session.teamID), function(err, team){
        if(err) throw err;
        var taskIds = team.tasks;
        var count = 0;
        var size = taskIds.length;
        var taskResult = [];
        taskIds.forEach(function(id){
            Tasks.findById(id, function(err, task){
                if(err) throw err;
                count++;
                Users.findById(task.createdBy, function(err, creator){
                    if(err) throw err;
                    var userIds = task.users;
                    var count2 = 0;
                    var size2 = userIds.length;
                    var userResult = [];
                    var convertedJSON = JSON.parse(JSON.stringify(task));
                    // console.log('creator', creator);
                    convertedJSON.createdBy = creator;                    
                    taskResult.push(convertedJSON);
                    userIds.forEach(function(userid){
                        Users.findById(userid, function(err, user){
                            count2++;
                            if(err) throw err;
                            userResult.push(user);
                            if(count2 == size2) {
                                convertedJSON.users = userResult;
                                // console.log('convertedJSON', convertedJSON);
                            }
                            if(count2 == size2 && count == size) res.json(taskResult);
                        });
                    });
                });
            });
        });
    });
})

.post(function (req, res, next) {
    console.log(req.body);
    Tasks.create(req.body, function (err, task) {
        if (err) {
            throw err;
            // res.writeHead(400,{'Content-Type':'text/plain'});
            // res.end('Duplicate found');
        }
        else {
            console.log('Dish created!');
            var id = task._id;
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('Added the team with id: ' + id);
        }
    });
})

.delete(function (req, res, next) {
    Tasks.findByIdAndRemove(req.params.taskId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

// const sampleTask = mongoose.Types.ObjectId("59e26cad1f58691dc0b8592a");
//
taskRouter.route('/:taskId')
.get(function (req, res, next) {
    console.log(req.body);
    Tasks.findById(mongoose.Types.ObjectId(req.params.taskId), function (err, task) {
        if (err) throw err;
        var result = [];
        var finalJSON = JSON.parse(JSON.stringify(task));
        Users.findById(task.createdBy, function(err, creator){
            if(err) throw err;
            finalJSON.createdBy = {
                "_id":creator._id, 
                "username":creator.username, 
                "firstName":creator.firstName,
                "lastName":creator.lastName
            };
            var ids = task.users;
            var size = ids.length;
            var count = 0;
            ids.forEach(function(id){
                Users.findById(id, function(err, user){
                    if(err) throw err;
                    if(user)
                    result.push({
                        "_id":user._id, 
                        "username":user.username, 
                        "firstName":user.firstName,
                        "lastName":user.lastName
                    });
                    else {
                        result.push({"_id":id, "userNotFound":"userNotFound"});
                    }
                    count++;
                    if(count === size) {
                        finalJSON.users = result;
                        // console.log(finalJSON);
                        res.json(finalJSON);
                    }                    
                });
            });
        });
        // res.json(task);
    });
})
.put(function(req, res, next){
    // console.log(req.body);
    Tasks.findByIdAndUpdate(mongoose.Types.ObjectId(req.body._id), {$set:req.body} ,{new: true}, function (err, response) {
        if(err) throw err;
        res.json(response);
    });
})
.delete(function(req, res, next){
    // console.log(req.body);
    Tasks.findById(mongoose.Types.ObjectId(req.body._id)).remove(function (err, response) {
        if(err) throw err;
        res.json(response);
    });
});

taskRouter.route('/:taskId/addUser')
.put(function(req, res, next){
    Tasks.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id), 
        {$addToSet: {users: mongoose.Types.ObjectId(req.body.user)}}, 
        {new : true}, 
        function(err, resp){
        if(err) res.send(err);
        res.json(resp);
    });
});
taskRouter.route('/:taskId/deleteUser')
.put(function(req, res, next){
    Tasks.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id), 
        {$pullAll: {users: [mongoose.Types.ObjectId(req.body.user)]}}, 
        {new : true}, 
        function(err, resp){
        if(err) res.send(err);
        res.json(resp);
    });
});
module.exports = taskRouter;