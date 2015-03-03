'use strict';

var Clipo = require('../clipo.js');

module.exports = function() {

  var createPageOnClick = function(buttonSelector) {
    $(document).on('click', buttonSelector, function(event) {
      performClipoAction(event, this, 'createPage');
    });   
  };

  var accessPageOnClick = function(buttonSelector) {
    $(document).on('click', buttonSelector, function(event) {
      performClipoAction(event, this, 'accessPage');
    });
  };

  var performClipoAction = function(event, element, actionName) {
    event.preventDefault();

    var /* var */ 
      pageName = getPageName(element),
      password = getPassword();

    Clipo[actionName](pageName, password);
  };

  var getPageName = function(element) {
    return $(element).data('page-name');
  };

  var getPassword = function() {
    return $('#password').val();
  };

  return {
    createPageOnClick: createPageOnClick,
    accessPageOnClick: accessPageOnClick,
  };
}();