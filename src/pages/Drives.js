import React, {useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../apiConfig';
import axios from 'axios';
import '../styles/drive.css';
import Sidebar from '../components/Sidebar';


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

   function formatDateForEdit(dateString) {
       const date = new Date(dateString);
       const year = date.getFullYear();
       const month = String(date.getMonth() + 1).padStart(2, '0');
       const day = String(date.getDate()).padStart(2, '0');
       return `${year}-${month}-${day}`;
   }

function Drives() {
  const [drives, setDrives] = useState([]);
  const [editDrive, setEditDrive] = useState(null);

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

    const isCurrentDrive = (dateString) => {
        const inputDate = new Date(dateString);
        const today = new Date();

        // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return inputDate.getTime() === today.getTime();
    }

  const handleEdit = (drive) => {
    console.log(drive);
  setEditDrive({ ...drive });
};


const handleEditChange = (e) => {
  const { name, value } = e.target;
  console.log(e.target);
  setEditDrive((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const submitEdit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(API_ENDPOINTS.UPDATE_DRIVE(editDrive.id), editDrive);
    alert('Drive updated!');
    setEditDrive(null);
    fetchDrives(); // refresh list
  } catch (err) {
    alert(err.response.data.message);
    console.error(err.response.data.message);
  }
};
  const handleCancel = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this drive?');
    if (!confirmDelete) return;

    try {
      await axios.delete(API_ENDPOINTS.DELETE_DRIVE(id));

      setDrives(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Failed to delete drive:', error);
      alert(error.data);
    }

  };

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
                <td>{formatDate(new Date(drive.drive_date).toLocaleDateString())}</td>
                <td>{drive.applicable_classes}</td>
                <td>{drive.available_doses}</td>
                <td>{isCurrentDrive(drive.drive_date) ? 'In Process' :  isPastDrive(drive.drive_date) ? 'Completed' : 'Scheduled'}</td>
                <td>
                      {!isPastDrive(drive.drive_date) && <button className="edit-btn" onClick={() =>handleEdit(drive)}>Edit</button>}
                       {!isPastDrive(drive.drive_date) && 
                      <button className="delete-btn" onClick={() =>handleCancel(drive.id)}>Cancel</button>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
        </section>

        <section>
                {editDrive && (
                    <>
                      <div className="modal-backdrop" onClick={() => setEditDrive(null)}></div>
                      <div className="modal">
                        <form onSubmit={submitEdit}>
                          <h3>Edit Drive</h3>
                          
                          <div className="form-group">
                            <label>Vaccine Name</label>
                            <input name="vaccine_name" value={editDrive.vaccine_name} onChange={handleEditChange} required />
                          </div>

                          <div className="form-group">
                            <label>Vaccine Date </label>
                            <input type='date' name="drive_date" value={formatDateForEdit(editDrive.drive_date)} onChange={handleEditChange} required />
                          </div>

                          <div className="form-group">
                            <label>Available Doses</label>
                            <input type='number' name="available_doses" value={editDrive.available_doses} onChange={handleEditChange} required />
                          </div>

                          <div className="form-group">
                            <label>Applicable Classes </label>
                            <input name="applicable_classes" value={editDrive.applicable_classes} onChange={handleEditChange} required />
                          </div>

                          <div className="form-actions">
                            <button type="submit" className="btn primary">Update</button>
                            <button type="button" className="btn secondary" onClick={() => setEditDrive(null)}>Cancel</button>
                          </div>
                        </form>
                      </div>
                    </>
                  )}

        </section>
      </main>
    </div>
  );
  
    };
  export default Drives;
  