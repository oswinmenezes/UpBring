import React, { useState, useEffect } from 'react';
import { Zap, BookOpen, TrendingUp, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import supabase from './services/supabase_client';

const RoadmapPage = () => {
  const [domain, setDomain] = useState('IT');
  const [role, setRole] = useState('Data Scientist');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userSkills, setUserSkills] = useState(["Python", "Basic Statistics", "SQL", "Excel"]);
  
  const [analysis, setAnalysis] = useState({
    currentSkills: [],
    missingSkills: [],
    roleDesc: "Select a role and click Analyze to generate your personalized career path.",
    marketDemand: "Awaiting analysis...",
    advices: "Awaiting analysis...",
    courses: []
  });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (!error && data && data.skills) {
          const activeSkills = data.skills.map(s => s.skill);
          if (activeSkills.length > 0) {
              setUserSkills(activeSkills);
              setAnalysis(prev => ({ ...prev, currentSkills: activeSkills }));
          }
        }
      } else {
          setAnalysis(prev => ({ ...prev, currentSkills: userSkills }));
      }
    }
    fetchUser();
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/job/skill-to-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: userSkills, role: role })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (!data.error) {
           setAnalysis({
             currentSkills: userSkills,
             missingSkills: data.missingSkills || [],
             roleDesc: data.description || "",
             marketDemand: data.marketDemand || "High",
             advices: data.advices || "Keep practicing.",
             roadmap: data.roadmap || [],
             courses: data.courses || []
           });
        }
      }
    } catch (err) {
       console.error("Failed to analyze:", err);
    } finally {
       setIsAnalyzing(false);
    }
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
        
        <div className="selector-group" style={{alignItems: 'center'}}>
          <select onChange={(e) => setDomain(e.target.value)} value={domain}>
            <option>IT</option>
            <option>Commerce</option>
            <option>Medical</option>
          </select>
          <select onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Mobile Developer">Mobile Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="ML Engineer">ML Engineer</option>
            <option value="Software Engineer">Software Engineer</option>
          </select>
          <button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="btn-learn" 
            style={{padding: '12px 24px', fontSize: '15px'}}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
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

            <h4 className="nav-logo-text" style={{marginTop: '25px'}}><CheckCircle size={18} /> Action Plan</h4>
            {analysis.roadmap && analysis.roadmap.length > 0 ? (
                <ul style={{fontFamily: 'Arial', fontSize: '14px', color: '#444', paddingLeft: '20px'}}>
                    {analysis.roadmap.map((step, i) => <li key={i} style={{marginBottom: '8px'}}>{step}</li>)}
                </ul>
            ) : (
                <p style={{fontFamily: 'Arial', fontSize: '14px', color: '#888'}}>Generate your personalized plan.</p>
            )}
          </div>

          <div>
            <h4 className="nav-logo-text"><BookOpen size={18} /> Recommended Courses</h4>
            {analysis.courses && analysis.courses.length > 0 ? analysis.courses.map((course, idx) => (
              <div key={idx} className="resource-card">
                <div>
                  <div style={{fontWeight: '700', fontFamily: 'Arial'}}>{course.name}</div>
                  <div style={{fontSize: '12px', color: '#888'}}>{course.platform}</div>
                </div>
                {course.link && course.link !== "#" ? (
                    <a href={course.link} target="_blank" rel="noopener noreferrer">
                        <button className="btn-learn">Explore</button>
                    </a>
                ) : (
                    <button className="btn-learn" style={{opacity: 0.5, cursor: 'not-allowed'}}>Search</button>
                )}
              </div>
            )) : (
              <p style={{fontFamily: 'Arial', fontSize: '14px', color: '#888'}}>No courses suggested yet.</p>
            )}
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