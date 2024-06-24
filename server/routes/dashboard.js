const express = require("express");
const router = express.Router();
const knex = require("../knex");
const bcrypt = require("bcrypt");

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

router.put("/:id/password", async (req, res) => {
  const userId = req.params.id;
  const { current_password, new_password } = req.body;

  try {
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    const newHashedPassword = await bcrypt.hash(new_password, 10);

    await knex("users")
      .where({ id: userId })
      .update({ password: newHashedPassword });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;