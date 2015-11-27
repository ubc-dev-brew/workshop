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

$('.update-user').on("click", function(event) {
    // Disable the default form submission
    event.preventDefault();
    var formData = new FormData($('.update-form')[0]);
    // Show success message.
    $('.status_messages').show().delay(6000).fadeOut(1000);
    
    $.ajax({
        url: '/api/user/update',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {
            var jsonResponse = JSON.parse(returndata)
            if(jsonResponse.hasOwnProperty('profilePicUrl')){
                $('#profilePictureUrl').attr("src", JSON.parse(returndata).profilePicUrl);
            }
            showUserSummary();
            location.reload();
        },
        error: function() {
            console.log('Error occured with dashboard update');  
        }
    });
});
    
// Search users on the platform
(function(){
  $.ajax({
    url: "/listAllUsers",
    type: "GET"
  }).done(function(data) {
    var users = data;
    $("#project").autocomplete({
            source: users,
             select: function(event, ui) {
                return false;
            },
            create: function () {
                $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                    return $('<li>')
                        .append('<a href="/users/' + item.value + '" >' + item.label + '</a>')
                        .appendTo(ul);
                };
            }
        });   
  });
})();
