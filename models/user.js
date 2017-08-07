// Dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dbConf = require('../conf/db');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  events: {
    type: Array
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

// Get User by ID
module.exports.getUserById = (id, callback)=>{
  User.findById(id, callback);
}

// Get User by Username
module.exports.getUserByUsername = (username, callback)=>{
  const query = {username: username};
  User.findOne(query, callback);
}

// Add User
module.exports.addUser = (newUser, callback)=>{
  // hash password
  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(newUser.password, salt, (err, hash)=>{
      if(err){
        console.log(err);
      }
      // assign hash to user password property and save in DB
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// Add Event
module.exports.addEvent = (id, eventData, callback)=>{
  const query = {_id: id};
  const addEvent = {$push: {"events": { "event_name": eventData.event_name, "date": eventData.date }}};
  User.updateOne(query,addEvent,callback);
}

// Compare Password
module.exports.comparePassword = (enteredPassword, hash, callback)=>{
  bcrypt.compare(enteredPassword, hash, (err, isMatch)=>{
    if(err) throw err;
    callback(null, isMatch);
  });
}
