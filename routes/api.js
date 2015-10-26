var cloudinary = require('cloudinary');
var multipart = require('multiparty');

module.exports = function(express, app) {
	app.use(express.multipart({defer: true}));
	var router = express.Router();
	
	router.post('/profile-picture', function(req, res) {
		var form = new multiparty.Form();
		var stream = cloudinary.uploader.upload_stream();
		
		form.on('error', function(err) {
			console.log("Error occurred while uploading a profile picture: " + err.stack);
		});
		
		form.on('part', function(part) {
			if(!part.filename) {
				part.resume();
			}
			if(part.filename) {
				part.pipe(stream);
			}
			part.on('error', function(err) {
				console.log("Error occurred while streaming a profile picture part: " + err.stack);
			})
		});
		
		form.parse(req);
	});
	
	app.use('/api', router);
}