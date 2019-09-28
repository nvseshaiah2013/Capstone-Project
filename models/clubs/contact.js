const mongoose = require('mongoose');

const contactDetails = new mongoose.Schema({
    phone_no: [String],
    email_id: [String],
    address: String
});

module.exports = contactDetails;