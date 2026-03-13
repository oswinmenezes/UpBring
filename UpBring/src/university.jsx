import React, { useState, useEffect } from 'react';

const UniversityDashboard = () => {
  // 1. Auth State - Checks localStorage so session persists on refresh
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isUniversityAuth') === 'true';
  });

  const [loading, setLoading] = useState(true);

  // Mock Data
  const stats = {
    total: 1250,
    hireable: 850,
    avgSkill: 72
  };

  useEffect(() => {
    // Artificial delay to simulate data syncing
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isUniversityAuth', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isUniversityAuth');
  };

  if (loading) return <div className="loading-state">Syncing University Data...</div>;

  return (
    <div className="page-container">
      {/* Navbar Section */}
      

      {/* Content Section */}
      <main className="main-content">
        
          <>
            <h2 className="serif-font">Student Placement Insights</h2>

            {/* Metric Cards */}
            <div className="stats-grid">
              <div className="card">
                <span className="label">Total Students</span>
                <div className="value">{stats.total}</div>
              </div>
              <div className="card border-green">
                <span className="label">Hireable Candidates</span>
                <div className="value">{stats.hireable}</div>
              </div>
              <div className="card border-red">
                <span className="label">Needs Upskilling</span>
                <div className="value">{stats.total - stats.hireable}</div>
              </div>
            </div>

            {/* Average Skill Graph */}
            <div className="graph-container">
              <div className="graph-header">
                <h3>Campus Skill Benchmark</h3>
                <span className="percentage">{stats.avgSkill}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${stats.avgSkill}%` }}></div>
              </div>
              <p className="graph-caption">Average across technical and professional competencies.</p>
            </div>

            {/* Curriculum Improvement Rectangle Box */}
            <div className="improvement-rectangle">
              <div className="improvement-header">
                <h3>Curriculum Improvement Roadmap</h3>
                <span className="priority-tag">High Impact</span>
              </div>
              <div className="roadmap-grid">
                <div className="roadmap-item">
                  <h4>Technical Refinement</h4>
                  <ul>
                    <li>Mandatory <strong>Full-Stack</strong> project in Semester 6.</li>
                    <li>Bi-weekly <strong>Live Coding</strong> sessions with industry mentors.</li>
                  </ul>
                </div>
                <div className="roadmap-item">
                  <h4>Employability Strategy</h4>
                  <ul>
                    <li>Partner with <strong>Tech HRs</strong> for mock resume screening.</li>
                    <li>Add a 1-credit course on <strong>Agile & Project Management</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        
      </main>

      {/* COMBINED CSS THEME */}
      <style>{`
        /* --- Navbar Styles --- */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid #e8e8e8;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-logo { display: flex; align-items: center; gap: 10px; }
        .logo-square { width: 24px; height: 24px; background: #b5d336; border-radius: 4px; }
        .nav-logo-text {
          font-family: 'Georgia', serif;
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        .nav-links { display: flex; gap: 32px; }
        .nav-link {
          background: none; border: none; text-decoration: none; color: #1a1a1a;
          font-family: Arial, sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; padding: 8px 0; transition: color 0.2s ease;
          position: relative;
        }
        .nav-link:hover { color: #b5d336; }
        .nav-link:after {
          content: ''; position: absolute; width: 0; height: 2px;
          bottom: 0; left: 0; background-color: #b5d336; transition: width 0.3s ease;
        }
        .nav-link:hover:after { width: 100%; }

        .nav-actions { display: flex; gap: 12px; align-items: center; }
        .btn-base {
          padding: 10px 22px; border-radius: 8px; font-family: Arial, sans-serif;
          font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s ease;
        }
        .btn-outline-nav { background: transparent; border: 1.5px solid #1a1a1a; color: #1a1a1a; }
        .btn-green-nav { background: #b5d336; border: none; color: #1a1a1a; }
        .btn-green-nav:hover { box-shadow: 0 4px 12px rgba(181, 211, 54, 0.3); transform: translateY(-1px); }

        /* --- Dashboard Layout --- */
        .page-container { background: #fcfcfc; min-height: 100vh; font-family: Arial, sans-serif; }
        .main-content { padding: 48px; max-width: 1200px; margin: 0 auto; }
        .serif-font { font-family: 'Georgia', serif; font-size: 32px; margin-bottom: 32px; color: #1a1a1a; }
        .auth-placeholder { text-align: center; margin-top: 100px; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 48px; }
        .card { background: #fff; padding: 24px; border: 1px solid #e8e8e8; border-radius: 12px; transition: transform 0.2s ease; }
        .card:hover { transform: translateY(-4px); }
        .border-green { border-left: 6px solid #b5d336; }
        .border-red { border-left: 6px solid #ff4d4d; }
        
        .label { color: #666; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { font-size: 36px; font-weight: 700; color: #1a1a1a; margin-top: 8px; }

        .graph-container { background: #fff; padding: 32px; border: 1px solid #e8e8e8; border-radius: 12px; margin-bottom: 48px; }
        .graph-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .percentage { color: #b5d336; font-size: 28px; font-weight: 700; }
        
        .progress-bar-bg { height: 14px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: #b5d336; border-radius: 10px; transition: width 1s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
        .graph-caption { font-size: 12px; color: #888; margin-top: 12px; }

        /* --- The Rectangle Improvement Box --- */
        .improvement-rectangle { background: #1a1a1a; color: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .improvement-header { display: flex; align-items: center; gap: 15px; margin-bottom: 24px; }
        .priority-tag { background: #b5d336; color: #1a1a1a; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; }
        
        .roadmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .roadmap-item h4 { color: #b5d336; margin-bottom: 12px; font-size: 18px; }
        .roadmap-item ul { padding-left: 18px; color: #bbb; line-height: 1.7; font-size: 14px; }
        .roadmap-item strong { color: #fff; }

        .loading-state { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Georgia', serif; font-size: 20px; }

        @media (max-width: 768px) {
          .navbar { padding: 0 20px; }
          .nav-links { display: none; }
          .roadmap-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default UniversityDashboard;