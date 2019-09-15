const clubRoutes = require('./models/clubs/club-routes');
const studentRoutes = require('./models/students/student-routes');
const router = require('express')();


router.get('/',function(req,res){
    res.redirect('/landing');

});

router.get('/landing',function(req,res){
    res.render("landing");
});

router.get('/event-new',function(req,res){
    res.render("events/new-event");
});

router.get('/login',function(req,res){
    res.render("students/Login");
});

router.get('/signup',function(req,res){
    res.render("students/sign-up");
});


module.exports = router; 