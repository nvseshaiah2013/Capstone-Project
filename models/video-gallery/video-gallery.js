const mongoose = require('mongoose');

const videos = new mongoose.Schema({
    video_src:{
        type:String,
        required:true,
    },
    caption:{
        type:String
    }
});

const video_gallery = new mongoose.Schema({
    event_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        index:true
    },
    video_links:[videos]
});

module.exports = mongoose.model('video_gallery',video_gallery);