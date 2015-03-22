var http = require('http'),
    swig = require('swig'),
    io = require('socket.io'),
    express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    session = require('express-session');

var Schema = mongoose.Schema;
//setting db
mongoose.connect('mongodb://localhost/fileuploader');
//linking schema
var dbSchema = require('./schema.js').database(Schema, mongoose);


var app = express();

var server = http.createServer(app);
io = io.listen(server);

//setting swig
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('view cache', false);
swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret-fileuploader-test',
  resave: false,
  saveUninitialized: false
}));

app.set('views', __dirname + '/templates');
app.set('port', process.env.PORT || 3000);

//routes
app.get('/home/:message?', function(req, res, next){
    var message = req.params.message || '';
    res.render('home', message);
});

app.post('/go_room', function(req, res, next){
    req.session.userName = req.body.username || {};
    req.session.password = req.body.password || {};

    UtilsDB.findChatter(req.session.userName, function(chatter){
        if(chatter && chatter.password){
            if(chatter.password != req.session.password){
                var object = { message : 'invalid credentials !!' };
                res.render('home' , object);
            }else{
                res.redirect('/room/');
            }
        }else{
            var object = { message : 'invalid user !!' };
            res.render('home' , object);
        }

    });
});

app.get('/room', function(req, res, next){
    res.send('you are in room now');
});

server.listen(app.get('port'), function(){
  console.log('express server listening in port : ' + app.get('port'));
});
