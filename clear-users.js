// Clear all existing users from database
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eduhub_kids")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err.message));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

const clearUsers = async () => {
  try {
    console.log('Clearing all existing users...');
    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);
    
    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

clearUsers();
