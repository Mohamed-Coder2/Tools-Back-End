const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    orderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderDetails: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dropoffLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dropoffTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Order;
};
