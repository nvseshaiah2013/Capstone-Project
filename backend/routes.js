const clubRoutes = require('./models/clubs/club-routes');
const studentRoutes = require('./models/students/student-routes');
const router = require('express')();


router.get('/',function(req,res){
    res.send("Default Route Working");

});

router.get('/event-new',function(req,res){
    res.render("events/new-event");
});

module.exports = router;