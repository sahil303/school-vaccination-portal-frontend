import React, {useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../apiConfig';
import axios from 'axios';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [userName, setUsername] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalVaccinatedStudents, setTtotalVaccinatedStudents] = useState(0);
  const [totalVaccinatedPercent, setTotalVaccinatedPercent] = useState(0);
  const [error, setError] = useState('error');

  useEffect(() => {
  const fetchSummary = async () => {
    setError('');
 try {
      const response = await axios.get(API_ENDPOINTS.GET_DASHBOARD_METRICS);

      if (response.data) {
        setUsername(sessionStorage.getItem('user'));
        if(response.data.total)
        {
          setTotalStudents(response.data.total);
        } 

        if(response.data.vaccinated)
        {
          setTtotalVaccinatedStudents(response.data.vaccinated);
        } 
        
        if(response.data.percent)
        {
          setTotalVaccinatedPercent(response.data.percent);
        } 

      } else {
        setError(response.err);
      }
    } catch (err) {
      // Handled network errors or other issues with the API call
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('No response from server. Please check your network.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Dashboard API error:', err);
    }
  };
  fetchSummary();
  },
  []);

  return (
    <div className="dashboard" role="main" aria-label="Dashboard">
      <Sidebar/>
      <main className="content" aria-label="Dashboard content">
        {error && <p className="error-message">{error}</p>}
        <header className="header">
          <h1 className="header-title">Dashboard Overview</h1>
          <div className="profile" aria-label="User profile">
            <span role="img" aria-label="User avatar" style={{fontSize: '1.75rem'}}>👤</span>
            <span className="profile-name">{userName}</span>
          </div>
        </header>
        <section className="cards" aria-label="Key metrics">
          <article className="card" tabIndex="0" aria-label="Overall Students">
            <div className="card-title">Overall Students</div>
            <div className="card-value">{totalStudents}</div>
          </article>
          <article className="card" tabIndex="0" aria-label="Vaccinated Students">
            <div className="card-title">Vaccinated Students</div>
            <div className="card-value">{totalVaccinatedStudents}</div>
          </article>
          <article className="card" tabIndex="0" aria-label="New Orders">
            <div className="card-title">Vaccinated Students(%)</div>
            <div className="card-value">{totalVaccinatedPercent}</div>
          </article>
        </section>
        <section className="chart-container" aria-label="Chart placeholder">
          Chart Placeholder
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
