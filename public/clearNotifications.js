function clearNotifications() {
    var ref = firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/Notifications');
    ref.remove()
    .then(function() {
      console.log("Remove Successful");
    })
    .catch(function(e) {
      console.log("Remove Failed " + e)
    })
}