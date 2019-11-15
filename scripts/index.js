$(document).ready(function () {
    var signup = document.getElementById("signup");
    var login = document.getElementById("firebaseui-auth-container");
    var loginDisplay = window.getComputedStyle(login);

    signup.addEventListener("click", function () {
        if (loginDisplay.getPropertyValue("display") == "none") {
            login.style.display = "block";
        } else {
            login.style.display = "none";
        }
    });
});