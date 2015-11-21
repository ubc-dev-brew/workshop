module.exports = {
	// Route middlewares to check if a user is logged in
	isLoggedIn : function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}		
		res.redirect('/');
	},
	
	// Route middlewares to check block access to pages if a user is logged in
	redirectIfLoggedIn : function(req, res, next) {
		if(req.isAuthenticated()) {
			res.redirect('/feed');
		}		
		return next();
	}
}