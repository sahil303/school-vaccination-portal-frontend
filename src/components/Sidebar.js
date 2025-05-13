// src/components/Header.js
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sidebar.css';
import home from '../assets/home.png'
import groups from '../assets/groups.png'
import vaccine from '../assets/vaccine.png'
import report from '../assets/report.png'
import logout from '../assets/logout.png'

function Sidebar() {
const [sidebarOpen, setSidebarOpen] = useState(true);
const navigate = useNavigate();

const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
};
const navigateToDashboard = () =>
  {
   navigate('/dashboard'); 
  };

  const navigateToStudents = () =>
  {
    navigate('/students');
  };

  const navigateToVaccineDrive = () =>
  {
    navigate('/drives');
  };

  const navigateToReports = () =>
  {
    navigate('/reports');
  };

  const navigateToLogin = () =>
  {
    sessionStorage.clear();
    navigate('/login', {replace: true});
  };

  return (
<nav className={`sidebar${sidebarOpen ? '' : ' closed'}`} aria-label="Sidebar navigation">
        <div className="sidebar-header">
          <span className="sidebar-brand">{sidebarOpen ? 'School Vaccination Portal' : '' }</span>
          <button
            onClick={toggleSidebar}
            className="toggle-btn"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
        <div className="menu" role="menu">
          <div className="menu-item" role="menuitem" tabIndex="0" onClick={navigateToDashboard}>
            <img className="menu-icon" aria-hidden="true" src={home} alt='Home'/>
            <span className="menu-text">Home</span>
          </div>
          <div className="menu-item" role="menuitem" tabIndex="0" onClick={navigateToStudents}>
            <img className="menu-icon" aria-hidden="true" src={groups} alt='Student Manage icon'/>
            <span className="menu-text">Manage Students</span>
          </div>
          <div className="menu-item" role="menuitem" tabIndex="0" onClick={navigateToVaccineDrive}>    
            <img className="menu-icon" aria-hidden="true" src={vaccine} alt='Vaccine Drive'/>
            <span className="menu-text">Vaccination Drives</span>
          </div>
          <div className="menu-item" role="menuitem" tabIndex="0" onClick={navigateToReports}>
            <img className="menu-icon" aria-hidden="true" src={report} alt='report'/>
            <span className="menu-text">Reports</span>
          </div>
          <div className="menu-item" role="menuitem" tabIndex="0" onClick={navigateToLogin}>
            <img className="menu-icon" aria-hidden="true" src={logout} alt='Logout'/>
            <span className="menu-text">Logout</span>
          </div>
        </div>
      </nav>
  );
}

export default Sidebar;
