import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Students.css';
import Sidebar from '../components/Sidebar';
import { API_ENDPOINTS } from '../apiConfig';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const effectRan = useRef(false);
  const [search, setSearch] = useState('');
  const [studentData, setStudentData] = useState({
    id: '',
    std_name: '',
    std_class: '',
    vaccinationStatus: '',
    vacc_name: '',
    vacc_date: '',
  });

  const [editStudent, setEditStudent] = useState(null);

   useEffect(() => {
 
    if (!effectRan.current) {
    getAllStudents();
    }

    effectRan.current = true;
  },
  []);

  // fetch API
     const getAllStudents = async () => {
      setIsLoading(true);
      setError('');
   try {
        const response = await axios.get(API_ENDPOINTS.GET_STUDENTS);
        setStudents(response.data.students);
      } catch (err) {
          console.error("Error fetching students data:", err);
          if (err.response && err.response.data && err.response.data.message) {
              setError(err.response.data.message);
          } else {
              setError('Failed to load students data. Please try again.');
          }
      }
      finally{
        setIsLoading(false);
      }
    }


  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(studentData);
    try {
      const response = await axios.post(`${API_ENDPOINTS.ADD_STUDENT}`, {
            student_id: studentData.id,
            name: studentData.std_name,
            student_class: studentData.std_class,
            vaccinated: false,
            vaccine_name: null,
            vaccination_date: null,
      });

      if (response.data) {
         getAllStudents(); // refresh list
         setStudentData({
          id: '',
          std_name: '',
          std_class: '',
          vaccinationStatus: '',
          vacc_name: '',
          vacc_date: '',
        });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data) {
        setError(err.response.data.message);
      }
      console.error('Login API error:', err);
      alert(error);
    }
  };

  const handleEdit = (student) => {
    console.log(student);
  setEditStudent({ ...student });
};

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditStudent((prev) => ({
    ...prev,
    [name]: name === 'vaccinated' ? value === 'true' : value,
  }));
};

const submitEdit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(API_ENDPOINTS.UPDATE_STUDENT(editStudent.student_id), editStudent);
    setEditStudent(null);
    getAllStudents(); // refresh list
  } catch (err) {
    console.error(err.data.message);
    alert(err.data.message);
  }
};

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_ENDPOINTS.DELETE_STUDENT(id)}`, {
            student_id: id,
      });

      setStudents(prev => prev.filter(s => s.student_id !== id));
    } catch (error) {
      console.error('Failed to delete student:', error);
      alert('Failed to delete student.');
    }

  };

   const filtered = (Array.isArray(students) ? students : []).filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Upload CSV
  const handleBulkUpload = (file) => {
  const reader = new FileReader();

  reader.onload = async (e) => {
    const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());

      if (values.length < headers.length) continue; // skip invalid rows

      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      // Prepare final object as per your API
      const studentData = {
        student_id: row.id,
        name: row.std_name,
        student_class: row.std_class,
            vaccinated: false,
            vaccine_name: null,
            vaccination_date: null,
      };

      try {
        await axios.post(`${API_ENDPOINTS.ADD_STUDENT}`, studentData);
        console.log(`Student ${row.std_name} added.`);
      } catch (error) {
        console.error(`Failed to add ${row.std_name}:`, error);
      }
    }

    alert('Bulk upload completed.');
    getAllStudents();
  };

  reader.readAsText(file);
};

if(isLoading)
  return(
    <h1>Student Data Loading...</h1>
  )

  return (
     <div className="student-management" role="main" aria-label="Student-Management">
      <Sidebar/>
      <main className="content" aria-label="Student content">
        <header className="header">
          <h1 className="header-title">Student Management</h1>
        </header>
        <section>
              <form className="add-student-form" onSubmit={handleSubmit}>
                <label>Student Id</label>
                <input type="number" name="id" value={studentData.id} onChange={handleChange} required />

                <label>Name</label>
                <input type="text" name="std_name" value={studentData.std_name} onChange={handleChange} required />

                <label>Class</label>
                <input type="text" name="std_class" value={studentData.std_class} onChange={handleChange} required />

                <button type="submit">Add Student</button>
              </form>
           <div className="students-actions">
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div>
                <button className="upload-btn" onClick={() => document.getElementById('csvUpload').click()}>
                  Upload CSV
                </button>
                <input type="file" id="csvUpload" style={{ display: 'none' }} accept=".csv" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file instanceof Blob) {
                    handleBulkUpload(file);
                  } else {
                    alert('Invalid file selected.');
                  }
                }} />
              </div>
            </div>
        </section>

         <section>
                {editStudent && (
                    <>
                      <div className="modal-backdrop" onClick={() => setEditStudent(null)}></div>
                      <div className="modal">
                        <form onSubmit={submitEdit}>
                          <h3>Edit Student</h3>
                            
                          <div className="form-group">
                            <label>Name</label>
                            <input name="student_id" value={editStudent.student_id} onChange={handleEditChange} disabled />
                          </div>

                          <div className="form-group">
                            <label>Name</label>
                            <input name="name" value={editStudent.name} onChange={handleEditChange} required />
                          </div>

                          <div className="form-group">
                            <label>Class</label>
                            <input name="student_class" value={editStudent.student_class} onChange={handleEditChange} required />
                          </div>

                          <div className="form-actions">
                            <button type="submit" className="btn primary">Update</button>
                            <button type="button" className="btn secondary" onClick={() => setEditStudent(null)}>Cancel</button>
                          </div>
                        </form>
                      </div>
                    </>
                  )}

        </section>
        <section>
          <div className="students-table-container">
          <table>
            <thead>
              <tr>
                <th>Student Id</th><th>Name</th><th>Class</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(student => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    <td>{student.student_class}</td>
                    <td>
                      <button className="edit-btn" onClick={() =>handleEdit(student)}>Edit</button>
                      <button className="delete-btn"  onClick={() => handleDelete(student.student_id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
        </section>
      </main>
    </div>
  );
}

export default StudentManagement;
