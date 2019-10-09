const mongoose = require('mongoose');

const images = new mongoose.Schema({
    image_src:{
        type:String,
        required:true
    },
    caption:{
        type:String
    }
});

const image_gallery = new mongoose.Schema({
    event_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        index:true
    },
    image_links:[images]
});


module.exports = mongoose.model('image_gallery',image_gallery);