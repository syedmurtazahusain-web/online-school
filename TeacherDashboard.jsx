import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // STRICT ROLE GUARD: Prevents the component from rendering even a single frame if the role is wrong
  const role = localStorage.getItem("role");
  if (role && role !== "teacher") {
    window.location.href = `/dashboard/${role}`; // Use window.location for a hard reset if navigate is too slow
    return null;
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token && !role) {
      navigate("/");
      return;
    }

    setLoading(false);
  }, [navigate]);

  const stats = {
    totalStudents: 45,
    totalCourses: 8,
    averageProgress: 72,
  };

  const courses = [
    { id: 1, name: "Web Development 101", students: 32, avgProgress: 75, color: 'var(--primary-500)' },
    { id: 2, name: "Advanced React", students: 28, avgProgress: 68, color: 'var(--secondary-500)' },
    { id: 3, name: "Python Basics", students: 41, avgProgress: 72, color: 'var(--success-500)' }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const styles = {
    container: {
      padding: "var(--space-8)",
      background: "var(--bg-secondary)",
      minHeight: "100vh",
      animation: "fadeIn 0.5s ease-out"
    },
    header: {
      marginBottom: "var(--space-8)",
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      margin: "0 0 8px 0",
      fontSize: "var(--text-4xl)",
      fontWeight: "800",
      color: "var(--text-primary)"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "var(--space-5)",
      marginBottom: "var(--space-8)"
    },
    card: {
      background: "var(--bg-primary)",
      padding: "var(--space-8)",
      borderRadius: "var(--radius-2xl)",
      textAlign: "center",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      border: "2px solid transparent",
      transition: "all var(--transition-base)",
      cursor: 'pointer'
    },
    number: {
      margin: "0 0 5px 0",
      fontSize: "var(--text-4xl)",
      fontWeight: "800",
      color: "var(--primary-600)"
    },
    label: {
      margin: "0",
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      fontWeight: "600"
    },
    section: {
      background: "var(--bg-primary)",
      padding: "var(--space-8)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-xl)",
      marginBottom: "var(--space-8)"
    },
    sectionTitle: {
      margin: "0 0 var(--space-6) 0",
      fontSize: "var(--text-2xl)",
      fontWeight: "800",
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      textAlign: "left",
      padding: "var(--space-4)",
      borderBottom: "2px solid var(--bg-secondary)",
      fontWeight: "700",
      color: "var(--text-secondary)",
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    },
    td: {
      padding: "var(--space-4)",
      borderBottom: "1px solid var(--bg-secondary)",
      color: "var(--text-primary)",
      fontWeight: "500"
    }
  };

  return (
    <div className="animate-fade-in" style={{ ...styles.container, padding: 'var(--space-12)' }}>
      <header style={styles.header}>
        <div>
          <h1 style={{ ...styles.title, fontSize: '42px', letterSpacing: '-0.04em' }}>Instructor Hub</h1>
          <p style={{ color: '#6b7280', fontWeight: '600', fontSize: '20px', marginTop: '10px' }}>Monitor your active classrooms and student success.</p>
        </div>
        <button className="bg-[#0056D2] text-white px-10 py-5 rounded-2xl font-black hover-lift transition-all shadow-2xl border-none cursor-pointer text-lg tracking-tight">
          + Create New Course
        </button>
      </header>

      <motion.div
        style={styles.grid}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          whileHover={{ y: -12, scale: 1.02, borderColor: '#0056D2' }}
          whileTap={{ scale: 0.98 }}
          className="hover-lift animate-fade-in-up"
          style={{ ...styles.card, background: '#ffffff', borderBottom: '5px solid #0056D2', padding: 'var(--space-12) var(--space-6)' }}
        >
          <div style={{ fontSize: "50px", marginBottom: "30px" }}>👥</div>
          <h3 style={{ ...styles.number, fontSize: '48px' }}>{stats.totalStudents}</h3>
          <p style={styles.label}>Total Students</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -12, scale: 1.02, borderColor: '#ec4899' }}
          whileTap={{ scale: 0.98 }}
          className="hover-lift animate-fade-in-up"
          style={{ ...styles.card, background: '#ffffff', borderBottom: '5px solid #ec4899', padding: 'var(--space-12) var(--space-6)' }}
        >
          <div style={{ fontSize: "50px", marginBottom: "30px" }}>📚</div>
          <h3 style={{ ...styles.number, fontSize: '48px' }}>{stats.totalCourses}</h3>
          <p style={styles.label}>Total Courses</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -12, scale: 1.02, borderColor: '#10b981' }}
          whileTap={{ scale: 0.98 }}
          className="hover-lift animate-fade-in-up"
          style={{ ...styles.card, background: '#ffffff', borderBottom: '5px solid #10b981', padding: 'var(--space-12) var(--space-6)' }}
        >
          <div style={{ fontSize: "50px", marginBottom: "30px" }}>📊</div>
          <h3 style={{ ...styles.number, fontSize: '48px' }}>{stats.averageProgress}%</h3>
          <p style={styles.label}>Average Progress</p>
        </motion.div>
      </motion.div>

      <motion.div
        style={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 style={styles.sectionTitle}>🚀 Active Classrooms</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Course Name</th>
                <th style={styles.th}>Students</th>
                <th style={styles.th}>Average Progress</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td style={styles.td}>{course.name}</td>
                  <td style={styles.td}>{course.students}</td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ flex: 1, height: "10px", background: "var(--bg-secondary)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${course.avgProgress}%`, background: "var(--gradient-primary)", borderRadius: "var(--radius-full)" }} />
                      </div>
                      <span style={{ fontWeight: "800", color: 'var(--primary-600)' }}>{course.avgProgress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;