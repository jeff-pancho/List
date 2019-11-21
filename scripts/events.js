$(document).ready(function() {
    // pointer to container holding the events
    var eventContainer = $("#event-container");

    // pointer to container create new event container
    var createEvent = $("#create-event-container");

    // pointer to create event button
    var createEventButton = $("#create-event");

    // pointer to "No Events" messgae
    var noEvents = $("#no-events");

    // Placeholder event
    var eventItem = $("<li class='event-group-item'>New Event</li>");

    createEventButton.click(addEvent);

    function addEvent() {
        hideNoEventsMessage();
        createNewEvent();
    }

    function createNewEvent() {
        console.log("hi");
        eventItem.clone().insertBefore(createEvent);
    }

    function hideNoEventsMessage() {
        if(noEvents.is(":visible")) {
            noEvents.hide();
        }
    }

});