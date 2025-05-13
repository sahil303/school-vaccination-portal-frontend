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

function EditStudentDetails() {
const [student, setStudent] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const effectRan = useRef(false);

  const [studentId, setStudentId] = useState(0);
   const [studentData, setStudentData] = useState({
    id: '',
    std_name: '',
    std_class: '',
    vaccinationStatus: '',
    vacc_name: '',
    vacc_date: '',
  });

   useEffect(() => {
    const getStudentById = async () => {
      setIsLoading(true);
      setError('');

   try {
    console.log(studentId);
        const response = await axios.get(API_ENDPOINTS.GET_STUDENT_BY_ID(sessionStorage.getItem('studentId')));
        console.log(response);
        console.log(response.data);
        setStudentData({id: response.data.student_id,
          std_name: response.data.name,
          std_class: response.data.student_class,
          vaccinationStatus: response.data.vaccinated,
          vacc_name: response.data.vaccine_name,
          vacc_date: response.data.vaccination_date, });
         await axios.get(API_ENDPOINTS.GET_DRIVES).then(response =>
        setVaccines(response));
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
    getStudentById();
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
      const response = await axios.post(`${API_ENDPOINTS.UPDATE_STUDENT(studentId)}`, {
            student_id: studentData.id,
            name: studentData.std_name,
            student_class: studentData.std_class,
            vaccinated: studentData.vaccinated,
            vaccine_name: studentData.vaccine_name,
            vaccination_date: studentData.vaccination_date,
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
      console.error('Login API error:', err);
    } 

    alert(error);
  };


  return (
     <div className="student-management" role="main" aria-label="Student-Management">
      <Sidebar/>
      <main className="content" aria-label="Student content">
        <header className="header">
          <h1 className="header-title">Update Student</h1>
        </header>
        <section>
              <form className="add-student-form" onSubmit={handleSubmit}>
                <label>Student Id</label>
                <input type="number" name="id" value={studentId} onChange={handleChange} readOnly />

                <label>Name</label>
                <input type="text" name="std_name" value={studentData.std_name} onChange={handleChange} required />

                <label>Class</label>
                <input type="text" name="std_class" value={studentData.std_class} onChange={handleChange} required />

                <label>
                  <input type="checkbox" name="vaccinated" checked={studentData.vaccinationStatus} onChange={handleChange} />
                  Vaccinated
                </label>


                    {studentData.vaccinationStatus && (
                      <>
                        <div>
                          <label>Vaccine Name:</label>
                          <input type="text" name="vaccine_name" value={studentData.vacc_name} onChange={handleChange} required />
                        </div>

                        <div>
                          <label>Vaccination Date:</label>
                          <input type="date" name="vaccination_date" value={studentData.vacc_date} onChange={handleChange} required />
                        </div>
                      </>
                    )}

                <button type="submit">Update Details</button>
              </form>

         
        </section>
      </main>
    </div>
  );
}

export default EditStudentDetails;
