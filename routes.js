const router = require('express')();
const bodyParser = require('body-parser');
const authStudent = require('./middleware/studentauth');
const authClub = require('./middleware/clubauth');
const authAdmin =require('./middleware/adminauth');
const studentRoutes = require('./models/students/student-routes');
const clubRoutes = require('./models/clubs/club-routes');
const AdminRoutes = require('./models/admin/admin-routes');

//To enable req.body parsing
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use('/student',studentRoutes);
router.use('/clubs',clubRoutes);
router.use('/admins',AdminRoutes);

//Routes
router.get('/', function (req, res) {
    res.redirect('/landing'); 
});

router.get('/landing', function (req, res) {
    res.render("landing");
});

module.exports = router; 