import React, { useState, useEffect } from 'react';
import supabase from '../services/supabase_client';
import './dashboard.css';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', user.id)
            .limit(1);

          if (fetchError) {
            console.error('Error fetching user data:', fetchError);
            setError(fetchError.message);
          } else if (data && data.length > 0) {
            console.log('User data fetched successfully:', data[0]);
            setUserData(data[0]);
          }
        }
      } catch (err) {
        console.error('Error in fetchUserProfile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const calculateAverageSkillLevel = (skills) => {
    if (!skills || skills.length === 0) return 0;
    const total = skills.reduce((sum, skill) => sum + (skill.proficiency || 0), 0);
    return Math.round(total / skills.length);
  };

  if (loading) {
    return (
      <div className="app dashboard-container">
        <header className="skill-analysis-banner">
          <h1 className="banner-title">Skill Analysis</h1>
        </header>
        <div className="loading-message">Loading your profile...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="app dashboard-container">
        <header className="skill-analysis-banner">
          <h1 className="banner-title">Skill Analysis</h1>
        </header>
        <div className="error-message">
          {error ? `Error: ${error}` : 'No profile data found. Please complete your profile first.'}
        </div>
      </div>
    );
  }

  const profile = userData.profile_analysis || {};
  const skills = userData.skills || [];
  const showcase = userData.showcase || [];
  const suitableRoles = userData.suitable_roles || [];
  const avgSkillLevel = calculateAverageSkillLevel(skills);

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
            <div className="avatar-circle">{getInitials(userData.full_name)}</div>
            <h2>{userData.full_name || 'Profile'}</h2>
            <p className="institution-text">{userData.institution || ''}</p>
          </div>
          <div className="sidebar-box skills-section">
            <h3>Top Skills</h3>
            <div className="skills-list">
              {skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="mini-badge">
                  {skill.skill}
                </span>
              ))}
            </div>
            <button className="btn-outline-small">Update Profile</button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-stats-area">
          <div className="stats-top-row">
            <div className="stat-card proficiency-card">
              <h2>Skill Proficiency</h2>
              <div className="proficiency-display">
                <div className="proficiency-score">{avgSkillLevel}/10</div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${(avgSkillLevel / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="skills-details">
                {skills.slice(0, 6).map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    <span className="skill-name">{skill.skill}</span>
                    <div className="skill-bar-small">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${(skill.proficiency / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="skill-level">{skill.proficiency}/10</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="stat-card eligibility-card">
              <h2>Suitable Roles</h2>
              <div className="roles-list">
                {suitableRoles && suitableRoles.length > 0 ? (
                  suitableRoles.map((role, idx) => (
                    <div key={idx} className="role-badge">{role}</div>
                  ))
                ) : (
                  <p className="no-data">No roles found yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="stat-card projects-section">
            <h2>Showcase Projects</h2>
            <div className="projects-grid">
              {showcase && showcase.length > 0 ? (
                showcase.map((project, idx) => (
                  <div key={idx} className="project-box">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>
                ))
              ) : (
                <div className="no-projects">No projects added yet</div>
              )}
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