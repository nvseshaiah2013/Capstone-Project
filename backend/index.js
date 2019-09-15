const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');


const app = express();

app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/styles', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/js1',express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js2',express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/',routes);


app.listen(3000,'localhost',function(){
    console.log("Server listening on port 3000");
}); 