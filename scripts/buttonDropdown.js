$(document).ready(function() {
    //Toggles between the up and down image for the dropdown button
    $(".drop-down-btn").click(function() {
        console.log("test")
        if ($(this).find(".up").is(":visible")) {
            $(".up").hide();
            $(".down").show();
        } else {
            $("up").show();
            $(".down").hide();
        }
    });
});