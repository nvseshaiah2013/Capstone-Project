const clubRoutes = require('./models/clubs/club-routes');
const studentRoutes = require('./models/students/student-routes');
const router = require('express')();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Student = require('./models/students/student');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));

router.use(require('express-session')({
    secret: "colorfulLPU",
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());





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

router.post('/signup',function(req,res){
    console.log(req.body);
    const newStudent = new Student(
        {
            name:req.body.name,
            username:req.body.username,
            phone_no:req.body.phone_no,
            reg_no:req.body.reg_no
        }
    );
    Student.register(newStudent,req.body.password,function(err,student){
        if(err)
        {
            console.log(err);
            return res.redirect('/signup');
        }
        passport.authenticate("local")(req,res,function(){
            res.send("Student Registration Successful!");
        });
    })
});

router.post('/login',passport.authenticate("local",{
    successRedirect:'/',
    failureRedirect:'/login'
}),function(req,res){});

// router.use('/student',studentRoutes);
// router.use('/clubs',clubRoutes);

module.exports = router; 