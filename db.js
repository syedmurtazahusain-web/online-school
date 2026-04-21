const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use 127.0.0.1 for local connections to avoid Node 18+ DNS resolution issues
    // Ensure the database name matches your application's needs (eduhub_kids)
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eduhub_kids";
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected via db.js ✅");
  } catch (err) {
    console.error("❌ MongoDB connection failed in db.js:", err.message);
    console.error("Please ensure MongoDB service is running and accessible at:", mongoURI);
  }
};

module.exports = connectDB;