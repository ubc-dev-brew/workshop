// Get all modules
var express = require('express'),
	app = express(),
	cons = require('consolidate'), // Templating library adapter for Express
	path =  require('path'),
	mongoose = require('mongoose'),
	swig = require('swig'),
    passport = require('passport');

// Resolve paths to client files.
var client_files = path.resolve(__dirname, './client/');

// Register our templating engine
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Express middleware to serve static files
app.use(express.static('public'));


// Get routes from routes/main.js
require('./routes/main.js')(express,app);

// Set a port to listen to for the server
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
	console.log('Node app is running on port',
	app.get('port'));
	});