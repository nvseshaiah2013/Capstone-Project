const router = require('express')();
const bodyParser = require('body-parser');
const authStudent = require('./middleware/studentauth');
const studentRoutes = require('./models/students/student-routes');
const clubRoutes = require('./models/clubs/club-routes');
const eventRoutes = require('./models/events/event-routes');
const Admin = require('./models/admin/admin');

//To enable req.body parsing
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use('/student',studentRoutes);
router.use('/events',eventRoutes);

//Routes
router.get('/', function (req, res) {
    res.redirect('/landing'); 
});

router.get('/landing', function (req, res) {
    res.render("landing");
});

router.get('/event-new', function (req, res) {
    res.render("events/new-event");
});

router.get('/clubNew',function(req,res){
    res.render("clubs/clubNew");
});

router.post('/clubNew',function(req,res){
    console.log(req.body);
    res.send("Hola");
});

//Protected Route

router.get('/protected', authStudent, function (req, res) {
    console.log(req.currentUser);
    res.send({
        "message": "Protected Route Reached",
        "username": req.currentUser.username
    });
});

// router.use('/student',studentRoutes);
// router.use('/clubs',clubRoutes);

module.exports = router; 