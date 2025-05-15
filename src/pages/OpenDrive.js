import React, {useEffect, useState, useRef } from 'react';
import { API_ENDPOINTS } from '../apiConfig';
import axios from 'axios';
import '../styles/drive.css';
import Sidebar from '../components/Sidebar';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function OpenDrive() {
  const [currentDrive, setCurrentDrive] = useState(null);
  const effectRan = useRef(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
       if (!effectRan.current) {
              fetchCurrentDrive();
              getAllStudents();
            }

    effectRan.current = true;
    }, []);
  
      const fetchCurrentDrive = async () => {
            try {
            const res = await axios.get(API_ENDPOINTS.GET_CURRENT_DRIVE);
            console.log(res.data.data);
            console.log(new Date(res.data.data.drive_date).toLocaleDateString());
            setCurrentDrive(res.data.data);
            } catch (err) {
            console.error('Error fetching drives:', err);
            alert(err);
            }
        };

        const getAllStudents = async () => {
            try {
                    const response = await axios.get(API_ENDPOINTS.GET_STUDENTS);
                    setStudents(response.data.students);
                } catch (err) {
                    console.error("Error fetching students data:", err);
                    if (err.response && err.response.data && err.response.data.message) {
                        alert(err.response.data.message);
                    } else {
                        console.log('Failed to load students data. Please try again.');
                    }
                }
        }

       const filtered = (Array.isArray(students) ? students : []).filter(s => !s.vaccinated
         && (currentDrive && currentDrive.applicable_classes.toLowerCase().includes(s.student_class.toLowerCase())));

       const handleVaccinate = async (student) =>
       {
        if(currentDrive.available_doses > 1)
        {
          student.vaccinated = true;
         student.vaccine_name = currentDrive.vaccine_name;
         student.vaccination_date = currentDrive.drive_date;
         currentDrive.available_doses -= 1;
          currentDrive.drive_date = new Date(currentDrive.drive_date).toLocaleDateString();
        }
        else{
          return alert("No slots/vaccines available");
        }

         try {
          console.log(currentDrive);
                await axios.put(API_ENDPOINTS.UPDATE_DRIVE_AVAILABLE_DOSES(currentDrive.id), currentDrive);
                fetchCurrentDrive();

                await axios.put(API_ENDPOINTS.MARK_STUDENT_VACCINATED(student.student_id), student);
                getAllStudents();
                
            } catch (err) {
                console.error(err.response.data.message);
                alert(err.response.data.message);
            }
       }

      return (
    <div className="drives" role="main" aria-label="Drive">
      <Sidebar/>
      <main className="content" aria-label="Reports content">
        <header className="header">
          <h1 className="header-title">Active Drive</h1>
        </header>
        {currentDrive && <section>
          <div className="drive-container">
            <h2>{currentDrive.vaccine_name} Drive</h2>
            <div className='drive-information'>

              <h3>Applicable Classes: <span className='drive-info-value'>{currentDrive.applicable_classes}</span></h3>
              <h3>Available Doses: <span className='drive-info-value'>{currentDrive.available_doses}</span></h3>
              <h3>Date: <span className='drive-info-value'>{formatDate(currentDrive.drive_date)}</span></h3>
            </div>
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
                      <button className="edit-btn" onClick={() =>handleVaccinate(student)}>Vaccinate</button>
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
        </section>}
        {!currentDrive && <div>
            <p className="no-drives-message">No Drive Schecduled Today.</p>
            </div>}
      </main>
    </div>
  );
}

  export default OpenDrive;
