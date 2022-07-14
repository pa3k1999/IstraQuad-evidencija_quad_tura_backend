const express = require("express");
const app = express();
const cors = require('cors');

var admin = require("firebase-admin");
var serviceAccount = require("./firebaseKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://evidencija-tura-default-rtdb.europe-west1.firebasedatabase.app"
});

app.use(cors());

app.get('/novi-user', (req, res) => {
  const email = req.headers['email'];
  const lozinka = req.headers['lozinka'];
  const isAdmin = req.headers['isadmin'];
  if(isAdmin === 'true'){
    admin.auth().createUser({
      email: email,
      password: lozinka,
      disabled: false,
    }).then(async(userCredential) => {
      console.log('novi user dodan (admin)')
      res.send(userCredential);
      admin.auth().setCustomUserClaims(userCredential.uid, {admin: true})
    })
  } else {
    admin.auth().createUser({
      email: email,
      password: lozinka,
      disabled: false,
    }).then(async(userCredential) => {
      console.log('novi user dodan (premium)')
      res.send(userCredential);
      admin.auth().setCustomUserClaims(userCredential.uid, {premiumAccount: true})
    })
  }
})

app.get('/novi-user-convert', (req, res) => {
    const uid = req.headers['uid'];
    admin.auth().setCustomUserClaims(uid, {premiumAccount: true}).then(console.log('converted'))
  
})

app.delete('/obrisi-vodica', (req, res) => {
  const uid = req.headers['uid'];
  admin.auth().deleteUser(uid)
  .then(() => {
    console.log('Vodic obrisan');
    res.send(true);
  })
  .catch((e) => {
    console.log('Error deleting user:', e);
    res.send(false);
  });
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