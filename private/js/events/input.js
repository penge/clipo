'use strict';

var Clipo = require('../clipo.js');

module.exports = function() {

  var init = function (inputSelector) {
    createNoteOnPaste();
    selectAndUpdatePlaceholderOnMouseEnter(inputSelector);
    deselectAndUpdatePlaceholderOnMouseLeave(inputSelector);
  };

  var createNoteOnPaste = function() {
    $(document).on('paste', function(e) {
      if ($(e.target).is('#new-note-input')) {
        return;
      }

      var /* var */
        text = getClipboardText(e),
        pageId = $('#page').data('id');

      if (isNotePresent(text)) {
        return;
      }

      Clipo.createNote(pageId, text);
    });
    
    $(document).on('paste', '#new-note-input', function() {
      var $input = $(this);
      
      setTimeout(function() {
        var /* var */
          text = $input.val(),
          pageId = $('#page').data('id');

        if (isNotePresent(text)) {
          return;
        }

        Clipo.createNote(pageId, text);
      }, 100);
    });
  };

  var selectAndUpdatePlaceholderOnMouseEnter = function(inputSelector) {
    $(document).on('mouseenter', inputSelector, function() {
      $(this).removeAttr('placeholder').select();
    });
  };

  var deselectAndUpdatePlaceholderOnMouseLeave = function(inputSelector) {
    $(document).on('mouseleave', inputSelector, function() {
      var /* var */
        $input = $(this),
        placeholder = $input.data('placeholder');

      $input.attr('placeholder', placeholder).blur();
    });
  };
  
  var getClipboardText = function(e) {
    return (e.originalEvent || e).clipboardData.getData('text/plain');
  };

  var isNotePresent = function(text) {
    var values = getAllNoteValues();
    return $.inArray(text, values) != -1;
  };

	var getAllNoteValues = function() {
	  return $('.note').map(function() {
	    return $(this).val();
	  });
	};

  return {
    init: init,
  };
}();