function patientNotifications() {
    var patientNotificationsArray = [];
    //var dealerscontent = document.getElementById("dealers-list");
    return firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Notifications').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }
        snapshot.forEach(function(userSnapshot) {
            patientNotificationsArray.push(userSnapshot);
        })
            var rows = "";
            var i = 0; 
            $.each(patientNotificationsArray, function(){
                var notification = patientNotificationsArray[i].val();
                rows += "<tr><td>" + notification + "</td><td><button class='btn btn-primary' onclick='viewReport("+(i+1)+")'>View</button></td><td><button class='btn btn-primary' onclick='acceptReport("+(i+1)+")'>Accept</button></td><td><button class='btn btn-primary'>Reject</button></td></tr>";
                i = i + 1;
            });
            $("#patientNotificationsList tbody").empty();
            $( rows ).appendTo( "#patientNotificationsList tbody" );                
            

    }) ;
}

function viewReport(i){
    // table = document.getElementById("patientNotificationsList");
    // tr = table.getElementsByTagName("tr");
    // td = tr[i].getElementsByTagName("td")[1];
    // doctorEmail = td.textContent || td.innerText;
    firebase.database().ref('Users/' + firebase.auth().currentUser.uid).child('fileHash').once("value")
    .then(function(snapshot) {
      var lastFileHash = (snapshot.numChildren()) - 1;
      console.log(lastFileHash);
      var updatedFile = snapshot.val()[lastFileHash] ;
      location.href = 'https://gateway.ipfs.io/ipfs/' + updatedFile;
    //   var key = userSnapshot.key;
    //   console.log(snapshot.lastFileHash);
    //   var ref = firebase.database().ref(
    //     "Users/".concat(key, "/Notifications")
    //   );
    //   var notification = "Doctor " + req.body.doctorEmail + " has updated your report";
    //   ref.update({
    //     [numberOfNotificationsss]: notification
    //   });
    })
  }

  function acceptReport(i){
    // table = document.getElementById("patientNotificationsList");
    // tr = table.getElementsByTagName("tr");
    // td = tr[i].getElementsByTagName("td")[1];
    // doctorEmail = td.textContent || td.innerText;
    var urlArray = [];
    firebase.database().ref('Users/' + firebase.auth().currentUser.uid).child('fileHash').once("value")
    .then(function(snapshot) {
      
        snapshot.forEach(function(userSnapshot) {
            urlArray.push(userSnapshot.val());
        })
        console.log(urlArray);
        window.location.href = '/mergeFiles/' + urlArray[0] + '/' + urlArray[1] + '/' + firebase.auth().currentUser.email + '/' + firebase.auth().currentUser.uid;
    }) 
  }