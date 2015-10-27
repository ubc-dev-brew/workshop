// Get all modules
var express = require('express'),
	app = express(),
	cons = require('consolidate'), // Templating library adapter for Express
	path =  require('path'),
	mongoose = require('mongoose'),
	swig = require('swig'),
	passport = require('passport'),
	flash = require('connect-flash'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	multipart = require('multiparty'),
	cloudinary = require('cloudinary'),
	session = require('express-session'),
	connectMongo = require('connect-mongo')(session),
	config = require('./config/config');

// Get environment variable
var env = config.env;
console.log(config.message);

// Set environment for swig
swig.setDefaults({ locals: { env: env } });

if(env === 'development') {
	// Express middleware to populate 'req.cookies' so we can access cookies
    // Set up our application
	app.use(cookieParser()); // Read cookies for authentication
    app.use(session({
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: true,
        cookie: {}
    })); // saving cookies to session locally
} else {
	// Set up our application
	app.use(cookieParser()); // Read cookies for authentication
    app.use(session({
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: true,
        store: new connectMongo({
            url: config.dbURL,
            stringify: true        
        })    
    })); // Saving cookies to mongodb when in production
}
// Resolve paths to client files.
var client_files = path.resolve(__dirname, './client/');

// Set a 30 second connection timeout for mongodb
var mongoOptions = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

// Pass in passport configuration file
// Needs to be configured before sending to routes
require('./config/passport')(passport, config);
	
// Register our templating engine
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Express middleware to serve static files
app.use(express.static('public'));

// Express middleware to populate 'req.body' so we can access POST variables
app.use(bodyParser.json()); // Parsing html forms
app.use(bodyParser.urlencoded({ extended: true }));

// Set up cloudinary
cloudinary.config(config.cloudinary);

// Set up passport
app.use(passport.initialize());
app.use(passport.session()); // Persisting log-in sessions
app.use(flash()); // For flash messages stored in session
	
// Get routes from routes/main.js
require('./routes/main.js')(express, app, passport);
require('./routes/api.js')(express, app, multipart, cloudinary);

// Set a port to listen to for the server
app.set('port', (process.env.PORT || 5000));

// Connect to MongoDB
var mongodbUri = 'mongodb://admin:devbrewadmin@ds043324.mongolab.com:43324/devbrew-workshop';
mongoose.connect(mongodbUri, mongoOptions);

var conn = mongoose.connection;

// MongoDB error event
conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function callback () {
	// Connection to mongoDB successful...
	console.log('Connected to mongoDB')
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port',
	app.get('port'));
});