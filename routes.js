const User = require("./models.js").UserModel;

module.exports = function (app, db) {

	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/views/index.html')
	});

	app.get('/api/exercise/users', (req, res) => {
		User.find({}, function(err, users) {
			if(err) throw err;
			res.json(users);
		});
	});
	
	app.get('/api/exercise/log/:userId/:from?/:to?/:limit?', function (req, res) {
			User.findById(req.params.userId, function(err, data) {
				if(data === null || data === undefined) {
					res.json("Could not find that user id in our database.");						
				} else {			
						if(err) throw err;
					
						let fromDate;
						let toDate; 
						let exerciseDate;
						let limit;
            let duration;
						let workouts = [];
						
            // if all optional parameters are present
						if(req.params.from && req.params.to && req.params.limit) {
							fromDate = new Date(req.params.from);
							toDate = new Date(req.params.to);
							limit = parseInt(req.params.limit);
							console.log(limit);
							
							console.log("from: " + fromDate);
							console.log("to: " + toDate);
							
							if(fromDate == "Invalid Date" || toDate == "Invalid Date" || isNaN(limit)) {
								res.json("Sorry, you didn't enter a valid date. Or your limit wasn't a valid integer, or whole number.");		
							} else {
								for(let i = 0; i < data.exercises.length; i++) {
									exerciseDate = new Date(data.exercises[i].date);
									duration = data.exercises[i].duration;
									console.log("exercise date: " + exerciseDate);
									if(exerciseDate >= fromDate && exerciseDate <= toDate && duration <= limit) {
										workouts.push(data.exercises[i]);
									}
								}
								console.log("workouts: " + workouts);
								res.json(workouts);	
							}
						}
					
						else if(req.params.from && req.params.to) {
							fromDate = new Date(req.params.from);
							toDate = new Date(req.params.to);
							console.log("from: " + fromDate);
							console.log("to: " + toDate);
							
							if(fromDate == "Invalid Date" || toDate == "Invalid Date") {
								res.json("Sorry, you didn't enter a valid date.");		
							} else {
								for(let i = 0; i < data.exercises.length; i++) {
									exerciseDate = new Date(data.exercises[i].date);
									console.log("exercise date: " + exerciseDate);
									if(exerciseDate >= fromDate && exerciseDate <= toDate) {
										workouts.push(data.exercises[i]);
									}
								}
								console.log("workouts: " + workouts);
								res.json(workouts);
							}
						}
					
						else if(req.params.from) {
							fromDate = new Date(req.params.from);
							console.log("from: " + fromDate);
							
							if(fromDate == "Invalid Date") {
								res.json("Sorry, you didn't enter a valid date.");		
							} else {
								for(let i = 0; i < data.exercises.length; i++) {
									exerciseDate = new Date(data.exercises[i].date);
									console.log("exercise date: " + exerciseDate);
									if(exerciseDate >= fromDate) {
										workouts.push(data.exercises[i]);
									}
								}
								console.log("workouts: " + workouts);
								res.json(workouts);
							}
						} 
					
						else {
							res.json(data.exercises);
						}
				}
			});
	});

	app.post('/api/exercise/new-user', function (req, res) {
		User.findOne({username: req.body.username}, function(err, data) {
			if(data !== null) {
				if(err) throw err;
				res.json("That username has already been added to the database.");						
			} else {			
					if(err) throw err;

					let newUser = new User({username: req.body.username});

					newUser.save(function(err, data) {
						if(err) throw err;
						res.json(data);
					});																		
			}
		});
	});
	
	app.post('/api/exercise/add', function (req, res) {
		User.findByIdAndUpdate(req.body.userId, { 
      $addToSet: {exercises: {description: req.body.description, duration: req.body.duration, date: req.body.date || new Date() } },
      $inc: {count: 1}
    }, {new: true}, function(err, data) {
			if(data === null || data === undefined) {
				res.json("Could not find that user id in our database.");
			} else {
				if(err) throw err;
				res.json(data);
			}
		});
	});
}