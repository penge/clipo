'use strict';

var Clipo = require('../clipo.js');

module.exports = function() {

  var init = function(noteSelector) {
    updateNoteOnChange(noteSelector);
    deleteNoteIfEmpty(noteSelector);
    selectNoteOnMouseEnter(noteSelector);
    deselectNoteOnMouseLeave(noteSelector);
  };

  var updateNoteOnChange = function(noteSelector) {
    $(document).on('change', noteSelector, function() {
      var /* var */
        $note  = $(this),
        noteId = $note.data('id'),
        text   = $note.val();

      if (!text) {
        return;
      }

      Clipo.updateNote(noteId, text);
    });
  };

  var deleteNoteIfEmpty = function(noteSelector) {
    $(document).on('keyup input', noteSelector, function() {
      var /* var */
        $note       = $(this),
        noteId      = $note.data('id'),
        isEmpty     = $note.val() === '';

      if (isEmpty) {
        Clipo.deleteNote(noteId);
      }
    });
  };

  var selectNoteOnMouseEnter = function(noteSelector) {
    $(document).on('mouseenter', noteSelector, function() {
      $(this).select();
    });
  };

  var deselectNoteOnMouseLeave = function(noteSelector) {
    $(document).on('mouseleave', noteSelector, function() {
      $(this).blur();
    });
  };

  return {
    init: init,
  };
}();