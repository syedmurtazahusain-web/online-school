import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, del } from '../utils/api';

function VideoManagement() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await get('http://localhost:5000/teacher/courses');
        setCourses(data.courses || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const fetchVideos = async () => {
        try {
          const data = await get(`http://localhost:5000/teacher/courses/${selectedCourse}/videos`);
          setVideos(data.videos || []);
        } catch (err) {
          console.error('Error fetching videos:', err);
        }
      };

      fetchVideos();
    } else {
      setVideos([]);
    }
  }, [selectedCourse]);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVideo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    setUploadLoading(true);
    try {
      await post(`http://localhost:5000/teacher/courses/${selectedCourse}/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      window.showToast('Video uploaded successfully!', 'success');
      e.target.reset();
      
      // Refresh videos
      const data = await get(`http://localhost:5000/teacher/courses/${selectedCourse}/videos`);
      setVideos(data.videos || []);
    } catch (err) {
      window.showToast(err.message, 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    
    try {
      await del(`http://localhost:5000/teacher/videos/${videoId}`);
      setVideos(videos.filter(video => video.id !== videoId));
      window.showToast('Video deleted successfully', 'success');
    } catch (err) {
      window.showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <div>Loading video management...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{padding: '20px'}}>
        <div style={{background: '#fee', color: '#c33', padding: '15px', borderRadius: '8px'}}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{padding: '20px', background: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1>📹 Video Management</h1>
        <button
          onClick={() => navigate('/courses')}
          style={{background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer'}}
        >
          ← Back to Courses
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px'}}>
        {/* Upload Form */}
        <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h2 style={{margin: '0 0 20px 0', color: '#333'}}>Upload New Video</h2>
          
          <form onSubmit={handleAddVideo}>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Select Course *</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title || course.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Video Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter video title..."
                required
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
            </div>

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Video Description</label>
              <textarea
                name="description"
                placeholder="Enter video description..."
                rows="3"
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', resize: 'vertical'}}
              />
            </div>

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Video File *</label>
              <input
                type="file"
                name="video"
                accept="video/*"
                required
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
            </div>

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Thumbnail (Optional)</label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
            </div>

            <button
              type="submit"
              disabled={uploadLoading || !selectedCourse}
              style={{
                background: uploadLoading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: uploadLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              {uploadLoading ? 'Uploading...' : '📤 Upload Video'}
            </button>
          </form>
        </div>

        {/* Videos List */}
        <div style={{background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <div style={{padding: '20px', borderBottom: '1px solid #dee2e6'}}>
            <h3 style={{margin: '0 0 15px 0', color: '#333'}}>
              {selectedCourse ? `Videos for ${courses.find(c => c._id === selectedCourse)?.title || 'Selected Course'}` : 'Select a Course to View Videos'}
            </h3>
            
            {selectedCourse && (
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px'}}
              />
            )}
          </div>

          <div style={{maxHeight: '600px', overflowY: 'auto'}}>
            {!selectedCourse ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                Please select a course to view and manage videos
              </div>
            ) : filteredVideos.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                {searchTerm ? 'No videos found matching your search.' : 'No videos uploaded yet. Upload your first video!'}
              </div>
            ) : (
              <div>
                {filteredVideos.map((video, index) => (
                  <div key={video.id} style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #dee2e6',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}>
                    <div style={{flex: 1, minWidth: 0}}>
                      <h4 style={{margin: '0 0 4px 0', color: '#1e293b', fontSize: '15px', fontWeight: '600'}}>{video.title}</h4>
                      {video.description && (
                        <p style={{margin: '0 0 4px 0', color: '#64748b', fontSize: '13px', lineHeight: '1.4'}}>
                          {video.description}
                        </p>
                      )}
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px'}}>
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontSize: '12px', fontWeight: '600', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px'}}>
                          ⏱ {video.duration || 'N/A'}
                        </span>
                        <span style={{color: '#94a3b8', fontSize: '12px'}}>
                          {video.uploadDate ? new Date(video.uploadDate).toLocaleDateString() : 'Recently uploaded'}
                        </span>
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '8px', flexShrink: 0}}>
                      <button
                        onClick={() => window.open(video.url, '_blank')}
                        style={{background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s'}}
                        onMouseOver={(e) => e.target.style.background = '#2563eb'}
                        onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                      >
                        ▶ Play
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        style={{background: '#f1f5f9', color: '#ef4444', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'}}
                        onMouseOver={(e) => {e.target.style.background = '#ef4444'; e.target.style.color = 'white'; e.target.style.borderColor = '#ef4444'}}
                        onMouseOut={(e) => {e.target.style.background = '#f1f5f9'; e.target.style.color = '#ef4444'; e.target.style.borderColor = '#e2e8f0'}}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoManagement;
