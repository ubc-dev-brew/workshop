var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	config = require('../config/config.js');
	
var postSchema = new Schema({
	imageUrl : String,
	caption : String,
	createdAt : {type : Date, default : Date.now()}
});

module.exports = mongoose.model('Post', postSchema);