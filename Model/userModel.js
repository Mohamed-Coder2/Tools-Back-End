const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Sets userID as the primary key
      autoIncrement: true, // Automatically increments the userID
    },
    uname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uemail: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true, // checks for email format
      allowNull: false,
    },
    upassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true, // Adds createdAt and updatedAt fields
  });

  return User;
};
