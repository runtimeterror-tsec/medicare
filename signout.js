function signout(){
    firebase.auth().signOut();
    window.location.href = "index.html"
  }