const router = require("express").Router();

// Get the user ID when authorized
router.get("/:id", async (req, res) => {
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
});

module.exports = router;
