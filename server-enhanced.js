const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eduhub_kids")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err.message));

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
userSchema.pre("save", async function() {
  const user = this;

  // Check if password is modified
  if (!user.isModified("password")) return;

  try {
    // Hash password using async/await
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  } catch (err) {
    throw err;
  }
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

// COURSE SCHEMA (Enhanced)
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Changed from 'name' to 'title'
  description: { type: String, required: true },
  duration: { type: String, required: true },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  teacher: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  videos: [{ 
    id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    uploadDate: { type: Date, default: Date.now }
  }],
  students: [mongoose.Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model("Course", courseSchema);

// SCHEDULE SCHEMA (New)
const scheduleSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  teacher: { type: String, required: true },
  type: { type: String, enum: ["live", "assignment", "exam", "meeting"], default: "live" },
  location: { type: String, default: "" },
  duration: { type: String, default: "" },
  maxStudents: { type: Number, default: 30 },
  createdAt: { type: Date, default: Date.now }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

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
  res.send("🚀 EduHub Kids Enhanced API running");
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
      grade: grade || "",
      school: school || "",
      experience: experience || "",
      department: department || "",
      subjects: subjects ? subjects.split(',').map(s => s.trim()) : [],
      phone: phone || "",
      address: address || "",
      parentName: parentName || "",
      parentPhone: parentPhone || "",
      qualification: qualification || ""
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

    console.log(" User found");

    // Compare passwords using async/await
    console.log("Comparing passwords...");
    try {
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
      console.error(" Password comparison error:", err);
      return res.status(500).json({ success: false, message: "Error comparing password" });
    }
  } catch (err) {
    console.error(" LOGIN ERROR:", err.message);
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
  console.log("     GET /admin/stats - Get statistics\n");
});
