import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Schedule() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      setLoading(false);
      return;
    }

    const endpoint = role === 'teacher' || role === 'admin' 
      ? 'http://localhost:5000/teacher/schedule' 
      : 'http://localhost:5000/student/schedule';

    fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setSchedule(data.schedule || []);
      }
    })
    .catch(err => {
      console.error('Error:', err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  const handleAddClass = () => navigate('/schedule/add');
  const handleEditClass = (id) => navigate(`/schedule/edit/${id}`);
  
  const handleDeleteClass = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/teacher/schedule/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
      setSchedule(schedule.filter(item => item._id !== id));
    })
    .catch(err => {
      console.error('Delete error:', err);
    });
  };

  const role = localStorage.getItem('role');
  const canManage = role === 'teacher' || role === 'admin';

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h1>Schedule</h1>
        {canManage && (
          <button onClick={handleAddClass}>Add Class</button>
        )}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
        {schedule.map(item => (
          <div key={item._id} style={{background: 'white', padding: '20px', border: '1px solid #ddd'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
              <h3>{item.subject}</h3>
              {canManage && (
                <div>
                  <button onClick={() => handleEditClass(item._id)} style={{marginRight: '5px'}}>Edit</button>
                  <button onClick={() => handleDeleteClass(item._id)}>Delete</button>
                </div>
              )}
            </div>
            <p><strong>Day:</strong> {item.day}</p>
            <p><strong>Time:</strong> {item.time}</p>
            <p><strong>Teacher:</strong> {item.teacher}</p>
          </div>
        ))}
      </div>

      {schedule.length === 0 && (
        <div style={{textAlign: 'center', padding: '40px'}}>
          No classes scheduled. {canManage && 'Click "Add Class" to create one.'}
        </div>
      )}
    </div>
  );
}

export default Schedule;
