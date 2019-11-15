$(document).ready(function() {
    console.log("BRUHHHHHHHHHHH!");

    // when user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        console.log("SUP");
    });
});