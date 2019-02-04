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
							
              // make sure the dates are valid and the limit is a number
							if(fromDate == "Invalid Date" || toDate == "Invalid Date" || isNaN(limit)) {
								res.json("Sorry, either you didn't enter a valid date, or your limit wasn't a valid integer.");		
							} else {
                // loop through the exercise array and put the ones that satisfy the parameters in a new array
								for(let i = 0; i < data.exercises.length; i++) {
									exerciseDate = new Date(data.exercises[i].date);
									duration = data.exercises[i].duration;
                  
									if(exerciseDate >= fromDate && exerciseDate <= toDate && duration <= limit) {
										workouts.push(data.exercises[i]);
									}
								}
								res.json(workouts);	
							}
						}
					  
            // if you only have the date parameters
						else if(req.params.from && req.params.to) {
							fromDate = new Date(req.params.from);
							toDate = new Date(req.params.to);
							
              // make sure the dates are valid
							if(fromDate == "Invalid Date" || toDate == "Invalid Date") {
								res.json("Sorry, you didn't enter a valid date.");		
							} else {
								for(let i = 0; i < data.exercises.length; i++) {
									exerciseDate = new Date(data.exercises[i].date);
                  
									if(exerciseDate >= fromDate && exerciseDate <= toDate) {
										workouts.push(data.exercises[i]);
									}
								}
								res.json(workouts);
							}
						}
					  
            // if there's only a "from" date, but no "to" date, then just return all exercises after the "from" date
						else if(req.params.from) {
							fromDate = new Date(req.params.from);
							
							if(fromDate == "Invalid Date") {
								res.json("Sorry, you didn't enter a valid date.");		
							} else {
								for(let i = 0; i < data.exercises.length; i++) {
									exerciseDate = new Date(data.exercises[i].date);
                  
									if(exerciseDate >= fromDate) {
										workouts.push(data.exercises[i]);
									}
								}
                
								res.json(workouts);
							}
						} 
					  
            // otherwise, just return the full exercise array
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