function usersignup() {
    console.log("Clicked");
    // var db = firebase.firestore();
    var name = document.getElementById("name").value;
    var email = document.getElementById("emailfield").value;
    var password = document.getElementById("passwordfield").value;
    var usertype = $('input[name=usertype]:checked').val();

    firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(user) {
    var user = firebase.auth().currentUser;
    var userid = user.uid;
    firebase.database().ref("Users").child(userid).set({
        Name: name,
        Email: email,
        Usertype : usertype
    });
})
.catch(function(error) {
// no `if (error)` is needed here: if `catch` is called, there was an error
var errorCode = error.code;
var errorMessage = error.message;

window.alert("There went something wrong : " + errorMessage);
    // db.collection("Users").doc(userid).set({
    //     Name: name,
    //     Email: email,
    //     Userytpe: usertype
    // })
    // .then(function() {
    //     console.log("Document successfully written!");
    // })
    // .catch(function(error) {
    //     console.error("Error writing document: ", error);
    // });
  });



}