$(document).ready(function () {
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
    // pointer to the list form
    const listForm = $("#list-form");
    // pointer to the "List name" form
    const listNameForm = $("#list-name");
    // pointer to the create task form
    const createTaskForm = $("#create-task-modal-form");
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
    // Array of list references
    let listRefs = [];

    //if user is authenticated
    firebase.auth().onAuthStateChanged(function (user) {
        //pointer to the user's list collection
        let lists = db.collection("users").doc(user.uid).collection("lists");

        //capture a snapshot of the lists collection
        lists.get().then(function (doc) {
            if (doc.size > 0) {
                hideNoLists();
                //execute a function for each child of the lists collectin
                doc.forEach(function (child) {
                    let name = child.data().name;
                    let taskArray = child.data().tasks;

                    listRefs.push(child);

                    // create list
                    createNewList(name, taskArray);
                });
            }
        });
        console.log(listRefs);
        console.log(listsCount);
    });

    $(listSaveChanges).click(function (e) {
        // validate form to ensure that there is
        // a list name
        if (!$(listNameForm).val()) {
            e.preventDefault();
            e.stopPropagation();
            $(listForm)[0].classList.add('was-validated');
        } else {
            // save the value of the input
            currentListName = $(listNameForm).val();
            // reset the value of input
            $(listNameForm).val("");

            // Unbinds any previous event handlers of the save changes button
            // then adds a new click handler to save the new list and tasks.
            $(taskSaveChanges).unbind().click(function () {
                // Variable to save the names of each task.
                let tasks = [];
                /**
                 * Iterate through each child (task item) in the task container.
                 */
                $(taskContainer).children().each(function (i, child) {
                    let taskName = $(child).find("p").text();
                    tasks.push(taskName);
                });
                console.log(currentListName);
                addList(currentListName, tasks);
                console.log(tasks);
                emptyTasks();
            });

            // Unbinds any previous event handlers of the create task form
            // then adds a new click handler to create a new task inside the
            // modal form.
            $(createTaskForm).unbind().submit(function (e) {
                e.preventDefault();
                // if the "Task name" form is filled out
                if ($(taskNameForm).val()) {
                    let taskName = $(taskNameForm).val();
                    // reset the form
                    $(taskNameForm).val("");
                    addTaskToForm(taskName);
                }
            });
        }
    });

    // Clicking cancel while creating tasks.
    $(cancelCreateTasks).click(emptyTasks);

    /**
     * Adds a new task to the task modal form. (Phew)
     * @param {String} taskName name of the task
     * @returns the task added to the form (for method chaining)
     */
    function addTaskToForm(taskName) {
        let taskItem = $("#task-clone").clone().show();
        $(taskItem).removeAttr("id");
        $(taskItem).find(".check-mark").remove();
        $(taskItem).addClass("list");
        $(taskItem).find("p").text(taskName);
        // trash can button to delete itself
        $(taskItem).find("button").click(function () {
            $(this).parent().remove();
        });

        $(taskContainer).append(taskItem);
        // scroll the div down to the bottom after creating task
        $(taskContainer).scrollTop(1000000);

        return taskItem;
    }

    /**
     * Adds the list to the document and saves it to the database.
     * @param {String} listName the name of the list
     * @param {Array} taskArray the array that holds all the names of the tasks
     */
    function addList(listName, taskArray) {
        hideNoLists();

        // add new list to database
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(user.uid).collection("lists").add({
                "name": listName,
                "tasks": taskArray,
                "status": "active"
            })
                .then(function (child) {
                    listRefs.push(child);
                    //append before #create-list-container
                    createNewList(listName, taskArray);
                })
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
        $(clone).find(".list-name").text(listName);
        $(clone).attr("id", "list-item-" + listsCount);

        // set unique id for the collapsible
        $(clone).find(".collapse").attr("id", "collapse-" + listsCount);
        // set target of the button to the unique collapsible id
        $(clone).find(".drop-down-btn").attr("href", "#collapse-" + listsCount);
        // bind click event to button
        $(clone).find(".drop-down-btn").click(toggleArrow);

        generateTasks(clone, taskArray)

        // modify list button per list
        $(clone).find(".modify-list").click(modifyListSetup);
        // delete list item
        $(clone).find(".delete-list").click(deleteList);

        $(clone).insertBefore(createList);
        listsCount++;
    }

    /**
     * Deletes the list item and updates the results to the database.
     */
    function deleteList() {
        let thisList = $(this).closest('li');
        let thisListID = thisList.attr("id");
        let parseID = thisListID.match(/(\d+)/);
        let index = parseID[0];
        console.log(listRefs[index]);
        // remove the list from the database and array
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(user.uid).collection("lists")
                .doc(listRefs[index].id).delete().then(function () {
                    thisList.remove();
                    listRefs.splice(index, 1, null);
                    let afterDelete = listRefs.filter(doc => doc != null)
                    if (afterDelete.length == 0) {
                        showNoListsMessage();
                    }
                })
        })
    }

    /**
     * When the tasks modal shows up, it will allow the user to modify the tasks.
     */
    function modifyListSetup() {
        let thisList = $(this).closest('li');
        let thisListID = thisList.attr("id");
        let parseID = thisListID.match(/(\d+)/);
        let index = parseID[0];

        // puts all the tasks taken from the database into the variable
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(user.uid).collection("lists")
                .doc(listRefs[index].id).get().then(function (doc) {
                    modifyTasks(doc, index);
                });
        });
    }

    /**
     * Allows the user to start modifying the tasks of a certain list.
     * @param {*} doc the list document in the database
     * @param {number} index in listRefs
     */
    function modifyTasks(doc, index) {
        console.log(doc);
        let tasksArray = doc.data().tasks;
        generateTasksInsideModal(tasksArray);

        // Unbind any event handlers on the save changes button in the task modal.
        // Also adds a new click handler that will save the changes made to the tasks
        // in the list.
        $(taskSaveChanges).unbind().click(function () {
            // update the tasks array inside the database
            firebase.auth().onAuthStateChanged(function (user) {
                db.collection("users").doc(user.uid).collection("lists")
                    .doc(doc.id).update({
                        "tasks": tasksArray
                    }).then(function () {
                        // update the list afterwards
                        let listItem = $("#list-item-" + index);
                        console.log(listItem);
                        $(listItem).find(".task-list-container").empty();
                        generateTasks(listItem, tasksArray);
                        emptyTasks();
                    });
            });
        });

        // Unbind any event handlers on the create task form in the list modal.
        // Also adds a new submit handler that will save the changes made to the
        // name of the list I guess.
        $(createTaskForm).unbind().submit(function (e) {
            e.preventDefault();
            // if the "Task name" form is filled out
            if ($(taskNameForm).val()) {
                let taskName = $(taskNameForm).val();
                addTaskToForm(taskName);
                // reset the form
                $(taskNameForm).val("");
                tasksArray.push(taskName);
            }
        });
    }

    /**
     * Generates the tasks inside the tasks modal using the inputted array of tasks.
     * It will also unbind and add a new click handler to the trashcan to modify the
     * task array.
     * @param {Array} tasksArray array of tasks
     */
    function generateTasksInsideModal(tasksArray) {
        tasksArray.forEach(function (taskName) {
            // Add the task to the form then unbind the click handler on the
            // trash button. This will allow us to bind a new click handler
            // to the trash button to modify the array.
            addTaskToForm(taskName).find(".trash-list").unbind().click(function () {
                // remove this task from the array
                let index = $(this).parent().index();
                tasksArray.splice(index, 1);
                console.log(tasksArray);
                $(this).parent().remove();
            });
        });
    }

    /**
     * Generates all the tasks and puts it all into the clone object.
     * @param {*} clone the jQuery object
     * @param {Array} taskArray the array that holds all the names of the tasks
     */
    function generateTasks(clone, taskArray) {
        let taskListContainer = $(clone).find(".task-list-container");
        taskArray.forEach(function (task) {
            let taskClone = $("#task-clone").clone().show();
            $(taskClone).removeAttr("id");
            $(taskClone).find(".trash-list").remove();
            $(taskClone).find("p").text(task);
            $(taskListContainer).append(taskClone);
        });
    }

    /**
     * Hide the notifier that says you have no lists.
     */
    function hideNoLists() {
        //hide #no-lists if it's still visible
        if ($(noLists).is(":visible")) {
            $(noLists).hide();
        }
    }

    /**
     * Shows the notifier that says you have no lists.
     */
    function showNoListsMessage() {
        if (noLists.is(":hidden")) {
            noLists.show();
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