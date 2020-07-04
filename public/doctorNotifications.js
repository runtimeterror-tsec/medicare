
function doctorNotifications() {
    var doctorNotificationsArray = [];
    //var dealerscontent = document.getElementById("dealers-list");
    return firebase.database().ref("Users/" + firebase.auth().currentUser.uid + '/Notifications').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }
        snapshot.forEach(function(userSnapshot) {
            doctorNotificationsArray.push(userSnapshot);
        })
        console.log(doctorNotificationsArray);
            var rows = "";
            var i = 0; 
            $.each(doctorNotificationsArray, function(){
                var notification = doctorNotificationsArray[i].val();
                rows += "<tr><td>" + notification + "</td></tr>";
                i = i + 1;
            });
            $("#doctorNotificationsList tbody").empty();

            $( rows ).appendTo( "#doctorNotificationsList tbody" );                
            

    }) ;
}