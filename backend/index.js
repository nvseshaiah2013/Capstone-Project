const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');
const routes = require('./routes');


const app = express();

app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/css',express.static(__dirname + '/semantic'));
app.use('/',routes);


app.listen(3000,'localhost',function(){
    console.log("Server listening on port 3000");
}); 
