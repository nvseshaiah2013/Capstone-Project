const express = require('express');
const router = express();
const Club = require('./club');
const Event = require('../events/event');
const Gallery = require('../image-gallery/image-gallery');
const Student = require('../students/student');
const clubAuth = require('../../middleware/clubauth');
const adminAuth = require('../../middleware/adminauth');
const Team = require('../teams/teams');
const multer = require('multer');
const moment = require('moment');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;


const makeCertificate = require('../../utility/makeCertificate');


//Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'event-images');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const uploadImages = multer({ storage: storage, fileFilter: imageFileFilter });


//Addition of Club by Admin

router.get('/add',adminAuth,function(req,res){
    res.render("clubs/clubNew");
});

router.post('/add',function(req,res){ 
    let club = new Club({
        "name":req.body.data.club_name,
        "username":req.body.data.username,
        "password":req.body.data.password,
        "desc.found_date":req.body.data.found_date,
        "desc.ceo":req.body.data.ceo,
        "contact.address":req.body.data.address
    });
    Club.findOne({name:req.body.data.club_name}).then(succ=>{
        if(!succ)
        {
            Club.findOne({username:req.body.data.username}).then(suc=>{
                if(!suc)
                {
                    club.save();
                    console.log("Saved");
                    return  res.statusCode(200).send({"message":"save Success!"}).end();
                }
                else
                {
                    console.log("username already in use");
                
                  return  res.statusCode(401).send({"message":"username already in use"}).end();
                }

            }).catch(err=>{
             // return  res.status(401).send({"message":"Error Occured" + err}).end();
            });
        }
        else
        {
            console.log("Name Exists");
           return res.statusCode(401).send({"message":"Club Name Already Exists"}).end();
        }

    }).catch(err=>{
        console.log(err);
       return res.statusCode(403).send({"message":"Something wrong","error":err}).end();
    })
    return res.status(200).send("Successfully Reached End!").end();
});

router.post('/addFounder',clubAuth,function(req,res){
    Club.findOneAndUpdate({_id:req.currentUser._id},{"$push":{"desc.founders":req.body.data.founder}},{new:true})
    .then((docs)=>{
        return res.render("clubs/profile",{club:docs});
    })
    .catch((err)=>{
        return res.status(403).send({"message":"Founder Addition Failed"});
    });
});

router.post('/addMember',clubAuth,function(req,res){
    Student.findOne({regn_no:req.body.data.regn_no})
    .then((student)=>{
        if(student && req.body.data.secretToken === student.secretToken)
        {
            let obj = {
                name:student.name,
                regn_no:student.regn_no
            };
            Club.findByIdAndUpdate(req.currentUser._id,{"$push":{"desc.members":obj}},{new:true})
            .then((club)=>{
                return res.render("clubs/profile",{club:club});
            })
            .catch((err)=>{
                return res.status(403).send({ "message": "Member Addition Error" });
            })
        }   
        else
        {
            return res.status(403).send({"message":"No Such Student"});
        }
    })
    .catch((err)=>{
        return res.status(403).send({"message":"Member Addition Failed"});
    })
});

router.get('/login',function(req,res){
    res.render("clubs/login");
});

router.post('/login',function(req,res){
    Club.findOne({username:req.body.username}).then(succ=>{
        if(succ)
        {
            succ.comparePwd(req.body.password,function(err,result){
                if(err) throw err;
                if(result){
                    succ.genJWT(function(err,token){
                        if(err) res.send("Some Problem Occured");
                        else res.status(200).render("clubs/dashboard",{auth:token,club:succ});
                    });
                }
                else{
                    res.status(401).json({"message":"Unauthorized"});
                }
            });
        }
    }).catch(err=>{
        res.status(401).json({"message":"Unuath"});
    });
});

router.get('/events',clubAuth,function(req,res){
    Event.find({club_id:req.currentUser._id})
    .then((docs)=>{
        return res.render("events/allClubEvents",{events:docs});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({"message":"Club Does Not Exist"});
    });
});


router.get('/events/add', clubAuth, function (req, res) {
    res.render("events/new-event");
});

router.post('/events/generateCertificate/:teamId/:categoryId',clubAuth,function(req,res){
    Event.findOne({club_id:req.currentUser._id,"categories._id":req.params.categoryId},{"categories.$":1,"end_date":1,event_name:1,club_id:1})
    .then((event)=>{
        if(!event)
        {
            return res.status(403).send({"message":"No Such Events Conducted"});
        }
        else
            {
               // console.log(Date.now());
                // console.log(event.end_date);
                if(moment(Date.now()).isSameOrAfter(event.end_date)){
                Team.findOne({_id:req.params.teamId,"events_participated.cat_id":req.params.categoryId},
                {"events_participated.$":1,team_name:1,owner_name:1,participants:1,certificates:1})
                .then((team)=>{
                    if(team){
                    let fileName = Date.now() + team.team_name + '.pdf';
                    //console.log(team);
                    team.certificates.push({club_id:event.club_id,cat_id:req.params.categoryId,src:'event-certificates/' + fileName });
                    team.save((err,success)=>{
                        if(err)
                        {
                            console.log(err);
                            return res.status(403).send({"message":"cannot generate certificate"});
                        }
                        else
                        {
                            makeCertificate(event.event_name,event.categories[0].category_name,
                                team.team_name,req.currentUser.name,fileName,team.owner_name.name,team.participants,success._id);
                            return res.status(200).send({"message":"Certificate Generated Successfully"});
                        }
                    });
                    }
                    else
                        {
                            return res.status(403).send({"message":"Team not registered for the Event"});
                        }
                })
                .catch((err)=>{
                    console.log(err);
                    return res.status(403).send({"message":"Invalid Request"});
                })
            }
            else
            {
                return res.status(403).send({"message":"Certificate Can only be generated after end of Event"});
            }
            }
    })
    .catch((err)=>{
        return res.status(403).send({"message":"Error Occured"});
    });
});

router.get('/issuedCertificates',clubAuth,function(req,res){
    Team.find({"certificates.club_id":req.currentUser._id},{"certificates.$":1})
    .then((docs)=>{
        return res.render("clubs/allCertificates",{certificates:docs});
        // return res.send({certificates:docs});
    })
    .catch((err)=>{
        return res.status(403).send({"message":err});
    });
});

router.get('/issuedCertificates/:certificateId',clubAuth,function(req,res){
    Team.find({ "certificates.club_id": req.currentUser._id, "certificates._id": ObjectId(req.params.certificateId)},{"certificates.$":1})
    .then((docs)=>{
        if(docs)
        {
            // return res.send({val:docs});
            // console.log(docs[0].certificates);
            // return res.sendFile('event-certificates/' + docs[0].certificates[0].src, {root:__dirname})
            var data = fs.readFileSync(docs[0].certificates[0].src);
            res.contentType('application/pdf');
            return res.send(data);
        }
        return res.status(404).send({"message":"File Not Found"});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({"message":"No Such certificate"});
    });
});


router.get('/events/:eventId',clubAuth,function(req,res){
    Event.findOne({_id:req.params.eventId,club_id:req.currentUser._id})
    .then((docs)=>{
        return res.render("events/showClubEvent",{event:docs});
    })
    .catch((err)=>{
        res.status(403).send({"message":"Error Occured"});
    });
});


router.post('/events',clubAuth,function(req,res){
    // console.log("Reached Here");
    // console.log(req.body.data);
    let data = req.body.data;
    let event = new Event({
        "event_name":data.event_name,
        "club_id":req.currentUser._id,
        "start_date":data.start_date,
        "end_date":data.end_date,
        "reg_deadline":data.reg_deadline,
        "description.venue":data.venue,
        "description.misc_details":data.misc_details,
        "description.prizes_worth":data.prizes_worth,
    });
    Event.create(event).then(suc=>{
       // console.log(suc);
       // console.log("Event Save Success");
        return res.send({"message":"Event Added Successfully"});
    }).catch(err=>{
        console.log(err);
        return res.send({"message":"Event Addition Failed"});
    })
});

router.get('/events/:eventId/addCategory',clubAuth,function(req,res){
    Event.findOne({_id:req.params.eventId,club_id:req.currentUser._id})
    .then((docs)=>{
        if(docs)
        {
            return res.render("events/addCategory",{event:docs});
        }
        else
            {
                return res.status(403).send({"message":"No Such Event"});
            }
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({ "message": "No Such Event" });
    });
});

router.post('/events/:eventId/addCategory',clubAuth,function(req,res){
    Event.findOneAndUpdate({ _id:req.params.eventId, club_id:req.currentUser._id },{"$push":{categories:req.body.data.category}},{new:true},function(err,docs){
        if(err)
        {
            console.log(err);
            return res.status(403).send({"message":" Failed to Add a New Category. Try Again "});
        }
        else{
            if(docs)
            {
                console.log("Success");
                return res.render("events/showClubEvent",{event:docs});
            }
            else
            {
                return res.status(403).send({"message":" No Such Event Exists for this user "});
            }

        }
    });
});

router.post('/events/:eventId/addImage',clubAuth,uploadImages.single('imageData'),function(req,res){
   // console.log(req);
    Event.findOne({_id:req.params.eventId,club_id:req.currentUser._id})
    .then((docs)=>{
        if(!docs)
        {
            return res.status(403).send({"message":"No Such Event Exist"});
        }
        else
            {
                let obj = {image_src:'event-images/'+req.file.filename,caption:"Howdy"};
                Gallery.findOneAndUpdate({event_id:req.params.eventId},{"$push":{image_links:obj}},{upsert:true,new:true})
                .then((result)=>{
                    return res.status(200).send({"message":"Image Uploaded Successfully"});
                })
                .catch((err=>{
                    return res.status(403).send({"message":err});
                }));
            }
    })
    .catch((err)=>{
        return res.status(403).send({ "message": err });
    });
});

router.get('/images/:eventId/:imageLink/',clubAuth,function(req,res){
    Event.findOne({_id:req.params.eventId,club_id:req.currentUser._id})
    .then((docs)=>{
        if(!docs)
        {
            return res.status(403).send({"message":"Error Occured"});
        }
        else
            {
                
            }
    })
});

module.exports = router;