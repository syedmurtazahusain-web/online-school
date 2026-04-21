import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token) {
        setError('Please login to access courses');
        setLoading(false);
        return;
      }

      const endpoint = role === 'teacher' || role === 'admin' 
        ? 'http://localhost:5000/teacher/courses' 
        : 'http://localhost:5000/student/courses';

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setCourses(data.courses || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    const role = localStorage.getItem('role');
    if (role === 'teacher' || role === 'admin') {
      navigate('/courses/add');
    }
  };

  const handleEditCourse = (courseId) => {
    const role = localStorage.getItem('role');
    if (role === 'teacher' || role === 'admin') {
      navigate(`/courses/edit/${courseId}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const role = localStorage.getItem('role');
    if (role !== 'teacher' && role !== 'admin') return;

    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/teacher/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      
      if (data.success) {
        setCourses(courses.filter(course => course._id !== courseId));
        alert('✅ Course deleted successfully');
      } else {
        alert('❌ ' + (data.message || 'Failed to delete'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('❌ Error deleting course');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'beginner') return course.level === 'beginner' && matchesSearch;
    if (filter === 'intermediate') return course.level === 'intermediate' && matchesSearch;
    if (filter === 'advanced') return course.level === 'advanced' && matchesSearch;
    return matchesSearch;
  });

  const role = localStorage.getItem('role');
  const canManageCourses = role === 'teacher' || role === 'admin';

  if (loading) {
    return (
      <div style={{fontFamily: 'Arial, sans-serif', padding: '20px', background: '#f8f9fa', minHeight: '100vh'}}>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <div style={{fontSize: '24px'}}>⏳ Loading courses...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{fontFamily: 'Arial, sans-serif', padding: '20px', background: '#f8f9fa', minHeight: '100vh'}}>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <div style={{background: '#fee', color: '#c33', padding: '15px', borderRadius: '8px', display: 'inline-block'}}>
            ⚠️ {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily: 'Arial, sans-serif', padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', color: 'white'}}>
        <h1 style={{margin: 0}}>📚 Courses</h1>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{padding: '10px 15px', border: 'none', borderRadius: '8px', fontSize: '14px', width: '250px'}}
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{padding: '10px 15px', border: 'none', borderRadius: '8px', fontSize: '14px'}}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          
          {canManageCourses && (
            <button 
              onClick={handleAddCourse}
              style={{background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
            >
              ➕ Add Course
            </button>
          )}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
          <div style={{fontSize: '50px', marginBottom: '10px'}}>📚</div>
          <p style={{fontSize: '18px', color: '#1e293b', fontWeight: '600'}}>No courses found.</p>
          {canManageCourses && <p style={{color: '#64748b', marginTop: '8px'}}>Click "➕ Add Course" to create one!</p>}
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px'}}>
          {filteredCourses.map((course, i) => (
            <div key={course._id} style={{background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
                <h3 style={{margin: 0, color: '#333', fontSize: '22px'}}>{course.title}</h3>
                {canManageCourses && (
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button 
                      onClick={() => handleEditCourse(course._id)}
                      style={{background: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold'}}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course._id)}
                      style={{background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold'}}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
              
              <p style={{margin: '20px 0', color: '#555', lineHeight: '1.6'}}>{course.description}</p>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                  <span style={{background: '#e3f2fd', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'}}>
                    {course.level || 'All Levels'}
                  </span>
                  <span style={{color: '#666', fontSize: '16px', fontWeight: 'bold'}}>
                    💰 ${course.price || '0'}
                  </span>
                </div>
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                  <span style={{color: '#666', fontSize: '14px'}}>
                    ⏱️ {course.duration || 'N/A'}
                  </span>
                  <span style={{color: '#666', fontSize: '14px'}}>
                    👨‍🏫 {course.teacher || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
