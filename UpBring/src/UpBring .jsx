import { useState } from "react";
import "./index.css";

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ activeSection, onNav }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src="/logo.png" alt="" height="45" />
      </div>
      <div className="nav-links">
        {["Home", "Get Job", "Mock Interview", "Learn Skill", "Dashboard"].map((item) => (
          <button
            key={item}
            className="nav-link"
            style={{ fontWeight: activeSection === item ? 600 : 400 }} // Kept dynamic logic
            onClick={(e) => { e.preventDefault(); onNav(item); }}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        <button className="btn-outline-nav">For Students</button>
        <button className="btn-green-nav">For Universities</button>
      </div>
    </nav>
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────
function HeroSection() {
  const [score] = useState(88);
  const [progress] = useState(78);

  return (
    <section className="hero">
      <div className="hero-left">
        <h1 className="hero-title">
          Turn Your<br />Skills Into<br />
          <em className="hero-title-italic">Opportunities.</em>
        </h1>
        <p className="hero-subtitle">
          Analyze your profile and get matched with career<br />
          opportunities tailored to your unique skill set. Join the<br />
          future of recruitment.
        </p>
        <div className="hero-buttons">
          <button className="btn-green">Analyse My Resume →</button>
          <button className="btn-outline">I'm a University</button>
        </div>
        <div className="hero-badges">
          {[
            { icon: "💼", text: "10K+ Jobs" },
            { icon: "🎓", text: "500+ Universities" },
            { icon: "🛡️", text: "92% Placement" },
          ].map(({ icon, text }) => (
            <span key={text} className="badge">
              <span>{icon}</span> {text}
            </span>
          ))}
        </div>
      </div>
      <div className="hero-right">
        <div className="profile-card">
          <div className="profile-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar">AJ</div>
              <div>
                <div className="profile-name">Alex Johnson</div>
                <div className="profile-role">Computer Science Student</div>
              </div>
            </div>
            <div className="score-badge">SCORE: {score}</div>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="profile-stats">
            <div className="stat-box">
              <div className="stat-label">Top Skill</div>
              <div className="stat-value">Python Dev</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Recommended</div>
              <div className="stat-value">AI Intern</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
      title: "Upload Resume",
      desc: "Securely upload your CV or LinkedIn profile.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Get Skill Score",
      desc: "AI analyzes your gaps and strengths instantly.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      title: "Match to Jobs",
      desc: "Connect directly with hiring partners.",
    },
  ];

  return (
    <section className="how-it-works">
      <h2 className="section-title">How It Works</h2>
      <p className="section-subtitle">Three simple steps to launch your career.</p>
      <div className="steps-row">
        {steps.map(({ icon, title, desc }) => (
          <div key={title} className="step">
            <div className="step-icon">{icon}</div>
            <div className="step-title">{title}</div>
            <div className="step-desc">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features Section ──────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      // icon: (/* SVG code */),
      title: "Skill Score Analysis",
      desc: "Deep dive into your technical and soft skills with our proprietary AI scoring engine.",
    },
    // ... other features
  ];

  return (
    <section className="features">
      <h2 className="feature-title">Features for the Future</h2>
      <p className="feature-subtitle">Everything you need to level up your professional profile.</p>
      <div className="features-grid">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="feature-card">
            <div className="feature-icon">{icon}</div>
            <div className="feature-card-title">{title}</div>
            <div className="feature-card-desc">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Mission Quote ─────────────────────────────────────────────────────────
function MissionSection() {
  return (
    <section className="mission">
      <blockquote className="mission-quote">
        "We don't just find you jobs. We build the path to get there."
      </blockquote>
      <cite className="mission-cite">— THE UPBRING MISSION</cite>
    </section>
  );
}

// ── University CTA ────────────────────────────────────────────────────────
function UniversityCTA() {
  return (
    <section className="cta-section">
      <div className="cta-card">
        <div className="cta-left">
          <h3 className="cta-title">Are You a University?</h3>
          <p className="cta-desc">
            Partner with us to boost your students' placement rates and get<br />
            real-time insights into industry skill demands.
          </p>
        </div>
        <button className="btn-partner">Partner With Us</button>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  const platform = ["How it Works", "Skill Score", "Job Board", "Resume AI"];
  const company = ["About Us", "Careers", "Press", "Contact"];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="nav-logo">
            <img src="/logo.png" alt="" height="45" />
          </div>
          <p className="footer-tagline">
            Empowering the next generation of talent<br />through data-driven career mapping.
          </p>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Platform</div>
          {platform.map((t) => <a key={t} href="#" className="footer-link">{t}</a>)}
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Company</div>
          {company.map((t) => <a key={t} href="#" className="footer-link">{t}</a>)}
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Contact</div>
          <a href="mailto:hello@upbring.io" className="footer-link">✉ hello@upbring.io</a>
          <a href="#" className="footer-link">📍 San Francisco, CA</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 UpBring Platform. All rights reserved.</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
            <a key={t} href="#" className="footer-bottom-link">{t}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function UpBring() {
  const [activeSection, setActiveSection] = useState("Home");

  const handleNav = (section) => {
    setActiveSection(section);
    const map = {
      Home: "hero",
      Features: "features",
      "How It Works": "how-it-works",
      About: "mission",
    };
    const el = document.getElementById(map[section]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navbar activeSection={activeSection} onNav={handleNav} />
      <div id="hero"><HeroSection /></div>
      <div id="how-it-works"><HowItWorksSection /></div>
      <div id="features"><FeaturesSection /></div>
      <div id="mission"><MissionSection /></div>
      <UniversityCTA />
      <Footer />
    </div>
  );
}

// // ── Styles ─────────────────────────────────────────────────────────────────
// const styles = {
//   app: {
//     fontFamily: "'Georgia', 'Times New Roman', serif",
//     color: "#1a1a1a",
//     margin: 0,
//     padding: 0,
//     overflowX: "hidden",
//   },

//   // Navbar
//   navbar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 48px",
//     height: 60,
//     background: "#fff",
//     borderBottom: "1px solid #e8e8e8",
//     position: "sticky",
//     top: 0,
//     zIndex: 100,
//   },
//   navLogo: { display: "flex", alignItems: "center", gap: 8 },
//   navLogoText: { fontSize: 18, letterSpacing: "-0.3px" },
//   navLinks: { display: "flex", gap: 32 },
//   navLink: {
//     textDecoration: "none",
//     color: "#1a1a1a",
//     fontSize: 14,
//     fontFamily: "Arial, sans-serif",
//     cursor: "pointer",
//   },
//   navActions: { display: "flex", gap: 12, alignItems: "center" },
//   btnOutlineNav: {
//     padding: "8px 18px",
//     border: "1.5px solid #1a1a1a",
//     borderRadius: 8,
//     background: "transparent",
//     fontFamily: "Arial, sans-serif",
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   btnGreenNav: {
//     padding: "8px 18px",
//     border: "none",
//     borderRadius: 8,
//     background: "#b5d336",
//     fontFamily: "Arial, sans-serif",
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: "pointer",
//   },

//   // Hero
//   hero: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     background: "#f0ecca",
//     padding: "80px 80px 80px 80px",
//     minHeight: "calc(100vh - 60px)",
//     boxSizing: "border-box",
//   },
//   heroLeft: { maxWidth: 520 },
//   heroTitle: {
//     fontSize: 62,
//     fontWeight: 700,
//     lineHeight: 1.1,
//     margin: "0 0 24px 0",
//     letterSpacing: "-1px",
//   },
//   heroTitleItalic: {
//     fontStyle: "italic",
//     fontWeight: 700,
//   },
//   heroSubtitle: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 15,
//     lineHeight: 1.7,
//     color: "#444",
//     margin: "0 0 32px 0",
//   },
//   heroButtons: { display: "flex", gap: 16, marginBottom: 32 },
//   btnGreen: {
//     padding: "14px 28px",
//     background: "#b5d336",
//     border: "none",
//     borderRadius: 8,
//     fontFamily: "Arial, sans-serif",
//     fontSize: 14,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   btnOutline: {
//     padding: "14px 28px",
//     background: "transparent",
//     border: "2px solid #1a1a1a",
//     borderRadius: 8,
//     fontFamily: "Arial, sans-serif",
//     fontSize: 14,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   heroBadges: { display: "flex", gap: 12, flexWrap: "wrap" },
//   badge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     padding: "8px 16px",
//     background: "rgba(255,255,255,0.6)",
//     border: "1px solid rgba(0,0,0,0.1)",
//     borderRadius: 999,
//     fontFamily: "Arial, sans-serif",
//     fontSize: 13,
//     fontWeight: 500,
//   },

//   // Profile card
//   heroRight: { flex: "0 0 420px" },
//   profileCard: {
//     background: "#fff",
//     borderRadius: 16,
//     padding: "28px",
//     boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
//   },
//   profileCardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: "50%",
//     background: "#c9a07a",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontFamily: "Arial, sans-serif",
//     fontWeight: 700,
//     fontSize: 14,
//     color: "#fff",
//   },
//   profileName: { fontWeight: 700, fontSize: 16, marginBottom: 2 },
//   profileRole: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 12,
//     color: "#666",
//   },
//   scoreBadge: {
//     background: "#b5d336",
//     borderRadius: 6,
//     padding: "6px 12px",
//     fontFamily: "Arial, sans-serif",
//     fontSize: 12,
//     fontWeight: 700,
//   },
//   progressBarBg: {
//     height: 6,
//     background: "#e8e8e8",
//     borderRadius: 999,
//     marginBottom: 20,
//   },
//   progressBarFill: {
//     height: "100%",
//     background: "#b5d336",
//     borderRadius: 999,
//     transition: "width 0.5s ease",
//   },
//   profileStats: { display: "flex", gap: 12 },
//   statBox: {
//     flex: 1,
//     background: "#f5f5f5",
//     borderRadius: 10,
//     padding: "12px 16px",
//   },
//   statLabel: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 11,
//     color: "#888",
//     marginBottom: 4,
//   },
//   statValue: { fontWeight: 700, fontSize: 15 },

//   // How It Works
//   howItWorks: {
//     background: "#fff",
//     padding: "80px 80px",
//     textAlign: "center",
//   },
//   sectionTitle: {
//     fontSize: 36,
//     fontWeight: 700,
//     marginBottom: 12,
//   },
//   sectionSubtitle: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 15,
//     color: "#666",
//     marginBottom: 60,
//   },
//   stepsRow: {
//     display: "flex",
//     justifyContent: "center",
//     gap: 80,
//   },
//   step: { maxWidth: 200, textAlign: "center" },
//   stepIcon: {
//     width: 72,
//     height: 72,
//     borderRadius: "50%",
//     background: "#b5d336",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 auto 20px",
//   },
//   stepTitle: { fontWeight: 700, fontSize: 16, marginBottom: 8 },
//   stepDesc: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 13,
//     color: "#666",
//     lineHeight: 1.6,
//   },

//   // Features
//   features: {
//     background: "#e8e8e3",
//     padding: "80px 80px",
//   },
//   featureTitle: {
//     fontSize: 36,
//     fontWeight: 700,
//     fontStyle: "italic",
//     marginBottom: 12,
//   },
//   featureSubtitle: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 15,
//     color: "#666",
//     marginBottom: 48,
//   },
//   featuresGrid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 20,
//   },
//   featureCard: {
//     background: "#fff",
//     borderRadius: 16,
//     padding: "32px",
//   },
//   featureIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 10,
//     background: "#f0ecca",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   featureCardTitle: { fontWeight: 700, fontSize: 18, marginBottom: 10 },
//   featureCardDesc: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 14,
//     color: "#555",
//     lineHeight: 1.6,
//   },

//   // Mission
//   mission: {
//     background: "#f0ecca",
//     padding: "100px 80px",
//     textAlign: "center",
//   },
//   missionQuote: {
//     fontSize: 38,
//     fontStyle: "italic",
//     fontWeight: 700,
//     maxWidth: 800,
//     margin: "0 auto 20px",
//     lineHeight: 1.3,
//     border: "none",
//   },
//   missionCite: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 12,
//     letterSpacing: "2px",
//     color: "#666",
//     fontStyle: "normal",
//   },

//   // CTA
//   ctaSection: {
//     background: "#e8e8e3",
//     padding: "60px 80px",
//   },
//   ctaCard: {
//     background: "#b5d336",
//     borderRadius: 20,
//     padding: "48px 56px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     maxWidth: 1100,
//     margin: "0 auto",
//   },
//   ctaLeft: {},
//   ctaTitle: { fontSize: 28, fontWeight: 800, marginBottom: 12, fontFamily: "Arial, sans-serif" },
//   ctaDesc: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 14,
//     color: "#333",
//     lineHeight: 1.6,
//   },
//   btnPartner: {
//     padding: "16px 32px",
//     background: "#fff",
//     border: "2px solid #1a1a1a",
//     borderRadius: 12,
//     fontFamily: "Arial, sans-serif",
//     fontSize: 15,
//     fontWeight: 700,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//     flexShrink: 0,
//   },

//   // Footer
//   footer: {
//     background: "#f0ecca",
//     padding: "60px 80px 32px",
//   },
//   footerInner: {
//     display: "grid",
//     gridTemplateColumns: "2fr 1fr 1fr 1fr",
//     gap: 48,
//     marginBottom: 48,
//   },
//   footerBrand: {},
//   footerTagline: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 13,
//     color: "#555",
//     marginTop: 16,
//     lineHeight: 1.7,
//   },
//   footerCol: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },
//   footerColTitle: {
//     fontFamily: "Arial, sans-serif",
//     fontWeight: 700,
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   footerLink: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 13,
//     color: "#444",
//     textDecoration: "none",
//     cursor: "pointer",
//   },
//   footerBottom: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderTop: "1px solid rgba(0,0,0,0.1)",
//     paddingTop: 24,
//     fontFamily: "Arial, sans-serif",
//     fontSize: 12,
//     color: "#666",
//   },
//   footerBottomLink: {
//     fontFamily: "Arial, sans-serif",
//     fontSize: 12,
//     color: "#444",
//     textDecoration: "none",
//   },
// };