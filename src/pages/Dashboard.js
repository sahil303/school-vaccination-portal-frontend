import React, { useState } from 'react';

import '../styles/Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard" role="main" aria-label="Dashboard">
      <nav className={`sidebar${sidebarOpen ? '' : ' closed'}`} aria-label="Sidebar navigation">
        <div className="sidebar-header">
          MyDashboard
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
          <div className="menu-item" role="menuitem" tabIndex="0">
            <span className="menu-icon" aria-hidden="true">🏠</span>
            <span className="menu-text">Home</span>
          </div>
          <div className="menu-item" role="menuitem" tabIndex="0">
            <span className="menu-icon" aria-hidden="true">📊</span>
            <span className="menu-text">Analytics</span>
          </div>
          <div className="menu-item" role="menuitem" tabIndex="0">
            <span className="menu-icon" aria-hidden="true">📁</span>
            <span className="menu-text">Projects</span>
          </div>
          <div className="menu-item" role="menuitem" tabIndex="0">
            <span className="menu-icon" aria-hidden="true">⚙️</span>
            <span className="menu-text">Settings</span>
          </div>
        </div>
      </nav>
      <main className="content" aria-label="Dashboard content">
        <header className="header">
          <h1 className="header-title">Dashboard Overview</h1>
          <div className="profile" aria-label="User profile">
            <span role="img" aria-label="User avatar" style={{fontSize: '1.75rem'}}>👤</span>
            <span className="profile-name">John Doe</span>
          </div>
        </header>
        <section className="cards" aria-label="Key metrics">
          <article className="card" tabIndex="0" aria-label="Total Sales">
            <div className="card-title">Total Sales</div>
            <div className="card-value">$12,430</div>
          </article>
          <article className="card" tabIndex="0" aria-label="Active Users">
            <div className="card-title">Active Users</div>
            <div className="card-value">1,245</div>
          </article>
          <article className="card" tabIndex="0" aria-label="New Orders">
            <div className="card-title">New Orders</div>
            <div className="card-value">87</div>
          </article>
          <article className="card" tabIndex="0" aria-label="Pending Tasks">
            <div className="card-title">Pending Tasks</div>
            <div className="card-value">14</div>
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
