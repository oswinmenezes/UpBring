import React from 'react';
// import NavBar from './navbar';
import {Link} from "react-router-dom";
import { 
  Briefcase, 
  BarChart2, 
  User, 
  CheckCircle, 
  Zap, 
  Shield, 
  ArrowRight,
  GraduationCap,
  Building,
  FileText,
  Target,
  MessageSquare,
  TrendingUp,
  Cpu
} from 'lucide-react';

const customCSS = `
/* App Container */
.app {
  font-family: 'Georgia', 'Times New Roman', serif;
  color: #1a1a1a;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background: #fff;
}

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-logo-text {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: -0.3px;
  font-family: Arial, sans-serif;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  background: none;
  border: none;
  text-decoration: none;
  color: #1a1a1a;
  font-size: 14px;
  font-family: Arial, sans-serif;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
  padding: 0;
}

.nav-link:hover {
  color: #b5d336;
}

.nav-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Base Link Button Styles */
.btn-base {
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: Arial, sans-serif;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-outline-nav {
  padding: 8px 18px;
  border: 1.5px solid #1a1a1a;
  border-radius: 8px;
  color: #1a1a1a;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
}

.btn-outline-nav:hover {
  background: #f5f5f5;
}

.btn-green-nav {
  padding: 8px 18px;
  background: #b5d336;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 600;
}

.btn-green-nav:hover {
  background: #a3c02d;
}

/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0ecca;
  padding: 80px;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
  flex-wrap: wrap;
  gap: 48px;
}

.hero-left {
  max-width: 540px;
}

.hero-title {
  font-size: 62px;
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 24px 0;
  letter-spacing: -1px;
}

.hero-title-italic {
  font-style: italic;
  font-weight: 700;
}

.hero-subtitle {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.7;
  color: #444;
  margin: 0 0 32px 0;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.btn-green {
  padding: 14px 28px;
  background: #b5d336;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 15px;
  font-weight: 700;
}

.btn-green:hover {
  transform: translateY(-2px);
}

.btn-outline {
  padding: 14px 28px;
  border: 2px solid #1a1a1a;
  border-radius: 8px;
  background: transparent;
  color: #1a1a1a;
  font-size: 15px;
  font-weight: 700;
}

.btn-outline:hover {
  transform: translateY(-2px);
  background: rgba(26, 26, 26, 0.05);
}

.hero-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 999px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

/* Profile card */
.hero-right {
  flex: 1;
  max-width: 460px;
  min-width: 300px;
}

.profile-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0,0,0,0.05);
}

.profile-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.profile-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #c9a07a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #fff;
}

.profile-name {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 4px;
  font-family: Arial, sans-serif;
}

.profile-role {
  font-family: Arial, sans-serif;
  font-size: 13px;
  color: #666;
}

.score-badge {
  background: #b5d336;
  border-radius: 8px;
  padding: 8px 14px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-section {
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #444;
}

.progress-bar-bg {
  height: 8px;
  background: #f0f0f0;
  border-radius: 999px;
}

.progress-bar-fill {
  height: 100%;
  background: #1a1a1a;
  border-radius: 999px;
  width: 85%;
  transition: width 0.5s ease;
}

.profile-stats {
  display: flex;
  gap: 12px;
}

.stat-box {
  flex: 1;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #eee;
}

.stat-label {
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  font-weight: 500;
}

.stat-value {
  font-family: Arial, sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: #1a1a1a;
}

/* How It Works */
.how-it-works {
  background: #fff;
  padding: 100px 80px;
  text-align: center;
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #666;
  margin-bottom: 72px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.steps-row {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.step {
  flex: 1;
  min-width: 240px;
  max-width: 280px;
  text-align: center;
  position: relative;
}

.step-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0ecca;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  transition: all 0.3s ease;
}

.step:hover .step-icon {
  transform: scale(1.05);
  background: #b5d336;
}

.step-title {
  font-family: Arial, sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
}

.step-desc {
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* Features */
.features {
  background: #1a1a1a;
  color: #fff;
  padding: 100px 80px;
}

.feature-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
}

.feature-title-italic {
  font-style: italic;
  color: #b5d336;
}

.feature-subtitle {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #aaa;
  margin-bottom: 64px;
  max-width: 600px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  background: #242424;
  border-radius: 16px;
  padding: 40px 32px;
  border: 1px solid #333;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #b5d336;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(181, 211, 54, 0.1);
  color: #b5d336;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.feature-card-title {
  font-family: Arial, sans-serif;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 12px;
}

.feature-card-desc {
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #aaa;
  line-height: 1.6;
}

/* Mission */
.mission {
  background: #f0ecca;
  padding: 120px 40px;
  text-align: center;
}

.mission-quote {
  font-size: 42px;
  font-style: italic;
  font-weight: 700;
  max-width: 900px;
  margin: 0 auto 32px;
  line-height: 1.4;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.mission-cite {
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #555;
  text-transform: uppercase;
}

/* CTA */
.cta-section {
  background: #fff;
  padding: 80px 40px;
}

.cta-card {
  background: #b5d336;
  border-radius: 24px;
  padding: 56px 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 32px;
}

.cta-content {
  max-width: 600px;
}

.cta-title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  font-family: 'Georgia', serif;
  letter-spacing: -0.5px;
}

.cta-desc {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #1a1a1a;
  line-height: 1.6;
}

.btn-partner {
  padding: 18px 40px;
  background: #1a1a1a;
  color: #fff;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
}

.btn-partner:hover {
  transform: translateY(-2px);
  background: #333;
}

/* Footer */
.footer {
  background: #f8f9fa;
  padding: 80px 80px 32px;
  border-top: 1px solid #eaeaea;
}

.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 64px;
  margin-bottom: 64px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.footer-tagline {
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #666;
  margin-top: 16px;
  line-height: 1.7;
  max-width: 300px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-col-title {
  font-family: Arial, sans-serif;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.footer-link {
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #555;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #b5d336;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eaeaea;
  padding-top: 32px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  color: #888;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-bottom-links {
  display: flex;
  gap: 24px;
}

.footer-bottom-link {
  color: #888;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  cursor: pointer;
}

.footer-bottom-link:hover {
  color: #1a1a1a;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .hero { padding: 60px 40px; }
  .how-it-works, .features { padding: 80px 40px; }
  .footer { padding: 60px 40px 32px; }
}

@media (max-width: 768px) {
  .hero { flex-direction: column; text-align: center; }
  .hero-left { margin: 0 auto; }
  .hero-buttons { justify-content: center; }
  .hero-badges { justify-content: center; }
  .hero-right { width: 100%; }
  
  .nav-links { display: none; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  
  .cta-card { flex-direction: column; text-align: center; padding: 40px 32px; }
  .btn-partner { width: 100%; }
}
`;

export default function Landing() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <style>{customCSS}</style>

      {/* Navbar */}
  

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-left">
            <h1 className="hero-title">
              Turn Your Skills Into <span className="hero-title-italic">Opportunities.</span>
            </h1>
            <p className="hero-subtitle">
              Scan your resume, get matched with instant job eligibility, and upskill in the domain of your choice. Gain total confidence with AI-driven mock interviews.
            </p>
            
            <div className="hero-buttons">
             <Link to="/"> <button className="btn-base btn-green">
                <GraduationCap size={20} />
                I'm a Student
              </button></Link>
              <button className="btn-base btn-outline">
                <Building size={20} />
                I'm a University
              </button>
            </div>

            <div className="hero-badges">
              <div className="badge">
                <CheckCircle size={14} color="#b5d336" /> Resume Scanning
              </div>
              <div className="badge">
                <Shield size={14} color="#b5d336" /> Job Eligibility
              </div>
              <div className="badge">
                <Zap size={14} color="#b5d336" /> Mock Interviews
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-info">
                  <div className="avatar">AC</div>
                  <div>
                    <div className="profile-name">Alex Carter</div>
                    <div className="profile-role">Computer Science Junior</div>
                  </div>
                </div>
                <div className="score-badge">
                  <Cpu size={14} /> 98% Match
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span>Skill Alignment Score</span>
                  <span>Excellent</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill"></div>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-box">
                  <div className="stat-label">Core Skills</div>
                  <div className="stat-value">React, Python</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Interview Status</div>
                  <div className="stat-value">Confidently Ready</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works" id="jobs">
          <h2 className="section-title">How Upbring Works</h2>
          <p className="section-subtitle">
            A seamless bridge from your resume to your dream career.
          </p>

          <div className="steps-row">
            <div className="step">
              <div className="step-icon">
                <FileText size={32} />
              </div>
              <h3 className="step-title">1. Instant Scan</h3>
              <p className="step-desc">Upload your resume. Our AI extracts your core skills and finds roles you're eligible for <b>instantly</b>.</p>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <TrendingUp size={32} />
              </div>
              <h3 className="step-title">2. Domain Upskilling</h3>
              <p className="step-desc">Pick your target domain. We provide curated paths to bridge skill gaps and master your niche.</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <MessageSquare size={32} />
              </div>
              <h3 className="step-title">3. Mock Interviews</h3>
              <p className="step-desc">Practice with domain-specific AI interviews. Gain feedback and confidence before the real deal.</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <Target size={32} />
              </div>
              <h3 className="step-title">4. Land the Job</h3>
              <p className="step-desc">Apply with a verified profile and interview expertise that sets you apart from the crowd.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features" id="learn">
          <h2 className="feature-title">Why choose <span className="feature-title-italic">Upbring?</span></h2>
          <p className="feature-subtitle">The platform that empowers your career journey with data and practice.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3 className="feature-card-title">Instant Eligibility</h3>
              <p className="feature-card-desc">No more black holes. Know exactly which roles are looking for your current skill set the moment you join.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart2 size={24} />
              </div>
              <h3 className="feature-card-title">Personalized Growth</h3>
              <p className="feature-card-desc">Upskill in the technologies that actually matter for your dream roles, tailored to your choice.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <h3 className="feature-card-title">Interview Confidence</h3>
              <p className="feature-card-desc">Mock interviews eliminate the nerves. Enter your actual interviews feeling prepared and capable.</p>
            </div>
          </div>
        </section>

        {/* Mission Quote Section */}
        <section className="mission">
          <blockquote className="mission-quote">
            "We don't just find you jobs. We build the confidence to secure them."
          </blockquote>
          <div className="mission-cite">
            — THE UPBRING MISSION
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to shape your career?</h2>
              <p className="cta-desc">
                Join thousands of students scanning their resumes and mastering their interview techniques today.
              </p>
            </div>
            <button className="btn-base btn-partner">
              Start Scanning Now <ArrowRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }}/>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="nav-logo" style={{ marginBottom: '16px' }}>
              <div style={{ width: 24, height: 24, background: '#b5d336', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="#1a1a1a" />
              </div>
              <span className="nav-logo-text" style={{ fontSize: '18px' }}>Upbring</span>
            </div>
            <p className="footer-tagline">
              Bridging the gap between skills and employment. We scan, we upskill, we prepare, you succeed.
            </p>
          </div>
          
          <div className="footer-col">
            <div className="footer-col-title">Platform</div>
            <button className="footer-link">Resume Scan</button>
            <button className="footer-link">Upskill Courses</button>
            <button className="footer-link">Mock Interviews</button>
            <button className="footer-link">Job Board</button>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <button className="footer-link">Interview Tips</button>
            <button className="footer-link">Skill Analysis</button>
            <button className="footer-link">Help Center</button>
            <button className="footer-link">Alumni Stories</button>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <button className="footer-link">About Us</button>
            <button className="footer-link">Careers</button>
            <button className="footer-link">Contact</button>
            <button className="footer-link">Privacy</button>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Upbring Inc. All rights reserved.</div>
          <div className="footer-bottom-links">
            <button className="footer-bottom-link">Privacy Policy</button>
            <button className="footer-bottom-link">Terms of Service</button>
            <button className="footer-bottom-link">Cookies</button>
          </div>
        </div>
      </footer>
    </div>
  );
}