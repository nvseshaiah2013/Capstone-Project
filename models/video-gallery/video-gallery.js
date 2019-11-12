const mongoose = require('mongoose');

const videos = new mongoose.Schema({
    _id: false,
    video_src: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: 'Awesome Picture'
    }
});

const video_gallery = new mongoose.Schema({
    _id: false,
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    video_links:[videos]
});

module.exports = mongoose.model('video_gallery',video_gallery);