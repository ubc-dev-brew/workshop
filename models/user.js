// Files for users mongoose models

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	config = require('../config/config.js');
	
var userSchema  = new Schema({
	auth : {
		local : {
			email: String,
			password: String
		},
		facebook : {
			id : String,
			token : String,
			email : String,
			name : String
		}
	},
	name : {
		firstName : String,
		lastName : String
	},
	profession : String,
	bio : String,
	profilePictureUrl : String,
	posts : [{
		type: Schema.Types.ObjectId, 
		ref: 'Post'
	}],
	createdAt : {
		type : Date, 
		default : Date.now()
	}
});


// Add methods to userSchema

// Generate a hash for password
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// Check if the user entered a valid password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.auth.local.password);
}

module.exports = mongoose.model('User', userSchema);