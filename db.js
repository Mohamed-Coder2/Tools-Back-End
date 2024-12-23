require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  `postgres://postgres:100603@localhost:5432/ToolsProject`,
  { dialect: 'postgres' }
);

sequelize.authenticate().then(() => {
  console.log('Database connected successfully');
}).catch((err) => {
  console.log(err);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require('./Model/userModel.js')(sequelize, DataTypes);
db.orders = require('./Model/orderModel.js')(sequelize, DataTypes);

// Define associations
db.users.hasMany(db.orders, { foreignKey: 'userId', sourceKey: 'uid', onDelete: 'CASCADE' });
db.orders.belongsTo(db.users, { foreignKey: 'userId', targetKey: 'uid' });

// Export the db object
module.exports = db;
