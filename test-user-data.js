// Test user data in database
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eduhub_kids")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err.message));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  createdAt: { type: Date, default: Date.now }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);

const testUserData = async () => {
  try {
    console.log('Testing user data in database...');
    
    // Find the demo user
    const user = await User.findOne({ email: 'demo@example.com' });
    
    if (user) {
      console.log('User found:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash: user.password
      });
      
      // Test password comparison
      const testPassword = 'demo123';
      const isMatch = await user.comparePassword(testPassword);
      console.log('Password comparison result:', isMatch);
      
      // Test with different passwords
      const passwords = ['demo123', 'demo', '123', 'password'];
      for (const pwd of passwords) {
        const match = await user.comparePassword(pwd);
        console.log(`Password "${pwd}" matches: ${match}`);
      }
    } else {
      console.log('User not found');
      
      // Create a test user
      console.log('Creating test user...');
      const newUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        role: 'student'
      });
      
      await newUser.save();
      console.log('Test user created');
      
      // Test login with new user
      const isMatch = await newUser.comparePassword('test123');
      console.log('New user password test:', isMatch);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testUserData();
