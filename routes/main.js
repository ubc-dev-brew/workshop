// This file contains the primary routes for the platform
module.exports = function(express, app, passport) {
	var router = express.Router();
	
<<<<<<< HEAD
	router.get('/', function(req, res) {
=======
	// =====================================
    // HOME / LOG-IN PAGE
    // =====================================
	router.get('/', function(req, res){
>>>>>>> df4af8c0a6025d4d817908053828520222d3576e
		res.render('index', {
			errorMessage: req.flash('loginMessage')
		});
	});
	
<<<<<<< HEAD
	router.get('/login', function(req, res) {
		res.render('loginPage', {
			message: 'This is the login page!'
=======
	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash: true // Show flash messages
	}));
	
	// =====================================
    // SIGN-UP PAGE
    // =====================================
	router.get('/signup', function(req, res){
		res.render('signup', {
			errorMessage: req.flash('signupMessage')
		});
	});
	
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/signup',
		failureFlash: true // Show flash messages
	}));
	
	// =====================================
    // DASHBOARD PAGE
    // =====================================	
	router.get('/dashboard', isLoggedIn, function(req, res){
		res.render('dashboard', {
			user : req.user
>>>>>>> df4af8c0a6025d4d817908053828520222d3576e
		});
	});
	
	// =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
	router.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));
	
	// Handle callback after authenticaiton
	router.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/dashboard',
			failureRedirect : '/'
		}));
		
	// =====================================
    // LOGOUT
    // =====================================	
	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	
	// Route middlewares to check if a user is logged in
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}		
		res.redirect('/');
	}
	
	// mount the router on the app - https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
	// All routes relative to '/'
	app.use('/', router);
}