import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../utils/api';
import { validateForm, courseValidationRules } from '../utils/validation';

function AddCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    price: '',
    category: '',
    teacher: '',
    thumbnail: ''
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
    const validationErrors = validateForm(formData, courseValidationRules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await post('http://localhost:5000/teacher/courses', formData);
      window.showToast('Course created successfully!', 'success');
      navigate('/courses');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{fontFamily: 'Arial, sans-serif', padding: '20px', background: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
        <h1 style={{margin: '0 0 20px 0', color: '#333'}}>Add New Course</h1>
        
        {errors.submit && (
          <div style={{background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px'}}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '10px', border: errors.title ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
            />
            {errors.title && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.title}</div>}
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              style={{width: '100%', padding: '10px', border: errors.description ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px', resize: 'vertical'}}
            />
            {errors.description && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.description}</div>}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 8 weeks"
                required
                style={{width: '100%', padding: '10px', border: errors.duration ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.duration && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.duration}</div>}
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                style={{width: '100%', padding: '10px', border: errors.level ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.level && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.level}</div>}
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                style={{width: '100%', padding: '10px', border: errors.price ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.price && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.price}</div>}
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Programming, Design"
                required
                style={{width: '100%', padding: '10px', border: errors.category ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.category && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.category}</div>}
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

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Thumbnail URL</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={{width: '100%', padding: '10px', border: errors.thumbnail ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
            />
            {errors.thumbnail && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.thumbnail}</div>}
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/courses')}
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

export default AddCourse;
