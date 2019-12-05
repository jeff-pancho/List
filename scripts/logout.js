$(function() {
    $("#logout").click(function(e) {
        e.preventDefault();
        firebase.auth().signOut().then(function () {
            window.location = "./index.html";
        }).catch(function (error) {
            console.log(error);
        });
    })
})
