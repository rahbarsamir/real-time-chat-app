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

// //Update username
// router.patch("/changeUsername", async (req, res) => {
//   try {
//     const { username, visitorId } = req.body;

//     if (!username || !visitorId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

    // const updatedUser = await User.findOneAndUpdate(
    //   { visitorId },             // ✅ query by visitorId, not _id
    //   { username },
    //   { new: true, runValidators: true }
    // );
    // Update username by visitorId
router.patch("/changeUsername", async (req, res) => {
  try {
    const { username, visitorId } = req.body;
    if (!username || !visitorId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findOne({ visitorId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.username = username;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error("ERROR:", err);   
    res.status(400).json({ error: err.message });
  }
});



export default router;

