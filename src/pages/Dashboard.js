import React, {useEffect, useState, useRef } from 'react';
import { API_ENDPOINTS } from '../apiConfig';
import axios from 'axios';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Dashboard = () => {
  const [userName, setUsername] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const effectRan = useRef(false);

  useEffect(() => {
  const fetchSummary = async () => {
    setIsLoading(true);
    setError('');
 try {
      const response = await axios.get(API_ENDPOINTS.GET_DASHBOARD_METRICS);
      setUsername(sessionStorage.getItem('user'));
      setDashboardData(response.data);
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        } else {
            setError('Failed to load dashboard data. Please try again.');
        }
    }
    finally{
      setIsLoading(false);
    }
  };
  
  if (!effectRan.current) {
  fetchSummary(); 
  
  effectRan.current = true;
  }
  },
  []);

  if (isLoading) {
    return <div className="loading-message">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="info-message">No dashboard data available.</div>;
  }

  const { total, vaccinated, percent, upcomingDrives } = dashboardData;

  return (
    <div className="dashboard" role="main" aria-label="Dashboard">
      <Sidebar/>
      <main className="content" aria-label="Dashboard content">
        {error && <p className="error-message">{error}</p>}
        <header className="header">
          <h1 className="header-title">School Vaccination Dashboard</h1>
          <div className="profile" aria-label="User profile">
            <span role="img" aria-label="User avatar" style={{fontSize: '1.75rem'}}>👤</span>
            <span className="profile-name">{userName}</span>
          </div>
        </header>
        <section className="cards" aria-label="Key metrics">
          <article className="card" tabIndex="0" aria-label="Total Students">
            <div className="card-title">Total Students</div>
            <div className="card-value">{total !== undefined ? total : 'N/A'}</div>
          </article>
          <article className="card" tabIndex="0" aria-label="Vaccinated Students">
            <div className="card-title">Students Vaccinated</div>
            <div className="card-value">{vaccinated !== undefined ? vaccinated : 'N/A'}</div>
          </article>
          <article className="card" tabIndex="0" aria-label="New Orders">
            <div className="card-title">Percentage Vaccinated</div>
            <div className="card-value">{percent !== undefined ? `${percent}%` : 'N/A'}</div>
          </article>
        </section>
        <section className="" aria-label="Upcoming Vaccination Drives">
          <div className="upcoming-drives-section">
            <h3 className="section-title">Upcoming Vaccination Drives</h3>
            {upcomingDrives && upcomingDrives.length > 0 ? (
              <ul className="drives-list">
                {upcomingDrives.map((drive) => (
                  <li key={drive.id} className="drive-item-card">
                    <h4>{drive.vaccine_name} Drive</h4>
                    <p><strong>Date:</strong> {formatDate(drive.drive_date)}</p>
                    <p><strong>Available Doses:</strong> {drive.available_doses !== undefined ? drive.available_doses : 'N/A'}</p>
                    <p><strong>Applicable Classes:</strong> {drive.applicable_classes || 'N/A'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-drives-message">No upcoming drives.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
