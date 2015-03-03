'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Page", {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};