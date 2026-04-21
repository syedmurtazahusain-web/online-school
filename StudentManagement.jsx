import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, del } from '../utils/api';

function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await get('http://localhost:5000/admin/students');
        setStudents(data.students || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => navigate('/students/add');
  const handleEditStudent = (id) => navigate(`/students/edit/${id}`);
  
  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    
    try {
      await del(`http://localhost:5000/admin/students/${id}`);
      setStudents(students.filter(student => student._id !== id));
      window.showToast('Student deleted successfully', 'success');
    } catch (err) {
      window.showToast(err.message, 'error');
    }
  };

  const handleSelectStudent = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) {
      window.showToast('Please select students to delete', 'warning');
      return;
    }

    if (!window.confirm(`Delete ${selectedStudents.length} student(s)?`)) return;
    
    try {
      await Promise.all(
        selectedStudents.map(id => del(`http://localhost:5000/admin/students/${id}`))
      );
      setStudents(students.filter(student => !selectedStudents.includes(student._id)));
      setSelectedStudents([]);
      window.showToast(`${selectedStudents.length} student(s) deleted successfully`, 'success');
    } catch (err) {
      window.showToast(err.message, 'error');
    }
  };

  const handleExport = () => {
    const dataToExport = filteredStudents.map(student => ({
      Name: student.name,
      Email: student.email,
      Grade: student.grade,
      Phone: student.phone || '',
      Address: student.address || '',
      'Parent Name': student.parentName || '',
      'Parent Phone': student.parentPhone || ''
    }));

    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    window.showToast('Students exported successfully', 'success');
  };

  if (loading) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <div>Loading students...</div>
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
        <h1>Student Management</h1>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <input
            type="text"
            placeholder="Search students..."
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
          {selectedStudents.length > 0 && (
            <button
              onClick={handleBulkDelete}
              style={{background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer'}}
            >
              🗑️ Delete ({selectedStudents.length})
            </button>
          )}
          <button
            onClick={handleAddStudent}
            style={{background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer'}}
          >
            ➕ Add Student
          </button>
        </div>
      </div>

      {filteredStudents.length > 0 && (
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <input
              type="checkbox"
              checked={selectedStudents.length === filteredStudents.length}
              onChange={handleSelectAll}
              style={{cursor: 'pointer'}}
            />
            <span>Select All ({filteredStudents.length})</span>
          </label>
        </div>
      )}

      <div style={{background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        {filteredStudents.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
            {searchTerm ? 'No students found matching your search.' : 'No students found. Click "Add Student" to create one.'}
          </div>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: '#f8f9fa', borderBottom: '2px solid #dee2e6'}}>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Select</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Name</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Email</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Grade</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Phone</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Parent</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student._id} style={{borderBottom: '1px solid #dee2e6', backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'}}>
                  <td style={{padding: '12px'}}>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleSelectStudent(student._id)}
                      style={{cursor: 'pointer'}}
                    />
                  </td>
                  <td style={{padding: '12px', fontWeight: '500'}}>{student.name}</td>
                  <td style={{padding: '12px', color: '#666'}}>{student.email}</td>
                  <td style={{padding: '12px'}}>{student.grade}</td>
                  <td style={{padding: '12px', color: '#666'}}>{student.phone || '-'}</td>
                  <td style={{padding: '12px', color: '#666'}}>{student.parentName || '-'}</td>
                  <td style={{padding: '12px'}}>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button
                        onClick={() => handleEditStudent(student._id)}
                        style={{background: '#007bff', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px'}}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
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

export default StudentManagement;
