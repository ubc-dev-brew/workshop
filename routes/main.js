// This file contains the primary routes for the platform
module.exports = function(express, app) {
	var router = express.Router();
	
	router.get('/', function(req, res) {
		res.render('index', {
			message: 'Hello World!'
		});
	});
	
	router.get('/login', function(req, res) {
		res.render('loginPage', {
			message: 'This is the login page!'
		});
	});
	
	// mount the router on the app - https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
	// All routes relative to '/'
	app.use('/', router);
}