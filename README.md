# Exercise Tracker REST API

#### A microservice project

1. Create a user by posting form data username to /api/exercise/new-user and a json object with username and _id will be returned.
2. Get an array of all users from api/exercise/users.
3. Add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. The appropriate user object will be returned, including an array of exercises.
4. Retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). The user object will include the array of exercises and the total exercise count.
5. Retrieve part of the exercise log of any user by also passing along optional parameters of from (date) & to (date) or limit (number of minutes). (Date format yyyy-mm-dd, limit = int)
