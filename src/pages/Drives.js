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

function Drives() {
  const [drives, setDrives] = useState([]);

const [formData, setFormData] = useState({
    vaccine_name: '',
    date: '',
    classes: '',
    doses: ''
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_DRIVES);
      console.log(res);
      setDrives(res.data || []);
    } catch (err) {
      console.error('Error fetching drives:', err);
      alert(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDrive = {
      vaccine_name: formData.vaccine_name,
      drive_date: formData.date,
      applicable_classes: formData.classes,
      available_doses: parseInt(formData.doses)
    };

    console.log(newDrive);
    try {
      const res = await axios.post(API_ENDPOINTS.ADD_DRIVE, newDrive);
      if(res)
      {
        alert("Drive created successfully!!");
      }
      fetchDrives();
      setFormData({ vaccine_name: '', date: '', classes: '', doses: '' });
    } catch (err) {
      alert(err.response.data.message);
      console.error('Failed to create drive:', err);
    }
  };

  const isPastDrive = (dateStr) => new Date(dateStr) < new Date();



    return (
    <div className="drives" role="main" aria-label="Drive">
      <Sidebar/>
      <main className="content" aria-label="Reports content">
        <header className="header">
          <h1 className="header-title">School Vaccination Drives</h1>
        </header>
        <section>
          <div className="drive-container">
      <h2>Vaccination Drives</h2>

      <form className="drive-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="vaccine_name"
          placeholder="Vaccine Name"
          value={formData.vaccine_name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="classes"
          placeholder="Applicable Classes (comma separated)"
          value={formData.classes}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="doses"
          placeholder="Number of Doses"
          value={formData.doses}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Drive</button>
      </form>

      <table className="drive-table">
        <thead>
          <tr>
            <th>Vaccine</th>
            <th>Date</th>
            <th>Applicable Classes</th>
            <th>Available Doses</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drives.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No drives scheduled</td></tr>
          ) : (
            drives.map(drive => (
              <tr key={drive.id}>
                <td>{drive.vaccine_name}</td>
                <td>{new Date(drive.drive_date).toLocaleDateString()}</td>
                <td>{drive.applicable_classes}</td>
                <td>{drive.available_doses}</td>
                <td>{isPastDrive(drive.drive_date) ? 'Completed' : 'Scheduled'}</td>
                <td>
                      <button className="edit-btn" disabled={isPastDrive(drive.drive_date)}>Edit</button>
                      <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
        </section>
      </main>
    </div>
  );
  
    };
  export default Drives;
  