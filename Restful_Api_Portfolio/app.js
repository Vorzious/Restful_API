var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
var db = mongoose.connect('mongodb://localhost/portfolioDB');
var Proj = require('./models/projectModel');

var app = express();
var port =  process.env.PORT || 8000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

projectRouter = require('./Routes/projectRoutes')(Proj);


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/api/projects', projectRouter);

// Home page.
app.get('/', function(req, res){
    res.send("Welcome to my Application!");
});


app.listen(port, function(){
    console.log("The application is running on Port number: " + port);
});
