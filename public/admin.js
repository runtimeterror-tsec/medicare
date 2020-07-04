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
                rows += "<tr><td>" + email + "</td><td><button class='btn btn-primary ml-3' onclick='getDoctorEmail("+(i)+")'>Edit</button></td><td><button class='btn btn-danger ml-3'>Delete</button></td></tr>";
                i = i + 1;
            });

            $( rows ).appendTo( "#allDoctorsList tbody" );                
            

    }) ;
}

function viewAllPatients(){
    console.log("viewAllDoctors() Entered");
    //var ref = firebase.database().ref("Company-Details").child('Dealers');
    var doctorsArray = [];
    //var dealerscontent = document.getElementById("dealers-list");
    return firebase.database().ref("Users").orderByChild('Usertype').equalTo('patient').once('value').then(function(snapshot) {
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
                rows += "<tr><td>" + email + "</td><td><button class='btn btn-primary ml-3'>Edit</button></td><td><button class='btn btn-danger ml-3'>Delete</button></td></tr>";
                i = i + 1;
            });

            $( rows ).appendTo( "#allPatientsList tbody" );                
            

    }) ;
}

function viewAllInsurance(){
    console.log("viewAllDoctors() Entered");
    //var ref = firebase.database().ref("Company-Details").child('Dealers');
    var doctorsArray = [];
    //var dealerscontent = document.getElementById("dealers-list");
    return firebase.database().ref("Users").orderByChild('Usertype').equalTo('insurance').once('value').then(function(snapshot) {
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
                rows += "<tr><td>" + email + "</td><td><button class='btn btn-primary ml-3'>Edit</button></td><td><button class='btn btn-danger ml-3'>Delete</button></td></tr>";
                i = i + 1;
            });

            $( rows ).appendTo( "#allInsuranceList tbody" );                
            

    }) ;
}

function viewAllMedical(){
    console.log("viewAllDoctors() Entered");
    //var ref = firebase.database().ref("Company-Details").child('Dealers');
    var doctorsArray = [];
    //var dealerscontent = document.getElementById("dealers-list");
    return firebase.database().ref("Users").orderByChild('Usertype').equalTo('pharmacy').once('value').then(function(snapshot) {
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
                rows += "<tr><td>" + email + "</td><td><button class='btn btn-primary ml-3' >Edit</button></td><td><button class='btn btn-danger ml-3'>Delete</button></td></tr>";
                i = i + 1;
            });

            $( rows ).appendTo( "#allMedicalList tbody" );                
            

    }) ;
}

function getDoctorEmail(i) {
    table = document.getElementById("allDoctorsList");
    tr = table.getElementsByTagName("tr");
    td = tr[i].getElementsByTagName("td")[0];
    doctorEmail = td.textContent || td.innerText;
    console.log(doctorEmail);

    $('#updateDoctorModal').modal('show');
    document.getElementById('updateEmail').value = doctorEmail;

    doctorsArray = [];
    return firebase.database().ref("Users").orderByChild('Email').equalTo(doctorEmail).once('value').then(function(snapshot) {
        snapshot.forEach(function(userSnapshot) {
            doctorsArray.push(userSnapshot);
        })
            var i = 0; 
            $.each(doctorsArray, function(){
                var email = doctorsArray[i].val().Email;
                var name = doctorsArray[i].val().Name;
                var qualification = doctorsArray[i].val().Qualification;
                var specialization = doctorsArray[i].val().Specialization;
                i = i + 1;
            });
            


    }) ;
    $('#submitUpdateForm').click(function() {
        updateDoctorValues(doctorEmail);
    })
}

function updateDoctorValues(currentUserEmail) {
    console.log("Clicked");
    var currentUser = currentUserEmail;
    console.log(currentUser);
    var updatedEmail = document.getElementById('updateEmail').value;
    var updatedName = document.getElementById('updateName').value;
    var updatedSpecialization = document.getElementById('updateSpecialization').value;
    var updatedQualification = document.getElementById('updateQualification').value;
    var updatedContactNum = document.getElementById('updateContactNum').value;
    console.log(updatedSpecialization);
    firebase.database().ref('Users').orderByChild('Email').equalTo(currentUser).once('value').then(function(snapshot) {
        if(snapshot.exists()){
            snapshot.forEach(function(userSnapshot) {
                var key = userSnapshot.key;
               // var user = firebase.auth().getUser(key);
                var ref = firebase.database().ref(
                    "Users/".concat(key,"/")
                );
                ref.update({
                    "Email":updatedEmail,
                    "Name":updatedName,
                    "Specialization":updatedSpecialization,
                    "Qualification" : updatedQualification,
                    "Contact Number" : updatedContactNum
                });

                // user.delete().then(function() {
                   
                // });
                
              });
        }
            
        else{
            console.log("Else");
        }
           
           
});

}