import React from 'react';
import './dashboard.css';

export default function Dashboard() {
  return (
    <div className="app dashboard-container">
      {/* HEADER SECTION */}
      <header className="skill-analysis-banner">
        <h1 className="banner-title">Skill Analysis</h1>
      </header>

      <div className="dashboard-body">
        {/* LEFT SIDEBAR */}
        <aside className="sidebar-panel">
          <div className="sidebar-box profile-section">
            <div className="avatar-circle">JD</div>
            <h2>Profile</h2>
          </div>
          <div className="sidebar-box skills-section">
            <h3>Skills</h3>
            <div className="skills-list">
              <span className="mini-badge">React</span>
              <span className="mini-badge">Python</span>
            </div>
            <button className="btn-outline-small">Update</button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-stats-area">
          <div className="stats-top-row">
            <div className="stat-card proficiency-card">
              <h2>Skill Proficiency</h2>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="stat-card eligibility-card">
              <h2>Certificates or Jobs You are Eligible</h2>
            </div>
          </div>

          <div className="stat-card projects-section">
            <h2>Projects</h2>
            <div className="projects-grid">
              <div className="project-box"></div>
              <div className="project-box"></div>
              <div className="project-box"></div>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER SECTION */}
      <footer className="dashboard-big-footer">
        <div className="footer-content">
          <h2 className="footer-logo">UpBring</h2>
          <p>“We don't just find you jobs. We build the path to get there.”</p>
        </div>
      </footer>
    </div>
  );
}