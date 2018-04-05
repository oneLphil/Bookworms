var express = require('express');
var body_parser = require('body-parser');
var sha256 = require('sha256');
var cookie_parser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb url';
var profile = express.Router();

profile.use(express.static('public'));
profile.use(body_parser.urlencoded({extended: true}));
profile.use(body_parser.json());
profile.use(cookie_parser());

// Stores session info
var sessions = {};

function generate_cookie(username) {
    let cookie = Date.now().toString();
    return sha256(cookie);
}

// Gets user info
profile.get('/users/:username', function(req, res) {
    MongoClient.connect(url).then((db) => {
        console.log('Connected to database');
        db.collection('USERS').find(
            {_id : req.params.username.toLowerCase()},
            {_id : 0, email : 0, password : 0}
        ).toArray().then((data) => {
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
});

// Route for books that have been read by the user
profile.route('/users/:username/books-read/:books')
    // Adds book(s) to the list
    .put(function(req, res) {
        let books = req.params.books.split(',');
        MongoClient.connect(url).then((db) => {
            console.log('Connected to database');
            db.collection('USERS').findAndModify(
                {_id : req.params.username.toLowerCase()}, [],
                {$addToSet : {books_read: {$each: books}}},
                {new : true}
            ).then((data) => {
                res.status(200).send(data.value.books_read);
                console.log(data);
            }).catch((error) => {
                res.status(500).send('Error');
                console.log(error);
            });
        }).catch((error) => {
            res.status(404);
            res.send('Cannot connect to database');
            console.log(error);
        });
    })
    // Deletes book(s) from the list
    .delete(function(req, res) {
        let books = req.params.books.split(',');
        MongoClient.connect(url).then((db) => {
            console.log('Connected to database');
            db.collection('USERS').findAndModify(
                {_id : req.params.username.toLowerCase()}, [],
                {$pullAll : {books_read: books}},
                {new : true}
            ).then((data) => {
                res.status(200).send(data.value.books_read);
                console.log(data);
            }).catch((error) => {
                res.status(500).send('Error');
                console.log(error);
            });
        }).catch((error) => {
            res.status(404);
            res.send('Cannot connect to database');
            console.log(error);
        });
    });

// Route for books that the user want to read
profile.route('/users/:username/books-to-read/:books')
    // Adds book(s) to the list
    .put(function(req, res) {
        let books = req.params.books.split(',');
        MongoClient.connect(url).then((db) => {
            console.log('Connected to database');
            db.collection('USERS').findAndModify(
                {_id : req.params.username.toLowerCase()}, [],
                {$addToSet : {books_to_read: {$each: books}}},
                {new : true}
            ).then((data) => {
                res.status(200).send(data.value.books_to_read);
                console.log(data);
            }).catch((error) => {
                res.status(500).send('Error');
                console.log(error);
            });
        }).catch((error) => {
            res.status(404);
            res.send('Cannot connect to database');
            console.log(error);
        });
    })
    // Remove book(s) from the list
    .delete(function(req, res) {
        let books = req.params.books.split(',');
        MongoClient.connect(url).then((db) => {
            console.log('Connected to database');
            db.collection('USERS').findAndModify(
                {_id : req.params.username.toLowerCase()}, [],
                {$pullAll : {books_to_read: books}},
                {new : true}
            ).then((data) => {
                res.status(200).send(data.value.books_to_read);
                console.log(data);
            }).catch((error) => {
                res.status(500).send('Error');
                console.log(error);
            });
        }).catch((error) => {
            res.status(404);
            res.send('Cannot connect to database');
            console.log(error);
        });
    });

// Adds a thread id in which the user participates in
profile.put('/users/:username/community/:cid', function(req, res) {
    let cid = req.params.cid;
    MongoClient.connect(url).then((db) => {
        console.log('Connected to database');
        db.collection('USERS').findAndModify(
            {_id : req.params.username.toLowerCase()}, [],
            {$addToSet : {communities: cid}},
            {new : true}
        ).then((data) => {
            res.status(200).send(data.value.communities);
            console.log(data);
        }).catch((error) => {
            res.status(500).send('Error');
            console.log(error);
        });
    }).catch((error) => {
        res.status(404);
        res.send('Cannot connect to database');
        console.log(error);
    });
});

// Registers a user
profile.post('/register', function(req, res) {
    var data = {
        _id : req.body.username.trim().toLowerCase(),
        email : req.body.email.trim(),
        password : req.body.password,
        books_read : [],
        books_to_read : [],
        communities : []
    };

    if (data.username == '' || data.email == '' || data.password == '') {
        res.status(400).send('Username, email, and password fields cannot be blank');
        return;
    }

    const register = async () => {
        let db = await MongoClient.connect(url);

        try {
            await db.collection('USERS').insertOne(data);
            res.status(200).send('Registered successfully');
        }
        catch (error) {
            res.status(400).send('Username already exists');
            console.log(error);
        }
    };

    register().catch((error) => {
        res.status(404).send('Cannot connect to database');
        console.log(error);
    });
});

// Logs in a user
profile.post('/login', function(req, res) {
    let data = {
        _id : req.body.username.trim().toLowerCase(),
        password : req.body.password
    };

    if (data._id == '' || data.password == '') {
        res.status(400).send('Username and password fields cannot be blank');
        return;
    }

    const login = async () => {
        let db = await MongoClient.connect(url);
        try {
            let logindata = await db.collection('USERS').find(data).toArray();
            if (logindata.length == 0) {
                res.status(400).send('Invalid username and password combination');
            }
            else {
                let hash = generate_cookie(data._id);
                sessions[hash] = data._id;
                console.log(sessions[hash]);
                res.status(200).cookie('username', hash)
                .send('Logged in successfully');
            }
        }
        catch (error) {
            res.status(500).send('Unable to log in');
            console.log(error);
        }
    };

    login().catch((error) => {
        res.status(404).send('Cannot connect to database');
        console.log(error);
    });
});

// Gets the current session for a user
profile.get('/get-session', function(req, res) {
    let cookie = cookie_parser.JSONCookies(req.cookies);
    try {
        if (!cookie.hasOwnProperty('username')) {
            res.status(200).send('');
        }
        else if (!sessions.hasOwnProperty(cookie.username)) {
            res.status(200).send('');
        }
        else {
            res.status(200).send(sessions[cookie.username]);
        }
    }
    catch (error) {
        res.status(200).send('');
    }
});

// Logs out a user and deletes the session associated with that user
profile.get('/logout', function(req, res) {
    let cookie = cookie_parser.JSONCookies(req.cookies);
    try {
        if (!cookie.hasOwnProperty('username')) {
            res.status(200).end();
        }
        else if (!sessions.hasOwnProperty(cookie.username)) {
            res.status(200).end();
        }
        else {
            delete sessions[cookie.username];
            res.status(200).end();
        }
    }
    catch (error) {
        res.status(200).end();
    }
});

module.exports = {
    profile : profile
};
