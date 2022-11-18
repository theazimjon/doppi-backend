const admin = require("firebase-admin");

const serviceAccount = require("./doppi-951be-firebase-adminsdk-omijx-c8952842aa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;