import { useState, useEffect, useRef } from "react";


 

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={s.navbar}>
      <div style={s.navLeft}>
        <img src="/logo.png" alt="" height="45" />
        
      </div>
      <div style={s.navCenter}>
        {["For Students", "For Mentors", "For Recruiters"].map((item, i) => (
          <a
            key={item}
            href="#"
            style={{
              ...s.navLink,
              color: i === 0 ? "#7ab800" : "#1a1a1a",
              borderBottom: i === 0 ? "2px solid #7ab800" : "2px solid transparent",
              paddingBottom: 4,
              fontWeight: i === 0 ? 600 : 400,
            }}
            onClick={(e) => e.preventDefault()}
          >
            {item}
          </a>
        ))}
      </div>
      <div style={s.navRight}>
        <button style={s.bellBtn} aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <div style={s.avatarCircle}>
          <div style={s.avatarInner} />
        </div>
      </div>
    </nav>
  );
}

// ── Profile Header ─────────────────────────────────────────────────────────
function ProfileHeader({ activeTab, setActiveTab }) {
  return (
    <div style={s.profileHeader}>
      <div style={s.profileInfo}>
        <div style={s.profileAvatar}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="30" fill="#d4a574" />
            <ellipse cx="30" cy="26" rx="11" ry="13" fill="#b8834a" />
            <ellipse cx="30" cy="52" rx="18" ry="12" fill="#c4956a" />
            <ellipse cx="30" cy="20" rx="13" ry="8" fill="#5a3010" />
          </svg>
        </div>
        <div>
          <h2 style={s.profileName}>Jane Cooper</h2>
          <span style={s.profileRole}>Student / Job Seeker</span>
        </div>
      </div>
      <button style={s.updateResumeBtn}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        Update Resume
      </button>
      <div style={s.tabs}>
        {["Skills", "Projects"].map((tab) => (
          <button
            key={tab}
            style={{
              ...s.tab,
              color: activeTab === tab ? "#1a1a1a" : "#999",
              borderBottom: activeTab === tab ? "2px solid #8cc800" : "2px solid transparent",
              fontWeight: activeTab === tab ? 600 : 400,
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Circular Score ─────────────────────────────────────────────────────────
function CircularScore({ score = 84 }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = score / 100;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setAnimated(progress * pct);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [pct]);

  const dashOffset = circumference * (1 - animated);

  return (
    <div style={s.scoreCard}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e8e8e8" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="#8cc800"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
        <text x="70" y="68" textAnchor="middle" style={{ fontSize: 32, fontWeight: 700, fontFamily: "Georgia, serif", fill: "#1a1a1a" }}>
          {score}
        </text>
      </svg>
      <div style={s.scoreLabel}>SKILL SCORE</div>
    </div>
  );
}

// ── Skill Bars ─────────────────────────────────────────────────────────────
function SkillBars() {
  const skills = [
    { name: "React", pct: 92 },
    { name: "Python", pct: 78 },
    { name: "Figma", pct: 88 },
    { name: "SQL", pct: 65 },
    { name: "Soft Skills", pct: 95 },
  ];
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={s.skillBarsCard}>
      {skills.map(({ name, pct }) => (
        <div key={name} style={{ marginBottom: 18 }}>
          <div style={s.skillBarHeader}>
            <span style={s.skillName}>{name}</span>
            <span style={s.skillPct}>{pct}%</span>
          </div>
          <div style={s.skillBarBg}>
            <div
              style={{
                ...s.skillBarFill,
                width: animated ? `${pct}%` : "0%",
                transition: "width 0.9s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Eligible Jobs ──────────────────────────────────────────────────────────
function EligibleJobs() {
  const jobs = ["Frontend Dev", "UI/UX Designer", "Data Analyst", "Product Designer"];
  return (
    <div style={s.eligibleCard}>
      <div style={s.eligibleHeader}>
        <div style={s.eligibleIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        </div>
        <span style={s.eligibleTitle}>Eligible Job Types</span>
      </div>
      <div style={s.jobTags}>
        {jobs.map((job) => (
          <span key={job} style={s.jobTag}>{job}</span>
        ))}
      </div>
      <p style={s.eligibleNote}>
        Based on your current skill scores, these roles are recommended for your profile.
      </p>
    </div>
  );
}

// ── Proficiency Section ────────────────────────────────────────────────────
function ProficiencySection() {
  return (
    <section style={s.proficiencySection}>
      <div style={s.proficiencyTitle}>
        <span style={s.proficiencyIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
        </span>
        <strong>Proficiency Deep Dive</strong>
      </div>
      <div style={s.proficiencyGrid}>
        <CircularScore score={84} />
        <SkillBars />
        <EligibleJobs />
      </div>
    </section>
  );
}

// ── Skills Cloud ───────────────────────────────────────────────────────────
function SkillsCloud() {
  const skills = [
    "JavaScript", "Tailwind CSS", "Git / GitHub", "Data Visualization",
    "User Research", "Wireframing", "Prototyping", "Communication",
    "Leadership", "Critical Thinking",
  ];
  return (
    <div style={s.skillsCloud}>
      <h3 style={s.sectionHeading}>Skills Cloud</h3>
      <div style={s.cloudTags}>
        {skills.map((skill) => (
          <span key={skill} style={s.cloudTag}>{skill}</span>
        ))}
      </div>
    </div>
  );
}

// ── Project Highlights ─────────────────────────────────────────────────────
function ProjectHighlights() {
  const projects = [
    {
      title: "E-Commerce Analytics Engine",
      desc: "A real-time dashboard built with React and D3.js to track user metrics and sales conversion rates.",
      tags: ["REACT", "D3.JS", "FIREBASE"],
      bg: "#1a1a2e",
      imgContent: (
        <svg width="110" height="70" viewBox="0 0 110 70" fill="none">
          <rect width="110" height="70" fill="#0f0f23"/>
          {[10,20,30,40,50,60].map((y,i)=>(
            <line key={i} x1="0" y1={y} x2="110" y2={y} stroke="#ffffff10" strokeWidth="0.5"/>
          ))}
          <polyline points="5,55 25,40 45,45 65,25 85,30 105,15" stroke="#8cc800" strokeWidth="2" fill="none"/>
          <polyline points="5,60 25,50 45,55 65,45 85,48 105,35" stroke="#4488ff" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
    },
    {
      title: "Eco-Track Mobile App",
      desc: "Complete UI/UX design and prototyping for a sustainability-focused habit tracker.",
      tags: ["FIGMA", "UI DESIGN", "USER TESTING"],
      bg: "#f5e8d8",
      imgContent: (
        <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
          <rect x="5" y="2" width="50" height="96" rx="8" fill="#fff" stroke="#ddd" strokeWidth="1"/>
          <rect x="10" y="12" width="40" height="6" rx="2" fill="#eee"/>
          <rect x="10" y="22" width="40" height="4" rx="2" fill="#f0f0f0"/>
          <rect x="10" y="30" width="30" height="4" rx="2" fill="#f0f0f0"/>
          <rect x="10" y="40" width="40" height="20" rx="4" fill="#8cc80020"/>
          <rect x="10" y="64" width="18" height="18" rx="3" fill="#8cc80030"/>
          <rect x="32" y="64" width="18" height="18" rx="3" fill="#8cc80030"/>
        </svg>
      ),
    },
    {
      title: "Automated Pipeline Script",
      desc: "Python scripts for automating database migrations and daily backups with SQL logging.",
      tags: ["PYTHON", "SQL", "DEVOPS"],
      bg: "#1a2010",
      imgContent: (
        <svg width="110" height="70" viewBox="0 0 110 70" fill="none">
          <rect width="110" height="70" fill="#0d1a08"/>
          {["#8cc800","#4a9","#fff8","#f84","#8cc800","#4a9","#fff8"].map((c,i)=>(
            <rect key={i} x="8" y={8+i*9} width={30+Math.sin(i*1.5)*20} height="4" rx="1" fill={c} opacity="0.8"/>
          ))}
        </svg>
      ),
    },
  ];

  return (
    <div style={s.projectHighlights}>
      <h3 style={s.sectionHeading}>Project Highlights</h3>
      <div style={s.projectList}>
        {projects.map(({ title, desc, tags, bg, imgContent }) => (
          <div key={title} style={s.projectCard}>
            <div style={{ ...s.projectThumb, background: bg }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                {imgContent}
              </div>
            </div>
            <div style={s.projectInfo}>
              <div style={s.projectTitle}>{title}</div>
              <div style={s.projectDesc}>{desc}</div>
              <div style={s.projectTags}>
                {tags.map((tag) => (
                  <span key={tag} style={s.projectTag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bottom Section ─────────────────────────────────────────────────────────
function BottomSection() {
  return (
    <section style={s.bottomSection}>
      <div style={s.bottomGrid}>
        <SkillsCloud />
        <ProjectHighlights />
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.footerInner}>
        <div style={s.footerBrand}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <img src="/logo.png" alt="" height="45" />
            
          </div>
          <p style={s.footerTagline}>
            Elevating student talent through<br />comprehensive skill analysis and industry-<br />aligned project tracking.
          </p>
        </div>
        <div style={s.footerCol}>
          <div style={s.footerColTitle}>PLATFORM</div>
          {["Skill Metrics", "Mentorship", "Career Pathways"].map((t) => (
            <a key={t} href="#" style={s.footerLink}>{t}</a>
          ))}
        </div>
        <div style={s.footerCol}>
          <div style={s.footerColTitle}>COMPANY</div>
          {["About Us", "Contact", "Privacy Policy"].map((t) => (
            <a key={t} href="#" style={s.footerLink}>{t}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function UpBringDashboard() {
  const [activeTab, setActiveTab] = useState("Skills");

  return (
    <div style={s.app}>
      <Navbar />
      <ProfileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Skills" ? (
        <>
          <ProficiencySection />
          <BottomSection />
        </>
      ) : (
        <BottomSection />
      )}
      <Footer />
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
  app: {
    fontFamily: "'Arial', sans-serif",
    color: "#1a1a1a",
    background: "#fff",
    minHeight: "100vh",
  },

  // Navbar
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: 56,
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: { display: "flex", alignItems: "center", gap: 8 },
  navLogoText: { fontSize: 17, letterSpacing: "-0.3px" },
  navCenter: { display: "flex", gap: 36 },
  navLink: {
    textDecoration: "none",
    fontSize: 14,
    cursor: "pointer",
    paddingBottom: 4,
  },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  bellBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "flex",
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#d4a574",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(180deg, #b8834a 0%, #d4a574 60%, #c4956a 100%)",
  },

  // Profile Header
  profileHeader: {
    background: "#fff",
    padding: "32px 40px 0",
    borderBottom: "1px solid #eee",
    position: "relative",
  },
  profileInfo: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #8cc800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#d4a574",
  },
  profileName: {
    margin: "0 0 4px",
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Georgia, serif",
  },
  profileRole: {
    fontSize: 13,
    color: "#888",
    background: "#f5f5f5",
    padding: "3px 10px",
    borderRadius: 999,
  },
  updateResumeBtn: {
    position: "absolute",
    top: 32,
    right: 40,
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    background: "#8cc800",
    border: "none",
    borderRadius: 8,
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    color: "#1a1a1a",
  },
  tabs: { display: "flex", gap: 32 },
  tab: {
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "8px 0",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
  },

  // Proficiency
  proficiencySection: {
    background: "#f0ecca",
    padding: "48px 40px",
  },
  proficiencyTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 18,
    fontFamily: "Georgia, serif",
    marginBottom: 28,
  },
  proficiencyIcon: {
    width: 32,
    height: 32,
    background: "#fff",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  proficiencyGrid: {
    display: "grid",
    gridTemplateColumns: "200px 1fr 260px",
    gap: 20,
  },

  // Score Card
  scoreCard: {
    background: "#fff",
    borderRadius: 14,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#888",
    marginTop: 8,
  },

  // Skill Bars
  skillBarsCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "28px 32px",
  },
  skillBarHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  skillName: { fontSize: 13, fontWeight: 500, color: "#333" },
  skillPct: { fontSize: 13, fontWeight: 600, color: "#1a1a1a" },
  skillBarBg: {
    height: 7,
    background: "#e8e8e8",
    borderRadius: 999,
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
    background: "#8cc800",
    borderRadius: 999,
  },

  // Eligible Jobs
  eligibleCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "24px",
  },
  eligibleHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  eligibleIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  eligibleTitle: { fontSize: 14, fontWeight: 700 },
  jobTags: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  jobTag: {
    padding: "7px 14px",
    background: "#f0f7d4",
    border: "1px solid #c5e04a",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    color: "#3a5a00",
    cursor: "pointer",
  },
  eligibleNote: {
    fontSize: 12,
    color: "#888",
    lineHeight: 1.6,
    fontStyle: "italic",
  },

  // Bottom section
  bottomSection: {
    background: "#e8e8e3",
    padding: "48px 40px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.8fr",
    gap: 40,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 20,
    fontFamily: "Georgia, serif",
  },

  // Skills Cloud
  skillsCloud: {},
  cloudTags: { display: "flex", flexWrap: "wrap", gap: 10 },
  cloudTag: {
    padding: "8px 16px",
    background: "#c8e840",
    border: "none",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },

  // Projects
  projectHighlights: {},
  projectList: { display: "flex", flexDirection: "column", gap: 16 },
  projectCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "16px",
    display: "flex",
    gap: 20,
    alignItems: "center",
  },
  projectThumb: {
    width: 130,
    height: 90,
    borderRadius: 10,
    overflow: "hidden",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  projectInfo: { flex: 1 },
  projectTitle: { fontSize: 15, fontWeight: 700, marginBottom: 6 },
  projectDesc: { fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 10 },
  projectTags: { display: "flex", gap: 8 },
  projectTag: {
    padding: "4px 10px",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: "#444",
  },

  // Footer
  footer: {
    background: "#f0ecca",
    padding: "48px 40px 32px",
  },
  footerInner: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 48,
  },
  footerBrand: {},
  footerLogoText: { fontSize: 16 },
  footerTagline: {
    fontSize: 13,
    color: "#666",
    lineHeight: 1.7,
    margin: 0,
  },
  footerCol: { display: "flex", flexDirection: "column", gap: 10 },
  footerColTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  footerLink: {
    fontSize: 13,
    color: "#444",
    textDecoration: "none",
    cursor: "pointer",
  },
};