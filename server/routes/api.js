/**
 * api code file
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const item = require('../models/item.js');
const user = require('../models/user.js');
const secret = 'this is the secret secret secret 12356'; // same secret as in socket.js used here to sign the authentication token
//get the file with the socket api code
const socket = require('./socket.js');

/*
 * POST User sign in. User Sign in POST is treated here
 */
exports.Authenticate =  (req, res) =>  {
  console.log('Received Authentication POST');
  var body = req.body;
  //if user valid
  var token = jwt.sign(req.body, secret);
  res.json({ username:req.body.username, token: token });
  console.log('Replied with the token: ', token);
  //if user not valid
  //res.status(401).send('Wrong user or password');

  /* Data base findOne example:

  user.findOne({$and:[{username:body.username},{password:body.password}]}, (err, User) =>{
       if (err) {
        //there was an error in the database
       }
       if (User != null){ //user exists update to is logged = true and send token response
       }
       else {
       //user does not exist
       }
    });*/

/* Data base updateOne example:

user.updateOne({username : body.username}, {$set:{islogged: true }}, (err, result)=>{
          if(err){
           //there was an error in the database
          }
          if(result){
            //user was updated
          }
        });
*/

/* Log error example:
    console.error("User updated");
*/

};

/*
 * POST User registration. User registration POST is treated here
 */
exports.NewUser =  (req, res) => {
  console.log("received form submission new user");
  console.log(req.body);
  // check if username already exists
  //If it still does not exist
  //create a new user
 /* database create example
           user.create({ name : req.body.name, email : req.body.email, username: req.body.username,
              password: req.body.password, islogged: false } , (err, newUser) => {
                if (err) {
                 //database error occurred
                } else {
                 //created a new user here is how to send a JSON object with the user to the client
                res.json({
                           name: newUser.name,
                           email: newUser.email,
                           username: newUser.username,
                           password: newUser.password
                          });
                //sends back a client user Type object (does not have the isLogged field) corresponding to the logged in user
               }
        });
 */
   //reply with the created user in a JSON object (for now is filled with dummy values
   res.json({
                           name: "somename",
                           email: "some@somemail.com",
                           username: "someusername",
                           password: "somepassword"
                          });

   //it the user already exist reply with error
   //res.status(401).send('User name already exists');
};

/*
 * POST Item creation. Item creation POST is treated here
 */
exports.NewItem =  (req, res) => {
  console.log("received form submission new item");
	console.log(req.body);
  //check if item already exists using the description field if not create item;
  /*   item.findOne({...}, (err, ExistingItem) =>{
            if (err) {
                //there was an error in the database
            }
            if (ExistingItem != null){ //item exists
            }
            else {
                //item does not exist
                item.create({...
            }
       });*/
  // send the Item as a response in the format of the Item.ts class in the client code (for now with dummy values)
  res.json({
            description: "somedescription",
            currentbid: "somecurrentbid",
            remainingtime: "someremainingtime",
            wininguser: "somewininguser"
            });
  //broadcast the new item to all clients using the Websocket connections
  //socket.NewItemBroadcast(newItem);
  //If an item with the same description already exists send error
  //res.status(404).send('An Item with the same description already exists');
};


/*
GET to obtain all active items in the database
*/
exports.GetItems = (req, res) => {

// Dummy items just for example you should send the items that exist in the database
    let item1 = new item({description:'Smartphone',currentbid:250, remainingtime:120, buynow:1000, wininguser:'dummyuser1'});
    let item2 = new item({description:'Tablet',currentbid:300, remainingtime:120, buynow:940, wininguser:'dummyuser2'});
    let item3 = new item({description:'Computer',currentbid:120, remainingtime:120, buynow:880, wininguser:'dummyuser3'});
    let Items = [item1,item2,item3];
    res.json(Items); //send array of existing active items in JSON notation
    console.log ("received get Items call responded with: ", Items);
};

