const mongoose = require('mongoose');


const video_gallery = new mongoose.Schema({
    _id: false,
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    video_links:[String]
});

module.exports = mongoose.model('video_gallery',video_gallery);