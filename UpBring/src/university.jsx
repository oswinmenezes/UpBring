import { useState, useEffect, useRef } from "react";

// ── Logo Icon ──────────────────────────────────────────────────────────────
function LogoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="14" height="20" rx="2" x="2" y="10" fill="#1a1a1a" />
      <rect width="14" height="20" rx="2" x="10" y="4" fill="#8cc800" />
    </svg>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ activePage, setActivePage }) {
  const navItems = ["Dashboard", "Curriculum", "Cohorts", "Settings"];
  return (
    <nav style={s.navbar}>
      <div style={s.navLeft}>
        <img src="/logo.png" alt="" height="45" />
        
      </div>
      <div style={s.navCenter}>
        {navItems.map((item) => (
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
        <button style={s.adminBadge}>UNIVERSITY ADMIN</button>
        <div style={s.adminAvatar}>RA</div>
      </div>
    </nav>
  );
}

// ── Upload Card ────────────────────────────────────────────────────────────
function UploadCard() {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); };

  return (
    <div
      style={{ ...s.uploadCard, borderColor: dragging ? "#8cc800" : "#ccc" }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 14 }}>
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      </svg>
      <div style={s.uploadTitle}>Upload Cohort Data</div>
      <div style={s.uploadDesc}>
        Drag and drop student transcripts or CSV files here to start the gap analysis.
      </div>
      <button style={s.analyseBtn}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        Analyse Cohort
      </button>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const raw = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    const suffix = String(value).replace(/[0-9.,]/g, "");
    let start = null;
    const duration = 1000;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(eased * raw));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  const raw = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const suffix = String(value).replace(/[0-9,]/g, "");
  const formatted = raw >= 1000
    ? displayed.toLocaleString()
    : String(displayed) + suffix;

  return (
    <div style={s.statCard}>
      <div style={s.statLabel}>{label}</div>
      <div style={s.statValue}>{formatted}</div>
    </div>
  );
}

// ── Upload & Stats Section ─────────────────────────────────────────────────
function UploadSection() {
  return (
    <section style={s.uploadSection}>
      <h2 style={s.pageTitle}>Upload &amp; Cohort Overview</h2>
      <p style={s.pageSubtitle}>Analyze student transcripts and identify industry readiness at scale.</p>
      <div style={s.uploadGrid}>
        <UploadCard />
        <StatCard label="Students Analysed" value="1,240" />
        <StatCard label="Avg Skill Score" value="78" />
        <StatCard label="Industry Alignment" value="64%" />
      </div>
    </section>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────
function BarChart() {
  const data = [
    { label: "Data Science",  student: 52, industry: 72 },
    { label: "Frontend Dev",  student: 75, industry: 80 },
    { label: "Cybersecurity", student: 40, industry: 82 },
    { label: "Cloud Ops",     student: 58, industry: 52 },
    { label: "AI / ML",       student: 35, industry: 95 },
    { label: "Mobile Dev",    student: 60, industry: 72 },
  ];

  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  const maxVal = 100;
  const chartH = 260;

  return (
    <div style={s.chartCard}>
      <div style={s.chartInner}>
        {data.map(({ label, student, industry }) => (
          <div key={label} style={s.barGroup}>
            <div style={s.bars}>
              <div style={s.barWrap}>
                <div
                  style={{
                    ...s.barStudent,
                    height: animated ? `${(student / maxVal) * chartH}px` : "0px",
                  }}
                />
              </div>
              <div style={s.barWrap}>
                <div
                  style={{
                    ...s.barIndustry,
                    height: animated ? `${(industry / maxVal) * chartH}px` : "0px",
                  }}
                />
              </div>
            </div>
            <div style={s.barLabel}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gap Analysis Section ───────────────────────────────────────────────────
function GapAnalysisSection() {
  return (
    <section style={s.gapSection}>
      <div style={s.gapHeader}>
        <div>
          <h2 style={s.pageTitle}>Industry Gap Analysis</h2>
          <p style={s.pageSubtitle}>Comparison between current curriculum outcomes and job market requirements.</p>
        </div>
        <div style={s.legend}>
          <span style={s.legendDot("#8cc800")} />
          <span style={s.legendText}>Student Skills</span>
          <span style={s.legendDot("#3d3a2e")} />
          <span style={s.legendText}>Industry Demand</span>
        </div>
      </div>
      <BarChart />
    </section>
  );
}

// ── Recommended Curriculum ─────────────────────────────────────────────────
function CurriculumSection() {
  const semesters = [
    {
      label: "Semester 1",
      badge: "CORE",
      courses: [
        { title: "Applied Statistics", tags: ["Data Analysis", "Modeling"] },
        { title: "Modern Web Arch", tags: ["React", "API Design"] },
      ],
    },
    {
      label: "Semester 2",
      badge: "NEW",
      courses: [
        { title: "Cloud Native Dev", tags: ["Docker", "K8s"] },
        { title: "AI Implementation", tags: ["PyTorch", "NLP"] },
      ],
    },
    {
      label: "Semester 3",
      badge: "CAPSTONE",
      courses: [
        { title: "Industry Practicum", tags: ["Project Mgmt", "Delivery"] },
      ],
    },
  ];

  return (
    <section style={s.curriculumSection}>
      <div style={s.curriculumHeader}>
        <div>
          <h2 style={s.pageTitle}>Recommended Curriculum</h2>
          <p style={s.pageSubtitle}>AI-optimized sequence to bridge the 36% industry gap.</p>
        </div>
        <button style={s.adoptBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          Adopt This Curriculum
        </button>
      </div>
      <div style={s.semesterGrid}>
        {semesters.map(({ label, badge, courses }) => (
          <div key={label} style={s.semesterCard}>
            <div style={s.semesterCardHeader}>
              <span style={s.semesterLabel}>{label}</span>
              <span style={s.semesterBadge}>{badge}</span>
            </div>
            <div style={s.courseList}>
              {courses.map(({ title, tags }) => (
                <div key={title} style={s.courseCard}>
                  <div style={s.courseTitle}>{title}</div>
                  <div style={s.courseTags}>
                    {tags.map((tag) => (
                      <span key={tag} style={s.courseTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Top Courses ────────────────────────────────────────────────────────────
function TopCoursesSection() {
  const courses = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8cc800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      ),
      category: "AI & DATA",
      title: "Generative AI Engineering",
      desc: "Bridge the gap in LLM orchestration and vector database management.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8cc800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      category: "CYBERSECURITY",
      title: "SecOps & Compliance",
      desc: "Integrated security practices for modern DevOps workflows and SOC standards.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8cc800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      category: "SYSTEMS",
      title: "Rust for Cloud Services",
      desc: "High-performance systems programming for scalable microservices architectures.",
    },
  ];

  return (
    <section style={s.topCoursesSection}>
      <h2 style={{ ...s.pageTitle, textAlign: "center", marginBottom: 8 }}>Top Courses to Introduce</h2>
      <div style={s.topCoursesGrid}>
        {courses.map(({ icon, category, title, desc }) => (
          <div key={title} style={s.topCourseCard}>
            <div style={s.topCourseTop}>
              <div style={s.topCourseIcon}>{icon}</div>
              <span style={s.topCourseCategory}>{category}</span>
            </div>
            <div style={s.topCourseTitle}>{title}</div>
            <div style={s.topCourseDesc}>{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function UpBringUniversity() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div style={s.app}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <UploadSection />
      <GapAnalysisSection />
      <CurriculumSection />
      <TopCoursesSection />
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
    color: "#1a1a1a",
    fontSize: 14,
    cursor: "pointer",
  },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  adminBadge: {
    padding: "7px 16px",
    border: "1.5px solid #ccc",
    borderRadius: 999,
    background: "transparent",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.5px",
    cursor: "pointer",
    color: "#1a1a1a",
  },
  adminAvatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#5a9a6a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
  },

  // Upload section
  uploadSection: {
    background: "#f0ecca",
    padding: "48px 40px",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Georgia, serif",
    margin: "0 0 6px",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 28,
  },
  uploadGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
    gap: 16,
    alignItems: "stretch",
  },
  uploadCard: {
    background: "#fff",
    borderRadius: 14,
    border: "2px dashed #ccc",
    padding: "40px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "border-color 0.2s",
  },
  uploadTitle: { fontSize: 16, fontWeight: 700, marginBottom: 10 },
  uploadDesc: { fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 24 },
  analyseBtn: {
    display: "flex",
    alignItems: "center",
    padding: "12px 24px",
    background: "#8cc800",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    color: "#1a1a1a",
  },
  statCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "28px 24px",
    borderTop: "3px solid #8cc800",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  statLabel: { fontSize: 13, color: "#888", marginBottom: 32 },
  statValue: { fontSize: 40, fontWeight: 700, fontFamily: "Georgia, serif" },

  // Gap Analysis
  gapSection: {
    background: "#e8e8e3",
    padding: "48px 40px",
  },
  gapHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  legend: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 },
  legendDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: color,
    display: "inline-block",
  }),
  legendText: { color: "#555", marginRight: 8 },

  // Chart
  chartCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "32px 40px 24px",
  },
  chartInner: {
    display: "flex",
    gap: 32,
    alignItems: "flex-end",
    justifyContent: "center",
    height: 300,
  },
  barGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  bars: {
    display: "flex",
    alignItems: "flex-end",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  barWrap: {
    display: "flex",
    alignItems: "flex-end",
    height: 260,
  },
  barStudent: {
    width: 40,
    background: "#8cc800",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.9s cubic-bezier(0.4,0,0.2,1)",
  },
  barIndustry: {
    width: 40,
    background: "#3d3a2e",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.9s cubic-bezier(0.4,0,0.2,1)",
  },
  barLabel: { fontSize: 11, color: "#888", textAlign: "center", marginTop: 4 },

  // Curriculum
  curriculumSection: {
    background: "#fff",
    padding: "48px 40px",
  },
  curriculumHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  adoptBtn: {
    display: "flex",
    alignItems: "center",
    padding: "12px 24px",
    background: "#8cc800",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    color: "#1a1a1a",
    whiteSpace: "nowrap",
  },
  semesterGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 20,
  },
  semesterCard: {
    background: "#f5f0e0",
    borderRadius: 14,
    padding: "20px",
  },
  semesterCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  semesterLabel: { fontSize: 15, fontWeight: 700 },
  semesterBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.5px",
    border: "1.5px solid #1a1a1a",
    borderRadius: 6,
    padding: "3px 8px",
  },
  courseList: { display: "flex", flexDirection: "column", gap: 10 },
  courseCard: {
    background: "#fff",
    borderRadius: 10,
    padding: "14px 16px",
  },
  courseTitle: { fontSize: 14, fontWeight: 600, marginBottom: 8 },
  courseTags: { display: "flex", gap: 6, flexWrap: "wrap" },
  courseTag: {
    fontSize: 11,
    color: "#5a7a00",
    background: "#e8f5a0",
    borderRadius: 999,
    padding: "3px 10px",
    fontWeight: 500,
  },

  // Top Courses
  topCoursesSection: {
    background: "#f0ecca",
    padding: "60px 40px",
  },
  topCoursesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 20,
    marginTop: 32,
  },
  topCourseCard: {
    background: "#fff",
    borderRadius: 14,
    padding: "28px 24px",
  },
  topCourseTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topCourseIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#f0f7d4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  topCourseCategory: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: "#888",
  },
  topCourseTitle: { fontSize: 16, fontWeight: 700, marginBottom: 10 },
  topCourseDesc: { fontSize: 13, color: "#666", lineHeight: 1.6 },
};