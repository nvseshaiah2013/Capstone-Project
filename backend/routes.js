const clubRoutes = require('./models/clubs/club-routes');
const studentRoutes = require('./models/students/student-routes');
const router = require('express')();
const mongoose = require('mongoose');
const Student = require('./models/students/student');
const bodyParser = require('body-parser');

//To enable req.body parsing
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

//Routes
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
    let student = new Student({
        username:req.body.username,
        password:req.body.password,
        regn_no:req.body.reg_no,
        name:req.body.name,
        phone_no:req.body.phone_no
    });
    Student.findOne({regn_no:req.body.reg_no}).then(user=>{
        if(user)
        {
            console.log("User Already Exists " + req.body.reg_no);
            res.status(401).json({"message":"Registration No Already Used"});
            res.end();
        }
        else
        {
            Student.findOne({username:req.body.username}).then(user=>{
                if(user)
                {
                    console.log("Email Id already Taken " + req.body.reg_no);
                    res.status(401).json({"message":"Email Id already Exists"});
                    res.end();
                }
                else
                {
                    student.save();
                    console.log(student + " Inserted\n");
                    res.status(200).send({"message":"Success"});
                }
            }).catch(err=>{
                console.log("Error: " + err);
            })
        }

    }).catch(err=>
        {
            console.log("error occured");
        })
});

router.post('/login',function(req,res){
    Student.findOne({username:req.body.username}).then(user=>{
        if(user)
        {
           user.comparePwd(req.body.password,function(err,result){
                if(err) throw err;
                console.log("Result is : " + result);
                if(result)
                    {
                        user.genJWT(function(err,token){
                            if(err) console.log("Token Error: " + err);
                            else 
                                {
                                    console.log(user.username + " " + token);
                                    res.render("students/dashboard",{auth:token});
                                }
                        });
                    }
                else 
                    {
                        res.send("Login Failed");
                    }
           });

        }
        else
        {
            res.send(403).send("Invalid Credentials!");
        }
    }).catch(err=>{
        res.status(403).send({"message":"invalid Credentials"});
    });
});

// router.use('/student',studentRoutes);
// router.use('/clubs',clubRoutes);

module.exports = router; 