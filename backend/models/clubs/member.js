const mongoose = require('mongoose');

const member = new mongoose.Schema({
    name: String,
    designation: String
});


module.exports = member;