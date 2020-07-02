//jshint esversion:6
const express = require("express");
const path = require('path');
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const ejs = require("ejs");
const bodyParser = require("body-parser");
var firebase = require('firebase');
var appp = firebase.initializeApp({ apiKey: "AIzaSyAEP62nznSL2MKrxZwlBypP_ydRsvRsubQ",
authDomain: "mediccare-717b3.firebaseapp.com",
databaseURL: "https://mediccare-717b3.firebaseio.com",
projectId: "mediccare-717b3",
storageBucket: "mediccare-717b3.appspot.com",
messagingSenderId: "370407773684" });
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
  });

app.get("/patient", function(req, res) {
  res.sendFile(path.join(__dirname+'/patient.html'));

})
app.get("/insurance", function(req, res) {
  res.sendFile(path.join(__dirname+'/insurance.html'));

})

app.get("/doctor", function(req, res) {
  res.sendFile(path.join(__dirname+'/doctor.html'));

})


app.get("/pharmacy", function(req, res) {
  res.sendFile(path.join(__dirname+'/pharmacy.html'));

})

// app.get("/success", function(req, res) {
//   res.render("success");
  
// })

app.post("/", function(req, res) {
  // const post = {
  //   email: req.body.emailfield,
  // }
  console.log(req.body.emailfield)
//   const { generateKeyPair } = require('crypto');
// generateKeyPair('rsa', {
//   modulusLength: 4096,
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem',
//     cipher: 'aes-256-cbc',
//     passphrase: req.body.emailfield
//   }
// }, (err, publicKey, privateKey) => {
//   // Handle errors and use the generated key pair.
//   if (!err) {
//     console.log("Public Key: " + publicKey + "\nPrivate Key: " + privateKey)
//   }
//   else{
//     console.log(err)
//   }
// });
const text = req.body.emailfield;
const encrypted = key.encrypt(text, 'base64');
console.log('encrypted: ', encrypted);
const decrypted = key.decrypt(encrypted, 'utf8');
console.log('decrypted: ', decrypted);
setInterval(() => {
  firebase.database().ref('Users').orderByChild('Email').equalTo(req.body.emailfield).once('value').then(function(snapshot) {
    if (snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var email = userSnapshot.val().Email;
        var key = userSnapshot.key;
                 // var user = firebase.auth().getUser(key);
                  var ref = firebase.database().ref(
                      "Users/".concat(key,"/")
                  );
                  ref.update({"Key":encrypted});
  
        // firebase.database().ref("Users").child(userid).set({
        //   Email: email,
        //   Usertype : usertype,
        //   Distributor_Email : distributor_email
        //   });
      })
    }
    else {
      console.log("No snapshout found");
    }
    
  
  });
}, 1000)

})

app.post("/patientupload", function(req, res) {
  // console.log(req.body.fileUpload.val());
  let testFile = fs.readFileSync("./" + req.body.fileUpload);
  let testBuffer = new Buffer(testFile);
  ipfs.files.add(testBuffer, function (err, file) {
    if (err) {
      console.log(err);
    }
    var hash = file[0].hash;
      const validCID = hash.toString();
      console.log("Encrypted" + hash);

    ipfs.files.get(validCID, function (err, files) {
        files.forEach((file) => {
          console.log("Decrypted" + file.content.toString('utf8'));
          // console.log(file.path)
          // console.log(file.content.toString('utf8'))
        })
      })
    

  })
  
})



  // app.post("/compose", function(req, res) {
  //   const post = {
  //     title: req.body.newPostTitle,
  //     content: req.body.newPostBody
  //   }
  //   posts.push(post);
  //   res.redirect("/");
  // })













app.listen(3000, function() {
  console.log("Server started on port 3000");
});
