
function insuranceNotifications() {
    var insuranceNotificationsArray = [];
    return firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Notifications').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }
        snapshot.forEach(function(userSnapshot) {
            insuranceNotificationsArray.push(userSnapshot);
        })
            var rows = "";
            var i = 0; 
            $.each(insuranceNotificationsArray, function(){
                var notification = insuranceNotificationsArray[i].val();
                rows += "<tr><td>" + notification + "</td><td><button class='btn btn-primary' onclick='getNotificationsReport("+(i+1)+")'>View</button></td><td><button class='btn btn-success' onclick='sendNotification()'>Accept</button></td><td><button class='btn btn-danger' onclick='rejectNotification()'>Reject</button></td></tr>";
                i = i + 1;
            });
            $("#insuranceNotificationsList tbody").empty();

            $( rows ).appendTo( "#insuranceNotificationsList tbody" );                
            

    }) ;
}

function sendNotification() {
    return firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Notifications').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }




        snapshot.forEach(function(userSnapshot) {
            console.log("Key" + userSnapshot.key);
            firebase.database().ref('Users/' + userSnapshot.key + '/Notifications').once('value').then(function(userrsnapshot) {
                console.log(userrsnapshot.numChildren());
                var ref = firebase.database().ref(
                    "Users/".concat(userSnapshot.key, "/Notifications")
                );
                ref.update({
                    [userrsnapshot.numChildren()] : "Insurance Firm " + firebase.auth().currentUser.email + " has accepted your insurance claim."
                })
            })
            
            // firebase.database().ref("Users/" + userSnapshot.key).once('value').then(function(snapshott) {
            //     var ref = firebase.database().ref(
            //         "Users/".concat(snapshott.val(), "/fileHash")
            //       );
            //       ref.update({
            //         [0]: hash
            //       });
            //     window.location.href = '/fetch/' + snapshott.val().Email + '/' + firebase.auth().currentUser.email;

            // })

        })
        firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Notifications').once('value').then(function(snapshot) {
    
            snapshot.forEach(function(userSnapshot) {
                console.log(userSnapshot.key);
                firebase.database().ref("Users/" + userSnapshot.key).once('value').then(function(snapshott) {
                    var patientEmail = snapshott.val().Email;
                    firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/Claims').once('value').then(function(count) {
                        var ref = firebase.database().ref(
                            "Users/".concat(firebase.auth().currentUser.uid, "/Claims")
                        );
                        ref.update({
                            [count.numChildren()] : patientEmail
                        })
                    })
                   
    
                })
    
            })
                
    
        }) ;
            

    }) ;
  
}
function rejectNotification() {
    return firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Notifications').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }




        snapshot.forEach(function(userSnapshot) {
            console.log("Key" + userSnapshot.key);
            firebase.database().ref('Users/' + userSnapshot.key + '/Notifications').once('value').then(function(userrsnapshot) {
                console.log(userrsnapshot.numChildren());
                var ref = firebase.database().ref(
                    "Users/".concat(userSnapshot.key, "/Notifications")
                );
                ref.update({
                    [userrsnapshot.numChildren()] : "Insurance Firm " + firebase.auth().currentUser.email + " has rejected your insurance claim."
                })
            })
            
            // firebase.database().ref("Users/" + userSnapshot.key).once('value').then(function(snapshott) {
            //     var ref = firebase.database().ref(
            //         "Users/".concat(snapshott.val(), "/fileHash")
            //       );
            //       ref.update({
            //         [0]: hash
            //       });
            //     window.location.href = '/fetch/' + snapshott.val().Email + '/' + firebase.auth().currentUser.email;

            // })

        })
            

    }) ;
}
function getNotificationsReport(i) {
    // table = document.getElementById("insuranceNotificationsList");
    // tr = table.getElementsByTagName("tr");
    // td = tr[i].getElementsByTagName("td")[0];
    // clickedPatient = td.textContent || td.innerText;
    // console.log(clickedPatient);

    return firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Notifications').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }




        snapshot.forEach(function(userSnapshot) {
            console.log(userSnapshot.key);
            firebase.database().ref("Users/" + userSnapshot.key).once('value').then(function(snapshott) {
                window.location.href = '/fetch/' + snapshott.val().Email + '/' + firebase.auth().currentUser.email;

            })

        })
            

    }) ;




}

