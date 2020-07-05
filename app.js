//jshint esversion:6
const express = require("express");
const path = require('path');
const ipfsAPI = require('ipfs-api');
var fs = require('fs');
// import CloudConvert from 'cloudconvert';
// const cloudConvert = new CloudConvert('api_key');
const ejs = require("ejs");
const bodyParser = require("body-parser");
var request = require('request-promise');
var firebase = require('firebase');
const {
  PDFDocument
} = require('pdf-lib')
const http = require("http");

var appp = firebase.initializeApp({
  apiKey: "AIzaSyAEP62nznSL2MKrxZwlBypP_ydRsvRsubQ",
  authDomain: "mediccare-717b3.firebaseapp.com",
  databaseURL: "https://mediccare-717b3.firebaseio.com",
  projectId: "mediccare-717b3",
  storageBucket: "mediccare-717b3.appspot.com",
  messagingSenderId: "370407773684"
});
const NodeRSA = require('node-rsa');
const key = new NodeRSA({
  b: 512
});
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {
  protocol: 'https'
})

const baseUrl = 'http://127.0.0.1:5001/';

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

app.get("/mergeFiles/:file1/:file2/:sender/:useruid", function (req, res) {
  var file1 = 'https://gateway.ipfs.io/ipfs/' + req.params.file1;
  var file2 = 'https://gateway.ipfs.io/ipfs/' + req.params.file2;
  var sender = req.params.sender;
  var useruid = req.params.useruid;
 
  request.get(file1).pipe(fs.createWriteStream('file1.pdf'));
 request.get(file2).pipe(fs.createWriteStream('file2.pdf'));

 setTimeout(() => {
    res.redirect('/fileMerged/' + sender + '/' + useruid);
}, 12000);
    
 
});


app.get('/fileMerged/:sender/:useruid', async function(req, res) {
  const content =  await PDFDocument.load(fs.readFileSync('./file2.pdf'));
    
   const doc = await PDFDocument.create();
   
    const cover = await PDFDocument.load(fs.readFileSync('./file1.pdf'));
    const contentPages1 = await doc.copyPages(cover, cover.getPageIndices());
    for (const page of contentPages1) {
      doc.addPage(page);
    }
   
   const contentPages2 = await doc.copyPages(content, content.getPageIndices());
   for (const page of contentPages2) {
     doc.addPage(page);
   }
   

   fs.writeFileSync('./merged.pdf', await doc.save());

   const userEmail = req.params.sender;
  const useruid = req.params.useruid;
  // console.log(req.body.fileUpload.val());
  let testFile = fs.readFileSync("./merged.pdf");
  let testBuffer = new Buffer(testFile);
  ipfs.files.add(testBuffer, function (err, file) {
    if (err) {
      console.log(err);
    }
    var hash = file[0].hash;
    const validCID = hash.toString();
    console.log("File Uploaded Successfully: " + hash);
    const data = new Uint8Array(Buffer.from(hash));

    firebase.database().ref('Users').orderByChild('Email').equalTo(userEmail).once('value').then(function (snapshot) {
      if (snapshot) {
        snapshot.forEach(function (userSnapshot) {
          setTimeout(() => {
            var loggedinuser = userEmail;
            console.log(loggedinuser);
            firebase.database().ref('Users/' + useruid).child('fileHash').once("value")
              .then(function (snapshot) {
                var numberOfNotificationss = snapshot.numChildren();
                var key = userSnapshot.key;

                var ref1 = firebase.database().ref(
                  "Users/".concat(key, "/fileHash")
                );
                ref1.remove()
                .then(function() {
                  console.log("Remove Successful");
                })
                .catch(function(e) {
                  console.log("Remove Failed " + e)
                })

                var ref = firebase.database().ref(
                  "Users/".concat(key, "/fileHash")
                );
                ref.update({
                  [0]: hash
                });


              });
          }, 2000);


        })
        setTimeout(() => {
          var data = { // this variable contains the data you want to send
            sender: userEmail,
            data: hash,
          }
          var options = {
            method: 'POST',
            uri: baseUrl + 'add_transaction',
            body: data,
            json: true // Automatically stringifies the body to JSON
          };

          var returndata;
          var sendrequest = request(options)
            .then(function (parsedBody) {
              console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
              returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
            })
            .catch(function (err) {
              console.log(err);
            });

          console.log(returndata);

          fs.unlinkSync('file1.pdf');
          fs.unlinkSync('file2.pdf');
          fs.unlinkSync('merged.pdf');


          res.redirect("/patient");

        }, 500)

      }
    });

  })
})

app.get('/view_report/:sender', function(req, res) {
  setTimeout(() => {
    var data = { // this variable contains the data you want to send
      sender: req.params.sender,
    }
    var options = {
      method: 'POST',
      uri: baseUrl + 'fetchpatient',
      body: data,
      json: true // Automatically stringifies the body to JSON
    };

    var returndata;
    var sendrequest = request(options)
      .then(function (parsedBody) {
        console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
        returndata = parsedBody;
        res.redirect('https://gateway.ipfs.io/ipfs/' + parsedBody.fileUrl);
        // do something with this data, here I'm assigning it to a variable.
      })
      .catch(function (err) {
        console.log(err);
      });

    console.log(returndata);

    // res.redirect("/patient");

  }, 500)

})

app.get('/revoke_doctor/:doctor/:sender', function(req, res){
  setTimeout(() => {
    var data = { // this variable contains the data you want to send
      sender: req.params.sender,
      doctor: req.params.doctor
    }
    var options = {
      method: 'POST',
      uri: baseUrl + 'revoke',
      body: data,
      json: true // Automatically stringifies the body to JSON
    };

    var returndata;
    var sendrequest = request(options)
      .then(function (parsedBody) {
        console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
        returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
      })
      .catch(function (err) {
        console.log(err);
      });

    console.log(returndata);

    res.redirect("/patient");

  }, 500)

})


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/patient", function (req, res) {
  res.sendFile(path.join(__dirname + '/patient.html'));

})
app.get("/insurance", function (req, res) {
  res.sendFile(path.join(__dirname + '/insurance.html'));

})

app.get("/doctor", function (req, res) {
  res.sendFile(path.join(__dirname + '/doctor.html'));

})


app.get("/pharmacy", function (req, res) {
  res.sendFile(path.join(__dirname + '/pharmacy.html'));

})

app.get("/admin", function (req, res) {
  res.sendFile(path.join(__dirname + '/admin.html'));
})

app.get("/encrypter", function (req, res) {
  var pair = keypair();
  console.log(pair);
  fs.writeFile('privatekey.txt', pair.private, function (err) {
    if (err) return console.log(err);
    console.log('Success');
  });
  fs.writeFile('publickey.txt', pair.public, function (err) {
    if (err) return console.log(err);
    console.log('Success');
  });

})



// app.post("/", function (req, res) {
//   console.log(req.body.emailfield)
//   const text = req.body.emailfield;
//   const encrypted = key.encrypt(text, 'base64');
//   console.log('encrypted: ', encrypted);
//   console.log('Key: '  +  key)

//   setInterval(() => {
//     firebase.database().ref('Users').orderByChild('Email').equalTo(req.body.emailfield).once('value').then(function (snapshot) {
//       if (snapshot) {
//         snapshot.forEach(function (userSnapshot) {
//           var email = userSnapshot.val().Email;
//           var Key = userSnapshot.key;
//           // var user = firebase.auth().getUser(key);
//           var ref = firebase.database().ref(
//             "Users/".concat(Key, "/")
//           );
//           ref.update({
//             "Public Key": key.exportKey('public'),
//             "Private Key" : key.exportKey('private')
//           });
//         })
//       } else {
//         console.log("No snapshout found");
//       }


//     });
//   }, 1000)

// })



app.post("/patientupload", function (req, res) {
  const userEmail = req.body.loggedinuser;
  const useruid = req.body.useruid;
  console.log(userEmail);
  // console.log(req.body.fileUpload.val());
  let testFile = fs.readFileSync("./" + req.body.fileUpload);
  let testBuffer = new Buffer(testFile);
  ipfs.files.add(testBuffer, function (err, file) {
    if (err) {
      console.log(err);
    }
    var hash = file[0].hash;
    const validCID = hash.toString();
    console.log("File Uploaded Successfully: " + hash);
    const data = new Uint8Array(Buffer.from(hash));

    firebase.database().ref('Users').orderByChild('Email').equalTo(userEmail).once('value').then(function (snapshot) {
      if (snapshot) {
        snapshot.forEach(function (userSnapshot) {
          setTimeout(() => {
            var loggedinuser = userEmail;
            console.log(loggedinuser);
            firebase.database().ref('Users/' + useruid).child('fileHash').once("value")
              .then(function (snapshot) {
                var numberOfNotificationss = snapshot.numChildren();
                var key = userSnapshot.key;

                var ref = firebase.database().ref(
                  "Users/".concat(key, "/fileHash")
                );
                ref.update({
                  [numberOfNotificationss]: hash
                });


              });
          }, 2000);


        })
        setTimeout(() => {
          var data = { // this variable contains the data you want to send
            sender: userEmail,
            data: hash,
          }
          var options = {
            method: 'POST',
            uri: baseUrl + 'add_transaction',
            body: data,
            json: true // Automatically stringifies the body to JSON
          };

          var returndata;
          var sendrequest = request(options)
            .then(function (parsedBody) {
              console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
              returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
            })
            .catch(function (err) {
              console.log(err);
            });

          console.log(returndata);

          res.redirect("/patient");

        }, 500)

      }
    });



    // ipfs.files.get(validCID, function (err, files) {
    //     files.forEach((file) => {
    //       console.log("Decrypted" + file.content.toString('utf8'));
    //       // console.log(file.path)
    //       // console.log(file.content.toString('utf8'))
    //     })
    //   })


  })

})

app.get('/grant/:doctorEmail/:senderEmail', function (req, res) {
  setTimeout(() => {
    var data = { // this variable contains the data you want to send
      sender: req.params.senderEmail,
      doctor: req.params.doctorEmail,
    }
    var options = {
      method: 'POST',
      uri: baseUrl + 'grant',
      body: data,
      json: true // Automatically stringifies the body to JSON
    };

    var returndata;
    var sendrequest = request(options)
      .then(function (parsedBody) {
        console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
        returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
      })
      .catch(function (err) {
        console.log(err);
      });

    console.log(returndata);

    res.redirect("/patient");

  }, 500)

})

app.get('/fetch/:patientEmail/:currentUser', function (req, res) {
  console.log(req.params.patientEmail);
  console.log(req.params.currentUser);
  setTimeout(() => {
    var data = { // this variable contains the data you want to send
      sender: req.params.patientEmail,
      doctor: req.params.currentUser,
    }
    var options = {
      method: 'POST',
      uri: baseUrl + 'fetch',
      body: data,
      json: true // Automatically stringifies the body to JSON
    };

    var returndata;
    var sendrequest = request(options)
      .then(function (parsedBody) {
        console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
        res.redirect('https://gateway.ipfs.io/ipfs/' + parsedBody.fileUrl);
        returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
      })
      .catch(function (err) {
        console.log(err);
      });

    console.log(returndata);


  }, 500)

})

app.post('/doctorupload', function (req, res) {
  console.log(req.body.loggedinuser);
  var patientuid = req.body.patientuid;
  var patientEmail = req.body.patientEmail;
  let testFile = fs.readFileSync("./" + req.body.fileUpload);
  let testBuffer = new Buffer(testFile);
  ipfs.files.add(testBuffer, function (err, file) {
    if (err) {
      console.log(err);
    }
    var hash = file[0].hash;
    const validCID = hash.toString();
    console.log("File Uploaded Successfully: " + hash);
    const data = new Uint8Array(Buffer.from(hash));

    //FIrebase
    firebase.database().ref('Users').orderByChild('Email').equalTo(patientEmail).once('value').then(function (snapshot) {
      if (snapshot) {
        snapshot.forEach(function (userSnapshot) {
          setTimeout(() => {
            firebase.database().ref('Users/' + patientuid).child('fileHash').once("value")
              .then(function (snapshot) {
                var numberOfNotificationss = snapshot.numChildren();
                var key = userSnapshot.key;

                var ref = firebase.database().ref(
                  "Users/".concat(key, "/fileHash")
                );
                ref.update({
                  [numberOfNotificationss]: hash
                });

                firebase.database().ref('Users/' + patientuid).child('Notifications').once("value")
                  .then(function (snapshot) {
                    var numberOfNotificationsss = snapshot.numChildren();
                    var key = userSnapshot.key;
                    var ref = firebase.database().ref(
                      "Users/".concat(key, "/Notifications")
                    );
                    var notification = "Doctor " + req.body.doctorEmail + " has updated your report";
                    ref.update({
                      [numberOfNotificationsss]: notification
                    });
                  })



              });
          }, 2000);


        })

      }
    });
  })

  res.redirect('/doctor')
});

app.get("/writefile", function (req, res) {
  const data = new Uint8Array(Buffer.from('Hello Node'));
  fs.writeFile('encrypted.txt', data, (err) => {
    if (err) throw err;
    res.send('The file has been saved!');
  });
})

app.get("/readFile", function (req, res) {
  fs.readFile('encrypted.txt', 'utf8', function (err, data) {

    // Display the file content 
    res.send(data);
    fs.unlinkSync('encrypted.txt');

  });

})

//Blockchain Routes

app.get("/mine_block", function (req, res) {
  req.connection.setTimeout(1000 * 60 * 10); // ten minutes
  setTimeout(() => {
    res.redirect(301, baseUrl + 'mine_block');
  }, 1000)

})

app.get("/get_chain", function (req, res) {
  req.connection.setTimeout(1000 * 60 * 10); // ten minutes

  setTimeout(() => {
    res.redirect(301, baseUrl + 'get_chain');

  }, 1000)

})

app.get("/is_valid", function (req, res) {
  res.redirect('https://127.0.0.1:5003/is_valid');

})


app.get('/connect_node', async function (req, res) {
  var data = { // this variable contains the data you want to send
    sender: "foo",
    receiver: "bar",
    amount: 100
  }
  var options = {
    method: 'POST',
    uri: 'http://127.0.0.1:5003/connect_node',
    body: data,
    json: true // Automatically stringifies the body to JSON
  };

  var returndata;
  var sendrequest = await request(options)
    .then(function (parsedBody) {
      console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
      returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
    })
    .catch(function (err) {
      console.log(err);
    });

  res.send(returndata);
});

app.get("/replace_chain", function (req, res) {
  res.redirect('http://127.0.0.1:5003/replace_chain');

})

app.get("/test", function (req, res) {
  var options = {
    method: 'GET',
    uri: 'http://127.0.0.1:5001/mine_block',
    json: true // Automatically stringifies the body to JSON
  };

  var returndata;
  var sendrequest = request(options)
    .then(function (parsedBody) {
      console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
      returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
    })
    .catch(function (err) {
      console.log(err);
    });

  var options = {
    method: 'GET',
    uri: 'http://127.0.0.1:5001/mine_block',
    json: true // Automatically stringifies the body to JSON
  };

  var returndata;
  var sendrequest = request(options)
    .then(function (parsedBody) {
      console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
      returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
    })
    .catch(function (err) {
      console.log(err);
    });
  var options = {
    method: 'GET',
    uri: 'http://127.0.0.1:5001/mine_block',
    json: true // Automatically stringifies the body to JSON
  };

  var returndata;
  var sendrequest = request(options)
    .then(function (parsedBody) {
      console.log(parsedBody); // parsedBody contains the data sent back from the Flask server
      returndata = parsedBody; // do something with this data, here I'm assigning it to a variable.
    })
    .catch(function (err) {
      console.log(err);
    });
  res.redirect('/');
})





app.listen(3000, function () {
  console.log("Server started on port 3000");
});