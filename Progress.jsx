import { useState, useEffect } from 'react';

function Progress() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token) {
        setError('Please login to view progress');
        setLoading(false);
        return;
      }

      // Mock progress data since backend doesn't have progress tracking yet
      const mockCourses = [
        {
          id: 1,
          title: 'Web Development Fundamentals',
          description: 'Learn HTML, CSS, and JavaScript basics',
          progress: 75,
          totalVideos: 20,
          completedVideos: 15,
          level: 'Beginner',
          teacher: 'Mr. Johnson',
          lastActivity: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          title: 'Mathematics for Beginners',
          description: 'Master fundamental mathematical concepts',
          progress: 45,
          totalVideos: 16,
          completedVideos: 7,
          level: 'Beginner',
          teacher: 'Ms. Smith',
          lastActivity: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          title: 'Science Explorer',
          description: 'Discover the wonders of science',
          progress: 20,
          totalVideos: 25,
          completedVideos: 5,
          level: 'Intermediate',
          teacher: 'Dr. Brown',
          lastActivity: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 4,
          title: 'Creative Arts & Design',
          description: 'Express your creativity through various art forms',
          progress: 90,
          totalVideos: 12,
          completedVideos: 11,
          level: 'Beginner',
          teacher: 'Ms. Davis',
          lastActivity: new Date(Date.now() - 1800000).toISOString()
        }
      ];

      setCourses(mockCourses);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError(err.message || 'Failed to fetch progress');
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return '#10b981'; // Green
    if (progress >= 70) return '#3b82f6'; // Blue
    if (progress >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getProgressText = (progress) => {
    if (progress >= 90) return 'Excellent!';
    if (progress >= 70) return 'Good';
    if (progress >= 50) return 'Keep Going';
    return 'Needs Attention';
  };

  if (loading) {
    return (
      <div style={{fontFamily: 'Arial, sans-serif', padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh'}}>
        <div style={{textAlign: 'center', color: 'white'}}>
          <div style={{fontSize: '24px'}}>⏳ Loading progress...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{fontFamily: 'Arial, sans-serif', padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh'}}>
        <div style={{textAlign: 'center', color: 'white'}}>
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
        <h1 style={{margin: 0}}>📊 Learning Progress</h1>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <span style={{background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold'}}>
            {courses.length} Courses
          </span>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
        {/* Progress Overview */}
        <div style={{background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)'}}>
          <h2 style={{margin: '0 0 20px 0', fontSize: '20px', color: '#333'}}>📈 Progress Overview</h2>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center'}}>
              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6'}}>{Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%</div>
              <div style={{fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px'}}>Average Progress</div>
            </div>
            <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center'}}>
              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>{courses.reduce((acc, course) => acc + course.completedVideos, 0)}</div>
              <div style={{fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px'}}>Videos Completed</div>
            </div>
          </div>

          <div style={{marginTop: '25px'}}>
            <h3 style={{margin: '0 0 15px 0', fontSize: '16px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px'}}>Course Completion</h3>
            {courses.map((course) => (
              <div key={course.id} style={{marginBottom: '15px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                  <span style={{fontSize: '14px', color: '#333'}}>{course.title}</span>
                  <span style={{fontSize: '12px', color: '#666'}}>{course.progress}%</span>
                </div>
                <div style={{width: '100%', height: '8px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden'}}>
                  <div 
                    style={{
                      width: `${course.progress}%`,
                      height: '100%',
                      background: getProgressColor(course.progress),
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Details */}
        <div style={{background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', maxHeight: '600px', overflow: 'auto'}}>
          <h2 style={{margin: '0 0 20px 0', fontSize: '20px', color: '#333'}}>📚 Course Details</h2>
          
          {courses.map((course) => (
            <div key={course.id} style={{borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px'}}>
                <div>
                  <h3 style={{margin: '0 0 5px 0', fontSize: '16px', color: '#333'}}>{course.title}</h3>
                  <p style={{margin: '0', fontSize: '14px', color: '#666'}}>{course.description}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <span style={{background: getProgressColor(course.progress), color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'}}>
                    {getProgressText(course.progress)}
                  </span>
                </div>
              </div>

              <div style={{display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '12px', color: '#666'}}>
                <span>👨‍🏫 {course.teacher}</span>
                <span>📊 {course.completedVideos}/{course.totalVideos} videos</span>
                <span>🎯 {course.level}</span>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div style={{width: '100%', height: '10px', background: '#e9ecef', borderRadius: '5px', overflow: 'hidden'}}>
                  <div 
                    style={{
                      width: `${course.progress}%`,
                      height: '100%',
                      background: getProgressColor(course.progress),
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <button 
                  style={{
                    background: getProgressColor(course.progress),
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Continue
                </button>
              </div>

              <p style={{margin: '10px 0 0 0', fontSize: '12px', color: '#999'}}>
                Last activity: {new Date(course.lastActivity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Section */}
      <div style={{marginTop: '30px', background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)'}}>
        <h2 style={{margin: '0 0 15px 0', fontSize: '20px', color: '#333'}}>💡 Motivation & Tips</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
          <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px'}}>
            <div style={{fontSize: '24px', marginBottom: '10px'}}>🎯</div>
            <h4 style={{margin: '0 0 5px 0', fontSize: '14px'}}>Set Goals</h4>
            <p style={{margin: '0', fontSize: '12px', color: '#666'}}>Complete at least one video per day to maintain steady progress.</p>
          </div>
          
          <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px'}}>
            <div style={{fontSize: '24px', marginBottom: '10px'}}>⏰</div>
            <h4 style={{margin: '0 0 5px 0', fontSize: '14px'}}>Consistency</h4>
            <p style={{margin: '0', fontSize: '12px', color: '#666'}}>Regular study sessions are more effective than cramming.</p>
          </div>
          
          <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '12px'}}>
            <div style={{fontSize: '24px', marginBottom: '10px'}}>🏆</div>
            <h4 style={{margin: '0 0 5px 0', fontSize: '14px'}}>Celebrate Wins</h4>
            <p style={{margin: '0', fontSize: '12px', color: '#666'}}>Every completed video is a step forward in your learning journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;