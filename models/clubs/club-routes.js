const express = require('express');
const router = express();


const Club = require('./club');
const clubAuth = require('../../middleware/clubauth');

router.get('/add',function(req,res){

});

router.post('/add',function(req,res){
    let club = new Club({

    });
    club.save();
});

module.exports = router;