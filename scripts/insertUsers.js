var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//setting db
mongoose.connect('mongodb://localhost/fileuploader');

//linking schema
var dbSchema = require('../schema.js').database(Schema, mongoose);

//inserting users
var user1 = new ChatterTB({
    name: 'francis',
    email: 'francis@test.com',
    password: '123456',
    nickname : 'frank'
});

user1.save(function(err){
   if(!err){
       console.log('new user registered');
       return;
    }else{
        console.log('error');
    }});


var user2 = new ChatterTB({
    name: 'denial',
    email: 'denial@test.com',
    password: '123456',
    nickname : 'denial'
});

user2.save(function(err){
   if(!err){
       console.log('new user registered');
       return;
    }else{
        console.log('error');
    }});

var user3 = new ChatterTB({
    name: 'drake',
    email: 'drake@test.com',
    password: '123456',
    nickname : 'drake'
});

user3.save(function(err){
   if(!err){
       console.log('new user registered');
       return;
    }else{
        console.log('error');
    }});