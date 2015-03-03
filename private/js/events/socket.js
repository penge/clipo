'use strict';

module.exports = function() {

  var init = function(io) {

    var socket = io(); 

    socket.on('connect', function() {
      var pageName = window.location.pathname.substr(1);
      if (!pageName) {
        return;
      }
      socket.emit('joinPage', pageName);
    });

    socket.on('createNote', function(id, text) {
      console.log('Creating note: ' + id);
      var $clone = getNoteClone(id, text);
      $('#notes').prepend($clone);
      $('#notes .note').autosize();
    });

    socket.on('updateNote', function(id, text) {
      console.log('Updating note: ' + id);
      getNoteById(id).val(text);
    });

    socket.on('deleteNote', function(id) {
      console.log('Deleting note: ' + id);
      getNoteById(id).remove();
    });

    var getNoteById = function(id) {
      return $('.note[data-id=' + id + ']');
    };

    var getNoteClone = function(id, text) {
      return $('#note-template')
        .clone()
        .removeClass('hide')
        .removeAttr('id')
        .attr('data-id', id)
        .val(text);
    };
  };

  return {
    init: init,
  };
}();