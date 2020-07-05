
function viewAllDoctors(){
    console.log("viewAllDoctors() Entered");
    //var ref = firebase.database().ref("Company-Details").child('Dealers');
    var doctorsArray = [];
    //var dealerscontent = document.getElementById("dealers-list");
    return firebase.database().ref("Users").orderByChild('Usertype').equalTo('doctor').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }
        snapshot.forEach(function(userSnapshot) {
            doctorsArray.push(userSnapshot);
        })
            var rows = "";
            var i = 0; 
            $.each(doctorsArray, function(){
                var email = doctorsArray[i].val().Email;
                console.log(email);
                rows += "<tr><td>" + doctorsArray[i].val().Name + "</td><td class='ml-2'>" + doctorsArray[i].val().Email +"</td><td class='ml-2'>" + doctorsArray[i].val().Qualification + "</td><td class='ml-2'>" + doctorsArray[i].val().Specialization + "</td><td class='ml-2'><button class='btn btn-primary ml-3' onclick='getDoctorEmail("+(i)+")'>Give Access</button></td></tr>";
                i = i + 1;
            });
            $("#allDoctorsList tbody").empty();
            $( rows ).appendTo( "#allDoctorsList tbody" );                
            

    }) ;
}

function getDoctorEmail(i){
    table = document.getElementById("allDoctorsList");
    tr = table.getElementsByTagName("tr");
    td = tr[i].getElementsByTagName("td")[1];
    doctorEmail = td.textContent || td.innerText;


    firebase.database().ref('Users').orderByChild('Email').equalTo(doctorEmail).once('value').then(function(snapshot) {
        if (snapshot) {
          snapshot.forEach(function(userSnapshot) {
            var key = userSnapshot.key;
            var ref = firebase.database().ref("Users/".concat(key,"/Notifications"));

            ref.once("value")
            .then(function(snapshot) {
                        var numberOfNotifications = snapshot.numChildren();
                        var ref2 = firebase.database().ref(
                            "Users/".concat(key,"/Notifications")
                        );
                        ref2.update({
                            [numberOfNotifications + 1]: 'Patient ' + firebase.auth().currentUser.email + ' has granted you access.' 
                        })
                        });

                      var ref1 = firebase.database().ref(
                          "Users/".concat(key,"/Patients")
                      );
                      ref1.update({
                          [firebase.auth().currentUser.uid]: firebase.auth().currentUser.email});
                    
                        
          })
        }
        else {
          console.log("No snapshout found");

        }
      });

      window.location.href = '/grant/'+ doctorEmail + '/' + firebase.auth().currentUser.email;
  }

   


  


