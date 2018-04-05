const express = require('express');
const community = express.Router();
const bodyParser = require("body-parser");
var ObjectId = require('mongodb').ObjectId; 

community.use(bodyParser.urlencoded({ extended: false }));
community.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb url';


community.route('/communities')
    // Get all communites
    .get(function(req, res) {
        MongoClient.connect(url).then((db) => {
            console.log('Getting all communities')
            console.log('Connected to database');
            db.collection('COMMUNITIES').find()
            .toArray().then((data) => {
                res.status(200);
                res.send(data);
            }).catch((error) => {
                res.status(500);
                res.send('Error');
                console.log(error);
            });
        }).catch((error) => {
            res.status(404);
            res.send('Cannot connect to database');
            console.log(error);
        });
    })
    // Add new community
    // request boday should be {name : <community name>, admin : <name>, description : <description>, time: <date/time of creation>}
    .post(function(req, res) {
        if ("name" in req.body && "admin" in req.body && "description" in req.body && "time" in req.body) {
            console.log('Adding a community:' + req.body.name)
            console.log(req.body)
            var data = {
                name : req.body.name,
                admin: req.body.admin,
                description: req.body.description,
                time: req.body.time,
                messages: []
            }
            MongoClient.connect(url).then((db) => {
                console.log('Connected to database');
                db.collection('COMMUNITIES').insertOne(data).then((db_res) => {
                    res.status(200);
                    res.send(db_res.ops[0]);
                }).catch((error) => {
                    res.status(500);
                    res.send('Error adding to database');
                    console.log(error);
                });
            })
        } else {
            res.status(500);
            res.send('Request body format incorrect')
        }
        
    })

// the community id should be in the url
community.route('/communities/:cid')
    // Get Specific Community Info
    .get(function(req, res) {
        console.log("Getting Community Info for: " + req.params.cid)
        MongoClient.connect(url).then((db) => {
            console.log('Connected to database');
            db.collection('COMMUNITIES').find({_id: ObjectId(req.params.cid)})
            .toArray().then((data) => {
                console.log(data)
                res.status(200);
                res.send(data);
            }).catch((error) => {
                res.status(500);
                res.send('Error');
                console.log(error);
            });
        }).catch((error) => {
            res.status(404);
            res.send('Cannot connect to database');
            console.log(error);
        });
    })
    // Post a new message
    // The request body should be {user: <name of poster>, message: <text>, time: <date/time of creation>}
    .post(function(req, res) {
        if ("user" in req.body && "message" in req.body && "time" in req.body) {
            console.log('Posting message: ' + req.body.message)
            MongoClient.connect(url).then((db) => {
                console.log('Connected to database');
                db.collection('COMMUNITIES').update({_id: ObjectId(req.params.cid)},
                    {   $push: {
                            messages: {
                                $each: [req.body]
                            }
                        }
                    }).then((dbres) => {
                    res.status(200);
                    res.send(dbres);
                }).catch((error) => {
                    res.status(500);
                    res.send('Error adding to database');
                    console.log(error);
                });
            })
        } else {
            res.status(500);
            res.send('Request body format incorrect')
        } 
    })
    // Delete a community
    // The request body should be {user: <admin name>} 
    .delete(function(req, res) {
        if ("user" in req.body) {
            MongoClient.connect(url).then((db) => {
                console.log('Connected to database');
                db.collection('COMMUNITIES').find({_id: ObjectId(req.params.cid)})
                .toArray().then((data) => {
                    console.log(data)
                    if (req.body.user == data.admin) {
                        db.collection('COMMUNITIES').remove({_id: ObjectId(req.params.cid)})
                        .then((db_res) => {
                            res.status(200);
                            res.status(500);
                        })
                    } else {
                        res.status(500);
                        res.send('This user does not have admin privileges')
                    }
                }).catch((error) => {
                    res.status(500);
                    res.send('Error');
                    console.log(error);
                });
            })
        } else {
            res.status(500);
            res.send('Request body format incorrect')
        }
    })


module.exports = {
    community: community
}