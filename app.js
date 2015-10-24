// Get all modules
var express = require('express'),
	app = express(),
	cons = require('consolidate'), // Templating library adapter for Express
	path =  require('path'),
	mongoose = require('mongoose'),
	swig = require('swig'),
	passport = require('passport'),
	config = require('./config/config');

// Get environment variable
var env = config.env;
console.log(config.message);

// Resolve paths to client files.
var client_files = path.resolve(__dirname, './client/');

// Set a 30 second connection timeout for mongodb
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

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

// Connect to MongoDB
var mongodbUri = 'mongodb://admin:devbrewadmin@ds043324.mongolab.com:43324/devbrew-workshop';
mongoose.connect(mongodbUri, options);

var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function callback () {
	// Application...
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port',
	app.get('port'));
});