import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Apply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "",
    experience: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be 6+ characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
          grade: userType === "student" ? formData.grade : undefined,
          experience: userType === "teacher" ? formData.experience : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);
        navigate("/dashboard/home");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "40px 20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <button onClick={() => navigate("/")} style={{ position: "absolute", top: "20px", left: "20px", padding: "10px 20px", background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid white", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>← Back</button>

      {step === 1 ? (
        <div style={{ textAlign: "center", color: "white", marginBottom: "50px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "800", margin: "0 0 15px 0" }}>🎯 Join EduHub Kids</h1>
          <p style={{ fontSize: "20px", opacity: 0.95, margin: "0 0 40px 0" }}>Choose your path and start your journey today!</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", maxWidth: "900px", margin: "0 auto" }}>
            {/* STUDENT */}
            <div onClick={() => { setUserType("student"); setStep(2); }} style={{ background: "white", borderRadius: "20px", padding: "40px", textAlign: "center", cursor: "pointer", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", transition: "all 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ fontSize: "80px", marginBottom: "20px" }}>👨‍🎓</div>
              <h2 style={{ fontSize: "28px", fontWeight: "800", margin: "10px 0", background: "linear-gradient(135deg, #667eea, #764ba2)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>I'm a Student</h2>
              <p style={{ color: "#666", margin: "0 0 25px 0", fontSize: "15px" }}>Join thousands of students learning new skills every day!</p>
              <div style={{ textAlign: "left", margin: "25px 0", fontSize: "14px", color: "#555" }}>
                <div style={{ margin: "8px 0" }}>✨ Access 100+ courses</div>
                <div style={{ margin: "8px 0" }}>🎥 Learn from videos</div>
                <div style={{ margin: "8px 0" }}>🏆 Earn badges & certificates</div>
                <div style={{ margin: "8px 0" }}>📊 Track your progress</div>
              </div>
              <button style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>📝 Register as Student</button>
            </div>

            {/* TEACHER */}
            <div onClick={() => { setUserType("teacher"); setStep(2); }} style={{ background: "white", borderRadius: "20px", padding: "40px", textAlign: "center", cursor: "pointer", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", transition: "all 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ fontSize: "80px", marginBottom: "20px" }}>👨‍🏫</div>
              <h2 style={{ fontSize: "28px", fontWeight: "800", margin: "10px 0", background: "linear-gradient(135deg, #f093fb, #f5576c)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>I'm a Teacher</h2>
              <p style={{ color: "#666", margin: "0 0 25px 0", fontSize: "15px" }}>Share your knowledge and inspire the next generation!</p>
              <div style={{ textAlign: "left", margin: "25px 0", fontSize: "14px", color: "#555" }}>
                <div style={{ margin: "8px 0" }}>📚 Create your courses</div>
                <div style={{ margin: "8px 0" }}>🎬 Upload videos & materials</div>
                <div style={{ margin: "8px 0" }}>👥 Build your student base</div>
                <div style={{ margin: "8px 0" }}>📊 Track student progress</div>
              </div>
              <button style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #f093fb, #f5576c)", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>✍️ Register as Teacher</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "20px", padding: "40px", maxWidth: "500px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: "32px", fontWeight: "800", textAlign: "center", color: "#667eea" }}>{userType === "student" ? "👨‍🎓 Student Registration" : "👨‍🏫 Teacher Registration"}</h2>

          {error && <div style={{ background: "#fee", color: "#c33", padding: "12px", borderRadius: "8px", marginBottom: "15px", textAlign: "center" }}>⚠�� {error}</div>}

          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "2px solid #e5e7eb", boxSizing: "border-box" }} />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "2px solid #e5e7eb", boxSizing: "border-box" }} />

          {userType === "student" && (
            <select value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "2px solid #e5e7eb", boxSizing: "border-box", background: "white", cursor: "pointer" }}>
              <option value="">Select Grade Level</option>
              <option value="elementary">🏫 Elementary (K-5)</option>
              <option value="middle">📚 Middle School (6-8)</option>
              <option value="high">🎓 High School (9-12)</option>
              <option value="college">🎓 College</option>
            </select>
          )}

          {userType === "teacher" && (
            <select value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "2px solid #e5e7eb", boxSizing: "border-box", background: "white", cursor: "pointer" }}>
              <option value="">Select Experience Level</option>
              <option value="beginner">🌟 Beginner (0-2 years)</option>
              <option value="intermediate">⭐ Intermediate (2-5 years)</option>
              <option value="expert">⭐⭐ Expert (5+ years)</option>
            </select>
          )}

          <input type="password" placeholder="Password (6+ characters)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "2px solid #e5e7eb", boxSizing: "border-box" }} />
          <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "2px solid #e5e7eb", boxSizing: "border-box" }} />

          <button onClick={handleRegister} disabled={loading} style={{ width: "100%", padding: "14px", background: "#667eea", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>{loading ? "⏳ Creating Account..." : "✨ Create Account"}</button>
          <p style={{ textAlign: "center", marginTop: "15px", color: "#667eea", cursor: "pointer", fontWeight: "bold" }} onClick={() => { setStep(1); setUserType(""); setError(""); }}>← Back to choose role</p>
        </div>
      )}
    </div>
  );
}

export default Apply;