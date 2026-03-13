import React, { useState } from 'react';
import { Zap, BookOpen, TrendingUp, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import NavBar from "./navbar" // Using your existing NavBar

const RoadmapPage = () => {
  const [domain, setDomain] = useState('IT');
  const [role, setRole] = useState('Data Science');

  // Hardcoded analysis data for mapping
  const analysis = {
    currentSkills: ["Python", "Basic Statistics", "SQL", "Excel"],
    missingSkills: ["Machine Learning", "Deep Learning", "AWS SageMaker", "Tableau"],
    roleDesc: "Data Scientists use data to understand and solve complex problems. This role requires a blend of programming, statistical proficiency, and business intuition.",
    marketDemand: "High - 25% projected growth over the next 3 years.",
    advices: "Focus on building a portfolio with real-world datasets rather than just certifications.",
    courses: [
      { name: "ML Specialization", platform: "Coursera", link: "#" },
      { name: "Deep Learning Foundations", platform: "Udacity", link: "#" }
    ]
  };

  return (
    <div className="app-container">
      <style>{`
        .analyzer-header { background: var(--bg-cream); padding: 40px 5%; text-align: center; }
        .selector-group { display: flex; gap: 20px; justify-content: center; margin-top: 20px; }
        
        select {
          padding: 12px 20px; border-radius: 8px; border: 1.5px solid var(--text-dark);
          font-family: Arial; font-weight: 600; cursor: pointer;
        }

        /* 90% Width Box Styles */
        .analysis-box {
          width: 90vw; margin: 30px auto; background: #fff;
          border-radius: 25px; padding: 40px; border: 1px solid var(--border-gray);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05); box-sizing: border-box;
        }

        .skill-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px; }
        
        .skill-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 50px; font-family: Arial; font-size: 14px;
        }
        .pill-current { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
        .pill-missing { background: #fff3e0; color: #ef6c00; border: 1px solid #ffe0b2; }

        .role-header { font-family: 'Georgia', serif; font-size: 32px; font-weight: 700; margin-bottom: 10px; }
        .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px; }
        
        .resource-card {
          background: #f9f9f7; padding: 20px; border-radius: 12px;
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
        }
        .btn-learn { 
          background: var(--accent-green); border: none; padding: 8px 16px; 
          border-radius: 6px; font-weight: 700; cursor: pointer;
        }
      `}</style>


      {/* --- STEP 1: SELECTORS --- */}
      <section className="analyzer-header">
        <h1 className="role-header" style={{fontStyle: 'italic'}}>Career Path Analyzer</h1>
        <p style={{fontFamily: 'Arial', color: '#666'}}>Select your target and we'll bridge the gap.</p>
        
        <div className="selector-group">
          <select onChange={(e) => setDomain(e.target.value)}>
            <option>IT</option>
            <option>Commerce</option>
            <option>Medical</option>
          </select>
          <select onChange={(e) => setRole(e.target.value)}>
            <option>Data Science</option>
            <option>Full Stack</option>
            <option>DevOps</option>
            <option>Backend</option>
          </select>
        </div>
      </section>

      {/* --- STEP 2: SKILL ANALYSIS (90% BOXES) --- */}
      
      {/* Box 1: Current Skills */}
      <div className="analysis-box">
        <h3 className="nav-logo-text"><CheckCircle size={20} color="#2e7d32" /> Skills You Have</h3>
        <div className="skill-grid">
          {analysis.currentSkills.map(skill => (
            <div key={skill} className="skill-pill pill-current">{skill}</div>
          ))}
        </div>
      </div>

      {/* Box 2: Missing Skills */}
      <div className="analysis-box" style={{ borderLeft: '8px solid var(--accent-green)' }}>
        <h3 className="nav-logo-text"><AlertCircle size={20} color="#ef6c00" /> Missing Requirements</h3>
        <div className="skill-grid">
          {analysis.missingSkills.map(skill => (
            <div key={skill} className="skill-pill pill-missing">{skill}</div>
          ))}
        </div>
      </div>

      {/* --- STEP 3: ROLE INTEL & MARKET DEMAND --- */}
      <div className="analysis-box">
        <div className="role-header">{role} Role Overview</div>
        <p style={{fontFamily: 'Arial', lineHeight: '1.6', color: '#444'}}>{analysis.roleDesc}</p>
        
        <div className="info-section">
          <div>
            <h4 className="nav-logo-text"><TrendingUp size={18} /> Market Demand</h4>
            <p style={{fontFamily: 'Arial', fontSize: '15px'}}>{analysis.marketDemand}</p>
            
            <h4 className="nav-logo-text" style={{marginTop: '25px'}}><Lightbulb size={18} /> Professional Advice</h4>
            <p style={{fontFamily: 'Arial', fontSize: '15px'}}>{analysis.advices}</p>
          </div>

          <div>
            <h4 className="nav-logo-text"><BookOpen size={18} /> Recommended Courses</h4>
            {analysis.courses.map(course => (
              <div key={course.name} className="resource-card">
                <div>
                  <div style={{fontWeight: '700', fontFamily: 'Arial'}}>{course.name}</div>
                  <div style={{fontSize: '12px', color: '#888'}}>{course.platform}</div>
                </div>
                <button className="btn-learn">Explore</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="footer" style={{textAlign: 'center', background: 'var(--bg-cream)', padding: '30px'}}>
        <p style={{fontFamily: 'Arial', fontSize: '12px', color: '#666'}}>© 2026 Upbring Career Labs</p>
      </footer>
    </div>
  );
};

export default RoadmapPage;