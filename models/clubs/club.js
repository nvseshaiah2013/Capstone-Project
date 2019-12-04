const mongoose = require('mongoose');
const contactDetails = require('./contact');
const description = require('./description');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt_factor = 10;

dotenv.config();
const clubSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true
    },
    contact:contactDetails,
    desc:description,
    reg_date:{
        type:Date,
        default:Date.now()
    },
    activeTokens:[String]
});


clubSchema.methods.genJWT = function genJWT(cb) {
    let club = this;
    jwt.sign({ username: this.username }, process.env.CLUB_PR_KEY, { expiresIn: "3h" }, function (err, token) {
        if (err) {
            // console.log("Error in signing token for user: " + club.username);
            cb(err);
        }
        else {
            //  console.log("Token Generated for username: " + club.username + " " + token);
            cb(null, token);
        }
    });
}

clubSchema.pre('save', function (next) {
    var club = this;

    // only hash the password if it has been modified (or is new)
    if (!club.isModified('password')) return next();

    // hash the password using our new salt
    bcrypt.hash(club.password, salt_factor, function (err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        club.password = hash;
        next();
    });
})



clubSchema.methods.comparePwd = function (password, cb) {
    // console.log(this.password);
    bcrypt.compare(password, this.password, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}


module.exports = mongoose.model('Club',clubSchema);


