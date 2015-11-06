var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	config = require('../config/config.js');
	
var postSchema = new Schema({
	imageUrl : String,
	caption : String
});

module.exports = mongoose.model('Post', postSchema);