$(document).ready(function() {
    let lists = db.collection("users").doc(user.uid).collection("lists")

    // when user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        
    });
});