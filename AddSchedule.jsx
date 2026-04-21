import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../utils/api';
import { validateForm, scheduleValidationRules } from '../utils/validation';

function AddSchedule() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    day: '',
    time: '',
    teacher: '',
    type: 'live',
    location: '',
    duration: '',
    maxStudents: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData, scheduleValidationRules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await post('http://localhost:5000/teacher/schedule', formData);
      window.showToast('Class scheduled successfully!', 'success');
      navigate('/schedule');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{fontFamily: 'Arial, sans-serif', padding: '20px', background: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
        <h1 style={{margin: '0 0 20px 0', color: '#333'}}>Schedule New Class</h1>
        
        {errors.submit && (
          <div style={{background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px'}}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', border: errors.subject ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
            />
            {errors.subject && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.subject}</div>}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Day *</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '10px', border: errors.day ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              {errors.day && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.day}</div>}
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '10px', border: errors.time ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.time && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.time}</div>}
            </div>
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Teacher *</label>
            <input
              type="text"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', border: errors.teacher ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
            />
            {errors.teacher && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.teacher}</div>}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '10px', border: errors.type ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              >
                <option value="live">Live Class</option>
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
                <option value="meeting">Meeting</option>
              </select>
              {errors.type && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.type}</div>}
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 2 hours"
                style={{width: '100%', padding: '10px', border: errors.duration ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.duration && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.duration}</div>}
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Room 101, Online"
                style={{width: '100%', padding: '10px', border: errors.location ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.location && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.location}</div>}
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Max Students</label>
              <input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                placeholder="30"
                min="1"
                style={{width: '100%', padding: '10px', border: errors.maxStudents ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.maxStudents && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.maxStudents}</div>}
            </div>
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Scheduling...' : 'Schedule Class'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/schedule')}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSchedule;
