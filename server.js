const express = require("express");
const app = express();
const cors = require('cors');

const wList = ['http://localhost:3000'];

var corsOptions = {
  origin: function (origin, callback) {
    if(wList.indexOf(origin) !== -1) {
      callback(null, true);
    } else{
      callback(new Error("Not allowed by CROS!!!"));
    }
  }
}

var admin = require("firebase-admin");
var serviceAccount = require("./firebaseKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://evidencija-tura-default-rtdb.europe-west1.firebasedatabase.app"
});

app.use(cors(corsOptions));

app.get('/novi-user', (req, res) => {
  const email = req.headers['email'];
  const lozinka = req.headers['lozinka'];
  admin.auth().createUser({
    email: email,
    password: lozinka,
    disabled: false,
  }).then(async(userCredential) => {
    console.log('novi user dodan')
    res.send(userCredential);
    admin.auth().setCustomUserClaims(userCredential.uid, {premiumAccount: true})
  })
})

app.get('/novi-user-convert', (req, res) => {
    const uid = req.headers['uid'];
    admin.auth().setCustomUserClaims(uid, {premiumAccount: true}).then(console.log('converted'))
  
})

// app.get('/server', (req, res) => {
//   const uid = req.headers['uid'];
//   const additionalClaims = {
//     premiumAccount: true,
//   }
//   console.log(uid);
//   admin.auth()
//   .createCustomToken(uid, additionalClaims)
//   .then((customToken) => {
//     res.send(customToken);
//   })
//   .catch((error) => {
//     console.log('Error creating custom token:', error);
//   });
  
// })

app.listen(4000);