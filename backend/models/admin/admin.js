const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

module.exports = mongoose.model('Admin',adminSchema);