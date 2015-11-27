/* global $ */
// Main JS file

function showEditForm() {
    document.getElementById('editForm').style.display="block";
    document.getElementById('userSummary').style.display= "none";
};

function showUserSummary() {
    document.getElementById('editForm').style.display= "none";
    document.getElementById('userSummary').style.display= "block";
};

// Handle click event for the feed form
$('.submit-to-feed').on("click", function(event) {
    event.preventDefault();
    var captionText = $('.form-group textarea').val();
    
    // Setting the value of text area to the hidden input field.
    $('#inputCaption').val(captionText);
    
    // Submit the form
    $('.feed-form').submit();
    
    // Show success message.
    $('.status_messages').show().delay(6000).fadeOut(1000);
});