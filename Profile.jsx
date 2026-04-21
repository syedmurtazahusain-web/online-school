import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentPhone: '',
    qualification: '',
    department: '',
    subjects: '',
    experience: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token) {
        setError('Please login to access profile');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/user/profile', {
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
        setUser(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          parentName: data.user.parentName || '',
          parentPhone: data.user.parentPhone || '',
          qualification: data.user.qualification || '',
          department: data.user.department || '',
          subjects: data.user.subjects ? data.user.subjects.join(', ') : '',
          experience: data.user.experience || ''
        });
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/user/profile', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        alert('✅ Profile updated successfully');
      } else {
        alert('❌ ' + (data.message || 'Failed to update profile'));
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('❌ Error updating profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const role = localStorage.getItem('role');

  if (loading) {
    return (
      <div style={{fontFamily: 'Arial, sans-serif', padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh'}}>
        <div style={{textAlign: 'center', color: 'white'}}>
          <div style={{fontSize: '24px'}}>⏳ Loading profile...</div>
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
        <h1 style={{margin: 0}}>👤 Profile</h1>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            style={{background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
          >
            {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
          </button>
          <button 
            onClick={handleLogout}
            style={{background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
        {/* Profile Card */}
        <div style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px'}}>
            <div style={{width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold'}}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{margin: 0, fontSize: '24px', color: '#333'}}>{user?.name}</h2>
              <p style={{margin: '5px 0 0 0', color: '#666', fontSize: '16px'}}>📧 {user?.email}</p>
              <span style={{background: '#e3f2fd', color: '#1976d2', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'}}>
                {user?.role}
              </span>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div>
              <h3 style={{margin: '0 0 10px 0', fontSize: '16px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px'}}>Basic Info</h3>
              <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px'}}>
                <p style={{margin: '5px 0', color: '#333'}}><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
                <p style={{margin: '5px 0', color: '#333'}}><strong>Address:</strong> {user?.address || 'Not provided'}</p>
                {user?.role === 'student' && (
                  <>
                    <p style={{margin: '5px 0', color: '#333'}}><strong>Grade:</strong> {user?.grade || 'Not provided'}</p>
                    <p style={{margin: '5px 0', color: '#333'}}><strong>School:</strong> {user?.school || 'Not provided'}</p>
                  </>
                )}
                {user?.role === 'teacher' && (
                  <>
                    <p style={{margin: '5px 0', color: '#333'}}><strong>Department:</strong> {user?.department || 'Not provided'}</p>
                    <p style={{margin: '5px 0', color: '#333'}}><strong>Experience:</strong> {user?.experience || 'Not provided'}</p>
                    <p style={{margin: '5px 0', color: '#333'}}><strong>Qualification:</strong> {user?.qualification || 'Not provided'}</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 style={{margin: '0 0 10px 0', fontSize: '16px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px'}}>Additional Info</h3>
              <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px'}}>
                {user?.role === 'student' && (
                  <>
                    <p style={{margin: '5px 0', color: '#333'}}><strong>Parent Name:</strong> {user?.parentName || 'Not provided'}</p>
                    <p style={{margin: '5px 0', color: '#333'}}><strong>Parent Phone:</strong> {user?.parentPhone || 'Not provided'}</p>
                  </>
                )}
                {user?.role === 'teacher' && (
                  <p style={{margin: '5px 0', color: '#333'}}><strong>Subjects:</strong> {user?.subjects?.join(', ') || 'Not provided'}</p>
                )}
                <p style={{margin: '5px 0', color: '#333'}}><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)'}}>
            <h2 style={{margin: '0 0 20px 0', fontSize: '24px', color: '#333'}}>✏️ Edit Profile</h2>
            
            <form onSubmit={handleUpdateProfile}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>FULL NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                    required
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>PHONE</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>ADDRESS</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                  />
                </div>
              </div>

              {user?.role === 'student' && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>PARENT NAME</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>PARENT PHONE</label>
                    <input
                      type="text"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                    />
                  </div>
                </div>
              )}

              {user?.role === 'teacher' && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>DEPARTMENT</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>EXPERIENCE</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                    />
                  </div>
                </div>
              )}

              {user?.role === 'teacher' && (
                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>SUBJECTS (comma-separated)</label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics, Science, English"
                    style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                  />
                </div>
              )}

              {user?.role === 'teacher' && (
                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>QUALIFICATION</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                  />
                </div>
              )}

              <div style={{display: 'flex', gap: '15px'}}>
                <button 
                  type="submit"
                  style={{background: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'}}
                >
                  ✅ Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{background: '#ef4444', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'}}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;