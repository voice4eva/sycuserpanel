// Dependencies
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const conf = require('../conf/db');

// Register
router.post('/register', (req, res, next)=>{
  // create new user
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  // add user
  User.addUser(newUser, (err, user)=>{
    if(err){
      res.json({success: false, msg: "Failed to register user"});
    } else {
      res.json({success: true, msg: "User has been registered"});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) =>{
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.comparePassword(password, user.password, (err, isMatch)=>{
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, conf.secret, {
          expiresIn: 86400 // 1 day
        });
        res.json({
          success: true,
          token: 'JWT '+ token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
  res.json({user: req.user});
});

// Events
router.post('/events', (req, res, next)=>{
  const id = req.body.id;
  const eventName = req.body.event;
  User.getUserById(id, (err, user) =>{
    if(err){
      return res.json({success: false, msg: 'Something went wrong with your event registration'});
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.addEvent(id, eventName, (err, success)=>{
      if(err) throw err;
      if(success){
        return res.json("You are registered for the following event: " + eventName.event_name + ", on " + eventName.date);
      }
    });
  })
});

module.exports = router;
