import { useState } from "react";



// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [active, setActive] = useState("Jobs");
  return (
    <nav style={s.navbar}>
      <div style={s.navLeft}>
        <img src="/logo.png" alt="" height="45" />
        
      </div>
      <div style={s.navCenter}>
        {["Dashboard", "Jobs", "Messages", "Profile"].map((item) => (
          <a
            key={item}
            href="#"
            onClick={(e) => { e.preventDefault(); setActive(item); }}
            style={{
              ...s.navLink,
              color: active === item ? "#7ab800" : "#1a1a1a",
              fontWeight: active === item ? 700 : 400,
            }}
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ── Job data ───────────────────────────────────────────────────────────────
const ALL_JOBS = [
  {
    id: 1,
    title: "Frontend Engineer",
    company: "Google",
    location: "Mountain View, CA",
    match: 98,
    type: "jobs",
    logoColor: "#e8e8e8",
    logoContent: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#f0f0f0"/>
        <text x="4" y="17" style={{ fontSize: 11, fontWeight: 700, fill: "#888" }}>G</text>
      </svg>
    ),
    requiredSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    matchPct: 98,
    improveTips: [
      "Complete the 'Advanced TypeScript' module to reach 100% match.",
      "Build a project using GraphQL to demonstrate data-fetching expertise.",
      "Take the 'Technical Interviews for Big Tech' roadmap.",
    ],
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Meta",
    location: "Menlo Park, CA",
    match: 92,
    type: "jobs",
    logoColor: "#4a9af0",
    logoContent: null,
    requiredSkills: ["Figma", "Prototyping", "User Research", "Design Systems"],
    matchPct: 92,
    improveTips: [
      "Strengthen your Design Systems knowledge.",
      "Add a case study showcasing end-to-end product work.",
    ],
  },
  {
    id: 3,
    title: "UX Researcher",
    company: "Airbnb",
    location: "San Francisco, CA",
    match: 89,
    type: "jobs",
    logoColor: "#FF5A5F",
    logoContent: null,
    requiredSkills: ["User Testing", "Surveys", "Data Analysis", "Figma"],
    matchPct: 89,
    improveTips: [
      "Complete the UX Research Methods course.",
      "Practice synthesizing qualitative data.",
    ],
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Spotify",
    location: "New York, NY",
    match: 85,
    type: "jobs",
    logoColor: "#1db954",
    logoContent: null,
    requiredSkills: ["SQL", "Python", "Tableau", "Statistics"],
    matchPct: 85,
    improveTips: [
      "Improve your Tableau skills.",
      "Take the Advanced SQL course.",
    ],
  },
  {
    id: 5,
    title: "Fullstack Developer",
    company: "Stripe",
    location: "Remote",
    match: 82,
    type: "jobs",
    logoColor: "#635BFF",
    logoContent: null,
    requiredSkills: ["Node.js", "React", "PostgreSQL", "REST APIs"],
    matchPct: 82,
    improveTips: [
      "Strengthen your backend Node.js skills.",
      "Build a full-stack project and add it to your profile.",
    ],
  },
  {
    id: 6,
    title: "UX Engineer",
    company: "Slack",
    location: "Denver, CO",
    match: 79,
    type: "jobs",
    logoColor: "#4a154b",
    logoContent: null,
    requiredSkills: ["React", "CSS", "Accessibility", "Design Tokens"],
    matchPct: 79,
    improveTips: [
      "Learn about accessibility best practices.",
      "Build a component library to showcase.",
    ],
  },
  {
    id: 7,
    title: "iOS Developer",
    company: "Apple",
    location: "Cupertino, CA",
    match: 76,
    type: "internships",
    logoColor: "#555",
    logoContent: null,
    requiredSkills: ["Swift", "SwiftUI", "Xcode", "Core Data"],
    matchPct: 76,
    improveTips: ["Complete the Swift Fundamentals course."],
  },
  {
    id: 8,
    title: "Data Science Intern",
    company: "Netflix",
    location: "Los Gatos, CA",
    match: 74,
    type: "internships",
    logoColor: "#E50914",
    logoContent: null,
    requiredSkills: ["Python", "ML", "Pandas", "Jupyter"],
    matchPct: 74,
    improveTips: ["Build a recommendation system project."],
  },
];

// ── Match Badge ───────────────────────────────────────────────────────────
function MatchBadge({ pct }) {
  return (
    <span style={s.matchBadge}>{pct}% Match</span>
  );
}

// ── Company Logo ──────────────────────────────────────────────────────────
function CompanyLogo({ job }) {
  const initials = job.company.slice(0, 2).toUpperCase();
  return (
    <div style={{ ...s.companyLogo, background: job.logoColor }}>
      <span style={{ color: job.logoColor === "#e8e8e8" ? "#888" : "#fff", fontSize: 12, fontWeight: 700 }}>
        {initials}
      </span>
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────
function JobCard({ job, selected, onSelect }) {
  return (
    <div style={{ ...s.jobCard, boxShadow: selected ? "0 0 0 2px #8cc800" : "0 1px 8px rgba(0,0,0,0.07)" }}>
      <div style={s.jobCardTop}>
        <CompanyLogo job={job} />
        <MatchBadge pct={job.match} />
      </div>
      <div style={s.jobTitle}>{job.title}</div>
      <div style={s.jobCompany}>{job.company}</div>
      <div style={s.jobLocation}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        &nbsp;{job.location}
      </div>
      <button
        style={{ ...s.viewDetailsBtn, background: selected ? "#8cc800" : "transparent" }}
        onClick={() => onSelect(job)}
      >
        View Details
      </button>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────
function DetailPanel({ job, onClose }) {
  if (!job) return null;

  const barWidth = `${job.matchPct}%`;

  return (
    <div style={s.detailPanel}>
      {/* Header */}
      <div style={s.detailHeader}>
        <span style={s.detailHeaderLabel}>JOB DETAIL VIEW</span>
        <button style={s.closeBtn} onClick={onClose}>✕</button>
      </div>

      {/* Company + Title */}
      <div style={s.detailCompanyRow}>
        <div style={{ ...s.detailLogo, background: job.logoColor }}>
          <span style={{ color: job.logoColor === "#e8e8e8" ? "#888" : "#fff", fontSize: 12, fontWeight: 700 }}>
            {job.company.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <div style={s.detailCompanyName}>{job.company} Inc.</div>
          <div style={s.detailJobTitle}>{job.title}</div>
        </div>
      </div>

      {/* Required Skills */}
      <div style={s.detailSection}>
        <div style={s.detailSectionTitle}>REQUIRED SKILLS</div>
        <div style={s.skillTags}>
          {job.requiredSkills.map((skill) => (
            <span key={skill} style={s.skillTag}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Match Score */}
      <div style={s.detailSection}>
        <div style={s.matchRow}>
          <span style={s.matchLabel}>Your Match</span>
          <span style={s.matchPctText}>{job.matchPct}%</span>
        </div>
        <div style={s.matchBarBg}>
          <div style={{ ...s.matchBarFill, width: barWidth }} />
        </div>
        <p style={s.matchNote}>
          You are in the top 5% of applicants based on your skill assessment scores.
        </p>
      </div>

      {/* What to Improve */}
      <div style={s.detailSection}>
        <div style={s.improveHeader}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8cc800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={s.improveSectionTitle}>WHAT TO IMPROVE</span>
        </div>
        <ul style={s.improveList}>
          {job.improveTips.map((tip, i) => (
            <li key={i} style={s.improveTip}>
              <span style={s.improveBullet}>*</span> {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button style={s.startRoadmapBtn}>Start Skill Roadmap</button>
    </div>
  );
}

// ── Skills Bar ────────────────────────────────────────────────────────────
const ALL_SKILLS = ["React", "Python", "UI Design", "SQL", "Communication"];

function SkillsBar({ skills, onEdit }) {
  return (
    <div style={s.skillsBar}>
      <span style={s.skillsBarLabel}>YOUR ACTIVE SKILLS:</span>
      <div style={s.activeTags}>
        {skills.map((sk) => (
          <span key={sk} style={s.activeTag}>{sk}</span>
        ))}
      </div>
      <button style={s.editBtn} onClick={onEdit}>
        ✏ EDIT
      </button>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function UpBringJobs() {
  const [tab, setTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState(ALL_JOBS[0]);
  const [skills] = useState(ALL_SKILLS);
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = ALL_JOBS.filter((j) => j.type === tab);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const panelOpen = !!selectedJob;

  return (
    <div style={s.app}>
      <Navbar />

      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, transition: "all 0.3s" }}>
          {/* Hero */}
          <div style={s.hero}>
            <div style={s.heroInner}>
              <h1 style={s.heroTitle}>Jobs Matched to Your Skills</h1>
              <div style={s.tabToggle}>
                <button
                  style={{ ...s.tabBtn, background: tab === "jobs" ? "#8cc800" : "transparent", fontWeight: tab === "jobs" ? 700 : 400 }}
                  onClick={() => { setTab("jobs"); setVisibleCount(6); }}
                >
                  Jobs
                </button>
                <button
                  style={{ ...s.tabBtn, background: tab === "internships" ? "#8cc800" : "transparent", fontWeight: tab === "internships" ? 700 : 400 }}
                  onClick={() => { setTab("internships"); setVisibleCount(6); }}
                >
                  Internships
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={s.body}>
            <SkillsBar skills={skills} onEdit={() => {}} />

            {/* Job grid */}
            <div style={s.jobGrid}>
              {visible.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={selectedJob?.id === job.id}
                  onSelect={setSelectedJob}
                />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 24, marginBottom: 40 }}>
                <button style={s.loadMoreBtn} onClick={() => setVisibleCount((c) => c + 3)}>
                  Load More Recommendations
                </button>
              </div>
            )}

            {!hasMore && (
              <div style={{ textAlign: "center", marginTop: 24, marginBottom: 40 }}>
                <button style={{ ...s.loadMoreBtn, opacity: 0.5, cursor: "default" }}>
                  Load More Recommendations
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer style={s.footer}>
            <div style={s.footerInner}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src="/logo.png" alt="" height="45" />
                
              </div>
              <div style={s.footerLinks}>
                {["Help Center", "Privacy Policy", "Terms of Service"].map((t) => (
                  <a key={t} href="#" style={s.footerLink}>{t}</a>
                ))}
              </div>
              <span style={s.footerCopy}>© 2024 UpBring Education. All rights reserved.</span>
            </div>
          </footer>
        </div>

        {/* Detail Panel */}
        {panelOpen && (
          <DetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const s = {
  app: { fontFamily: "'Arial', sans-serif", color: "#1a1a1a", background: "#f5f5f0", minHeight: "100vh" },

  // Navbar
  navbar: {
    display: "flex", alignItems: "center", gap: 32,
    padding: "0 32px", height: 52,
    background: "#fff", borderBottom: "1px solid #eee",
    position: "sticky", top: 0, zIndex: 200,
  },
  navLeft: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontSize: 16, letterSpacing: "-0.3px" },
  navCenter: { display: "flex", gap: 28 },
  navLink: { textDecoration: "none", fontSize: 14, cursor: "pointer" },

  // Hero
  hero: { background: "#f0ecca", padding: "44px 40px 32px" },
  heroInner: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", maxWidth: 1100,
  },
  heroTitle: {
    fontSize: 32, fontWeight: 700,
    fontFamily: "Georgia, serif", margin: 0,
  },
  tabToggle: {
    display: "flex", border: "1.5px solid #ccc",
    borderRadius: 999, overflow: "hidden", background: "#fff",
  },
  tabBtn: {
    padding: "9px 24px", border: "none",
    fontSize: 13, cursor: "pointer",
    borderRadius: 999, transition: "background 0.2s",
  },

  // Body
  body: { padding: "24px 40px", maxWidth: 1100 },

  // Skills bar
  skillsBar: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#ebebeb", borderRadius: 10,
    padding: "10px 18px", marginBottom: 24, flexWrap: "wrap",
  },
  skillsBarLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#888", marginRight: 4 },
  activeTags: { display: "flex", gap: 8, flexWrap: "wrap", flex: 1 },
  activeTag: {
    padding: "5px 14px", background: "#8cc800",
    borderRadius: 999, fontSize: 12, fontWeight: 600,
  },
  editBtn: {
    background: "none", border: "none",
    fontSize: 12, color: "#555", cursor: "pointer", fontWeight: 600,
  },

  // Job grid
  jobGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 8,
  },
  jobCard: {
    background: "#fff", borderRadius: 14, padding: "20px",
    display: "flex", flexDirection: "column", gap: 6,
    cursor: "pointer", transition: "box-shadow 0.2s",
  },
  jobCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  companyLogo: {
    width: 38, height: 38, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  matchBadge: {
    background: "#8cc800", borderRadius: 999,
    padding: "4px 10px", fontSize: 11, fontWeight: 700,
  },
  jobTitle: { fontSize: 16, fontWeight: 700, marginTop: 4 },
  jobCompany: { fontSize: 13, color: "#555" },
  jobLocation: { fontSize: 12, color: "#aaa", display: "flex", alignItems: "center", marginBottom: 10 },
  viewDetailsBtn: {
    border: "1.5px solid #ddd", borderRadius: 8, padding: "9px",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    marginTop: "auto", transition: "background 0.2s",
  },

  // Load More
  loadMoreBtn: {
    padding: "12px 28px", background: "#fff",
    border: "1.5px solid #ccc", borderRadius: 999,
    fontSize: 13, fontWeight: 600, cursor: "pointer",
  },

  // Detail Panel
  detailPanel: {
    width: 320, flexShrink: 0,
    background: "#fff",
    borderLeft: "1px solid #eee",
    padding: "24px 24px 32px",
    position: "sticky", top: 52,
    height: "calc(100vh - 52px)",
    overflowY: "auto",
    display: "flex", flexDirection: "column", gap: 20,
  },
  detailHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  detailHeaderLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#888",
  },
  closeBtn: {
    background: "none", border: "none", fontSize: 16,
    cursor: "pointer", color: "#888", lineHeight: 1,
  },
  detailCompanyRow: { display: "flex", gap: 14, alignItems: "center" },
  detailLogo: {
    width: 44, height: 44, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  detailCompanyName: { fontSize: 12, color: "#7ab800", fontWeight: 600, marginBottom: 4 },
  detailJobTitle: { fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif", lineHeight: 1.2 },

  detailSection: { borderTop: "1px solid #f0f0f0", paddingTop: 16 },
  detailSectionTitle: {
    fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
    color: "#888", marginBottom: 10,
  },
  skillTags: { display: "flex", flexWrap: "wrap", gap: 8 },
  skillTag: {
    padding: "5px 12px", border: "1.5px solid #ddd",
    borderRadius: 8, fontSize: 12, fontWeight: 500,
  },

  matchRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  matchLabel: { fontSize: 13, fontWeight: 600 },
  matchPctText: { fontSize: 22, fontWeight: 800, color: "#8cc800" },
  matchBarBg: { height: 8, background: "#e8e8e8", borderRadius: 999, overflow: "hidden", marginBottom: 10 },
  matchBarFill: { height: "100%", background: "#8cc800", borderRadius: 999 },
  matchNote: { fontSize: 12, color: "#888", lineHeight: 1.6, margin: 0 },

  improveHeader: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 },
  improveSectionTitle: { fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#444" },
  improveList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  improveTip: { fontSize: 12, color: "#444", lineHeight: 1.6, display: "flex", gap: 6 },
  improveBullet: { color: "#8cc800", fontWeight: 700, flexShrink: 0 },

  startRoadmapBtn: {
    width: "100%", padding: "16px",
    background: "#8cc800", border: "none",
    borderRadius: 12, fontSize: 15, fontWeight: 800,
    cursor: "pointer", marginTop: "auto",
  },

  // Footer
  footer: {
    background: "#f0ecca",
    borderTop: "1px solid #e0d8c0",
    padding: "20px 40px",
  },
  footerInner: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", flexWrap: "wrap", gap: 12,
  },
  footerLinks: { display: "flex", gap: 24 },
  footerLink: { fontSize: 13, color: "#555", textDecoration: "none" },
  footerCopy: { fontSize: 12, color: "#888" },
};