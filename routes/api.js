module.exports = function(express, app, middleware, multipart, cloudinary, User, Post) {
	var router = express.Router();
	
	router.post('/profile', function(req, res) {
		var form = new multipart.Form();
		var userModel = {};
		
		form.on('error', function(err) {
			console.log("Error occurred while uploading a profile picture: " + err.stack);
			// TODO handle error condition properly (ajax response to form)
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
				// TODO handle error condition properly (ajax response to form)
			});
		});
		
		form.on('field', function(name, value) {
			userModel[name] = value;
		});
		
		form.parse(req, function(err, fields, files) {
			if(err) {
				console.log("Error occurred while parsing a multi-part form.\nHTTP POST /profile\n" + err.stack);
				// TODO handle error condition properly (ajax response to form)
			}
			var newUser = new User(userModel);
			newUser.save(function(err, result) {
				if(err) {
					console.log("Error occurred while saving a new user to MongoDB: " + err.stack);
					// TODO handle error condition properly (ajax response to form)
				}
				console.log("Added new user. " + JSON.stringify(result));
			});
		});
		
		res.render('feed');
	});
    
    router.post('/user/update', middleware.isLoggedIn, function(req, res) {
        var form = new multipart.Form();
        var query;
        if(req.user._doc.auth.local) {
            query = User.where({ 'auth.local.email' : req.user._doc.auth.local.email });
        }
        else {
            query = User.where({ 'auth.facebook.id' : req.user._doc.auth.facebook.id });
        }
        
        form.on('error', function(err) {
			console.log('Error occurred while updating user profile: ' + err.stack);
		});
        
        form.on('part', function(part) {
            if(!part.filename) {
                part.resume();
            }
            if(part.filename) {
                var stream = cloudinary.uploader.upload_stream(function(result) {
                    User.findOneAndUpdate(query, { $set: { profilePictureUrl : result.url }}, {upsert: true}, function(err, result) {
                      if (err) {
                        console.log("Error occured while updating user profile.");
                      }
                      console.log("Updated user profile: " + JSON.stringify(result));
                    });
                });
                part.pipe(stream);
                part.resume();
            }
            
            part.on('error', function(err) {
				console.log("Error occurred while stream a post image part: " + err.stack);
			});
        });
        
        form.on('field', function(name, value) {
            if(name === 'profession') {
                if(value) {
                    User.findOneAndUpdate(query, { $set: { profession : value }}, {upsert: true}, function(err, result) {
                      if (err) {
                        console.log("Error occured while updating user profile.");
                      }
                      console.log("Updated user profile: " + JSON.stringify(result));
                    });
                }
            }
            if(name === 'bio') {
                if(value) {
                    User.findOneAndUpdate(query, { $set: { bio : value }}, {upsert: true}, function(err, result) {
                      if (err) {
                        console.log("Error occured while updating user profile.");
                      }
                      console.log("Updated user profile: " + JSON.stringify(result));
                    });
                }
            }
        });
        
        form.parse(req);
        form.on('close', function() {
			res.redirect('/dashboard');
		});
    });
    
	// ================================================
    // CREATE NEW POST
	// ================================================

	router.post('/post', function(req, res) {
		var form = new multipart.Form();
		var postModel = {};
				
		form.on('error', function(err) {
			console.log('Error occurred while uploading a post: ' + err.stack);
			// TODO handle error condition properly (ajax response to form)
		});
		
		form.on('part', function(part) {
			if(!part.filename) {
				part.resume();
			}
			if(part.filename) {
				var stream = cloudinary.uploader.upload_stream(function(result) {
					postModel.imageUrl = result.url;
					var query;
					if(req.user._doc.auth.local) {
						query = User.where({ 'auth.local.email' : req.user._doc.auth.local.email });
					}
					else {
						query = User.where({ 'auth.facebook.id' : req.user._doc.auth.facebook.id });
					}
					query.findOne(function(err, user) {
						if(err) {
							console.log("An error occurred while retrieving a user doc: " + err.stack);
							// TODO handle error condition properly (ajax response to form)
						}
						if(user) {
							// Add a reference to the user in post
							postModel.user = user._id;
							var newPost = new Post(postModel);
							newPost.save(function(err, post) {
								if(err) {
									console.log("Error occurred while saving a new post to MongoDB: " + err.stack);
								}
								user.posts.push(post._id);
								user.save();
								console.log("Added new post: " + JSON.stringify(post));
							});
						}
					});
				});
				part.pipe(stream);
				part.resume();
			}
			part.on('error', function(err) {
				console.log("Error occurred while streaming a post image part: " + err.stack);
				// TODO handle error condition properly (ajax response to form)
			});
		});
		
		form.on('field', function(name, value) {
			if(name === 'caption') {
				postModel.caption = value; 
			}
		});
		
		form.on('close', function() {
			res.redirect('/feed');
		});
		
		form.parse(req);
	});
	
	app.use('/api', router);
};