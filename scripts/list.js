$(document).ready(function(){
    // pointer to the list container
    const listContainer = $("#list-container");
    // pointer to the container that holds the create list button
    const createList = $("#create-list-container");
    // pointer to the create list button
    const createListButton = $("#create-list");
    // pointer to the container that tells you if there are no lists
    const noLists = $("#no-lists");
    // pointer to "Save Changes" button in list modal form
    const listSaveChanges = $("#list-save-changes");
    // pointer to the "List name" form
    const listNameForm = $("#list-name");
    // pointer to the create task button inside the modal form
    const createTaskButton = $("#create-task");
    // pointer to the task field in the modal form
    const taskContainer = $("#task-container");
    // pointer to the "Task name" form
    const taskNameForm = $("#task-name-form");
    // pointer to the "Save changes" button in task modal form
    const taskSaveChanges = $("#task-save-changes");
    // pointer to the cancel button in the modal form for tasks
    const cancelCreateTasks = $("#cancel-create-tasks");
    // pointer to the trash can button
    const trashCanBtn = $("#trash-can-btn");
    
    // number of lists currently loaded
    let listsCount = 0;
    // current list name after inputting it into the modal form
    let currentListName = "";
    
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
                    let name = child.data().name;
                    let taskArray = child.data().tasks;

                    // create list
                    createNewList(name, taskArray);
                });
            }
        });
        console.log(listsCount);
    });

    $(listSaveChanges).click(function() {
        // save the value of the input
        currentListName = $(listNameForm).val();
        // reset the value of input
        $(listNameForm).val("");
    });

    $("#create-task-modal-form").click(function(e) {
        e.preventDefault();
        // if the "Task name" form is filled out
        if ($(taskNameForm).val()) {
            let taskName = $(taskNameForm).val();
            // reset the form
            $(taskNameForm).val("");
            addTaskToForm(taskName);
        }
    });

    // Save the new list and tasks
    $(taskSaveChanges).click(function() {
        // Variable to save the names of each task.
        let tasks = [];
        /**
         * Iterate through each child (task item) in the task container.
         */
        $(taskContainer).children().each(function(i, child) {
            let taskName = $(child).find("p").html()
            tasks.push(taskName);
        });
        console.log(currentListName);
        addList(currentListName, tasks);
        console.log(tasks);
        emptyTasks();
    });
    

    $(cancelCreateTasks).click(emptyTasks);

    /**
     * Adds a new task to the task modal form. (Phew)
     * @param {String} taskName name of the task
     */
    function addTaskToForm(taskName) {
        let taskItem = $("#task-clone").clone().show();
        $(taskItem).removeAttr("id");
        $(taskItem).find(".check-mark").remove();
        $(taskItem).addClass("list");
        $(taskItem).find("p").html(taskName);
        // trash can button to delete itself
        $(taskItem).find("button").click(function() {
            $(this).parent().remove();
        });

        $(taskContainer).append(taskItem);
        // scroll the div down to the bottom after creating task
        $(taskContainer).scrollTop(1000000);
    }

    /**
     * Adds the list to the document and saves it to the database.
     * @param {String} listName the name of the list
     * @param {Array} taskArray the array that holds all the names of the tasks
     */
    function addList(listName, taskArray) {
        hideNoLists();
        
        //append before #create-list-container
        createNewList(listName, taskArray);

        // add new list to database
        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users").doc(user.uid).collection("lists").add({
                "name": listName,
                "tasks": taskArray,
                "status": "active"
            });
        });
    }

    /**
     * Creates the list element along with its tasks and places it into the document.
     * @param {String} listName the name of the list
     * @param {Array} taskArray the array that holds all the names of the tasks
     */
    function createNewList(listName, taskArray) {
        let clone = $("#list-clone").clone().show();
        $(clone).removeAttr("id");
        $(clone).find(".down").hide();
        $(clone).find(".list-name").html(listName);

        // set unique id for the collapsible
        $(clone).find(".collapse").attr("id", "collapse-" + listsCount);
        // set target of the button to the unique collapsible id
        $(clone).find(".drop-down-btn").attr("href", "#collapse-" + listsCount);
        // bind click event to button
        $(clone).find(".drop-down-btn").click(toggleArrow);

        generateTasks(clone, taskArray)

        $(clone).insertBefore(createList);
        listsCount++;
    }

    /**
     * Generates all the tasks and puts it all into the clone object.
     * @param {*} clone the jQuery object
     * @param {Array} taskArray the array that holds all the names of the tasks
     */
    function generateTasks(clone, taskArray) {
        let taskListContainer = $(clone).find(".task-list-container");
        taskArray.forEach(function(task) {
            let taskClone = $("#task-clone").clone().show();
            $(taskClone).removeAttr("id");
            $(taskClone).find(".trash-list").remove();
            $(taskClone).find("p").html(task);
            $(taskListContainer).append(taskClone);
        });
    }

    /**
     * Hide the notifier that says you have no lists.
     */
    function hideNoLists() {
        //hide #no-lists if it's still visible
        if($(noLists).is(":visible")) {
            $(noLists).hide();
        }
    }

    /**
     * Empty the task items in the task container in the task modal form. (Phew)
     */
    function emptyTasks() {
        $(taskContainer).empty();
    }

    /**
     * Toggles the dropdown arrow's orientation.
     */
    function toggleArrow() {
        // toggle between the up and down image of the dropdown button
        console.log("test")
        if ($(this).find(".up").is(":visible")) {
            $(this).find(".up").hide();
            $(this).find(".down").show();
        } else {
            $(this).find(".up").show();
            $(this).find(".down").hide();
        }
    }
});