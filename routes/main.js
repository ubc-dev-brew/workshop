// This file contains the primary routes for the platform
module.exports = function(express, app, middleware, passport, User, Post) {
	var router = express.Router();
	
	// =====================================
	// HOME / LOG-IN PAGE
  	// =====================================
	router.get('/', middleware.redirectIfLoggedIn, function(req, res){
		var query = Post.where().sort({ 'createdAt' : -1 }).limit(10);
		query.find(function(err, docs) {
			if(err) {
				console.log("An error occurred while searching for recent posts: " + err.stack);
			}
			res.render('index', {
				errorMessage: req.flash('loginMessage'),
				posts : docs
			});
		});
		
	});
	
	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/feed',
		failureRedirect: '/',
		failureFlash: true // Show flash messages
	}));
	
	// =====================================
  	// SIGN-UP PAGE
  	// =====================================
	router.get('/signup', middleware.redirectIfLoggedIn, function(req, res){
		res.render('signup', {
			errorMessage: req.flash('signupMessage')
		});
	});
	
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/feed',
		failureRedirect: '/signup',
		failureFlash: true // Show flash messages
	}));
	
	// =====================================
  	// DASHBOARD PAGE
	// =====================================	
	router.get('/dashboard', middleware.isLoggedIn, function(req, res){
		res.render('dashboard', {
			user : req.user,
			isUserLoggedIn: req.isAuthenticated()
		});
	});
	
    // =====================================
  	// USER PROFILE PAGE
	// =====================================	
    router.get('/users/:userId', function(req, res) {
        User.findById(req.params.userId, function(err, user){
            if(err) {
				console.log("An error occurred while retrieving this user: " + err.message);
			}
			Post.find({user: user}, function(err, posts) {
				if(err) {
					console.log("An error occurred while retrieving the posts for this user: " + err.message);
				}
				console.log(posts);
	            res.render('profile', {
	                profileOwner : user,
	                posts : posts,
					isUserLoggedIn: req.isAuthenticated()
	            });
			});
        });
    });
	
	// =====================================
  	// GET ALL USERS
	// =====================================	
    router.get('/listAllUsers', function(req, res) {
        User.find({}, {name: 1 }, function(err, dataresult) {
			var i,
				l = dataresult.length,
				userArray = [];
			
			for (i = 0; i < l; i++) {
				var userObject = new Object();
				userObject.label = dataresult[i].name.firstName + ' ' + dataresult[i].name.lastName;
				userObject.value = dataresult[i].id;
				userArray.push(userObject);								
			}
			
			res.send(userArray);
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
			res.render('feed', {
				user : req.user,
				posts : docs,
				isUserLoggedIn: req.isAuthenticated()
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
			successRedirect : '/feed',
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