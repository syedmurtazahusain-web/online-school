// Test password hashing and comparison directly
const bcrypt = require('bcrypt');

const testPasswordHashing = async () => {
  const password = 'demo123';
  
  try {
    console.log('Testing password hashing and comparison...');
    
    // Hash the password like the server does
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hash);
    
    // Compare the password like the server does
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Password match:', isMatch);
    
    // Test with wrong password
    const isWrongMatch = await bcrypt.compare('wrongpassword', hash);
    console.log('Wrong password match:', isWrongMatch);
    
  } catch (error) {
    console.error('Error:', error);
  }
};

testPasswordHashing();
