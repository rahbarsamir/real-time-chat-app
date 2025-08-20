import express from "express";
import User from "../model/userModel.js";

const router = express.Router();

// Search username
router.get("/:username", async (req, res) => {
  try {
    const users = await User.find({
      username: new RegExp(req.params.username, "i"),
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

