const express = require('express');
const router = express();

router.get('/add',function(req,res){
    res.render("events/new-event");
});

router.post('/add',function(req,res){

});

router.post('/register',function(req,res){

});

router.post('/deregister',function(req,res){

});

router.post('registerTeam',function(req,res){

});

router.post('/deregisterTeam',function(req,res){

});

module.exports = router;