// Files for users mongoose models

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	config = require('../config/config.js');
	
var userSchema  = new Schema({
    local : {
		email: String,
		password: String
	}	
});


// Add methods to userSchema

// Generate a hash for password
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// Check if the user entered a valid password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);