const express = require("express");
const db = require("../db");
const User = db.users; // Access the User model

// Function to check if username or email already exists
const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: { uname: req.body.uname },
    });

    if (username) {
      return res.status(409).send("Username already taken");
    }

    const emailcheck = await User.findOne({
      where: { uemail: req.body.uemail },
    });

    if (emailcheck) {
      return res.status(409).send("Email already registered");
    }

    next();
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).send("Server error");
  }
};

module.exports = { saveUser };
