$(document).ready(function() {
    // pointer to container holding the events
    const eventContainer = $("#event-container");

    // pointer to container create new event container
    const createEvent = $("#create-event-container");

    // pointer to create event button
    const createEventButton = $("#create-event-open");

    // pointer to "No Events" messgae
    const noEvents = $("#no-events");

    // pointer to "Save Changes" button in modal form
    const saveChanges = $("#save-changes");

    // pointer to the "Event name" form in the modal thing
    const eventNameForm = $("#event-name");

    // pointer to the "Select priority" form in the modal thingamajig
    const selectPriority = $("#select-priority");

    // pointer to the "Event description" form in the modal thingabadingaling
    const eventDescriptionForm = $("#event-description")


    // Placeholder event
    const eventItem = $("<li class='event-group-item'>New Event</li>");

    //if user is authenticated
    firebase.auth().onAuthStateChanged(function(user) {
        //pointer to the user's list collection
        let events = db.collection("users").doc(user.uid).collection("events");

        //capture a snapshot of the lists collection
        events.get().then(function(doc){
            //execute a function for each child of the lists collectin
            doc.forEach(function(child){
                // console.log(child);

                let name = child.data().name;
                let priority = child.data().priority;
                let description = child.data().description;

                console.log(name);
                console.log(priority);
                console.log(description);

                //append before #create-list-container
                addEvent(name, priority, description);
                // let listItem = $("<li class=\"list-group-item border-0\">New List</li>");
                // $(listItem).insertBefore(createList)
            });
        });
    });

    // Button click event handler for creating event
    // createEventButton.click(addEvent);

    // When clicking the "Save Changes" button on the modal.
    $(saveChanges).click(function (event) {
        //prevent the submit button from refreshing the page
        // event.preventDefault();

        //save the values of the inputs
        let eventName = $(eventNameForm).val();
        let eventPriority = $(selectPriority).val();
        let eventDescription = $(eventDescriptionForm).val();

        //save the information into the database
        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users").doc(user.uid).collection("events").add({
                "name": eventName,
                "priority": eventPriority,
                "description": eventDescription
            });
        });

        addEvent(eventName, eventPriority, eventDescription);

        // Reset values of input forms
        $(eventName).val("");
        $(eventPriority).val("");
        $(eventDescription).val("");
    });

    function addEvent(name, priority, description) {
        hideNoEventsMessage();
        createNewEvent(name, priority, description);
    }

    // Adds a new event to the list
    function createNewEvent(name, priority, description) {
        let clone = eventItem.clone()
        $(clone).html(name);

        $(clone).insertBefore(createEvent);
    }
    
    function saveEvent(event) {
        // console.log("swag");
        // let eventName = $(eventNameForm).val();
        // let eventPriority = $(selectPriority).val();
        // let eventDescription = $(eventDescriptionForm).val();

        // console.log(eventName);
        // console.log(eventPriority);
        // console.log(eventDescription);
    }

    // Hides the "No Events" message
    function hideNoEventsMessage() {
        if(noEvents.is(":visible")) {
            noEvents.hide();
        }
    }

});