var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/fileuploader');

var dbSchema = require('../schema.js').database(Schema, mongoose);

var chatterTB = new ChatterTB({name: 'rigoberto', email: 'rigoxls@gmail.com', password: '123456', nickname : 'rigo'});
    chatterTB.save(function(err){
     if(!err){
      console.log('new user registered');
      return;
     }else{
      console.log('error');
     }
    });