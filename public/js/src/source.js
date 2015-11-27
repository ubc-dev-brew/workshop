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

// Search users on the platform
(function(){
  $.ajax({
    url: "/listAllUsers",
    type: "GET"
  }).done(function(data) {
    console.log(data);
    
  });
})();


$(function() {
		var projects = [
			{
				value: "jquery",
				label: "jQuery",
				desc: "the write less, do more, JavaScript library",
				icon: "jquery_32x32.png"
			},
			{
				value: "jquery-ui",
				label: "jQuery UI",
				desc: "the official user interface library for jQuery",
				icon: "jqueryui_32x32.png"
			},
			{
				value: "sizzlejs",
				label: "Sizzle JS",
				desc: "a pure-JavaScript CSS selector engine",
				icon: "sizzlejs_32x32.png"
			}
		];
		$("#project").autocomplete({
            source: projects,
            create: function () {
                $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                  console.log(item);
                    return $('<li>')
                        .append('<a>' + item.label + '<br>' + item.value + '</a>')
                        .appendTo(ul);
                };
            }
        });
	});