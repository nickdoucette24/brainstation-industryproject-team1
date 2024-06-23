const router = require("express").Router();
const knex = require("../knex"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT Config
const { JWT_SECRET, JWT_EXPIRY } = process.env;

// Login
router.post("/login", async (req, res) => {
  // Check if email and password are in the request body
  const { email, password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Missing Password in the Login Payload.",
    });
  } else if (!email) {
    return res.status(400).json({
      message: "Missing Email in the Login Payload.",
    });
  }

  // Check if the user is registered
  try {
    const user = await knex("users").where({ email: email }).first();

    if (!user) {
      return res.status(401).json({
        message: "User does not exist.",
      });
    }

    // Compare the password against the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate the JWT for the user
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    // Send a token with the success message
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      id: user.id,
      token: token,
    });
  } catch (error) {
    console.error("Unable to Login: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Register
router.post("/register", async (req, res) => {
  // Extract data from request body
  const { first_name, last_name, email, password } = req.body;

  // Check if all the parameters are there
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({
      message: "Missing Field(s) in the Registration Payload.",
    });
  }

  // Database Request
  try {
    const existingUser = await knex("users").where({ email: email }).first();

    // Check if user already exists
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await knex("users").insert({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    // Fetch the newly created user
    const newUser = await knex("users").where({ email }).first();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      id: newUser.id,
      token: token,
    });
  } catch (error) {
    console.error("Unable to Register: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;