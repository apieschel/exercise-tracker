const routes = require('./routes.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config();

const cors = require('cors');
const mongoose = require('mongoose')

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {useMongoClient: true}, (err, db) => {
	if(err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Successful database connection');
				routes(app, db);
				
				// Not found middleware
				app.use((req, res, next) => {
					return next({status: 404, message: 'not found'})
				});

				// Error Handling middleware
				app.use((err, req, res, next) => {
					let errCode, errMessage

					if (err.errors) {
						// mongoose validation error
						errCode = 400 // bad request
						const keys = Object.keys(err.errors)
						// report the first validation error
						errMessage = err.errors[keys[0]].message
					} else {
						// generic or custom error
						errCode = err.status || 500
						errMessage = err.message || 'Internal Server Error'
					}
					res.status(errCode).type('txt')
						.send(errMessage)
				});

				const listener = app.listen(process.env.PORT || 3000, () => {
					console.log('Your app is listening on port ' + listener.address().port)
				});
	
		}
	
});