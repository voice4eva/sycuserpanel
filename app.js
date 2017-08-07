// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./routes/users');
const dbConf = require('./conf/db');

// Database connect
mongoose.connect(dbConf.db, {useMongoClient:true});
mongoose.connection.on('connected', ()=>{console.log("Database connected: " + dbConf.db);});
mongoose.connection.on('error', (err)=>{console.log("Database error: " + err);});

// App and port number
const app = express();
const port = 3000;

// Middleware: CORS, body parser, passport
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./conf/passport')(passport);

// Client folder
app.use(express.static(path.join(__dirname, 'client')));

// Users
app.use('/users', users);

// Index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Start server
app.listen(port, ()=>{
  console.log("Server started on port: " + port);
});
