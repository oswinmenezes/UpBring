import { useState } from "react";




// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [active, setActive] = useState("Roadmaps");
  const items = ["Explore", "Roadmaps", "Mentors", "My Courses"];
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
            onClick={(e) => { e.preventDefault(); setActive(item); }}
            style={{
              ...s.navLink,
              color: active === item ? "#7ab800" : "#1a1a1a",
              fontWeight: active === item ? 600 : 400,
              borderBottom: active === item ? "2px solid #7ab800" : "2px solid transparent",
            }}
          >
            {item}
          </a>
        ))}
      </div>
      <div style={s.navRight}>
        <button style={s.profileBtn}>Profile</button>
        <div style={s.avatarOrange} />
      </div>
    </nav>
  );
}

// ── Domain / Role Selectors ────────────────────────────────────────────────
const domainOptions = ["Design & Creative", "Engineering", "Data Science", "Marketing"];
const roleMap = {
  "Design & Creative": ["Product Designer", "UI/UX Designer", "Motion Designer", "Brand Designer"],
  "Engineering": ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "DevOps Engineer"],
  "Data Science": ["Data Analyst", "ML Engineer", "Data Engineer", "AI Researcher"],
  "Marketing": ["Growth Marketer", "SEO Specialist", "Content Strategist", "Performance Marketer"],
};

const roleInfo = {
  "Product Designer":     { demand: "High Demand",   salary: "Average Salary: $120k" },
  "UI/UX Designer":       { demand: "High Demand",   salary: "Average Salary: $110k" },
  "Motion Designer":      { demand: "Medium Demand", salary: "Average Salary: $95k"  },
  "Brand Designer":       { demand: "Medium Demand", salary: "Average Salary: $90k"  },
  "Frontend Engineer":    { demand: "High Demand",   salary: "Average Salary: $130k" },
  "Backend Engineer":     { demand: "High Demand",   salary: "Average Salary: $135k" },
  "Full Stack Engineer":  { demand: "High Demand",   salary: "Average Salary: $140k" },
  "DevOps Engineer":      { demand: "High Demand",   salary: "Average Salary: $145k" },
  "Data Analyst":         { demand: "High Demand",   salary: "Average Salary: $105k" },
  "ML Engineer":          { demand: "Very High",     salary: "Average Salary: $160k" },
  "Data Engineer":        { demand: "High Demand",   salary: "Average Salary: $138k" },
  "AI Researcher":        { demand: "Very High",     salary: "Average Salary: $175k" },
  "Growth Marketer":      { demand: "Medium Demand", salary: "Average Salary: $85k"  },
  "SEO Specialist":       { demand: "Medium Demand", salary: "Average Salary: $75k"  },
  "Content Strategist":   { demand: "Medium Demand", salary: "Average Salary: $80k"  },
  "Performance Marketer": { demand: "High Demand",   salary: "Average Salary: $95k"  },
};

// ── Hero / Finder Section ──────────────────────────────────────────────────
function HeroSection({ domain, setDomain, role, setRole }) {
  const roles = roleMap[domain] || [];
  const info = roleInfo[role] || {};

  return (
    <section style={s.hero}>
      <div style={s.heroLeft}>
        <h1 style={s.heroTitle}>
          Find Your Path to a<br />
          <span style={s.heroTitleGreen}>Specific Role</span>
        </h1>
        <div style={s.selectRow}>
          <div style={s.selectGroup}>
            <label style={s.selectLabel}>DOMAIN</label>
            <div style={s.selectWrap}>
              <select
                style={s.select}
                value={domain}
                onChange={(e) => {
                  const d = e.target.value;
                  setDomain(d);
                  setRole(roleMap[d][0]);
                }}
              >
                {domainOptions.map((d) => <option key={d}>{d}</option>)}
              </select>
              <span style={s.chevron}>▾</span>
            </div>
          </div>
          <div style={s.selectGroup}>
            <label style={s.selectLabel}>ROLE</label>
            <div style={s.selectWrap}>
              <select
                style={s.select}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
              <span style={s.chevron}>▾</span>
            </div>
          </div>
        </div>
      </div>

      <div style={s.focusCard}>
        <div style={s.focusLabel}>CURRENT FOCUS</div>
        <div style={s.focusRole}>{role}</div>
        <p style={s.focusDesc}>
          Based on your current skill gap analysis, we have tailored this roadmap to
          accelerate your transition into a Senior {role} role.
        </p>
        <div style={s.focusBadges}>
          <span style={s.focusBadge}>{info.demand}</span>
          <span style={s.focusBadge}>{info.salary}</span>
        </div>
      </div>
    </section>
  );
}

// ── Market Demand Jobs ────────────────────────────────────────────────────
const jobsByRole = {
  "Product Designer": [
    { logo: null,      title: "Senior Product Designer",    company: "Google",  loc: "Mountain View, CA (Remote)" },
    { logo: "airbnb",  title: "Staff Experience Designer",  company: "Airbnb",  loc: "San Francisco, CA" },
    { logo: "stripe",  title: "Product Designer, Dashboard",company: "Stripe",  loc: "Remote" },
  ],
  "UI/UX Designer": [
    { logo: null,     title: "Senior UX Designer",          company: "Meta",    loc: "Menlo Park, CA" },
    { logo: null,     title: "Product UX Designer",         company: "Figma",   loc: "San Francisco, CA (Remote)" },
    { logo: null,     title: "UI Designer",                 company: "Notion",  loc: "Remote" },
  ],
};

function CompanyLogo({ name }) {
  const colors = { airbnb: "#FF5A5F", stripe: "#635BFF" };
  const labels = { airbnb: "Ai", stripe: "St" };
  if (!name) return <div style={s.logoPlaceholder} />;
  return (
    <div style={{ ...s.logoSquare, background: colors[name] || "#888" }}>
      <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{labels[name] || name[0]}</span>
    </div>
  );
}

function MarketDemandSection({ role }) {
  const jobs = jobsByRole[role] || jobsByRole["Product Designer"];
  return (
    <section style={s.marketSection}>
      <div style={s.marketTitle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8cc800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
        <strong style={{ marginLeft: 8 }}>Market Demand for {role}</strong>
      </div>
      <div style={s.jobList}>
        {jobs.map(({ logo, title, company, loc }) => (
          <div key={title} style={s.jobRow}>
            <div style={s.jobLeft}>
              <div style={s.jobAccent} />
              <CompanyLogo name={logo} />
              <div>
                <div style={s.jobTitle}>{title}</div>
                <div style={s.jobMeta}>{company} • {loc}</div>
              </div>
            </div>
            <button style={s.viewJobBtn}>View Job</button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Improvement Roadmap ────────────────────────────────────────────────────
function RoadmapSection() {
  const steps = [
    { level: "Level 1", sub: "Foundations & UI Basics",    status: "COMPLETED",   done: true  },
    { level: "Level 2", sub: "UX Research & Strategy",     status: "IN PROGRESS", active: true},
    { level: "Level 3", sub: "Design Systems",             status: null,          done: false },
    { level: "Job Ready",sub: "Portfolio & Mock Interviews",status: null,          done: false },
  ];

  const icons = [
    // clipboard check
    <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M5 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1"/><polyline points="9 12 11 14 15 10"/></svg>,
    // lightbulb
    <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M12 2a7 7 0 0 1 7 7c0 3.5-2 5.5-2.5 7h-9C7 14.5 5 12.5 5 9a7 7 0 0 1 7-7z"/></svg>,
    // archive
    <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
    // briefcase
    <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></svg>,
  ];

  return (
    <section style={s.roadmapSection}>
      <h2 style={s.roadmapTitle}>Your Improvement Roadmap</h2>
      <div style={s.stepsRow}>
        {steps.map(({ level, sub, status, done, active }, i) => (
          <div key={level} style={s.stepCol}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i < steps.length - 1 && (
                <div style={{ ...s.stepLine, background: done || active ? "#8cc800" : "#ccc" }} />
              )}
              <div style={{
                ...s.stepCircle,
                background: done || active ? "#8cc800" : "#e8e8e8",
                color: done || active ? "#1a1a1a" : "#aaa",
                border: done || active ? "none" : "2px solid #ccc",
              }}>
                {icons[i]}
              </div>
            </div>
            <div style={{ ...s.stepLevel, color: done || active ? "#1a1a1a" : "#aaa" }}>{level}</div>
            <div style={{ ...s.stepSub, color: done || active ? "#555" : "#bbb" }}>{sub}</div>
            {status && (
              <span style={{
                ...s.statusBadge,
                background: status === "COMPLETED" ? "#1a1a1a" : "#8cc800",
                color: status === "COMPLETED" ? "#fff" : "#1a1a1a",
              }}>
                {status}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Recommended Courses ────────────────────────────────────────────────────
function RecommendedCourses() {
  const courses = [
    { platform: "COURSERA",           hours: "12 Hours", title: "Advanced UI Design: Mastering Visual Grids" },
    { platform: "UDEMY",              hours: "24 Hours", title: "UX Research Mastery: User Testing & Insights" },
    { platform: "INTERACTION DESIGN", hours: "8 Hours",  title: "Psychology in Web Design: The Human Element" },
  ];
  return (
    <section style={s.coursesSection}>
      <div style={s.coursesHeader}>
        <div>
          <h2 style={s.coursesTitle}>Recommended Courses</h2>
          <p style={s.coursesSubtitle}>Specially curated high-impact courses for your next level.</p>
        </div>
        <a href="#" style={s.exploreAll}>Explore all 48 courses →</a>
      </div>
      <div style={s.coursesGrid}>
        {courses.map(({ platform, hours, title }) => (
          <div key={title} style={s.courseCard}>
            <div style={s.courseTop}>
              <span style={s.platformBadge}>{platform}</span>
              <span style={s.hoursText}>{hours}</span>
            </div>
            <div style={s.courseTitle}>{title}</div>
            <a href="#" style={s.openLink}>Open Course →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.footerInner}>
        <div style={s.footerBrand}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <img src="/logo.png" alt="" height="45" />
           
          </div>
          <p style={s.footerDesc}>
            Elevating students' careers through data-driven<br />
            role selection and personalized improvement<br />
            roadmaps.
          </p>
          <div style={s.socials}>
            <button style={s.socialBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </button>
            <button style={s.socialBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </button>
          </div>
        </div>
        {[
          { title: "PLATFORM",  links: ["All Courses", "Role Explorer", "Certifications"] },
          { title: "COMMUNITY", links: ["Find Mentors", "Student Showcase", "Forums"] },
          { title: "SUPPORT",   links: ["Help Center", "Contact Us", "Privacy Policy"] },
        ].map(({ title, links }) => (
          <div key={title} style={s.footerCol}>
            <div style={s.footerColTitle}>{title}</div>
            {links.map((l) => <a key={l} href="#" style={s.footerLink}>{l}</a>)}
          </div>
        ))}
      </div>
      <div style={s.footerCopy}>© 2024 UpBring Education Tech. All rights reserved.</div>
    </footer>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function UpBringRoadmaps() {
  const [domain, setDomain] = useState("Design & Creative");
  const [role, setRole] = useState("Product Designer");

  return (
    <div style={s.app}>
      <Navbar />
      <HeroSection domain={domain} setDomain={setDomain} role={role} setRole={setRole} />
      <MarketDemandSection role={role} />
      <RoadmapSection />
      <RecommendedCourses />
      <Footer />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const s = {
  app: { fontFamily: "'Arial', sans-serif", color: "#1a1a1a", background: "#fff", minHeight: "100vh" },

  // Navbar
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: 56, background: "#fff",
    borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 100,
  },
  navLeft: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontSize: 17, letterSpacing: "-0.3px" },
  navCenter: { display: "flex", gap: 36 },
  navLink: { textDecoration: "none", fontSize: 14, cursor: "pointer", paddingBottom: 4 },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  profileBtn: {
    padding: "8px 20px", background: "#8cc800", border: "none",
    borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer",
  },
  avatarOrange: { width: 34, height: 34, borderRadius: "50%", background: "#e8a040" },

  // Hero
  hero: {
    background: "#f0ecca", padding: "56px 80px",
    display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40,
  },
  heroLeft: { flex: 1 },
  heroTitle: {
    fontSize: 38, fontWeight: 700, fontFamily: "Georgia, serif",
    lineHeight: 1.25, margin: "0 0 28px",
  },
  heroTitleGreen: { color: "#7ab800" },
  selectRow: { display: "flex", gap: 16, flexWrap: "wrap" },
  selectGroup: { display: "flex", flexDirection: "column", gap: 6 },
  selectLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#888" },
  selectWrap: { position: "relative", display: "inline-flex", alignItems: "center" },
  select: {
    appearance: "none", WebkitAppearance: "none",
    padding: "12px 44px 12px 16px",
    background: "#fff", border: "1px solid #ddd", borderRadius: 10,
    fontSize: 14, color: "#1a1a1a", cursor: "pointer",
    minWidth: 200, outline: "none",
  },
  chevron: {
    position: "absolute", right: 14, fontSize: 14,
    color: "#888", pointerEvents: "none",
  },

  // Focus card
  focusCard: {
    background: "#fff", borderRadius: 16, padding: "28px 32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)", minWidth: 360, maxWidth: 420, flex: "0 0 420px",
  },
  focusLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#888", marginBottom: 8 },
  focusRole: { fontSize: 36, fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: 14, lineHeight: 1.2 },
  focusDesc: { fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 18 },
  focusBadges: { display: "flex", gap: 8, flexWrap: "wrap" },
  focusBadge: {
    padding: "5px 14px", border: "1px solid #ccc",
    borderRadius: 999, fontSize: 12, fontWeight: 500, color: "#333",
  },

  // Market Demand
  marketSection: { background: "#e8e8e3", padding: "48px 80px" },
  marketTitle: { display: "flex", alignItems: "center", fontSize: 18, fontWeight: 700, marginBottom: 24 },
  jobList: { display: "flex", flexDirection: "column", gap: 14 },
  jobRow: {
    background: "#fff", borderRadius: 14, padding: "18px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "relative", overflow: "hidden",
  },
  jobLeft: { display: "flex", alignItems: "center", gap: 16 },
  jobAccent: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    width: 5, background: "#8cc800", borderRadius: "14px 0 0 14px",
  },
  logoPlaceholder: {
    width: 36, height: 36, borderRadius: 8, background: "#f0f0f0",
  },
  logoSquare: {
    width: 36, height: 36, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  jobTitle: { fontSize: 14, fontWeight: 700, marginBottom: 3 },
  jobMeta: { fontSize: 12, color: "#888" },
  viewJobBtn: {
    padding: "9px 20px", background: "#fff", border: "1.5px solid #ddd",
    borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
  },

  // Roadmap
  roadmapSection: { background: "#f0ecca", padding: "56px 80px", textAlign: "center" },
  roadmapTitle: {
    fontSize: 24, fontWeight: 700, fontFamily: "Georgia, serif",
    marginBottom: 40, textAlign: "center",
  },
  stepsRow: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: 0, alignItems: "start",
  },
  stepCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" },
  stepLine: {
    position: "absolute", top: 24, left: "50%", width: "100%",
    height: 2, zIndex: 0,
    backgroundImage: "linear-gradient(to right, #ccc 50%, transparent 50%)",
    backgroundSize: "10px 2px",
  },
  stepCircle: {
    width: 52, height: 52, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", zIndex: 1,
  },
  stepLevel: { fontSize: 14, fontWeight: 700, marginTop: 4 },
  stepSub: { fontSize: 12, textAlign: "center", lineHeight: 1.4 },
  statusBadge: {
    marginTop: 4, padding: "4px 10px", borderRadius: 6,
    fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
  },

  // Courses
  coursesSection: { background: "#fff", padding: "48px 80px" },
  coursesHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-end", marginBottom: 28,
  },
  coursesTitle: { fontSize: 24, fontWeight: 700, fontFamily: "Georgia, serif", margin: "0 0 6px" },
  coursesSubtitle: { fontSize: 13, color: "#888" },
  exploreAll: { fontSize: 13, color: "#7ab800", textDecoration: "none", fontWeight: 600 },
  coursesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  courseCard: {
    background: "#f5f0dc", borderRadius: 16, padding: "24px",
    display: "flex", flexDirection: "column", gap: 14,
  },
  courseTop: { display: "flex", alignItems: "center", gap: 12 },
  platformBadge: {
    background: "#8cc800", borderRadius: 999, padding: "4px 12px",
    fontSize: 10, fontWeight: 700, letterSpacing: "0.3px",
  },
  hoursText: { fontSize: 12, color: "#888" },
  courseTitle: { fontSize: 15, fontWeight: 700, lineHeight: 1.4 },
  openLink: { fontSize: 13, color: "#7ab800", textDecoration: "none", fontWeight: 600 },

  // Footer
  footer: { background: "#f0ecca", padding: "48px 40px 24px" },
  footerInner: {
    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: 48, marginBottom: 32,
  },
  footerBrand: {},
  footerDesc: { fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 16 },
  socials: { display: "flex", gap: 10 },
  socialBtn: {
    width: 34, height: 34, borderRadius: "50%",
    border: "1px solid #ccc", background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  footerCol: { display: "flex", flexDirection: "column", gap: 10 },
  footerColTitle: {
    fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
    color: "#1a1a1a", marginBottom: 4,
  },
  footerLink: { fontSize: 13, color: "#555", textDecoration: "none", cursor: "pointer" },
  footerCopy: {
    borderTop: "1px solid #e0d8c0", paddingTop: 20,
    fontSize: 12, color: "#888",
  },
};