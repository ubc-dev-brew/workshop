module.exports = {
	// Route middlewares to check if a user is logged in
	isLoggedIn : function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}		
		res.redirect('/');
	}
}