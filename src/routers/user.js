const db = require("../../db/index");
const User = db.user;
const auth = require("../../middleware/auth");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = new express.Router();

//Register Users
router.post("/users/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password,
    });

    const token = await newUser.generateToken(); //generating token

    res
      .status(201)
      .json({ message: "User registered successfully", newUser, token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Login users

router.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByCredentials(username, password)
    const token = await user.generateToken();

    res.json({ message: "Login successful", user, token });
  } catch (e) {
    console.error("Error logging in user:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get authnticated users
router.get("/users", auth, async (req, res) => {
  //console.log('userrrrrrrrrrrr', req.user)
    res.status(200).send(req.user)
});

module.exports = router;
