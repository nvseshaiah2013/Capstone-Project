const Payment = require('./payment');
const router = require('express')();
const Event = require('../events/event');
const Team = require('../teams/teams');
const qs = require('querystring');
const checksum_lib = require('../../checksum/checksum');
const dotenv = require('dotenv');

dotenv.config();

port = 3443;
var PaytmConfig = {
    mid: process.env.mid,
    key:process.env.key,
    website:process.env.website
};

router.post('/pay/:teamId/:catId',function(req,res){
    Team.findOne({_id:req.params.teamId,"events_participated.cat_id":req.params.catId})
    .then((team)=>{
        if(team)
        {
            Event.findOne({"categories._id":req.params.catId},{"categories.$":1})
            .then((event)=>{
                if(event)
                {
                    var params = {};
                    params['MID'] = PaytmConfig.mid;
                    params['WEBSITE'] = PaytmConfig.website;
                    params['CHANNEL_ID'] = 'WEB';
                    params['INDUSTRY_TYPE_ID'] = 'Retail';
                    params['ORDER_ID'] = 'COLORS_' + new Date().getTime();
                    params['CUST_ID'] = (team._id).toString();
                    params['TXN_AMOUNT'] = (event.categories[0].amount).toString();
                    params['CALLBACK_URL'] = 'https://localhost:' + port + '/payments/pay/' + team._id + '/' + event.categories[0]._id + '/callback';
                    //params['EMAIL'] = 'abc@mailinator.com';
                    //params['MOBILE_NO'] = '7777777777';
                    checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {

                        var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
                        // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

                        var form_fields = "";
                        for (var x in params) {
                            form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
                        }
                        form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
                        res.end();
                    });
                }
                else
                {
                    return res.status(401).send({ "message": "You cannot pay for this event category" });

                }

            })
            .catch((err)=>{
                console.log(err);
                return res.status(401).send({ "message": "You cannot pay for this event category" });
            })
            

        }
        else
        {
            return res.status(401).send({ "message": "You cannot pay for this event." });
        }

    })
    .catch((err)=>{
        console.log(err);
        return res.status(401).send({"message":"You cannot pay for this event."});
    })
});


router.post('/pay/:teamId/:catId/callback',function(req,res){
    console.log(req.body);
    return res.send("Hello World");
});


module.exports = router;