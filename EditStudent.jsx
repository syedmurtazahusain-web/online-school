import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from '../utils/api';
import { validateForm, studentValidationRules } from '../utils/validation';

function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    phone: '',
    address: '',
    parentName: '',
    parentPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await get(`http://localhost:5000/admin/students/${id}`);
        setFormData(data.student);
        setErrors({});
      } catch (err) {
        setErrors({ fetch: err.message });
      } finally {
        setFetchLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

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
    const validationErrors = validateForm(formData, studentValidationRules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await put(`http://localhost:5000/admin/students/${id}`, formData);
      window.showToast('Student updated successfully!', 'success');
      navigate('/students');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{fontFamily: 'Arial, sans-serif', padding: '20px', background: '#f8f9fa', minHeight: '100vh'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '24px'}}>⏳ Loading student...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily: 'Arial, sans-serif', padding: '20px', background: '#f8f9fa', minHeight: '100vh'}}>
      <div style={{maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
        <h1 style={{margin: '0 0 20px 0', color: '#333'}}>✏️ Edit Student</h1>
        
        {errors.fetch && (
          <div style={{background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px'}}>
            {errors.fetch}
          </div>
        )}
        
        {errors.submit && (
          <div style={{background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px'}}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '10px', border: errors.name ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.name && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.name}</div>}
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{width: '100%', padding: '10px', border: errors.email ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.email && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.email}</div>}
            </div>
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Grade *</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="e.g., 10th Grade"
              required
              style={{width: '100%', padding: '10px', border: errors.grade ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
            />
            {errors.grade && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.grade}</div>}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                style={{width: '100%', padding: '10px', border: errors.phone ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.phone && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.phone}</div>}
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Parent Name</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Parent/Guardian Name"
                style={{width: '100%', padding: '10px', border: errors.parentName ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
              />
              {errors.parentName && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.parentName}</div>}
            </div>
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State"
              style={{width: '100%', padding: '10px', border: errors.address ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
            />
            {errors.address && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.address}</div>}
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px', color: '#333'}}>Parent Phone</label>
            <input
              type="tel"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              placeholder="+1 (555) 987-6543"
              style={{width: '100%', padding: '10px', border: errors.parentPhone ? '1px solid #dc3545' : '1px solid #ddd', borderRadius: '5px', fontSize: '16px'}}
            />
            {errors.parentPhone && <div style={{color: '#dc3545', fontSize: '12px', marginTop: '5px'}}>{errors.parentPhone}</div>}
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
              {loading ? 'Updating...' : 'Update Student'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/students')}
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

export default EditStudent;
