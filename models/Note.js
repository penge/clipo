'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Note", {
    text: {
      type: DataTypes.TEXT
    }
  });
};