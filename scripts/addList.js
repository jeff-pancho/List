$(document).ready(function(){
    $("#add-list").click(addList);
});

function addList() {
    let listGroupItem = $("<li class=\"list-group-item\">TEST</li>");
    $(".list-group").append(listGroupItem);
    console.log("List created.");

    $(".no-lists").hide();
}