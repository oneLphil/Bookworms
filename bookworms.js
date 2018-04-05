const express = require('express');
const community = require('./routes/community_routes.js').community;
const profile = require('./routes/profile_routes.js').profile;
const app = express();
app.use(express.static('public'));
app.use(profile);
app.use(community);

var port = process.env.PORT || 8000;

// MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb url';
/*
// clear all community data on database
MongoClient.connect(url).then((db) => {
    console.log('Connected to database');
    db.collection('COMMUNITIES').remove();
});*/

app.listen(port, () => console.log('Running on port ' + port));
