// This file contains the primary routes for the platform
module.exports = function(express, app, middleware, passport, Post) {
	var router = express.Router();
	
	// =====================================
	// HOME / LOG-IN PAGE
  	// =====================================
	router.get('/', function(req, res){
		res.render('index', {
			errorMessage: req.flash('loginMessage')
		});
	});
	
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
	router.get('/dashboard', middleware.isLoggedIn, function(req, res){
		res.render('dashboard', {
			user : req.user
		});
	});
	
	// =====================================
    // FEED
    // =====================================	
	router.get('/feed', middleware.isLoggedIn, function(req,res) {
		var query = Post.where().sort({ 'createdAt' : -1 }).limit(10);
		query.find(function(err, docs) {
			if(err) {
				console.log("An error occurred while searching for recent posts: " + err.stack);
			}
			for(var index in docs) {
				console.log('****' + index + '****');
				console.dir(docs[index]);
			}
			res.render('feed', {
				user : req.user,
				posts : docs
			});
		});
	});
	
	// =====================================
  	// FACEBOOK ROUTES
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

	// mount the router on the app - https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
	// All routes relative to '/'
	app.use('/', router);
}