$(document).ready(function(){
    //pointer to the list container
    var listContainer = $("#list-container");
    //pointer to the container that holds the create list button
    var createList = $("#create-list-container");
    //pointer to the create list button
    var createListButton = $("#create-list");
    //pointer to the container that tells you if there are no lists
    var noLists = $("#no-lists");
    
    $(createListButton).click(addList);

    function addList() {
        //hide #no-lists if it's still visible
        if($(noLists).is(":visible")) {
            $(noLists).hide();
        }
        
        let listItem = $("<li class=\"list-group-item\">New List</li>");
        $(listItem).insertBefore(createList)

        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users").doc(user.uid).collection("lists").doc("newList").set({
                "name": "test",
                "status": "active"
            });
        });
    }
});