module.exports = function(express, app, middleware, multipart, cloudinary, User, Post) {
	var router = express.Router();
	
	router.post('/profile', function(req, res) {
		var form = new multipart.Form();
		var userModel = {};
		
		form.on('error', function(err) {
			console.log("Error occurred while uploading a profile picture: " + err.stack);
		});
		
		form.on('part', function(part) {
			if(!part.filename) {
				// The part is a form field, not a file
				console.dir(part);
				part.resume();
			}
			if(part.filename) {
				// The part is a file, stream to Cloudinary
				var stream = cloudinary.uploader.upload_stream(function(result) {
					userModel.profilePictureUrl = result.url;
				});
				part.pipe(stream);
				part.resume();
			}
			part.on('error', function(err) {
				console.log("Error occurred while streaming a profile picture part: " + err.stack);
			});
		});
		
		form.on('field', function(name, value) {
			userModel[name] = value;
		});
		
		form.parse(req, function(err, fields, files) {
			if(err) {
				console.log("Error occurred while parsing a multi-part form.\nHTTP POST /profile\n" + err.stack);
			}
			var newUser = new User(userModel);
			newUser.save(function(err, result) {
				if(err) {
					console.log("Error occurred while saving a new user to MongoDB: " + err.stack);
				}
				console.log("Added new user. " + JSON.stringify(result));
			});
		});
		
		res.render('feed');
	});
	
	router.post('/post', function(req, res) {
		var form = new multipart.Form();
		var postModel = {};
		
		form.on('error', function(err) {
			console.log('Error occurred while uploading a post: ' + err.stack);
		});
		
		form.on('part', function(part) {
			if(!part.filename) {
				part.resume();
			}
			if(part.filename) {
				var stream = cloudinary.uploader.upload_stream(function(result) {
					postModel.imageUrl = result.url;
				});
				part.pipe(stream);
				part.resume();
			}
			part.on('error', function(err) {
				console.log("Error occurred while stream a post image part: " + err.stack);
			});
		});
		
		form.on('field', function(name, value) {
			if(name === 'caption') {
				postModel.caption = value; 
			}
		});
		
		form.parse(req, function(err, fields, files) {
			if(err) {
				console.log("Error occurred while parsing a multi-part form.\nHTTP POST /api/post\n" + err.stack);
			}
			var newPost = new Post(postModel);
			newPost.save(function(err, result) {
				if(err) {
					console.log("Error occurred while saving a new post to MongoDB: " + err.stack);
				}
				console.log("Added new post: " + JSON.stringify(result));
			});
			res.render('feed');
		});
	});
	
	app.use('/api', router);
};