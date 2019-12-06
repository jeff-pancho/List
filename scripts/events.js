$(document).ready(function () {
    // pointer to container holding the events
    const eventContainer = $("#event-container");
    // pointer to container create new event container
    const createEvent = $("#create-event-container");
    // pointer to create event button
    const createEventButton = $("#create-event-open");
    // pointer to "No Events" messgae
    const noEvents = $("#no-events");
    // pointer to create event modal
    const createEventModal = $("#example-modal");
    // pointer to the create event form
    const eventForm = $("#event-form");
    // pointer to the "Event name" form in the modal thing
    const eventNameForm = $("#event-name");
    // pointer to the "Event date" form in the modal thing
    const eventDateForm = $("#event-date");
    // pointer to the "Select priority" form in the modal thingamajig
    const selectPriority = $("#select-priority");
    // pointer to the "Event description" form in the modal thingabadingaling
    const eventDescriptionForm = $("#event-description")
    // pointer to "Save Changes" button in modal form
    const saveChanges = $("#save-changes");

    // number of events currently loaded
    let eventsCount = 0;
    // Array of event references
    let eventRefs = [];
    // Placeholder event
    const eventItem = $("#placeholder");

    // populate users events ordered by date
    orderEvents();

    // reset the forms everytime the user closes the modal
    $("#cancel-button").click(function () {
        $(eventForm)[0].reset();
    });

    /**
     * Event Listener on the create event button.
     * Opens up the create event modal form.
     */
    $(createEventButton).click(function () {
        $("#example-modal-label").html("Create Event");
        // Unbinds any previous event handlers of the save changes button
        // Adds a new click handler.
        // When clicking the "Save Changes" button on the modal.
        $(saveChanges).unbind().click(function (e) {
            // validate form to ensure that there is an
            // event name and event date
            if (!$(eventNameForm).val() || !$(eventDateForm).val()) {
                e.preventDefault();
                e.stopPropagation();
                // Add the Bootstrap was-validated class to generate validation feedback
                $(eventForm)[0].classList.add('was-validated');
            } else {
                //save the values of the inputs
                let eventName = $(eventNameForm).val();
                let eventDate = $(eventDateForm).val();
                let eventPriority = $(selectPriority).val();
                let eventDescription = $(eventDescriptionForm).val();

                // DATABASE WRITE to the events collection
                // save the information into the database
                firebase.auth().onAuthStateChanged(function (user) {
                    db.collection("users").doc(user.uid).collection("events").add({
                        "name": eventName,
                        "date": eventDate,
                        "priority": eventPriority,
                        "description": eventDescription
                    })
                        .then(function (child) {
                            eventRefs.push(child);
                        })
                });

                createNewEvent(eventName, eventDate, eventPriority, eventDescription);
                // make sure no events message is hidden if making first event
                hideNoEventsMessage();
                // Reset values of input forms
                $(eventForm)[0].reset();
                $(eventForm)[0].classList.remove('was-validated');

                // re-orders the user's events by date
                orderEvents();
            }
        });
    });

    /**
     * Create a new event.
     * It will first clone the hidden element to append to the list that stores
     * each event in the page.
     * @param {String} name of the event
     * @param {String} date of the event
     * @param {String} priority of the event
     * @param {String} description of the event
     */
    function createNewEvent(name, date, priority, description) {
        let clone = eventItem.clone().show()
        $(clone).find("#item-name").text(name);
        $(clone).find("#item-date").text(date);
        $(clone).find("#item-priority").html("<b>Priority: </b>" + priority);
        let cloneDesc = document.createTextNode(description);
        $(clone).find("#item-description").html("<b>Description: </b>");
        $(clone).find("#item-description").append(cloneDesc);
        $(clone).find(".down").hide();
        $(clone).removeAttr("id");
        $(clone).attr("id", "event-item-" + eventsCount);

        // set unique id for the collapsible
        $(clone).find(".collapse").attr("id", "collapse-" + eventsCount);
        // set target of the button to the unique collapsible id
        $(clone).find(".drop-down-btn").attr("href", "#collapse-" + eventsCount);
        // bind click event to button
        $(clone).find(".drop-down-btn").click(function () {
            // toggle between the up and down image of the dropdown button
            console.log("test")
            if ($(this).find(".up").is(":visible")) {
                $(this).find(".up").hide();
                $(this).find(".down").show();
            } else {
                $(this).find(".up").show();
                $(this).find(".down").hide();
            }
        });

        // Event listener to modify event item
        $(clone).find(".modify-event").click(modifyEventSetup);

        // Event listener to delete event item
        $(clone).find(".delete-event").click(deleteEvent);

        $(clone).insertBefore(createEvent);

        eventsCount++;
    }

    /**
     * When the event modal shows up, it will allow the user to modify the event.
     */
    function modifyEventSetup() {
        $("#example-modal-label").html("Modify Event");
        let thisEvent = $(this).closest('li');
        let thisEventID = thisEvent.attr("id");
        let parseID = thisEventID.match(/(\d+)/);
        let index = parseID[0];

        // DATABASE READ of the event document
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(user.uid).collection("events")
                .doc(eventRefs[index].id).get().then(function (doc) {
                    modifyEvent(doc, index);
                });
        });
    }

    /**
     * Allows the user to start modifying the events in the page.
     * @param {*} doc the event document in the database
     * @param {number} index in eventRefs
     */
    function modifyEvent(doc, index) {
        $(eventNameForm).val(doc.data().name);
        $(eventDateForm).val(doc.data().date);
        $(selectPriority).val(doc.data().priority);
        $(eventDescriptionForm).val(doc.data().description);

        // Unbind any event handlers on the save changes button in the task modal.
        // Also adds a new click handler that will save the changes made to the tasks
        // in the list.
        $(saveChanges).unbind().click(function (e) {
            // validate form to ensure that there is an
            // event name and event date
            if (!$(eventNameForm).val() || !$(eventDateForm).val()) {
                e.preventDefault();
                e.stopPropagation();
                // Add the Bootstrap was-validated class to generate validation feedback
                $(eventForm)[0].classList.add('was-validated');
            } else {
                // save the values of the inputs
                let eventName = $(eventNameForm).val();
                let eventDate = $(eventDateForm).val();
                let eventPriority = $(selectPriority).val();
                let eventDescription = $(eventDescriptionForm).val();

                // DATABASE WRITE to the event document (updating it)
                // save the information into the database
                firebase.auth().onAuthStateChanged(function (user) {
                    db.collection("users").doc(user.uid).collection("events")
                        .doc(doc.id).update({
                            "name": eventName,
                            "date": eventDate,
                            "priority": eventPriority,
                            "description": eventDescription
                        })
                        .then(function () {
                            // update the event afterwards
                            let updatedEvent = $("#event-item-" + index);
                            $(updatedEvent).find("#item-name").text(eventName);
                            $(updatedEvent).find("#item-date").text(eventDate);
                            $(updatedEvent).find("#item-priority").html("<b>Priority: </b>" + eventPriority);
                            let updatedDesc = document.createTextNode(eventDescription);
                            $(updatedEvent).find("#item-description").html("<b>Description: </b>");
                            $(updatedEvent).find("#item-description").append(updatedDesc);

                            console.log(updatedEvent);
                        })
                });

                // make sure no events message is hidden if making first event
                hideNoEventsMessage();
                $(eventForm)[0].reset();
                $(eventForm)[0].classList.remove('was-validated');

                // re-orders the user's events by date
                orderEvents();
            }
        });
    }

    /**
     * Deletes the event and updates the results to the database.
     */
    function deleteEvent() {
        let thisEvent = $(this).closest('li');
        let thisEventID = thisEvent.attr("id");
        let parseID = thisEventID.match(/(\d+)/);
        let index = parseID[0];
        // DATABASE WRITE of the event document (deletion)
        // remove the event from the database and the array
        console.log(eventRefs[index].data().name);
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(user.uid).collection("events")
                .doc(eventRefs[index].id).delete().then(function () {
                    thisEvent.remove();
                    eventRefs.splice(index, 1, null);
                    var afterDelete = eventRefs.filter(doc => doc != null)
                    if (afterDelete.length == 0) {
                        showNoEventsMessage();
                    }
                })
        })
    }

    /**
     * Populates the user's events, ordered by date.
     */
    function orderEvents() {
        $(createEvent).prevAll().remove();
        eventsCount = 0;
        eventRefs = [];
        // if user is authenticated
        firebase.auth().onAuthStateChanged(function (user) {
            // pointer to the user's events collection
            let events = db.collection("users").doc(user.uid).collection("events");

            let orderedEvents = events.orderBy("date");

            // DATABASE READ of the events collection
            // capture a snapshot of the events collection
            orderedEvents.get().then(function (docs) {
                if (docs.size > 0) {
                    hideNoEventsMessage();
                    // execute a function for each child of the event collection
                    // this will basically add every event to the page
                    docs.forEach(function (child) {
                        let name = child.data().name;
                        let date = child.data().date;
                        let priority = child.data().priority;
                        let description = child.data().description;

                        eventRefs.push(child);

                        // append before #create-event-container
                        createNewEvent(name, date, priority, description);
                    });
                }
            });
        });
    }

    /**
     * Hide the notifier that says you have no events.
     */
    function hideNoEventsMessage() {
        if (noEvents.is(":visible")) {
            noEvents.hide();
        }
    }

    /**
     * Shows the notifier that says you have no events.
     */
    function showNoEventsMessage() {
        if (noEvents.is(":hidden")) {
            noEvents.show();
        }
    }

    /**
     * Datepicker setup.
     */
    var date_input = $('input[name="date"]'); //our date input has the name "date"
    var options = {
        format: 'mm/dd/yyyy',
        todayHighlight: true,
        autoclose: true,
        toggleActive: true,
        defaultViewDate: {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate()
        }
    };
    date_input.datepicker(options);

});