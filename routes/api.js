
module.exports = function(express, app, multipart, cloudinary) {
	var router = express.Router();
	
	router.get('/profile-picture', function(req, res) {
		res.render('upload');
	});
	
	router.post('/profile-picture', function(req, res) {
		var form = new multipart.Form();
		var stream = cloudinary.uploader.upload_stream();
		
		form.on('error', function(err) {
			console.log("Error occurred while uploading a profile picture: " + err.stack);
		});
		
		form.on('part', function(part) {
			if(!part.filename) {
				// The part is a form field, not a file
				part.resume();
			}
			if(part.filename) {
				// The part is a file, stream to Cloudinary
				part.pipe(stream);
				part.resume();
			}
			part.on('error', function(err) {
				console.log("Error occurred while streaming a profile picture part: " + err.stack);
			})
		});
		
		form.parse(req);
		res.render('index');
	});
	
	app.use('/api', router);
}