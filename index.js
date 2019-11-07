const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./db/db');
const routes = require('./routes');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/scripts',express.static(__dirname + '/views'));
app.use('/',routes);
app.set('secPort',3443);
const options = {
    key: fs.readFileSync(__dirname + '/certificates/key.pem'),
    cert: fs.readFileSync(__dirname + '/certificates/cert.pem'),
    passphrase:'nightlighton'
} 

var secureServer = https.createServer(options,app);

secureServer.listen(app.get('secPort'), () => {
    console.log('Server listening on port ', app.get('secPort'));
});

secureServer.on('error', () => { console.log("Error Starting secure server") });
secureServer.on('listening', ()=>{console.log("Server Started")});

app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    }
    else {
        res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    }
});


// app.listen(3000,'localhost',function(){ 
//     console.log("Server listening on port 3000");
// }); 
