import "./NavBar.css";
import {Link } from "react-router-dom";

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
export default function NavBar(){
    return<nav className="navbar">
        <div className="nav-logo">
          <div style={{ width: 28, height: 28, background: '#b5d336', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#1a1a1a" />
          </div>
          <span className="nav-logo-text">Upbring</span>
        </div>
        <div className="nav-links">
          <Link to="/"><button onClick={() => scrollTo('home')} className="nav-link">Home</button></Link>
          <Link to="/getjob"><button onClick={() => scrollTo('jobs')} className="nav-link">Get Job</button></Link>
          <Link to="/learn"><button onClick={() => scrollTo('learn')} className="nav-link">Learn Skill</button></Link>
          <Link to="/mock"><button onClick={() => scrollTo('mock')} className="nav-link">Mock Interview</button></Link>
          <Link to="/dashboard"><button onClick={() => scrollTo('dashboard')} className="nav-link">Dashboard</button></Link>
        </div>
        <div className="nav-actions">
         {true && <><button className="btn-base btn-outline-nav">Log In</button>
          <button className="btn-base btn-green-nav">Sign Up</button></>} 
        </div>
      </nav>
}