module.exports = function(express, app, middleware, multipart, cloudinary, User, Post) {
	var router = express.Router();
	
    // ================================================
    // UPDATE USER INFORMATION
	// ================================================
    router.post('/user/update', middleware.isLoggedIn, function(req, res) {
        var form = new multipart.Form();
        var query;
        var email;
        var jsonResponse = {};
        var pictureUpdate = false;

        if(req.user._doc.auth.local) {
            query = User.where({ 'auth.local.email' : req.user._doc.auth.local.email });
            email = req.user._doc.auth.local.email;
        }
        else {
            query = User.where({ 'auth.facebook.id' : req.user._doc.auth.facebook.id });
            email = req.user._doc.auth.facebook.email;
        }
        
        form.on('error', function(err) {
			console.log('Error occurred while updating user profile: ' + err.stack);
		});
        
        form.on('part', function(part) {
            if(!part.filename) {
                part.resume();
            }
            if(part.filename) {
                pictureUpdate = true;
                var stream = cloudinary.uploader.upload_stream(function(result) {
                    jsonResponse["profilePicUrl"] = result.url;
                    res.send(JSON.stringify(jsonResponse));
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
                    jsonResponse["profession"] = value;
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
                    jsonResponse["bio"] = value;
                    User.findOneAndUpdate(query, { $set: { bio : value }}, {upsert: true}, function(err, result) {
                      if (err) {
                        console.log("Error occured while updating user profile.");
                      }
                      console.log("Updated user profile: " + JSON.stringify(result));
                    });
                }
            }
            if(name === 'firstName') {
                if(value) {
                    jsonResponse["firstName"] = value;
                    User.findOneAndUpdate(query, { $set: { 'name.firstName' : value }}, {upsert: true}, function(err, result) {
                      if (err) {
                        console.log("Error occured while updating user profile.");
                      }
                      console.log("Updated user profile: " + JSON.stringify(result));
                    });
                }
            }
            if(name === 'lastName') {
                if(value) {
                    jsonResponse["lastName"] = value;
                    User.findOneAndUpdate(query, { $set: { 'name.lastName' : value }}, {upsert: true}, function(err, result) {
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
            if(!pictureUpdate) {
                res.send(JSON.stringify(jsonResponse));
            }
		});
    });
    
	// ================================================
    // CREATE NEW POST
	// ================================================

	router.post('/post', function(req, res) {
		var form = new multipart.Form();
		var postModel = {};
        var query;
        var email;
        if(req.user._doc.auth.local) {
            query = User.where({ 'auth.local.email' : req.user._doc.auth.local.email });
            email = req.user._doc.auth.local.email;
        }
        else {
            query = User.where({ 'auth.facebook.id' : req.user._doc.auth.facebook.id });
            email = req.user._doc.auth.facebook.email;
        }
				
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