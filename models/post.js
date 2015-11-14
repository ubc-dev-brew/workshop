var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	config = require('../config/config.js');
	
var postSchema = new Schema({
	imageUrl : String,
	caption : String,
	user : { 
		type: Schema.Types.ObjectId, 
		ref: 'User' 
	},
	createdAt : {
		type : Date, 
		default : Date.now()
	}
});

module.exports = mongoose.model('Post', postSchema);