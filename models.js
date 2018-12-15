let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
	username: String,
	exercises: [{ description: String, duration: Number, date: Date }]
});

let User = mongoose.model('User', userSchema);

exports.UserModel = User;