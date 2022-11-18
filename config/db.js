// Requiring firebase (as our db)
const firebase = require('firebase');// Importing our configuration to initialize our app
const config = require('./firebase_config.js');// Creates and initializes a Firebase app instance. Pass options as param
const db = firebase.initializeApp(config.firebaseConfig);module.exports = db;

module.exports = db;