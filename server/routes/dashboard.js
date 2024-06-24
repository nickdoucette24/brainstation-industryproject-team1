const express = require("express");
const router = express.Router();
const knex = require("../knex");

// Get the user ID when authorized
router
  .route("/:id")
  .get(async (req, res) => {
    // Pull the userId from the request params
    const userId = req.params.id;

    // Database Requests
    try {
      // Get the user info
      const user = await knex("users").where({ id: userId }).first();

      // Verify the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
  .put(async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email } = req.body;

    try {
      const user = await knex("users").where({ id: userId }).first();

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      await knex("users")
        .where({ id: userId })
        .update({ first_name, last_name, email });

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        id: userId,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
