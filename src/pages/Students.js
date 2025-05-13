import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Students.css';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../apiConfig';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const effectRan = useRef(false);
  const navigate = useNavigate();

   const [studentData, setStudentData] = useState({
    id: '',
    std_name: '',
    std_class: '',
    vaccinationStatus: '',
    vacc_name: '',
    vacc_date: '',
  });

    useEffect(() => {
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

    if (!effectRan.current) {
    getAllStudents();
    }

    effectRan.current = true;
  },
  []);

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
          window.location.reload();
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
      console.error('Login API error:', err);
    } 

    alert(error);
  };

  const handleEdit = (student_id) => {
    
    sessionStorage.setItem('studentId', student_id);
    navigate(`/editStudentDetails`);
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_ENDPOINTS.DELETE_STUDENT(id)}`, {
            student_id: id,
      });
      alert('Student deleted successfully.');

      // Optionally refresh or filter local state:
      setStudents(prev => prev.filter(s => s.student_id !== id));
    } catch (error) {
      console.error('Failed to delete student:', error);
      alert('Failed to delete student.');
    }

  };

    const [search, setSearch] = useState('');

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
     window.location.reload();
  };

  reader.readAsText(file);
};

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
          <div className="students-table-container">
          <table>
            <thead>
              <tr>
                <th>Student Id</th><th>Name</th><th>Class</th><th>Status</th>
                <th>Vaccine Name</th><th>Vaccination Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(student => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    <td>{student.student_class}</td>
                    <td className={student.vaccinated ? 'status yes' : 'status no'}>
                      {student.vaccinated ? 'Vaccinated' : 'Pending'}
                    </td>
                    <td>{student.vaccine_name ? student.vaccine_name : 'N/A'}</td>
                    <td>{formatDate(student.vaccination_date)}</td>
                    <td>
                      <button className="edit-btn" onClick={() =>handleEdit(student.student_id)}>Edit</button>
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
