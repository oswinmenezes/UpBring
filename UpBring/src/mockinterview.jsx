import { useState, useEffect, useRef, useCallback } from "react";

// ── Growmark palette ──────────────────────────────────────────────
const C = {
  bg:       "#E9E8E6",
  bgCream:  "#F7EFD3",
  dark:     "#121414",
  lime:     "#D3F285",
  limeSoft: "#D7ED9F",
  brown:    "#8F6B59",
  gray1:    "#535555",
  gray2:    "#787978",
  gray3:    "#9B9E9D",
  gray4:    "#C5C6C5",
  white:    "#FAFAF8",
};

const ROLES = [
  { id:"swe",       label:"Software Engineer",   icon:"{ }",  tag:"Engineering"  },
  { id:"pm",        label:"Product Manager",      icon:"◈",    tag:"Product"      },
  { id:"ds",        label:"Data Scientist",        icon:"∿",    tag:"Analytics"    },
  { id:"designer",  label:"UX Designer",           icon:"◻",    tag:"Design"       },
  { id:"marketing", label:"Marketing Manager",     icon:"↗",    tag:"Marketing"    },
  { id:"finance",   label:"Finance Analyst",       icon:"$",    tag:"Finance"      },
  { id:"hr",        label:"HR Manager",            icon:"⊕",    tag:"People"       },
  { id:"sales",     label:"Sales Executive",       icon:"⟳",    tag:"Sales"        },
  { id:"devops",    label:"DevOps Engineer",       icon:"⚙",    tag:"Infrastructure"},
  { id:"custom",    label:"Custom Role",           icon:"+",    tag:"Any field"    },
];

const LEVELS  = ["Internship","Junior","Mid-Level","Senior","Lead","Director+"];
const STYLES  = ["Behavioral","Technical","Case Study","Mixed"];

const sysPrompt = (role, level, style) => `
You are an expert professional interviewer conducting a ${style} mock interview for a ${level} ${role} position.

Your job:
1. Ask ONE focused interview question at a time, appropriate for the level and role.
2. After the candidate responds, give specific, constructive feedback (2-3 sentences) — mention what was strong, what was missing, and a tip to improve.
3. Then ask the next question.
4. After 5 questions, provide a final evaluation with an overall score (1-10), key strengths, and areas for improvement.

Format responses as:
QUESTION: [question]

After a candidate answers:
FEEDBACK: [feedback]
NEXT QUESTION: [question]

At the end (after 5th answer):
FINAL EVALUATION:
Score: X/10
Strengths: ...
Improvements: ...
Overall: ...
`;

const toSpeech = (t) =>
  t.replace(/^(QUESTION:|NEXT QUESTION:|FEEDBACK:|FINAL EVALUATION:)\s*/gm,"").replace(/\n+/g," ").trim();

export default function App() {
  const [screen,  setScreen]  = useState("setup");
  const [role,    setRole]    = useState(null);
  const [custom,  setCustom]  = useState("");
  const [level,   setLevel]   = useState("Mid-Level");
  const [style,   setStyle]   = useState("Mixed");
  const [mode,    setMode]    = useState("both"); // text | voice | both

  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [qCount,    setQCount]    = useState(0);
  const [evalText,  setEvalText]  = useState(null);

  const [recording, setRecording] = useState(false);
  const [speaking,  setSpeaking]  = useState(false);
  const [audioOn,   setAudioOn]   = useState(true);
  const [transcript,setTranscript]= useState("");
  const [micErr,    setMicErr]    = useState("");
  const [audioLvl,  setAudioLvl]  = useState(0);

  const [typeText,  setTypeText]  = useState("");
  const [typing,    setTyping]    = useState(false);

  const bottomRef   = useRef(null);
  const recRef      = useRef(null);
  const synthRef    = useRef(window.speechSynthesis);
  const streamRef   = useRef(null);
  const rafRef      = useRef(null);
  const finalRef    = useRef("");

  const roleName = role?.id === "custom" ? custom || "Custom Role" : role?.label;
  const showVoice = mode === "voice" || mode === "both";
  const showText  = mode === "text"  || mode === "both";

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typeText]);
  useEffect(() => () => { synthRef.current?.cancel(); stopRec(); }, []);

  // ── TTS ──────────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!audioOn || !synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(toSpeech(text));
    u.rate = 0.93; u.pitch = 1; u.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google")||v.name.includes("Daniel")||v.name.includes("Samantha"))) || voices.find(v=>v.lang.startsWith("en"));
    if (v) u.voice = v;
    u.onstart = ()=>setSpeaking(true);
    u.onend   = ()=>setSpeaking(false);
    u.onerror = ()=>setSpeaking(false);
    synthRef.current.speak(u);
  },[audioOn]);

  const stopSpeak = () => { synthRef.current?.cancel(); setSpeaking(false); };

  // ── Mic visualiser ───────────────────────────────────────────────
  const startViz = (stream) => {
    try {
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const an  = ctx.createAnalyser(); an.fftSize = 256;
      src.connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const tick = () => {
        an.getByteFrequencyData(buf);
        setAudioLvl(Math.min(100,(buf.reduce((a,b)=>a+b,0)/buf.length)*2.8));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {}
  };
  const stopViz = () => { cancelAnimationFrame(rafRef.current); setAudioLvl(0); };

  // ── STT ─────────────────────────────────────────────────────────
  const stopRec = () => {
    recRef.current?.stop();
    streamRef.current?.getTracks().forEach(t=>t.stop());
    stopViz(); setRecording(false);
  };

  const startRec = async () => {
    setMicErr("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicErr("Speech recognition requires Chrome/Edge."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      streamRef.current = stream;
      startViz(stream);
      finalRef.current = "";
      const rec = new SR();
      rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
      recRef.current = rec;
      rec.onresult = e => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalRef.current += e.results[i][0].transcript+" ";
          else interim += e.results[i][0].transcript;
        }
        const combined = finalRef.current + interim;
        setTranscript(combined);
        if (showText) setInput(combined);
      };
      rec.onerror = e => { if (e.error!=="no-speech") setMicErr("Mic error: "+e.error); stopRec(); };
      rec.onend   = () => { stopViz(); setRecording(false); };
      rec.start(); setRecording(true); stopSpeak();
    } catch { setMicErr("Microphone access denied."); }
  };

  const toggleMic = () => {
    if (recording) {
      stopRec();
      if (mode==="voice") setTimeout(()=>{ const t=finalRef.current.trim(); if(t) send(t); },400);
    } else {
      setTranscript(""); setInput(""); startRec();
    }
  };

  // ── Typing animation ─────────────────────────────────────────────
  const typeAnim = (text, done) => {
    setTyping(true); setTypeText("");
    let i = 0;
    const iv = setInterval(()=>{
      i++; setTypeText(text.slice(0,i));
      if (i>=text.length) { clearInterval(iv); setTyping(false); done(text); }
    },9);
  };

  // ── API ──────────────────────────────────────────────────────────
  const callAPI = async (msgs, extra="") => {
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
        system: sysPrompt(roleName,level,style)+extra, messages: msgs })
    });
    const d = await res.json();
    return d.content?.[0]?.text || "";
  };

  const startInterview = async () => {
    setScreen("interview"); setLoading(true);
    try {
      const text = await callAPI([{ role:"user", content:"Please start the interview with the first question." }]);
      setLoading(false);
      typeAnim(text, ft => { setMessages([{role:"assistant",content:ft}]); setQCount(1); speak(ft); });
    } catch { setLoading(false); setMessages([{role:"assistant",content:"Failed to start. Please try again."}]); }
  };

  const send = async (override) => {
    const msg = (override!==undefined ? override : input).trim();
    if (!msg||loading||typing) return;
    setInput(""); setTranscript(""); finalRef.current=""; stopSpeak();
    const newMsgs = [...messages,{role:"user",content:msg}];
    setMessages(newMsgs); setLoading(true);
    const isLast = qCount>=5;
    const extra  = isLast ? " This was the 5th final question. Provide FINAL EVALUATION now." : "";
    try {
      const text = await callAPI(newMsgs.map(m=>({role:m.role,content:m.content})), extra);
      setLoading(false);
      typeAnim(text, ft => {
        setMessages(p=>[...p,{role:"assistant",content:ft}]);
        speak(ft);
        if (isLast) { setEvalText(ft); setTimeout(()=>setScreen("done"),1800); }
        else setQCount(c=>c+1);
      });
    } catch { setLoading(false); setMessages(p=>[...p,{role:"assistant",content:"Error. Please try again."}]); }
  };

  const reset = () => {
    stopSpeak(); stopRec();
    setScreen("setup"); setRole(null); setMessages([]); setInput(""); setTranscript("");
    setQCount(0); setEvalText(null); setTypeText(""); finalRef.current="";
  };

  // ── Message renderer ─────────────────────────────────────────────
  const renderMsg = (text) => text.split("\n").map((line,i)=>{
    if (/^(QUESTION:|NEXT QUESTION:)/.test(line))
      return <p key={i} style={{margin:"5px 0",fontWeight:700,color:C.dark,fontSize:14}}>{line.replace(/^(NEXT )?QUESTION:\s*/,"")}</p>;
    if (line.startsWith("FEEDBACK:"))
      return <p key={i} style={{margin:"5px 0",color:C.gray1,fontSize:13,fontStyle:"italic",borderLeft:`3px solid ${C.lime}`,paddingLeft:10}}>{line.replace("FEEDBACK:","").trim()}</p>;
    if (/^(FINAL EVALUATION:|Score:|Strengths:|Improvements:|Overall:)/.test(line))
      return <p key={i} style={{margin:"4px 0",fontWeight:line.startsWith("FINAL")?700:500,color:C.dark,fontSize:13}}>{line}</p>;
    return line ? <p key={i} style={{margin:"3px 0",color:C.gray1,fontSize:13}}>{line}</p> : <br key={i}/>;
  });

  const BARS = [0.4,0.65,1,0.8,0.55,0.9,0.5,0.75,1,0.6,0.45,0.8,0.7,0.35];

  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.dark}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Fraunces:ital,wght@0,300;0,600;0,700;1,300;1,600&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.gray4};border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes ripple{0%{transform:translate(-50%,-50%) scale(1);opacity:.5}100%{transform:translate(-50%,-50%) scale(2.6);opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fadeUp{animation:fadeUp .5s ease forwards}
        .role-card{transition:all .22s ease;cursor:pointer;border:1.5px solid transparent}
        .role-card:hover{transform:translateY(-4px);border-color:${C.lime}!important;box-shadow:0 8px 32px rgba(211,242,133,.25)}
        .role-card.active{border-color:${C.dark}!important;background:${C.dark}!important}
        .role-card.active .role-tag,.role-card.active .role-icon,.role-card.active .role-name{color:${C.lime}!important}
        .chip{transition:all .18s;cursor:pointer;border:1.5px solid ${C.gray4}}
        .chip:hover{border-color:${C.dark}}
        .chip.active{background:${C.dark};color:${C.lime};border-color:${C.dark}}
        .mode-card{transition:all .2s;cursor:pointer;border:1.5px solid ${C.gray4};border-radius:12px;padding:20px 16px;text-align:center;background:${C.white}}
        .mode-card:hover{border-color:${C.dark};transform:translateY(-2px)}
        .mode-card.active{border-color:${C.dark};background:${C.dark};color:${C.lime}}
        .mode-card.active p{color:${C.limeSoft}!important}
        .send-btn{transition:all .15s}.send-btn:hover{opacity:.88;transform:scale(.97)}
        textarea:focus{outline:none}
        input:focus{outline:none}
        .cursor{animation:blink .75s infinite}
        .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.gray3};animation:shimmer 1.2s infinite}
        .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{borderBottom:`1px solid ${C.gray4}`,background:C.white,padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"center",height:60,position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,background:C.dark,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:14,height:14,background:C.lime,borderRadius:3}}/>
          </div>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:17,fontWeight:600,letterSpacing:"-.3px"}}>Growmark Interview</span>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {screen==="interview" && (
            <button onClick={()=>{setAudioOn(e=>!e);if(speaking)stopSpeak();}}
              style={{background:"transparent",border:`1.5px solid ${C.gray4}`,color:audioOn?C.dark:C.gray3,padding:"6px 14px",borderRadius:8,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit"}}>
              {audioOn?"🔊 Sound on":"🔇 Muted"}
            </button>
          )}
          {screen!=="setup" && (
            <button onClick={reset} style={{background:C.dark,color:C.lime,border:"none",padding:"7px 18px",borderRadius:8,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>
              ← Restart
            </button>
          )}
        </div>
      </nav>

      {/* ══════════════ SETUP ══════════════════════════════════ */}
      {screen==="setup" && (
        <div style={{maxWidth:860,margin:"0 auto",padding:"52px 24px 80px"}}>

          {/* Hero */}
          <div className="fadeUp" style={{marginBottom:52}}>
            <div style={{display:"inline-block",background:C.lime,color:C.dark,fontSize:11,fontWeight:600,letterSpacing:"2px",padding:"5px 14px",borderRadius:20,marginBottom:18}}>
              AI-POWERED PRACTICE
            </div>
            <h1 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(36px,5vw,58px)",fontWeight:600,lineHeight:1.1,letterSpacing:"-1.5px",marginBottom:14}}>
              Mock Interview<br/><em style={{color:C.brown,fontStyle:"italic"}}>Conductor</em>
            </h1>
            <p style={{color:C.gray2,fontSize:16,maxWidth:480,lineHeight:1.65}}>
              Practice for any role with AI that asks real questions, gives real feedback, and scores your performance.
            </p>
          </div>

          {/* Step 1 – Role */}
          <div className="fadeUp" style={{marginBottom:44,animationDelay:".06s",opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
              <div style={{width:26,height:26,background:C.dark,color:C.lime,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>1</div>
              <span style={{fontSize:13,fontWeight:600,letterSpacing:".5px",color:C.gray1}}>SELECT YOUR ROLE</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
              {ROLES.map(r=>(
                <div key={r.id} className={`role-card ${role?.id===r.id?"active":""}`}
                  style={{background:C.white,borderRadius:10,padding:"16px 14px"}}
                  onClick={()=>setRole(r)}>
                  <div className="role-icon" style={{fontSize:20,marginBottom:8,color:role?.id===r.id?C.lime:C.gray2,fontFamily:"monospace",fontWeight:700}}>{r.icon}</div>
                  <div className="role-name" style={{fontSize:13,fontWeight:600,color:role?.id===r.id?C.lime:C.dark,marginBottom:3}}>{r.label}</div>
                  <div className="role-tag" style={{fontSize:11,color:role?.id===r.id?C.limeSoft:C.gray3}}>{r.tag}</div>
                </div>
              ))}
            </div>
            {role?.id==="custom" && (
              <input value={custom} onChange={e=>setCustom(e.target.value)}
                placeholder="e.g. Cybersecurity Analyst, Growth Hacker…"
                style={{marginTop:12,width:"100%",background:C.white,border:`1.5px solid ${C.gray4}`,color:C.dark,padding:"13px 16px",borderRadius:10,fontSize:14,fontFamily:"inherit"}}/>
            )}
          </div>

          {/* Step 2 – Level */}
          <div className="fadeUp" style={{marginBottom:36,animationDelay:".12s",opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:26,height:26,background:C.dark,color:C.lime,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>2</div>
              <span style={{fontSize:13,fontWeight:600,letterSpacing:".5px",color:C.gray1}}>EXPERIENCE LEVEL</span>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {LEVELS.map(l=>(
                <button key={l} onClick={()=>setLevel(l)} className={`chip ${level===l?"active":""}`}
                  style={{padding:"9px 18px",borderRadius:20,fontSize:13,background:level===l?C.dark:C.white,color:level===l?C.lime:C.dark,fontFamily:"inherit"}}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 – Style */}
          <div className="fadeUp" style={{marginBottom:36,animationDelay:".16s",opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:26,height:26,background:C.dark,color:C.lime,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>3</div>
              <span style={{fontSize:13,fontWeight:600,letterSpacing:".5px",color:C.gray1}}>INTERVIEW STYLE</span>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {STYLES.map(s=>(
                <button key={s} onClick={()=>setStyle(s)} className={`chip ${style===s?"active":""}`}
                  style={{padding:"9px 18px",borderRadius:20,fontSize:13,background:style===s?C.dark:C.white,color:style===s?C.lime:C.dark,fontFamily:"inherit"}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4 – Mode */}
          <div className="fadeUp" style={{marginBottom:48,animationDelay:".2s",opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:26,height:26,background:C.dark,color:C.lime,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>4</div>
              <span style={{fontSize:13,fontWeight:600,letterSpacing:".5px",color:C.gray1}}>HOW WILL YOU ANSWER?</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,maxWidth:540}}>
              {[{id:"text",icon:"⌨️",label:"Type Only",desc:"Keyboard input"},{id:"voice",icon:"🎙️",label:"Voice Only",desc:"Speak your answers"},{id:"both",icon:"✦",label:"Both",desc:"Voice + type together"}].map(m=>(
                <div key={m.id} className={`mode-card ${mode===m.id?"active":""}`} onClick={()=>setMode(m.id)}>
                  <div style={{fontSize:22,marginBottom:8}}>{m.icon}</div>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{m.label}</div>
                  <p style={{fontSize:11,color:C.gray2}}>{m.desc}</p>
                </div>
              ))}
            </div>
            <p style={{fontSize:12,color:C.gray3,marginTop:10}}>🔊 Interviewer speaks questions aloud — mute anytime in the toolbar.</p>
          </div>

          {/* CTA */}
          <button onClick={startInterview}
            disabled={!role||(role.id==="custom"&&!custom.trim())}
            style={{background: role?C.dark:"#ccc",color:role?C.lime:C.white,border:"none",padding:"16px 44px",borderRadius:12,fontSize:15,fontWeight:600,cursor:role?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10,transition:"all .2s",boxShadow:role?"0 4px 24px rgba(18,20,20,.18)":"none"}}>
            Begin Interview
            <span style={{fontSize:18}}>→</span>
          </button>
        </div>
      )}

      {/* ══════════════ INTERVIEW ════════════════════════════ */}
      {screen==="interview" && (
        <div style={{maxWidth:780,margin:"0 auto",padding:"32px 24px",display:"flex",flexDirection:"column",minHeight:"calc(100vh - 60px)"}}>

          {/* Progress bar */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <p style={{fontSize:12,color:C.gray2,marginBottom:3}}>{roleName} · {level}</p>
              <p style={{fontSize:11,color:C.gray3,letterSpacing:".5px"}}>{style.toUpperCase()} INTERVIEW</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {[1,2,3,4,5].map(n=>(
                <div key={n} style={{width:32,height:5,borderRadius:3,background: n<qCount?C.dark:n===qCount?C.lime:C.gray4,transition:"background .3s"}}/>
              ))}
              <span style={{fontSize:12,color:C.gray2,marginLeft:6,fontWeight:500}}>{qCount}/5</span>
            </div>
          </div>

          {/* Speaking bar */}
          {speaking && (
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 16px",background:C.bgCream,border:`1px solid ${C.lime}`,borderRadius:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:C.dark,animation:"shimmer .8s infinite"}}/>
              <span style={{fontSize:12,color:C.dark,fontWeight:500}}>Interviewer is speaking…</span>
              <button onClick={stopSpeak} style={{marginLeft:"auto",background:"transparent",border:`1px solid ${C.gray4}`,color:C.gray1,padding:"3px 10px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Skip ▶</button>
            </div>
          )}

          {/* Chat */}
          <div style={{flex:1,minHeight:340,maxHeight:440,overflowY:"auto",background:C.white,border:`1px solid ${C.gray4}`,borderRadius:16,padding:"20px",marginBottom:16,display:"flex",flexDirection:"column",gap:14}}>
            {messages.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:10,alignItems:"flex-start"}}>
                {m.role==="assistant" && (
                  <div style={{width:30,height:30,borderRadius:8,background:C.dark,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:2}}>
                    <div style={{width:12,height:12,background:C.lime,borderRadius:3}}/>
                  </div>
                )}
                <div style={{maxWidth:"76%",padding:"13px 16px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"4px 14px 14px 14px",background:m.role==="user"?C.dark:C.bgCream,border:`1px solid ${m.role==="user"?"transparent":C.gray4}`}}>
                  {m.role==="assistant"
                    ? renderMsg(m.content)
                    : <p style={{color:C.limeSoft,fontSize:14,lineHeight:1.65}}>{m.content}</p>
                  }
                </div>
              </div>
            ))}

            {(loading||typing) && (
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:30,height:30,borderRadius:8,background:C.dark,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:12,height:12,background:C.lime,borderRadius:3,animation:"spin 1s linear infinite"}}/>
                </div>
                <div style={{padding:"13px 16px",borderRadius:"4px 14px 14px 14px",background:C.bgCream,border:`1px solid ${C.gray4}`,maxWidth:"76%"}}>
                  {typing && typeText
                    ? <>{renderMsg(typeText)}<span className="cursor" style={{color:C.brown}}>|</span></>
                    : <div style={{display:"flex",gap:5,padding:"4px 0"}}><div className="dot"/><div className="dot"/><div className="dot"/></div>
                  }
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input Panel */}
          <div style={{background:C.white,border:`1px solid ${C.gray4}`,borderRadius:16,padding:"16px 18px"}}>

            {showVoice && (
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:showText?14:0}}>
                {/* Mic */}
                <div style={{position:"relative",width:48,height:48,flexShrink:0}}>
                  {recording && [0,1].map(k=>(
                    <div key={k} style={{position:"absolute",top:"50%",left:"50%",width:48,height:48,borderRadius:"50%",border:`2px solid ${C.dark}`,animation:"ripple 1.6s ease-out infinite",animationDelay:`${k*.7}s`,pointerEvents:"none"}}/>
                  ))}
                  <button onClick={toggleMic} disabled={loading||typing}
                    style={{position:"absolute",inset:0,borderRadius:"50%",border:`2px solid ${recording?C.dark:C.gray4}`,background:recording?C.dark:C.white,color:recording?C.lime:C.gray2,fontSize:18,cursor:loading||typing?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
                    {recording?"⏹":"🎙"}
                  </button>
                </div>

                {/* Waveform */}
                <div style={{display:"flex",alignItems:"center",gap:2.5,height:32,flex:1}}>
                  {BARS.map((h,i)=>(
                    <div key={i} style={{width:3,borderRadius:2,background:recording?C.dark:C.gray4,height:recording?`${Math.max(4,audioLvl*h*.32)}px`:"4px",transition:"height .08s ease"}}/>
                  ))}
                </div>

                <span style={{fontSize:11,color:recording?C.dark:C.gray3,fontWeight:recording?600:400,letterSpacing:"1px",minWidth:80,textAlign:"right"}}>
                  {recording?"● REC":"Tap to speak"}
                </span>

                {mode==="voice" && transcript && !recording && (
                  <button onClick={()=>send(transcript)} disabled={loading||typing}
                    style={{background:C.dark,color:C.lime,border:"none",padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                    Send →
                  </button>
                )}
              </div>
            )}

            {mode==="voice" && transcript && (
              <div style={{background:C.bgCream,border:`1px solid ${C.gray4}`,borderRadius:8,padding:"10px 14px",marginBottom:showText?12:0,fontSize:13,color:C.gray1,fontStyle:"italic"}}>
                "{transcript}"
              </div>
            )}

            {showText && (
              <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                  placeholder={recording?"Listening… (edit if needed)":"Type your answer… (Enter to send, Shift+Enter for newline)"}
                  rows={2} disabled={loading||typing}
                  style={{flex:1,background:C.bg,border:`1.5px solid ${input?C.dark:C.gray4}`,color:C.dark,borderRadius:10,padding:"12px 14px",fontSize:14,fontFamily:"inherit",resize:"none",lineHeight:1.6,transition:"border-color .2s"}}/>
                <button onClick={()=>send()} disabled={!input.trim()||loading||typing} className="send-btn"
                  style={{background:input.trim()&&!loading&&!typing?C.dark:"#ddd",color:input.trim()&&!loading&&!typing?C.lime:C.gray3,border:"none",borderRadius:10,padding:"0 20px",fontSize:20,cursor:"pointer",height:60,flexShrink:0}}>
                  →
                </button>
              </div>
            )}

            {micErr && <p style={{fontSize:12,color:"#c0392b",marginTop:8}}>⚠ {micErr}</p>}
          </div>
        </div>
      )}

      {/* ══════════════ DONE ══════════════════════════════════ */}
      {screen==="done" && (
        <div style={{maxWidth:720,margin:"0 auto",padding:"60px 24px 80px"}}>
          <div className="fadeUp" style={{marginBottom:40}}>
            <div style={{display:"inline-block",background:C.lime,color:C.dark,fontSize:11,fontWeight:600,letterSpacing:"2px",padding:"5px 14px",borderRadius:20,marginBottom:20}}>
              INTERVIEW COMPLETE
            </div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:42,fontWeight:600,letterSpacing:"-1px",lineHeight:1.15,marginBottom:10}}>
              Well done,<br/><em style={{color:C.brown}}>here's your feedback.</em>
            </h2>
            <p style={{color:C.gray2,fontSize:15}}>{roleName} · {level} · {style}</p>
          </div>

          <div className="fadeUp" style={{background:C.white,border:`1.5px solid ${C.gray4}`,borderRadius:18,padding:"32px",marginBottom:32,animationDelay:".12s",opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.gray4}`}}>
              <div style={{width:32,height:32,background:C.dark,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:14,height:14,background:C.lime,borderRadius:4}}/>
              </div>
              <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:600}}>Final Evaluation</span>
            </div>
            <div style={{lineHeight:1.85}}>
              {evalText ? renderMsg(evalText) : <p style={{color:C.gray3}}>No evaluation available.</p>}
            </div>
          </div>

          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button onClick={reset} style={{background:C.dark,color:C.lime,border:"none",padding:"14px 32px",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(18,20,20,.15)"}}>
              Try Again →
            </button>
            <button onClick={()=>{reset();}} style={{background:"transparent",border:`1.5px solid ${C.dark}`,color:C.dark,padding:"14px 32px",borderRadius:12,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>
              Change Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
