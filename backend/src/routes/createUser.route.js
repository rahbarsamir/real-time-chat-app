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

//Update Route
router.put("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body; 

  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { message },        
      { new: true }         
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Failed to update message" });
  }
});

// Delete Route 
router.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});


export default router;
