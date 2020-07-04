function login(){

    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert("Error : " + errorMessage);

      // ...
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          //window.location.href = "dashboard.html"
          database = firebase.database();
          var Email = document.getElementById("email_field").value;
          var inputtypefield =$('input[name=usertype]:checked').val();
            //console.log();
            return database.ref('Users').orderByChild('Email').equalTo(Email).once('value').then(function(snapshot) {
              
              snapshot.forEach(function(userSnapshot) {
                var usertype = userSnapshot.val().Usertype;
                console.log(usertype);
                if(usertype=="doctor"){
                  window.location.href = "/doctor";
                }
                else if (usertype == "patient")
                {
                  window.location.href = "/patient";
                }
                else if (usertype == "insurance")
                {
                  window.location.href = "/insurance";
                }
                else if (usertype == "pharmacy") {
                  window.location.href = "/pharmacy"
                }
                else if (usertype == "admin") {
                  window.location.href = "/admin"
                }
                else{
                  //firebase.auth().currentUser.delete().then(function() {// User deleted.});
                  console.log("No usertype defined");
                }

              })

            });



      } else {
        // No user is signed in.
        console.log("Else");
      }

        //}
      });
  }

  