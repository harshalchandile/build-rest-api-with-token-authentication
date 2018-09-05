// server.js
// We are building an Express Application
var express = require('express');
var app = express();

// Bodyparser for parsing form data
var bodyParser = require('body-parser');
// Use bodyparse in our app
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Morgan for logging
var morgan = require('morgan');
// Use morgan in our app
app.use(morgan('dev'));

// Load configuration
var config = require('./config');

// jsonwebtoken for authentication
var jwt = require('jsonwebtoken');

// Mongoose as ORM for Mongodb-nodejs
var mongoose = require('mongoose');
mongoose.connect(config.database); // connect to database

app.set('superSecret', config.secret); // Use secret from config file

var User = require('./models/user'); // Mongoose ORM schema

app.listen(config.port); // Start server at port specified in config.js

app.get('/', function(req, res) {
    res.send('Create API Routes This includes the following routes');
});

app.get('/setup', function(req, res) {

    // create a sample user
    var adminuser = new User({
        name: 'admin',
        password: 'password',
        admin: true
    });

    // save the sample user
    adminuser.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({
            success: true
        });
    });
});

var router = express.Router(); // Create Express router
app.use('/api', router); // Access router's method with /api as prefix e.g. http://localhost:4000/api/

// Create authentication token if the username and passwords are matched or correct
router.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                const payload = {
                    admin: user.admin
                };
                var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 24 * 60 * 60
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Get your token!',
                    token: token
                });
            }

        }

    });
});

// route middleware to verify a token
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// API routes always be accessed with authentication
router.get('/', function(req, res) {
    res.json({
        message: 'welcome to our api!!!'
    });
});

router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

console.log('Server started on the port', +config.port);