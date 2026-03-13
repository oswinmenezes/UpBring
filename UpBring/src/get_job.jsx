import React, { useState, useEffect } from 'react';
import supabase from './services/supabase_client';
import { 
  Zap, 
  MapPin, 
  Briefcase, 
  ChevronRight 
} from 'lucide-react';

/**
 * NAVBAR COMPONENT
 */
const NavBar = () => {
  const scrollTo = (id) => console.log(`Scrolling to ${id}`);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <div style={{ width: 28, height: 28, background: '#b5d336', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="#1a1a1a" />
        </div>
        <span className="nav-logo-text">Upbring</span>
      </div>
      <div className="nav-links">
        <button onClick={() => scrollTo('home')} className="nav-link">Home</button>
        <button onClick={() => scrollTo('jobs')} className="nav-link">Get Job</button>
        <button onClick={() => scrollTo('learn')} className="nav-link">Learn Skill</button>
        <button onClick={() => scrollTo('mock')} className="nav-link">Mock Interview</button>
        <button onClick={() => scrollTo('dashboard')} className="nav-link">Dashboard</button>
      </div>
      <div className="nav-actions">
        <button className="btn-base btn-outline-nav">Log In</button>
        <button className="btn-base btn-green-nav">Sign Up</button>
      </div>
    </nav>
  );
};

/**
 * MAIN JOB PORTAL PAGE
 */
const JobPortal = () => {
  const [skills] = useState(["Python", "Java", "JavaScript", "React", "PostgreSQL", "NextJS"]);
  const [suitableRole, setSuitableRole] = useState("Fetching Role...");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoleAndJobs() {
      try {
        setLoading(true);
        // 1. Fetch Job Role based on skills
        const roleRes = await fetch('http://localhost:5000/api/job/find-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills })
        });
        
        let fetchedRole = "Software Engineer";
        if (roleRes.ok) {
          const roleData = await roleRes.json();
          fetchedRole = roleData.role || fetchedRole;
        }
        setSuitableRole(fetchedRole);

        // 2. Fetch Jobs from Supabase
        const { data: jobsData, error } = await supabase
          .from('jobs')
          .select('*')
          .ilike('role', `%${fetchedRole}%`)
          .limit(10);

        if (error) {
          console.error("Supabase query error:", error);
        } else {
          // If no matches, fetch general jobs
          if (!jobsData || jobsData.length === 0) {
             const { data: fallbackData } = await supabase.from('jobs').select('*').limit(6);
             setJobs(fallbackData || []);
          } else {
             setJobs(jobsData);
          }
        }
      } catch (err) {
        console.error("Error in fetchRoleAndJobs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoleAndJobs();
  }, [skills]);

  return (
    <div className="app-container">
      <style>{`
        :root {
          --bg-cream: #f0ecca;
          --accent-green: #b5d336;
          --border-gray: #e8e8e8;
          --text-dark: #1a1a1a;
          --text-muted: #666;
          --font-serif: 'Georgia', serif;
          --font-sans: 'Arial', sans-serif;
        }

        body { margin: 0; padding: 0; background-color: #fff; }

        .app-container {
          color: var(--text-dark);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Navbar CSS */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 70px;
          background: #fff;
          border-bottom: 1px solid var(--border-gray);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; }
        .nav-logo-text { font-family: var(--font-serif); font-size: 20px; font-weight: 700; }
        
        .nav-links { display: flex; gap: 32px; }
        .nav-link { 
          background: none; border: none; cursor: pointer;
          font-family: var(--font-sans); font-size: 14px; 
          color: var(--text-dark); font-weight: 500;
        }
        .nav-link:hover { color: var(--accent-green); }

        .nav-actions { display: flex; gap: 12px; }
        .btn-base {
          padding: 10px 20px; border-radius: 8px; font-family: var(--font-sans);
          font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s;
        }
        .btn-outline-nav { border: 1.5px solid var(--text-dark); background: transparent; }
        .btn-green-nav { border: none; background: var(--accent-green); }

        /* Profile Summary Box (90% width) */
        .hero-section {
          background-color: var(--bg-cream);
          padding: 60px 0;
          display: flex;
          justify-content: center;
        }
        .profile-box {
          width: 90%;
          max-width: 1200px;
          background: #fff;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(0,0,0,0.02);
        }
        .skills-group h4 { 
          font-family: var(--font-sans); font-size: 11px; 
          color: var(--text-muted); letter-spacing: 1.5px; 
          text-transform: uppercase; margin-bottom: 15px; 
        }
        .skill-tag {
          display: inline-block;
          background: #f4f4f2;
          padding: 6px 14px;
          border-radius: 50px;
          margin: 0 8px 8px 0;
          font-family: var(--font-sans);
          font-size: 13px;
          color: #444;
        }
        .role-display { text-align: right; }
        .role-display h2 { 
          font-family: var(--font-serif); font-style: italic; 
          font-size: 32px; margin: 8px 0 0 0;
        }

        /* Job Listings */
        .jobs-container {
          width: 90%;
          max-width: 1200px;
          margin: 60px auto;
        }
        .section-header { 
          font-family: var(--font-serif); font-size: 28px; 
          margin-bottom: 30px; font-weight: 700; 
        }

        .job-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .job-card {
          background: #fff;
          border: 1px solid var(--border-gray);
          border-radius: 16px;
          padding: 24px;
          transition: 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .job-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-green);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08);
        }

        .level-pill {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 16px;
          width: fit-content;
        }
        .level-advanced { background: #dcedc8; color: #33691e; }
        .level-intermediate { background: var(--bg-cream); color: #827717; }
        .level-basic { background: #eee; color: #666; }

        .job-title { 
          font-family: var(--font-serif); font-size: 20px; 
          margin: 0 0 5px 0; font-weight: 700; 
        }
        .job-company { 
          font-family: var(--font-sans); color: var(--text-muted); 
          font-size: 15px; margin-bottom: 20px; 
        }
        .job-meta { 
          display: flex; align-items: center; gap: 6px;
          font-family: var(--font-sans); font-size: 13px; color: var(--text-muted);
        }

        .apply-link {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--accent-green);
          color: var(--text-dark);
          text-decoration: none;
          padding: 12px;
          border-radius: 10px;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 14px;
        }

        /* Footer */
        .footer {
          background: var(--bg-cream);
          padding: 60px 5%;
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--text-muted);
        }
      `}</style>

 

      <section className="hero-section">
        <div className="profile-box">
          <div className="skills-group">
            <h4>Your Skills</h4>
            <div className="skills-list">
              {skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="role-display">
            <h4>Recommended Role</h4>
            <h2>{suitableRole}</h2>
          </div>
        </div>
      </section>

      <main className="jobs-container">
        <h2 className="section-header">Recommended Opportunities</h2>
        {loading ? (
          <p>Loading your opportunities...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found for this role at the moment.</p>
        ) : (
          <div className="job-grid">
            {jobs.map((job) => {
              const displayLevel = job.exp_level || job.level || 'Basic';
              const levelClass = displayLevel.toString().toLowerCase().includes('senior') || displayLevel.toString().toLowerCase().includes('advanced') ? 'advanced' :
                                 displayLevel.toString().toLowerCase().includes('mid') || displayLevel.toString().toLowerCase().includes('intermediate') ? 'intermediate' : 'basic';
              
              return (
                <div key={job.id} className="job-card">
                  <div>
                    <span className={`level-pill level-${levelClass}`}>
                      {displayLevel}
                    </span>
                    <h3 className="job-title">{job.title || job.role}</h3>
                    <p className="job-company">{job.company}</p>
                    <div className="job-meta" style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <span><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {job.location}</span>
                      <span><Briefcase size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {job.experience || 'Not specified'}</span>
                    </div>
                  </div>
                  <a href={job.link || '#'} className="apply-link" target="_blank" rel="noopener noreferrer">
                    View Details <ChevronRight size={16} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p>© 2026 Upbring. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobPortal;