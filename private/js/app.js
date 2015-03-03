'use strict';

/* global io */

var Events = {
  page:   require('./events/page.js'),
  note:   require('./events/note.js'),
  input:  require('./events/input.js'),
  socket: require('./events/socket.js'),
};

var init = function() {
  $(function() {
    autosizeNotes();
    attachEvents();
  });
  
  var autosizeNotes = function() {
    $('.note').autosize();
  };

  var attachEvents = function() {
    Events.page.createPageOnClick('#create-page-button');
    Events.page.accessPageOnClick('#access-page-button');
    Events.note.init('.note');
    Events.input.init('#new-note-input');
    Events.socket.init(io);
  };
};

init();