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
.post(function (req, res, next) {
    console.log(req.body);
    Tasks.create(req.body, function (err, task) {
        if (err) {
            // throw err;
            res.writeHead(400,{'Content-Type':'text/plain'});
            res.end('Duplicate found');
        }
        else {
            console.log('Task created!');
            var id = task._id;
            Teams.findByIdAndUpdate(
                mongoose.Types.ObjectId(req.body.teamId), 
                {$push: {"tasks":id}}, 
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
        res.json(task);
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
        Teams.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.body.teamId),
            {$pull: {"tasks": req.body._id}},
            {new: true},
            function(err, response2) {
                if(err) throw err;
                res.json(response2);
            }
        );        
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