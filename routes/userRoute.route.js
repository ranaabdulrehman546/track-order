const express = require("express");
const UsersModel = require("../models/Users.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); //for hashing of password

/// User login route
userRouter.post("/users/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await UsersModel.findOne({ name });
    //  console.log(user)

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userId: user._id }, "syook", {
            expiresIn: "1h",
          });

          res.status(200).json({ token, userId: user._id }); // Use user._id instead of newUser._id
        } else {
          res.status(401).send({ message: "Invalid credentials" });
        }
      });
    } else {
      res.status(401).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.post("/users/register", async (req, res) => {
  const { name, phoneNumber, password, confirmpassword } = req.body;

  try {
    // Validate required fields
    if (!name || !phoneNumber || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate password confirmation
    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if a user with the provided phone number already exists
    const existingUserByPhone = await UsersModel.findOne({ phoneNumber });
    if (existingUserByPhone) {
      return res.status(409).json({ message: "User with this phone number already exists." });
    }

    // Check if a user with the provided name already exists
    const existingUserByName = await UsersModel.findOne({ name });
    if (existingUserByName) {
      return res.status(409).json({ message: "User with this name already exists." });
    }

    bcrypt.hash(password, 2, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error while hashing the password using bcrypt module." });
      }

      try {
        // Create a new user with the hashed password
        const newUser = new UsersModel({ name, phoneNumber, password: hash });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, "syook", {
          expiresIn: "1h",
        });

        // Send token to the client
        res.status(201).json({ token, userId: newUser._id, message: "User registered successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const users = await UsersModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.messsage });
  }
});

module.exports = userRouter;
