import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, del } from '../utils/api';

function TeacherManagement() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await get('http://localhost:5000/admin/teachers');
        setTeachers(data.teachers || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddTeacher = () => navigate('/teachers/add');
  const handleEditTeacher = (id) => navigate(`/teachers/edit/${id}`);
  
  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    
    try {
      await del(`http://localhost:5000/admin/teachers/${id}`);
      setTeachers(teachers.filter(teacher => teacher._id !== id));
      window.showToast('Teacher deleted successfully', 'success');
    } catch (err) {
      window.showToast(err.message, 'error');
    }
  };

  const handleSelectTeacher = (id) => {
    setSelectedTeachers(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === filteredTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map(teacher => teacher._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTeachers.length === 0) {
      window.showToast('Please select teachers to delete', 'warning');
      return;
    }

    if (!window.confirm(`Delete ${selectedTeachers.length} teacher(s)?`)) return;
    
    try {
      await Promise.all(
        selectedTeachers.map(id => del(`http://localhost:5000/admin/teachers/${id}`))
      );
      setTeachers(teachers.filter(teacher => !selectedTeachers.includes(teacher._id)));
      setSelectedTeachers([]);
      window.showToast(`${selectedTeachers.length} teacher(s) deleted successfully`, 'success');
    } catch (err) {
      window.showToast(err.message, 'error');
    }
  };

  const handleExport = () => {
    const dataToExport = filteredTeachers.map(teacher => ({
      Name: teacher.name,
      Email: teacher.email,
      Department: teacher.department,
      Subjects: teacher.subjects.join('; '),
      Phone: teacher.phone || '',
      Address: teacher.address || '',
      Qualification: teacher.qualification || '',
      Experience: teacher.experience || ''
    }));

    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `teachers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    window.showToast('Teachers exported successfully', 'success');
  };

  if (loading) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <div>Loading teachers...</div>
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
        <h1>Teacher Management</h1>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', width: '250px'}}
          />
          <button
            onClick={handleExport}
            style={{background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer'}}
          >
            📊 Export
          </button>
          {selectedTeachers.length > 0 && (
            <button
              onClick={handleBulkDelete}
              style={{background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer'}}
            >
              🗑️ Delete ({selectedTeachers.length})
            </button>
          )}
          <button
            onClick={handleAddTeacher}
            style={{background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer'}}
          >
            ➕ Add Teacher
          </button>
        </div>
      </div>

      {filteredTeachers.length > 0 && (
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <input
              type="checkbox"
              checked={selectedTeachers.length === filteredTeachers.length}
              onChange={handleSelectAll}
              style={{cursor: 'pointer'}}
            />
            <span>Select All ({filteredTeachers.length})</span>
          </label>
        </div>
      )}

      <div style={{background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        {filteredTeachers.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
            {searchTerm ? 'No teachers found matching your search.' : 'No teachers found. Click "Add Teacher" to create one.'}
          </div>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: '#f8f9fa', borderBottom: '2px solid #dee2e6'}}>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Select</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Name</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Email</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Department</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Subjects</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Experience</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher, index) => (
                <tr key={teacher._id} style={{borderBottom: '1px solid #dee2e6', backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'}}>
                  <td style={{padding: '12px'}}>
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher._id)}
                      onChange={() => handleSelectTeacher(teacher._id)}
                      style={{cursor: 'pointer'}}
                    />
                  </td>
                  <td style={{padding: '12px', fontWeight: '500'}}>{teacher.name}</td>
                  <td style={{padding: '12px', color: '#666'}}>{teacher.email}</td>
                  <td style={{padding: '12px'}}>{teacher.department}</td>
                  <td style={{padding: '12px', color: '#666'}}>{teacher.subjects.join(', ')}</td>
                  <td style={{padding: '12px', color: '#666'}}>{teacher.experience ? `${teacher.experience} years` : '-'}</td>
                  <td style={{padding: '12px'}}>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button
                        onClick={() => handleEditTeacher(teacher._id)}
                        style={{background: '#007bff', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px'}}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        style={{background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px'}}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TeacherManagement;
