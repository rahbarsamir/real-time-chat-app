import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://anas:anas123@cluster0.hzvr90t.mongodb.net/REALTIMECHAT", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB Connected");
  } catch (err) {
    console.error(" MongoDB Error:", err);
    process.exit(1);
  }
};
