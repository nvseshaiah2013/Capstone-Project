const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

adminSchema.pre('save',function(next){
    let admin = this;
    if(!admin.isModified('password')) return next();
    bcrypt.hash(admin.password,10,function(err,passhash){
        if(err) next(err);
        admin.password = passhash;
        next();
    })

});


adminSchema.methods.genJWT = function genJWT(cb) {
    let admin = this;
    jwt.sign({ username: this.username }, process.env.ADMIN_PR_KEY, { expiresIn: "3h" }, function (err, token) {
        if (err) {
            // console.log("Error in signing token for user: " + admin.username);
            cb(err);
        }
        else {
            //  console.log("Token Generated for username: " + admin.username + " " + token);
            cb(null, token);
        }
    });
}


adminSchema.methods.comparePwd = function (password, cb) {
    // console.log(this.password);
    bcrypt.compare(password, this.password, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}


module.exports = mongoose.model('Admin',adminSchema);