const mongoose = require('mongoose');
const member = require('./member');

const description = new mongoose.Schema({
    found_date: Date,
    founders: [String],
    ceo: String,
    members: [member]
});


module.exports = description;