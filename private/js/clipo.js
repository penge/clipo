'use strict';

module.exports = function() {

  var createPage = function(name, password) {
    $.post("/pages", { name: name, password: password }).done(function() {
      location.reload();
    });
  };

  var accessPage = function(name, password) {
    $.post("/pages/access", { name: name, password: password }).done(function() {
      location.reload();
    });
  };

  var createNote = function(pageId, text) {
    $.post("/notes", { pageId: pageId, text: text }).done(function() {
      $('#new-note-input').val('');
    });
  };

  var updateNote = function(noteId, text) {
    $.post("/notes/" + noteId, { text: text }).done(function() {
    });
  };

  var deleteNote = function(noteId) {
    $.ajax({
      url: '/notes/' + noteId,
      type: 'DELETE',
      success: function() {
      }
    });
  };

  return {
    createPage: createPage,
    accessPage: accessPage,
    createNote: createNote,
    updateNote: updateNote,
    deleteNote: deleteNote,
  };
}();