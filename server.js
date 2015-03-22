var http = require('http'),
    swig = require('swig'),
    io = require('socket.io'),
    express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    session = require('express-session');

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
app.get('/home', function(req, res, next){

    var object = { text : 'sometext' };
    res.render('home', object);
});

server.listen(app.get('port'), function(){
  console.log('express server listening in port : ' + app.get('port'));
});
