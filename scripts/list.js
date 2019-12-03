$(document).ready(function(){
    // pointer to the list container
    const listContainer = $("#list-container");
    // pointer to the container that holds the create list button
    const createList = $("#create-list-container");
    // pointer to the create list button
    const createListButton = $("#create-list");
    // pointer to the container that tells you if there are no lists
    const noLists = $("#no-lists");
    // pointer to "Save Changes" button in modal form
    const saveChanges = $("#save-changes");
    // pointer to the "List name" form
    const listNameForm = $("#list-name");
    // pointer to the create task button inside the modal form
    const createTaskButton = $("#create-task");
    // pointer to the task field in the modal form
    const taskContainer = $("#task-container");
    // pointer to the "Task name" form
    const taskNameForm = $("#task-name-form");
    // pointer to the cancel button in the modal form for tasks
    const cancelCreateTasks = $("#cancel-create-tasks");
    
    
    //if user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        //pointer to the user's list collection
        let lists = db.collection("users").doc(user.uid).collection("lists");

        //capture a snapshot of the lists collection
        lists.get().then(function(doc){
            if (doc.size > 0) {
                hideNoLists();
                //execute a function for each child of the lists collectin
                doc.forEach(function(child){
                    //append before #create-list-container
                    createNewList();
                });
            }
        });
    });

    $(saveChanges).click(function() {
        // save the value of the input
        let listName = $(listNameForm).val();
        console.log(listName);

        // reset the value of input
        $(listName).val("");
    });

    $("#create-task-modal-form").click(function(e) {
        e.preventDefault();
    // $(createTaskButton).click(function() {
        // if the "Task name" form is filled out
        if ($(taskNameForm).val()) {
            let taskName = $(taskNameForm).val();
            // reset the form
            $(taskNameForm).val("");
            addTaskToForm(taskName);
        }
    });
    

    $(cancelCreateTasks).click(function() {
        $(taskContainer).empty();
    });

    function addTaskToForm(taskName) {
        let taskItem = $("#task-clone").clone().show();
        $(taskItem).find("span").html(taskName);
        // trash can button to delete itself
        $(taskItem).find("button").click(function() {
            $(this).parent().remove();
        });

        $(taskContainer).append(taskItem);
        // scroll the div down to the bottom after creating task
        $(taskContainer).scrollTop(1000000);
    }

    function addList(listName) {
        hideNoLists();
        
        //append before #create-list-container
        createNewList();

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

    //create the list element
    function createNewList() {
        let listItem = $("#list-clone").clone().show();
        $(listItem).find(".down").hide();

        $(listItem).insertBefore(createList);
    }
});