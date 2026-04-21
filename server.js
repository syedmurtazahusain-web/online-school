const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const connectDB = require("./db"); // Import the connection function
const path = require("path");
require("dotenv").config();

const app = express();
const SECRET = process.env.JWT_SECRET || "super-secret-key-change-this-in-production";

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB using the centralized db.js
connectDB();

// USER SCHEMA
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  grade: { type: String, default: "" },
  school: { type: String, default: "" },
  experience: { type: String, default: "" },
  department: { type: String, default: "" },
  subjects: [{ type: String }],
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  parentName: { type: String, default: "" },
  parentPhone: { type: String, default: "" },
  qualification: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// Hash password ONLY if it's new or modified
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

// COURSE SCHEMA
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, default: "" },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  price: { type: Number, default: 0 },
  category: { type: String, default: "" },
  teacher: { type: String, default: "" },
  videos: [{ 
    id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: String, default: "" }
  }],
  students: [mongoose.Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model("Course", courseSchema);

// PROGRESS SCHEMA
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
  completedVideos: [String],
  createdAt: { type: Date, default: Date.now }
});

const Progress = mongoose.model("Progress", progressSchema);

// VERIFY TOKEN MIDDLEWARE
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    console.warn("⚠️ No token provided");
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    req.user = jwt.verify(token, SECRET);
    console.log("✅ Token verified for user:", req.user.id);
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// CHECK ROLE MIDDLEWARE
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }
    next();
  };
};

// ROUTES

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("🚀 EduHub Kids API running");
});

/* REGISTER */
app.post("/register", async (req, res) => {
  try {
    console.log("\n📝 REGISTER REQUEST");
    console.log("Body:", req.body);

    const { name, email, password, role, grade, school, experience, department, subjects, phone, address, parentName, parentPhone, qualification } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    if (password.length < 6) {
      console.warn("⚠️ Password too short");
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    console.log("🔍 Checking if user exists...");
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      console.warn("⚠️ User already exists:", email);
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    console.log("✅ User doesn't exist, creating new user...");

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "student",
      grade: grade || "", // Student specific
      school: school || "", // Student specific
      experience: experience || "", // Teacher specific
      department: department || "", // Teacher specific
      subjects: subjects ? subjects.split(',').map(s => s.trim()) : [], // Teacher specific
      phone: phone || "",
      address: address || "",
      parentName: parentName || "", // Student specific
      parentPhone: parentPhone || "", // Student specific
      qualification: qualification || "" // Teacher specific
    });

    console.log("💾 Saving user to database...");
    await user.save();
    console.log("✅ User saved successfully:", user._id);

    // Generate token
    console.log("🔐 Generating JWT token...");
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "30d" });
    console.log("✅ Token generated");

    console.log("✅ REGISTRATION SUCCESSFUL\n");

    res.json({
      success: true,
      message: "Registration successful",
      token,
      role: user.role,
      userId: user._id
    });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err.message);
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* LOGIN */
app.post("/login", async (req, res) => {
  try {
    console.log("\n🔐 LOGIN REQUEST");
    console.log("Body:", { email: req.body.email });

    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("⚠️ Missing email or password");
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Find user
    console.log("🔍 Finding user...");
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.warn("⚠️ User not found:", email);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    console.log("✅ User found");

    // Compare passwords using async/await
    console.log(" Comparing passwords...");
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.warn(" Invalid password");
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    console.log(" Password valid");

    // Generate token
    console.log(" Generating JWT token...");
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "30d" });
    console.log(" Token generated");

    console.log(" LOGIN SUCCESSFUL\n");

    res.json({ 
      success: true, 
      token, 
      role: user.role, 
      userId: user._id 
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* TEACHER COURSES MANAGEMENT */
app.get("/teacher/courses", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("📚 Fetching courses for teacher/admin:", req.user.id);
    
    const courses = await Course.find();
    res.json({ success: true, courses });
  } catch (err) {
    console.error("❌ Error fetching courses:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/teacher/courses", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("📝 Creating new course:", req.body);
    
    const course = new Course(req.body);
    await course.save();
    
    res.json({ success: true, message: "Course created successfully", course });
  } catch (err) {
    console.error("❌ Error creating course:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/teacher/courses/:id", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("✏️ Updating course:", req.params.id);
    
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    
    res.json({ success: true, message: "Course updated successfully", course });
  } catch (err) {
    console.error("❌ Error updating course:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/teacher/courses/:id", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("🗑️ Deleting course:", req.params.id);
    
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting course:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* VIDEO UPLOAD ENDPOINTS */
app.post("/teacher/courses/:courseId/videos", verifyToken, checkRole(['admin', 'teacher']), upload.single('video'), async (req, res) => {
  try {
    console.log("📹 Uploading video to course:", req.params.courseId);
    
    const { title, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Video file required" });
    }
    
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    
    const videoId = `video-${Date.now()}`;
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    
    course.videos.push({
      id: videoId,
      title: title || req.file.originalname,
      description: description || "",
      url: videoUrl,
      duration: "",
      thumbnail: "",
      uploadDate: new Date()
    });
    
    await course.save();
    
    res.json({ 
      success: true, 
      message: "Video uploaded successfully",
      video: {
        id: videoId,
        title: title || req.file.originalname,
        url: videoUrl
      }
    });
  } catch (err) {
    console.error("❌ Error uploading video:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/teacher/courses/:courseId/videos", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("📹 Fetching videos for course:", req.params.courseId);
    
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    
    res.json({ success: true, videos: course.videos });
  } catch (err) {
    console.error("❌ Error fetching videos:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/teacher/videos/:videoId", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("🗑️ Deleting video:", req.params.videoId);
    
    // Find course containing this video and remove it
    const course = await Course.findOne({ "videos.id": req.params.videoId });
    if (!course) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    
    course.videos = course.videos.filter(video => video.id !== req.params.videoId);
    await course.save();
    
    res.json({ success: true, message: "Video deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting video:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* SCHEDULE MANAGEMENT */
app.get("/teacher/schedule", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("📅 Fetching schedule for teacher/admin:", req.user.id);
    
    const schedule = await Schedule.find();
    res.json({ success: true, schedule });
  } catch (err) {
    console.error("❌ Error fetching schedule:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/teacher/schedule", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("📅 Creating new schedule item:", req.body);
    
    const schedule = new Schedule(req.body);
    await schedule.save();
    
    res.json({ success: true, message: "Class scheduled successfully", schedule });
  } catch (err) {
    console.error("❌ Error creating schedule:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/teacher/schedule/:id", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("✏️ Updating schedule:", req.params.id);
    
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule item not found" });
    }
    
    res.json({ success: true, message: "Schedule updated successfully", schedule });
  } catch (err) {
    console.error("❌ Error updating schedule:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/teacher/schedule/:id", verifyToken, checkRole(['admin', 'teacher']), async (req, res) => {
  try {
    console.log("🗑️ Deleting schedule item:", req.params.id);
    
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule item not found" });
    }
    
    res.json({ success: true, message: "Schedule item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting schedule:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* STUDENT MANAGEMENT */
app.get("/admin/students", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("👨‍🎓 Fetching students for admin:", req.user.id);
    
    const students = await User.find({ role: 'student' }).select('-password');
    res.json({ success: true, students });
  } catch (err) {
    console.error("❌ Error fetching students:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/admin/students", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("👨‍🎓 Creating new student:", req.body);
    
    const student = new User({ ...req.body, role: 'student' });
    await student.save();
    
    res.json({ success: true, message: "Student created successfully", student });
  } catch (err) {
    console.error("❌ Error creating student:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/admin/students/:id", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("✏️ Updating student:", req.params.id);
    
    const student = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    res.json({ success: true, message: "Student updated successfully", student });
  } catch (err) {
    console.error("❌ Error updating student:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/admin/students/:id", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("🗑️ Deleting student:", req.params.id);
    
    const student = await User.findByIdAndDelete(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting student:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* TEACHER MANAGEMENT */
app.get("/admin/teachers", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("👨‍🏫 Fetching teachers for admin:", req.user.id);
    
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json({ success: true, teachers });
  } catch (err) {
    console.error("❌ Error fetching teachers:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/admin/teachers", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("👨‍🏫 Creating new teacher:", req.body);
    
    const teacher = new User({ ...req.body, role: 'teacher' });
    await teacher.save();
    
    res.json({ success: true, message: "Teacher created successfully", teacher });
  } catch (err) {
    console.error("❌ Error creating teacher:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/admin/teachers/:id", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("✏️ Updating teacher:", req.params.id);
    
    const teacher = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    
    res.json({ success: true, message: "Teacher updated successfully", teacher });
  } catch (err) {
    console.error("❌ Error updating teacher:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/admin/teachers/:id", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("🗑️ Deleting teacher:", req.params.id);
    
    const teacher = await User.findByIdAndDelete(req.params.id).select('-password');
    
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    
    res.json({ success: true, message: "Teacher deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting teacher:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ADMIN STATS */
app.get("/admin/stats", verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    console.log("📊 Fetching admin stats");
    
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalCourses = await Course.countDocuments();
    const totalClasses = await Schedule.countDocuments();
    
    res.json({ 
      success: true, 
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalClasses
      }
    });
  } catch (err) {
    console.error("❌ Error fetching stats:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* STUDENT ENDPOINTS (Existing) */
app.get("/student/courses", verifyToken, async (req, res) => {
  try {
    console.log("📚 Fetching courses for student:", req.user.id);

    const courses = await Course.find();
    const progressData = await Progress.find({ userId: req.user.id });

    const formatted = courses.map(course => {
      const progress = progressData.find(p => p.courseId.toString() === course._id.toString());
      return {
        id: course._id,
        title: course.title, // Changed from name to title
        description: course.description,
        progress: progress ? Math.round((progress.completedVideos.length / (course.videos?.length || 1)) * 100) : 0
      };
    });

    res.json({ success: true, courses: formatted });
  } catch (err) {
    console.error("❌ Error fetching courses:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/student/schedule", verifyToken, async (req, res) => {
  try {
    console.log("📅 Fetching schedule for student:", req.user.id);

    const schedule = await Schedule.find();
    res.json({ success: true, schedule });
  } catch (err) {
    console.error("❌ Error fetching schedule:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/user/profile", verifyToken, async (req, res) => {
  try {
    console.log("👤 Fetching user profile:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Error fetching profile:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/student/videos/:courseId", verifyToken, async (req, res) => {
  try {
    console.log("📹 Fetching videos for course:", req.params.courseId);

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Get progress for this user and course
    const progress = await Progress.findOne({ 
      userId: req.user.id, 
      courseId: req.params.courseId 
    });

    const videos = course.videos.map(video =>({
      id: video.id,
      title: video.title,
      url: video.url,
      completed: progress?.completedVideos.includes(video.id) || false
    }));

    res.json({ success: true, videos });
  } catch (err) {
    console.error("❌ Error fetching videos:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/student/video/complete", verifyToken, async (req, res) => {
  try {
    console.log("📹 Marking video as completed:", req.body);

    const { courseId, videoId } = req.body;

    if (!courseId || !videoId) {
      return res.status(400).json({ success: false, message: "Course ID and Video ID required" });
    }

    // Find or create progress record
    let progress = await Progress.findOne({ 
      userId: req.user.id, 
      courseId: courseId 
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        courseId: courseId,
        completedVideos: [videoId]
      });
    } else {
      if (!progress.completedVideos.includes(videoId)) {
        progress.completedVideos.push(videoId);
      }
    }

    await progress.save();

    res.json({ success: true, message: "Video marked as completed" });
  } catch (err) {
    console.error("❌ Error marking video complete:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* SEED SAMPLE DATA */
app.post("/seed", async (req, res) => {
  try {
    console.log("🌱 Seeding sample data...");

    // Clear existing data
    await Course.deleteMany({});
    await Progress.deleteMany({});
    await Schedule.deleteMany({}); // Clear schedule data too

    // Create sample courses with videos
    const courses = [
      {
        title: "Web Development Fundamentals",
        description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
        duration: "10 hours",
        level: "beginner",
        price: 49.99,
        category: "Programming",
        teacher: "Mr. Johnson",
        videos: [
          { id: "web1", title: "Introduction to Web Development", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "05:00" },
          { id: "web2", title: "HTML Basics & Structure", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "08:30" },
          { id: "web3", title: "CSS Styling Fundamentals", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "12:15" },
          { id: "web4", title: "JavaScript Introduction", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "15:00" },
          { id: "web5", title: "Building Your First Website", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "20:00" }
        ]
      },
      {
        title: "Mathematics for Beginners",
        description: "Master fundamental mathematical concepts with interactive lessons.",
        duration: "8 hours",
        level: "beginner",
        price: 39.99,
        category: "Mathematics",
        teacher: "Ms. Smith",
        videos: [
          { id: "math1", title: "Numbers and Operations", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "07:00" },
          { id: "math2", title: "Basic Algebra", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "10:00" },
          { id: "math3", title: "Geometry Fundamentals", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "11:30" },
          { id: "math4", title: "Problem Solving Techniques", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "14:00" }
        ]
      },
      {
        title: "Science Explorer",
        description: "Discover the wonders of science through engaging experiments and lessons.",
        duration: "12 hours",
        level: "intermediate",
        price: 59.99,
        category: "Science",
        teacher: "Mr. Davis",
        videos: [
          { id: "sci1", title: "Introduction to Scientific Method", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "06:00" },
          { id: "sci2", title: "Chemistry Basics", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "09:00" },
          { id: "sci3", title: "Physics Fundamentals", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "13:00" },
          { id: "sci4", title: "Biology and Life Sciences", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "16:00" },
          { id: "sci5", title: "Environmental Science", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "18:00" }
        ]
      },
      {
        title: "Creative Arts & Design",
        description: "Express your creativity through various art forms and digital design.",
        duration: "7 hours",
        level: "beginner",
        price: 45.00,
        category: "Arts",
        teacher: "Ms. White",
        videos: [
          { id: "art1", title: "Drawing Fundamentals", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "04:00" },
          { id: "art2", title: "Color Theory and Application", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "07:00" },
          { id: "art3", title: "Digital Art Basics", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "10:00" },
          { id: "art4", title: "Graphic Design Principles", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "13:00" }
        ]
      },
      {
        title: "English Language Arts",
        description: "Improve reading, writing, and communication skills.",
        duration: "9 hours",
        level: "intermediate",
        price: 42.50,
        category: "Language",
        teacher: "Mr. Green",
        videos: [
          { id: "eng1", title: "Grammar and Punctuation", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "05:30" },
          { id: "eng2", title: "Creative Writing Workshop", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "08:45" },
          { id: "eng3", title: "Reading Comprehension", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "11:00" },
          { id: "eng4", title: "Public Speaking Skills", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "14:30" },
          { id: "eng5", title: "Literature Analysis", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", duration: "17:00" }
        ]
      }
    ];

    const insertedCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${insertedCourses.length} sample courses`);

    // Create sample schedule items
    const scheduleItems = [
      { subject: "Web Dev Live", day: "Monday", time: "10:00 AM", teacher: "Mr. Johnson", type: "live", location: "Zoom Link", duration: "1.5h" },
      { subject: "Math Exam Prep", day: "Wednesday", time: "02:00 PM", teacher: "Ms. Smith", type: "exam", location: "Classroom 3B", duration: "1h" },
      { subject: "Science Lab", day: "Friday", time: "09:00 AM", teacher: "Mr. Davis", type: "assignment", location: "Lab 1A", duration: "2h" }
    ];
    const insertedSchedule = await Schedule.insertMany(scheduleItems);
    console.log(`✅ Created ${insertedSchedule.length} sample schedule items`);

    res.json({ 
      success: true, 
      message: "Sample data seeded successfully",
      courses: insertedCourses.length,
      schedule: insertedSchedule.length
    });
  } catch (err) {
    console.error("❌ Error seeding data:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 EduHub Kids Enhanced Server running on http://localhost:${PORT}`);
  console.log("💡 Make sure MongoDB is running!");
  console.log("📁 Uploads directory: ./uploads/videos");
  console.log("📝 Enhanced API Endpoints:");
  console.log("   POST /register - Register new user");
  console.log("   POST /login - Login user");
  console.log("   Teacher/Admin Endpoints:");
  console.log("     GET /teacher/courses - Get courses");
  console.log("     POST /teacher/courses - Create course");
  console.log("     PUT /teacher/courses/:id - Update course");
  console.log("     DELETE /teacher/courses/:id - Delete course");
  console.log("     POST /teacher/courses/:courseId/videos - Upload video");
  console.log("     GET /teacher/courses/:courseId/videos - Get course videos");
  console.log("     DELETE /teacher/videos/:videoId - Delete video");
  console.log("     GET /teacher/schedule - Get schedule");
  console.log("     POST /teacher/schedule - Create schedule item");
  console.log("     PUT /teacher/schedule/:id - Update schedule item");
  console.log("     DELETE /teacher/schedule/:id - Delete schedule item");
  console.log("   Admin Endpoints:");
  console.log("     GET /admin/students - Get students");
  console.log("     POST /admin/students - Create student");
  console.log("     PUT /admin/students/:id - Update student");
  console.log("     DELETE /admin/students/:id - Delete student");
  console.log("     GET /admin/teachers - Get teachers");
  console.log("     POST /admin/teachers - Create teacher");
  console.log("     PUT /admin/teachers/:id - Update teacher");
  console.log("     DELETE /admin/teachers/:id - Delete teacher");
  console.log("     GET /admin/stats - Get statistics");
  console.log("   Student Endpoints:");
  console.log("     GET /student/courses - Get courses");
  console.log("     GET /student/schedule - Get schedule");
  console.log("     GET /student/videos/:courseId - Get course videos");
  console.log("     POST /student/video/complete - Mark video complete");
  console.log("   General Endpoints:");
  console.log("     GET /user/profile - Get user profile");
  console.log("     POST /seed - Seed sample data (for development)\n");
});