import { useState, useEffect } from "react";




// ── Navbar — Readiness Report ──────────────────────────────────────────────
function NavbarReadiness({ activePage, setActivePage }) {
  const items = ["Home", "Get Job", "Mock Interview","Learn Skill", "Dashboard"];
  return (
    <nav style={s.navbar}>
      <div style={s.navLeft}>
        <img src="/logo.png" alt="" height="45" />
        
      </div>
      <div style={s.navCenter}>
        {items.map((item) => (
          <a
            key={item}
            href="#"
            style={{ ...s.navLink, fontWeight: activePage === item ? 600 : 400 }}
            onClick={(e) => { e.preventDefault(); setActivePage(item); }}
          >
            {item}
          </a>
        ))}
      </div>
      <div style={s.navRight}>
        <button style={s.bellBtn} aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        <div style={s.avatarPhoto}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="17" fill="#c9a882" />
            <ellipse cx="17" cy="14" rx="6" ry="7" fill="#a07040" />
            <ellipse cx="17" cy="30" rx="10" ry="7" fill="#b8905a" />
          </svg>
        </div>
      </div>
    </nav>
  );
}



// ── Circular Progress ─────────────────────────────────────────────────────
function CircularProgress({ pct = 92 }) {
  const r = 72;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = null;
    const dur = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setProgress(ease * pct);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [pct]);

  const offset = circ - (progress / 100) * circ;

  return (
    <div style={s.circleWrap}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#e0e0e0" strokeWidth="12" />
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke="#8cc800"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
        />
        <text x="90" y="86" textAnchor="middle" style={{ fontSize: 36, fontWeight: 700, fontFamily: "Georgia, serif", fill: "#1a1a1a" }}>
          {Math.round(progress)}%
        </text>
        <text x="90" y="108" textAnchor="middle" style={{ fontSize: 11, letterSpacing: 2, fill: "#888", fontFamily: "Arial, sans-serif" }}>
          READY
        </text>
      </svg>
    </div>
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={s.hero}>
      <div style={s.heroLeft}>
        <h1 style={s.heroTitle}>Your Job Readiness<br />Report</h1>
        <p style={s.heroDesc}>
          Track your progress and identify key areas for growth<br />
          to become industry-ready. You are currently in the<br />
          top 10% of candidates.
        </p>
        <button style={s.viewReportBtn}>
          View Detailed Report&nbsp;
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>
      <div style={s.heroRight}>
        <CircularProgress pct={92} />
      </div>
    </section>
  );
}

// ── Skill Bar ─────────────────────────────────────────────────────────────
function SkillBar({ label, pct, animated }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={s.skillRowHeader}>
        <span style={s.skillLabel}>{label}</span>
        <span style={s.skillPct}>{pct}%</span>
      </div>
      <div style={s.skillBarBg}>
        <div style={{ ...s.skillBarFill, width: animated ? `${pct}%` : "0%" }} />
      </div>
    </div>
  );
}

// ── Domain Card ───────────────────────────────────────────────────────────
function DomainCard({ category, title }) {
  return (
    <div style={s.domainCard}>
      <div style={s.domainCategory}>{category}</div>
      <div style={s.domainTitle}>{title}</div>
    </div>
  );
}

// ── Skill Breakdown ────────────────────────────────────────────────────────
function SkillBreakdown() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 150); return () => clearTimeout(t); }, []);

  const skills = [
    { label: "Technical Skills", pct: 95 },
    { label: "Communication", pct: 90 },
    { label: "Problem Solving", pct: 82 },
    { label: "Leadership", pct: 75 },
  ];

  return (
    <section style={s.skillSection}>
      <h2 style={s.sectionTitle}>Skill Breakdown</h2>
      <div style={s.skillGrid}>
        <div style={s.skillBarsCard}>
          {skills.map(({ label, pct }) => (
            <SkillBar key={label} label={label} pct={pct} animated={animated} />
          ))}
        </div>
        <div style={s.domainCards}>
          <DomainCard category="DOMAIN MASTERY" title="Technical Depth: 95%" />
          <DomainCard category="HUMAN INTERACTIONS" title="Soft Skills: 88%" />
          <DomainCard category="INFORMATION FLOW" title="Communication: 90%" />
        </div>
      </div>
    </section>
  );
}

// ── Analysis Summary ───────────────────────────────────────────────────────
function AnalysisSummary() {
  return (
    <section style={s.analysisSection}>
      <h2 style={s.analysisTitleText}>Analysis Summary</h2>
      <div style={s.analysisBody}>
        <p style={s.analysisPara}>
          Based on your current performance, you have demonstrated a{" "}
          <strong>high level of technical proficiency, particularly in data structures and backend logic.</strong>{" "}
          Your communication scores indicate that you can articulate complex ideas clearly, which is a{" "}
          <strong>highly sought-after trait</strong> in modern engineering teams.
        </p>
        <p style={s.analysisPara}>
          However, your project management and leadership components show room for growth.
          Focusing on <strong>mentoring junior developers</strong> or taking ownership of end-to-end features will
          likely bridge the final gap between where you are and a senior-level placement.
        </p>
        <p style={s.analysisPara}>
          We recommend prioritizing the{" "}
          <span style={s.analysisLink}>Leadership Foundations workshop</span>{" "}
          to bolster your management profile before the upcoming hiring season.
        </p>
      </div>
    </section>
  );
}

// ── Bridge Gap Courses ─────────────────────────────────────────────────────
function BridgeGapSection() {
  const courses = [
    {
      badge: "ADVANCED",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3" /><line x1="12" y1="8" x2="12" y2="21" />
          <line x1="8" y1="12" x2="12" y2="8" /><line x1="16" y1="12" x2="12" y2="8" />
        </svg>
      ),
      title: "Advanced System Design",
      desc: "Master distributed systems, microservices architecture, and high-availability patterns for enterprise-scale applications.",
      enrollColor: "#1a1a1a",
    },
    {
      badge: "CORE",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Leadership Foundations",
      desc: "Develop critical soft skills for leading agile teams, conflict resolution, and strategic decision-making in a tech environment.",
      enrollColor: "#8cc800",
    },
  ];

  return (
    <section style={s.bridgeSection}>
      <div style={s.bridgeHeader}>
        <h2 style={s.sectionTitle}>Ready to Bridge the Final Gap?</h2>
        <a href="#" style={s.viewAllLink}>
          View All Courses&nbsp;
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            <path d="M21 16v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
          </svg>
        </a>
      </div>
      <div style={s.bridgeGrid}>
        {courses.map(({ badge, icon, title, desc, enrollColor }) => (
          <div key={title} style={s.bridgeCard}>
            <div style={s.bridgeCardTop}>
              <div style={s.bridgeIcon}>{icon}</div>
              <span style={s.bridgeBadge}>{badge}</span>
            </div>
            <div style={s.bridgeTitle}>{title}</div>
            <div style={s.bridgeDesc}>{desc}</div>
            <a href="#" style={{ ...s.enrollLink, color: enrollColor }}>
              Enroll →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Footer — Readiness ────────────────────────────────────────────────────
function FooterReadiness() {
  return (
    <footer style={s.footerSimple}>
      <div style={s.footerSimpleInner}>
        <div style={s.navLeft}>
          <img src="/logo.png" alt="" height="45" />
         
        </div>
        <div style={s.footerLinks}>
          {["Terms", "Privacy", "Contact Support"].map((t) => (
            <a key={t} href="#" style={s.footerSimpleLink}>{t}</a>
          ))}
        </div>
        <div style={s.footerCopy}>© 2024 UpBring Education Platforms Inc.</div>
      </div>
    </footer>
  );
}

// ── Recommended Courses ────────────────────────────────────────────────────
function RecommendedCourses() {
  const courses = [
    {
      platform: "COURSERA",
      hours: "12 Hours",
      title: "Advanced UI Design: Mastering Visual Grids",
    },
    {
      platform: "UDEMY",
      hours: "24 Hours",
      title: "UX Research Mastery: User Testing & Insights",
    },
    {
      platform: "INTERACTION DESIGN",
      hours: "8 Hours",
      title: "Psychology in Web Design: The Human Element",
    },
  ];

  return (
    <section style={s.recommendedSection}>
      <div style={s.recommendedHeader}>
        <div>
          <h2 style={s.recommendedTitle}>Recommended Courses</h2>
          <p style={s.recommendedSubtitle}>Specially curated high-impact courses for your next level.</p>
        </div>
        <a href="#" style={s.exploreAllLink}>Explore all 48 courses →</a>
      </div>
      <div style={s.coursesGrid}>
        {courses.map(({ platform, hours, title }) => (
          <div key={title} style={s.courseCard}>
            <div style={s.courseCardTop}>
              <span style={s.platformBadge}>{platform}</span>
              <span style={s.hoursText}>{hours}</span>
            </div>
            <div style={s.courseCardTitle}>{title}</div>
            <a href="#" style={s.openCourseLink}>Open Course →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Footer — Courses ──────────────────────────────────────────────────────
function FooterCourses() {
  return (
    <footer style={s.footerCourses}>
      <div style={s.footerCoursesInner}>
        <div style={s.footerBrand}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
           <img src="/logo.png" alt="" height="45" />
           
          </div>
          <p style={s.footerBrandDesc}>
            Elevating students' careers through data-driven<br />
            role selection and personalized improvement<br />
            roadmaps.
          </p>
          <div style={s.footerSocials}>
            <button style={s.socialBtn} aria-label="website">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
            <button style={s.socialBtn} aria-label="email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </button>
          </div>
        </div>
        <div style={s.footerCol}>
          <div style={s.footerColTitle}>PLATFORM</div>
          {["All Courses", "Role Explorer", "Certifications"].map((t) => (
            <a key={t} href="#" style={s.footerColLink}>{t}</a>
          ))}
        </div>
        <div style={s.footerCol}>
          <div style={s.footerColTitle}>COMMUNITY</div>
          {["Find Mentors", "Student Showcase", "Forums"].map((t) => (
            <a key={t} href="#" style={s.footerColLink}>{t}</a>
          ))}
        </div>
        <div style={s.footerCol}>
          <div style={s.footerColTitle}>SUPPORT</div>
          {["Help Center", "Contact Us", "Privacy Policy"].map((t) => (
            <a key={t} href="#" style={s.footerColLink}>{t}</a>
          ))}
        </div>
      </div>
      <div style={s.footerCoursesCopy}>
        © 2024 UpBring Education Tech. All rights reserved.
      </div>
    </footer>
  );
}


// ── Main App ───────────────────────────────────────────────────────────────
export default function UpBringReadiness() {
  const [page, setPage] = useState("readiness");
  const [activeReadinessNav, setActiveReadinessNav] = useState("Dashboard");
  const [activeCoursesNav, setActiveCoursesNav] = useState("Roadmaps");

  return (
    <div style={s.app}>
      

      {page === "readiness" ? (
        <>
          <NavbarReadiness activePage={activeReadinessNav} setActivePage={setActiveReadinessNav} />
          <HeroSection />
          <SkillBreakdown />
          <AnalysisSummary />
          <BridgeGapSection />
          <FooterReadiness />
        </>
      ) : (
        <>
          
          <RecommendedCourses />
          <FooterCourses />
        </>
      )}
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


  
  // Shared Navbar
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
    color: "#1a1a1a",
    fontSize: 14,
    cursor: "pointer",
    paddingBottom: 4,
    borderBottom: "2px solid transparent",
  },
  navRight: { display: "flex", alignItems: "center", gap: 14 },
  bellBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "flex",
  },
  avatarPhoto: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileBtn: {
    padding: "8px 20px",
    background: "#8cc800",
    border: "none",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    color: "#1a1a1a",
  },
  avatarOrange: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#e8a040",
  },

  // Hero
  hero: {
    background: "#f0ecca",
    padding: "60px 80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 320,
  },
  heroLeft: { maxWidth: 520 },
  heroTitle: {
    fontSize: 48,
    fontWeight: 700,
    fontFamily: "Georgia, serif",
    lineHeight: 1.15,
    margin: "0 0 18px",
  },
  heroDesc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 1.7,
    marginBottom: 28,
  },
  viewReportBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "12px 24px",
    background: "#8cc800",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    color: "#1a1a1a",
  },
  heroRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  circleWrap: {},

  // Skill Breakdown
  skillSection: {
    background: "#e8e8e3",
    padding: "48px 80px",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "Georgia, serif",
    marginBottom: 24,
  },
  skillGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    alignItems: "start",
  },
  skillBarsCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "28px 32px",
  },
  skillRowHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skillLabel: { fontSize: 13, color: "#333" },
  skillPct: { fontSize: 13, fontWeight: 600 },
  skillBarBg: {
    height: 8,
    background: "#e0e0e0",
    borderRadius: 999,
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
    background: "#8cc800",
    borderRadius: 999,
    transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
  },
  domainCards: { display: "flex", flexDirection: "column", gap: 12 },
  domainCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px 24px",
  },
  domainCategory: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#888",
    marginBottom: 8,
  },
  domainTitle: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
  },

  // Analysis Summary
  analysisSection: {
    background: "#fff",
    padding: "56px 80px",
    maxWidth: "100%",
  },
  analysisTitleText: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "Georgia, serif",
    marginBottom: 20,
  },
  analysisBody: { maxWidth: 640 },
  analysisPara: {
    fontSize: 14,
    color: "#333",
    lineHeight: 1.8,
    marginBottom: 18,
  },
  analysisLink: {
    textDecoration: "underline",
    color: "#1a1a1a",
    cursor: "pointer",
  },

  // Bridge Gap
  bridgeSection: {
    background: "#f0ecca",
    padding: "48px 80px",
  },
  bridgeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  viewAllLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#1a1a1a",
    textDecoration: "none",
    fontWeight: 500,
  },
  bridgeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  bridgeCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "28px",
  },
  bridgeCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bridgeIcon: {
    width: 38,
    height: 38,
    background: "#f0f7d4",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bridgeBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: "#666",
  },
  bridgeTitle: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 10,
  },
  bridgeDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  enrollLink: {
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  },

  // Footer Readiness
  footerSimple: {
    background: "#f0ecca",
    padding: "28px 80px",
    borderTop: "1px solid #e0d8c0",
  },
  footerSimpleInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLinks: { display: "flex", gap: 32 },
  footerSimpleLink: {
    fontSize: 13,
    color: "#444",
    textDecoration: "none",
  },
  footerCopy: { fontSize: 12, color: "#888" },

  // Recommended Courses
  recommendedSection: {
    background: "#fff",
    padding: "48px 40px",
  },
  recommendedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 32,
  },
  recommendedTitle: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Georgia, serif",
    margin: "0 0 6px",
  },
  recommendedSubtitle: {
    fontSize: 13,
    color: "#777",
  },
  exploreAllLink: {
    fontSize: 13,
    color: "#7ab800",
    textDecoration: "none",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 20,
  },
  courseCard: {
    background: "#f5f0dc",
    borderRadius: 16,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  courseCardTop: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  platformBadge: {
    background: "#8cc800",
    borderRadius: 999,
    padding: "4px 12px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.3px",
    color: "#1a1a1a",
  },
  hoursText: { fontSize: 12, color: "#888" },
  courseCardTitle: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.4,
    flex: 1,
  },
  openCourseLink: {
    fontSize: 13,
    color: "#7ab800",
    textDecoration: "none",
    fontWeight: 600,
    marginTop: "auto",
  },

  // Footer Courses
  footerCourses: {
    background: "#f0ecca",
    padding: "48px 40px 28px",
  },
  footerCoursesInner: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: 48,
    marginBottom: 32,
  },
  footerBrand: {},
  footerBrandDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 1.7,
    marginBottom: 16,
  },
  footerSocials: { display: "flex", gap: 10 },
  socialBtn: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "1px solid #ccc",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  footerCol: { display: "flex", flexDirection: "column", gap: 10 },
  footerColTitle: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  footerColLink: {
    fontSize: 13,
    color: "#555",
    textDecoration: "none",
    cursor: "pointer",
  },
  footerCoursesCopy: {
    borderTop: "1px solid #e0d8c0",
    paddingTop: 20,
    fontSize: 12,
    color: "#888",
  },
};