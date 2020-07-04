function viewAllInsurance(){
    console.log("viewAllDoctors() Entered");
    //var ref = firebase.database().ref("Company-Details").child('Dealers');
    var insuranceArray = [];
    //var dealerscontent = document.getElementById("dealers-list");
    return firebase.database().ref("Users").orderByChild('Usertype').equalTo('insurance').once('value').then(function(snapshot) {
        if (snapshot) {
            console.log("Snapshot exists");
        }
        else{
            console.log("Snapshot doesn't exists.")
        }
        snapshot.forEach(function(userSnapshot) {
            insuranceArray.push(userSnapshot);
        })
            var rows = "";
            var i = 0; 
            $.each(insuranceArray, function(){
                var email = insuranceArray[i].val().Email;
                console.log(email);
                rows += "<tr><td>" + email + "</td><td><button class='btn btn-primary ml-3' onclick='getInsuranceEmail("+(i)+")'>Request</button></td></tr>";
                i = i + 1;
            });
            $("#allInsuuanceList tbody").empty();
            $( rows ).appendTo( "#allInsuranceList tbody" );                
            

    }) ;
}

function getInsuranceEmail(i){
    table = document.getElementById("allInsuranceList");
    tr = table.getElementsByTagName("tr");
    td = tr[i].getElementsByTagName("td")[0];
    insuranceEmail = td.textContent || td.innerText;


    firebase.database().ref('Users').orderByChild('Email').equalTo(insuranceEmail).once('value').then(function(snapshot) {
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
                            [firebase.auth().currentUser.uid]: 'Patient ' + firebase.auth().currentUser.email + ' has requested to Claim Insurance.' 
                        })
                        });
                        
                        window.location.href = '/grant/'+ insuranceEmail + '/' + firebase.auth().currentUser.email;
   
          })
        }
        else {
          console.log("No snapshout found");

        }
      });
    
  }

   