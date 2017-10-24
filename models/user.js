var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: { //profile
        type: String, 
        default: "https://farm8.staticflickr.com/7298/8726823636_c33fd4fd24.jpg" //this shows up when typing in url to user id that doesn't exist- not quite the desired handling
    },
    fullName: String, //profile
    aboutMe: String, //profile
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);