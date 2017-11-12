var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Wikis = require('./../models/wikis');
var Teams = require('./../models/teams');
var wikiRouter = express.Router();
wikiRouter.use(bodyParser.json());
const sampleTeam = mongoose.Types.ObjectId("59e26b9e7f0a59348cf67421");
var dummyWiki = {    
    name: 'The first wiki',
    heading: 'The First',
    descrption: 'This is the first wiki being created for testing purpose.'
}

wikiRouter.route('/')
.get(function (req, res, next) {
    Teams.findById(sampleTeam, function(err, team){
        if (err) throw err;
        var wikiIds = team.wikis;
        var count = 0;
        var size = wikiIds.length;
        var wikiResult = [];
        wikiIds.forEach(function(id){
            Wikis.findById(id, function (err, wiki) {
                count++;
                if (err) throw err;
                wikiResult.push(wiki);
                if(count == size) res.json(wikiResult);
            });
        });
    });
    
})

.post(function (req, res, next) {
    Wikis.create(req.body, function (err, wiki) {
        if (err) {
            res.writeHead(400,{'Content-Type':'text/plain'});
            res.end('Duplicate found');
        }
        else {
            console.log('Dish created!');
            var id = wiki._id;
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('Added the ticket with id: ' + id);
        }
    });
})

.delete(function (req, res, next) {
    Wikis.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

//
wikiRouter.route('/:wikiId')
.get(function (req, res, next) {
    Wikis.findById(req.params.wikiId, function (err, wiki) {
        if (err) throw err;
        res.json(wiki);
    });
})
.put(function (req, res, next) {
    Wikis.findByIdAndUpdate(
        req.params.wikiId, 
        {
            "name":req.body.name, 
            "heading":req.body.heading, 
            "description":req.body.description
        },
        {new : true}, 
        function (err, wiki) {
            if (err) throw err;
            res.json(wiki);
    });
})
.delete(function (req, res, next) {
    Wikis.findByIdAndRemove(req.params.wikiId, {new : true}, function (err, wiki) {
        if (err) throw err;
        res.json(wiki);
    });
});
module.exports = wikiRouter;