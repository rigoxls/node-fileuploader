var http = require('http'),
    swig = require('swig'),
    io = require('socket.io'),
    dl  = require('delivery'),
    fs  = require('fs');
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
                req.session.currentUser = chatter;
                res.redirect('/room/');
            }
        }else{
            var object = { message : 'invalid user !!' };
            res.render('home' , object);
        }

    });
});

app.get('/room', function(req, res, next){
    var currentUser = req.session.currentUser || null;
    if(currentUser){
        res.render('room', currentUser);
    }else{
        var object = { message : 'invalid user !!' };
        res.render('home' , object);
    }
});


// socket io connections
io.sockets.on('connection', function (socket) {

    //create an instance of delivery
    var delivery = dl.listen(socket);

    //get file from local
    delivery.on('receive.success',function(file){
        var fileExt = path.extname(file.name.toLowerCase()).substr(1);

        //just validate basic extensions for images
        if(fileExt == 'jpg' || fileExt == 'png' || fileExt == 'gif'){
            var pathImage = __dirname + '/public/photos/' + file.name;

            fs.writeFile(pathImage , file.buffer , function(err){
                if(err){
                    console.info('Error saving file.');
                }else{
                    if(socket.uEmail){
                        UtilsDB.savePicture(socket.uEmail, file.name, function(chatter){
                            console.info('File saved.');
                            console.info(chatter);
                            socket.emit('updatePicture', chatter);
                        });
                    }else{
                        console.info('error no UEmail defined');
                    }
                };
            });
        }else{
            var oMessage = { 'message' : "error file is not an image"};
            socket.emit('message', oMessage);
        }

    });

    socket.on('register', function(data){
        socket.uEmail = data;
    });

    socket.on('disconnect', function() {
        console.info('disconnect');
    });
});


server.listen(app.get('port'), function(){
  console.log('express server listening in port : ' + app.get('port'));
});
