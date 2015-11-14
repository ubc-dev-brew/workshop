(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global $ */
// Main JS file

function showEditForm() {
    var editForm = document.getElementById('editForm').style.display="block";
    var userSummary = document.getElementById('userSummary').style.display= "none";
};


function showUserSummary() {
    var editForm = document.getElementById('editForm').style.display= "none";;
    var userSummary = document.getElementById('userSummary').style.display= "block";
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
},{}]},{},[1]);
