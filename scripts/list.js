$(document).ready(function(){
    //pointer to the list container
    var listContainer = $("#list-container");
    //pointer to the container that holds the create list button
    var createList = $("#create-list-container");
    //pointer to the create list button
    var createListButton = $("#create-list");
    //pointer to the container that tells you if there are no lists
    var noLists = $("#no-lists");
    
    //if user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        //pointer to the user's list collection
        let lists = db.collection("users").doc(user.uid).collection("lists");

        //capture a snapshot of the lists collection
        lists.get().then(function(doc){
            //execute a function for each child of the lists collectin
            doc.forEach(function(child){
                hideNoLists();

                //append before #create-list-container
                let listItem = $("<li class=\"list-group-item border-0\">New List</li>");
                $(listItem).insertBefore(createList)
            });
        });
    });

    $(createListButton).click(addList);
    function addList() {
        hideNoLists();
        
        //append before #create-list-container
        let listItem = $("<li class=\"list-group-item border-0\">New List</li>");
        $(listItem).insertBefore(createList)

        //add new list to database
        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users").doc(user.uid).collection("lists").add({
                "name": "test",
                "status": "active"
            });
        });
    }

    function hideNoLists() {
        //hide #no-lists if it's still visible
        if($(noLists).is(":visible")) {
            $(noLists).hide();
        }
    }
});