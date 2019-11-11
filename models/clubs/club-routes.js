const express = require('express');
const router = express();
const Club = require('./club');
const Event = require('../events/event');
const Gallery = require('../image-gallery/image-gallery');
const Student = require('../students/student');
const clubAuth = require('../../middleware/clubauth');
const adminAuth = require('../../middleware/adminauth');
const VideoGallery = require('../video-gallery/video-gallery');
const Feedback = require('../feedback/feedback');
const Team = require('../teams/teams');
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;
const dateValidate = require('../../validations/dateValidation');


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
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPEG|PNG|GIF|JPG)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const uploadImages = multer({ storage: storage, fileFilter: imageFileFilter });


//Addition of Club by Admin

router.get('/add', adminAuth, function (req, res) {
    res.render("clubs/clubNew");
});

router.post('/add', function (req, res) {
    let club = new Club({
        "name": req.body.data.club_name,
        "username": req.body.data.username,
        "password": req.body.data.password,
        "desc.found_date": req.body.data.found_date,
        "desc.ceo": req.body.data.ceo,
        "contact.address": req.body.data.address
    });
    Club.findOne({ name: req.body.data.club_name }).then(succ => {
        if (!succ) {
            Club.findOne({ username: req.body.data.username }).then(suc => {
                if (!suc) {
                    club.save(function (err, product) {
                        if (err)
                            return res.status(403).send({ "message": "Error Occured" + err }).end();
                    });
                    console.log("Saved");
                    return res.status(200).send({ "message": "save Success!" }).end();
                }
                else {
                    console.log("username already in use");
                    return res.status(403).send({ "message": "username already in use" }).end();
                }

            }).catch(err => {
                return res.status(403).send({ "message": "Error Occured" + err }).end();
            });
        }
        else {
            console.log("Name Exists");
            return res.status(403).send({ "message": "Club Name Already Exists" }).end();
        }

    }).catch(err => {
        console.log(err);
        return res.status(403).send({ "message": "Something wrong", "error": err }).end();
    })
    // return res.status(200).send("Successfully Reached End!").end();
});
router.get('/profile', clubAuth, function (req, res) {
    Club.findOne({ _id: req.currentUser._id }, { password: 0 })
        .then((club) => {
            if (club) {
                return res.render("clubs/profile", { profile: club });
            }
            else {
                return res.status(403).send({ "message": "No Such Club Found" });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ "message": "Profile Fetch Error Occured" });
        });
})

    ;
router.get('/founders', clubAuth, function (req, res) {
    Club.findOne({ _id: req.currentUser._id }, { "desc.founders": 1 })
        .then((founder) => {
            return res.status(200).send({ founders: founder });
        })
        .catch((err) => {
            return res.status(403).send({ "message": "Error" });
        })
});

router.post('/addFounder', clubAuth, function (req, res) {
    Club.findOneAndUpdate({ _id: req.currentUser._id }, { "$push": { "desc.founders": req.body.data.founder } }, { new: true })
        .then((docs) => {
            return res.render("clubs/profile", { club: docs });
        })
        .catch((err) => {
            console.log(err);
            return res.status(403).send({ "message": "Founder Addition Failed" });
        });
});

router.get('/members', clubAuth, function (req, res) {
    Club.findOne({ _id: req.currentUser._id }, { "desc.members": 1 })
        .then((member) => {
            return res.status(200).send({ members: member });
        })
        .catch((err) => {
            console.log(err);
            return res.status(403).send({ "message": "Error" });
        })
});

router.post('/addMember', clubAuth, function (req, res) {
    Student.findOne({ regn_no: req.body.data.regn_no })
        .then((student) => {
            if (student && req.body.data.secretToken === student.secretToken) {
                let obj = {
                    name: student.name,
                    regn_no: student.regn_no
                };
                Club.findByIdAndUpdate(req.currentUser._id, { "$push": { "desc.members": obj } }, { new: true })
                    .then((club) => {
                        return res.render("clubs/profile", { club: club });
                    })
                    .catch((err) => {
                        return res.status(403).send({ "message": "Member Addition Error" });
                    })
            }
            else {
                return res.status(403).send({ "message": "No Such Student" });
            }
        })
        .catch((err) => {
            return res.status(403).send({ "message": "Member Addition Failed" });
        })
});

router.post('/sendNotification/:studentId', clubAuth, function (req, res) {
    let data = req.body.data;
    let notification = {
        heading: data.heading,
        text: data.text
    };
    Student.findOneAndUpdate({ regn_no: req.params.studentId }, { "$push": { notifications: notification } }, (err, result) => {
        if (err) {
            return res.status(403).send({ "message": "Cannot send Notification" });
        }
        else {
            return res.status(200).send({ "message": "Notification Sent" });
        }
    });
});

router.get('/notifications', clubAuth, function (req, res) {
    Club.findById(req.currentUser._id, { notifications: 1 })
        .then((notifications) => {
            return res.status(200).send({ notifications: notifications });
        })
        .catch((err) => {
            console.log("Notifications: " + err);
            return res.status(403).send({ "message": "error fetching notifications" });
        })
});

router.get('/login', function (req, res) {
    res.render("clubs/login");
});

router.post('/signout', clubAuth, function (req, response) {
    //console.log(tok);
    Club.findOneAndUpdate({ _id: req.currentUser._id }, { "$pull": { activeTokens: req.currentUser.token } }, (err, res) => {
        if (err) {
            console.log(err);
            return response.status(403).send({ "message": "Error Logging Out" });
        }
        else {
            return response.status(200).send({ "message": "SignOut Success" });
        }
    });
    //return res.send("Hello");
});


router.post('/login', function (req, res) {
    Club.findOne({ username: req.body.username }).then(succ => {
        if (succ) {
            succ.comparePwd(req.body.password, function (err, result) {
                if (err) throw err;
                if (result) {
                    succ.genJWT(function (err, token) {
                        if (err)
                            return res.status(401).send("Some Problem Occured");
                        else {
                            Club.findOneAndUpdate({ username: req.body.username }, { "$push": { activeTokens: token } })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(401).render("clubs/login", { "message": "Wrong Credentials - Check Username Password Again" });
                                });
                            return res.status(200).render("clubs/dashboard", { auth: token, club: succ });
                        }
                    });
                }
                else {
                    return res.status(401).render("clubs/login", { "message": "Wrong Credentials  - Check Username Password Again" });
                }
            });
        }
        else {
            return res.status(401).render("clubs/login", { "message": "Wrong Credentials - Check Username Password Again" });
        }
    }).catch(err => {
        console.log(err);
        return res.status(401).render("clubs/login", { "message": "Wrong Credentials  - Check Username Password Again" });
    });
});

router.get('/events', clubAuth, function (req, res) {
    Event.find({ club_id: req.currentUser._id })
        .then((docs) => {
            return res.render("clubs/allClubEvents", { events: docs });
        })
        .catch((err) => {
            console.log(err);
            return res.status(403).send({ "message": "Club Does Not Exist" });
        });
});


router.get('/events/add', clubAuth, function (req, res) {
    res.render("events/new-event");
});

router.post('/events/generateCertificate/:teamId/:categoryId', clubAuth, function (req, res) {
    Event.findOne({ club_id: req.currentUser._id, "categories._id": req.params.categoryId }, { "categories.$": 1, "end_date": 1, event_name: 1, club_id: 1 })
        .then((event) => {
            if (!event) {
                return res.status(403).send({ "message": "No Such Events Conducted" });
            }
            else {
                // console.log(Date.now());
                // console.log(event.end_date);
                if (moment(Date.now()).isSameOrAfter(event.end_date)) {
                    Team.findOne({ _id: req.params.teamId, "events_participated.cat_id": req.params.categoryId },
                        { "events_participated.$": 1, team_name: 1, owner_name: 1, participants: 1, certificates: 1 })
                        .then((team) => {
                            if (team) {
                                let fileName = Date.now() + team.team_name + '.pdf';
                                //console.log(team);
                                team.certificates.push({ club_id: event.club_id, cat_id: req.params.categoryId, src: 'event-certificates/' + fileName });
                                team.save((err, success) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(403).send({ "message": "cannot generate certificate" });
                                    }
                                    else {
                                        makeCertificate(event.event_name, event.categories[0].category_name,
                                            team.team_name, req.currentUser.name, fileName, team.owner_name.name, team.participants, success._id);
                                        return res.status(200).send({ "message": "Certificate Generated Successfully" });
                                    }
                                });
                            }
                            else {
                                return res.status(403).send({ "message": "Team not registered for the Event" });
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(403).send({ "message": "Invalid Request" });
                        })
                }
                else {
                    return res.status(403).send({ "message": "Certificate Can only be generated after end of Event" });
                }
            }
        })
        .catch((err) => {
            return res.status(403).send({ "message": "Error Occured" });
        });
});

router.get('/issuedCertificates', clubAuth, function (req, res) {
    Team.find({ "certificates.club_id": req.currentUser._id }, { "certificates.$": 1 })
        .then((docs) => {
            return res.render("clubs/allCertificates", { certificates: docs });
            // return res.send({certificates:docs});
        })
        .catch((err) => {
            return res.status(403).send({ "message": err });
        });
});

router.get('/issuedCertificates/:certificateId', clubAuth, function (req, res) {
    Team.find({ "certificates.club_id": req.currentUser._id, "certificates._id": ObjectId(req.params.certificateId) }, { "certificates.$": 1 })
        .then((docs) => {
            if (docs) {
                // return res.send({val:docs});
                // console.log(docs[0].certificates);
                // return res.sendFile('event-certificates/' + docs[0].certificates[0].src, {root:__dirname})
                var data = fs.readFileSync(docs[0].certificates[0].src);
                res.contentType('application/pdf');
                return res.send(data);
            }
            return res.status(404).send({ "message": "File Not Found" });
        })
        .catch((err) => {
            console.log(err);
            return res.status(403).send({ "message": "No Such certificate" });
        });
});

router.post('/events', clubAuth, function (req, res) {
    let data = req.body.data;
    //console.log(data);
    if (!dateValidate.sameOrAfterToday(data.start_date) || !dateValidate.sameOrAfterToday(data.end_date)
        || !dateValidate.sameOrAfterToday(data.reg_deadline)) {
        //console.log("Inside 1");
        return res.status(403).send({ "message": "Invalid Dates" });
    }
    // console.log(data);
    if (!(dateValidate.sameBefore(data.reg_deadline, data.start_date) && dateValidate.sameBefore(data.start_date, data.end_date))) {
        // console.log("after 2");
        return res.status(403).send({ "message": "Invalid Dates" });
    }
    //console.log(data);
    let event = new Event({
        "event_name": data.event_name,
        "club_id": req.currentUser._id,
        "start_date": data.start_date,
        "end_date": data.end_date,
        "reg_deadline": data.reg_deadline,
        "description.venue": data.venue,
        "description.misc_details": data.misc_details,
        "description.prizes_worth": data.prizes_worth,
    });
    Event.create(event).then(suc => {
        // console.log(suc);
        // console.log("Event Save Success");
        return res.status(200).send({ "message": "Event Added Successfully" });
    }).catch(err => {
        console.log(err);
        return res.status(200).send({ "message": "Event Addition Failed" });
    })
});

router.get('/events/addCategoryModal', clubAuth, function (req, res) {
    return res.render("events/addCategoryModal");
});

router.get('/events/:eventId', clubAuth, function (req, res) {
    Event.findOne({ _id: req.params.eventId, club_id: req.currentUser._id })
        .then((docs) => {
            return res.render("events/showClubEvent", { event: docs });
        })
        .catch((err) => {
            res.status(403).send({ "message": "Error Occured" });
        });
});

router.get('/events/:eventId/addCategory', clubAuth, function (req, res) {
    Event.findOne({ _id: req.params.eventId, club_id: req.currentUser._id })
        .then((docs) => {
            if (docs) {
                return res.render("events/addCategory", { event: docs });
            }
            else {
                return res.status(403).send({ "message": "No Such Event" });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(403).send({ "message": "No Such Event" });
        });
});

router.post('/events/:eventId/addCategory', clubAuth, function (req, res) {
    console.log(req.body.data);
    Event.findOneAndUpdate({ _id: req.params.eventId, club_id: req.currentUser._id }, { "$push": { categories: req.body.data } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err);
            return res.status(403).send({ "message": " Failed to Add a New Category. Try Again " });
        }
        else {
            if (docs) {
                console.log("Success");
                return res.render("events/addCategory", { event: docs });
            }
            else {
                return res.status(403).send({ "message": " No Such Event Exists for this user " });
            }

        }
    });
});

router.get('/events/:categoryId/registeredTeams', clubAuth, function (req, res) {
    Event.findOne({ club_id: req.currentUser._id, "categories._id": req.params.categoryId })
        .then((event) => {
            if (!event) {
                return res.status(403).send({ "message": "error" });
            }
            else {
                Team.find({ "events_participated.cat_id": req.params.categoryId }, { team_name: 1, owner_name: 1 }, (err, teams) => {
                    if (err) {
                        return res.status(403).send({ "message": "Error" });
                    }
                    else {
                        return res.render("clubs/registeredTeams", { teams: teams });
                    }
                });
            }
        })
        .catch((err) => {
            return res.status(403).send({ "message": "error" });
        });
});

router.post('/images/:eventId/addImage', clubAuth, uploadImages.single('imageData'), function (req, res) {
    // console.log(req);
    Event.findOne({ _id: req.params.eventId, club_id: req.currentUser._id })
        .then((docs) => {
            if (!docs) {
                return res.status(403).send({ "message": "No Such Event Exist" });
            }
            else {
                // console.log(req.body);
                // console.log(req.body.data);
                let obj = { image_src: 'event-images/' + req.file.filename, caption: req.body.caption };
                Gallery.findOneAndUpdate({ event_id: req.params.eventId }, { "$push": { image_links: obj } }, { upsert: true, new: true })
                    .then((result) => {
                        return res.status(200).send({ "message": "Image Uploaded Successfully" });
                    })
                    .catch((err => {
                        return res.status(403).send({ "message": err });
                    }));
            }
        })
        .catch((err) => {
            return res.status(403).send({ "message": err });
        });
});

router.post('/images/:eventId/getImage', clubAuth, function (req, res) {
    // console.log("jere" + req.body.data);
    Event.findOne({ _id: req.params.eventId, club_id: req.currentUser._id })
        .then((docs) => {
            if (!docs) {
                return res.status(403).send({ "message": "Error Occured" });
            }
            else {
                //console.log(image_links.image_src.split('.'));
                Gallery.findOne({ event_id: req.params.eventId, "image_links.image_src": req.body.data }, { "image_links.$": 1 })
                    .then((images) => {
                        if (!images) {
                            return res.status(403).send({ "message": "Error occured" });
                        }
                        // console.log(images.image_links[0]);
                        var ext = path.extname(images.image_links[0].image_src);
                        fs.readFile(images.image_links[0].image_src, 'base64', (err, image) => {
                            const dataURL = '<div class="card"><div class="image"><img src="data:image/' + ext.toLowerCase().split('.')[1] + ';base64, ' + image
                            +'" alt="Image Loading" ></div><div class="content"><a class="header">' + images.image_links[0].caption + "</a></div></div>" ;
                               return res.status(200).send(dataURL);
                        });


                    })
                    .catch((err) => {
                        return res.status(403).send({ "message": "Error Sending File " + err });
                    })
            }
        });
});

router.get('/images/:eventId/all', clubAuth, function (req, res) {
    Event.findOne({ _id: req.params.eventId, club_id: req.currentUser._id }, { image_links: 1 })
        .then((docs) => {
            if (!docs) {
                return res.status(403).send({ "message": "Error Occured" });
            }
            else {
                Gallery.findOne({ event_id: req.params.eventId })
                    .then((images) => {
                        return res.status(200).render("clubs/clubImages", { imageList: images });
                    })
            }
        }).catch((err) => {
            return res.status(404).send({ "message": "error" });
        })
});

router.get('/images/galleryPage', clubAuth, function (req, res) {
    Event.find({ club_id: req.currentUser._id }, { _id: 1, event_name: 1 })
        .then((events) => {
            return res.render("clubs/clubImageGallery", { events: events });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ "message": "Some Error Occured" });
        })
});

module.exports = router;