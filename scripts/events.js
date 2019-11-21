$(document).ready(function() {
    // pointer to container holding the events
    var eventContainer = $("#event-container");

    // pointer to container create new event container
    var createEvent = $("#create-event-container");

    // pointer to create event button
    var createEventButton = $("#create-event-open");

    // pointer to "No Events" messgae
    var noEvents = $("#no-events");

    // Placeholder event
    var eventItem = $("<li class='event-group-item'>New Event</li>");

    // Button click event handler for creating event
    createEventButton.click(addEvent);

    function addEvent() {
        hideNoEventsMessage();
        createNewEvent();
    }

    // Adds a new event to the list
    function createNewEvent() {
        eventItem.clone().insertBefore(createEvent);
    }

    // Hides the "No Events" message
    function hideNoEventsMessage() {
        if(noEvents.is(":visible")) {
            noEvents.hide();
        }
    }

});