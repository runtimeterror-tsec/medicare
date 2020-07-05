function viewMyDoctors(){
    var currentPatient = firebase.auth().currentUser.email;
    var myDoctorsArray = [];
    var allPatients = [];
    return firebase.database().ref("Users").orderByChild('Usertype').equalTo('doctor').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }
        snapshot.forEach(function(userSnapshot) {
            // doctorsArray.push(userSnapshot);
            var doctorData = userSnapshot.val().Patients;
            for (var doctorEmail in doctorData) {
                // allPatients.push(doctorData[doctorEmail]);
                console.log("doctorEmail: " + doctorEmail)
                if (doctorEmail == firebase.auth().currentUser.uid) {
                    myDoctorsArray.push(userSnapshot.val().Email)
                }
            }
        
            // console.log("All Patients: " + allPatients);
            // for (var j in allPatients) {
            //     console.log(j[1]);
            // }
            // for (var patientEmail in allPatients) {
            //     console.log(patientEmail);
            //     // if (patientEmail == currentPatient) {
            //     //     myDoctorsArray.push(patientEmail);
            //     // }
            // }
            
            // console.log(myDoctorsArray);
            
        })
            var rows = "";
            var i = 0; 
            $.each(myDoctorsArray, function(){
                var email = myDoctorsArray[i];
                console.log(email);
                rows += "<tr><td>" + email + "</td><td><button class='btn btn-danger' onclick='getRevokeDoctorEmail("+(i+1)+")'>Revoke Access</button></td></tr>"
                i = i + 1;
            });
            $("#myDoctorsList tbody").empty();
            $( rows ).appendTo( "#myDoctorsList tbody" );                
            

    }) ;
}

function getRevokeDoctorEmail(i){
    table = document.getElementById("myDoctorsList");
    tr = table.getElementsByTagName("tr");
    td = tr[i].getElementsByTagName("td")[0];
    doctorEmail = td.textContent || td.innerText;
    console.log(doctorEmail);


    firebase.database().ref('Users').orderByChild('Email').equalTo(doctorEmail).once('value').then(function(snapshot) {
        if (snapshot) {
          snapshot.forEach(function(userSnapshot) {
            var key = userSnapshot.key;

                      var ref1 = firebase.database().ref(
                          "Users/".concat(key,"/Patients")
                      );
                      ref1.update({
                          [firebase.auth().currentUser.uid]: null});
                    
                        
          })
        }
        else {
          console.log("No snapshout found");

        }
      });

      window.location.href = '/revoke_doctor/' + doctorEmail + '/' + firebase.auth().currentUser.email;
    
  }
