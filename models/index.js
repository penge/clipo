var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' });

var db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  Page:      sequelize.import(__dirname + '/Page'),
  Note:      sequelize.import(__dirname + '/Note'),
};

db.Page.hasMany(db.Note);
db.Note.belongsTo(db.Page);

module.exports = db;