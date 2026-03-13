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

export default function MockInterview() {
  const [screen,   setScreen]   = useState("setup");
  const [role,     setRole]     = useState(null);
  const [custom,   setCustom]   = useState("");
  const [level,    setLevel]    = useState("Mid-Level");
  const [style,    setStyle]    = useState("Mixed");
  const [mode,     setMode]     = useState("both");

  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [qCount,     setQCount]    = useState(0);
  const [evalText,   setEvalText]  = useState(null);

  const [recording, setRecording] = useState(false);
  const [speaking,   setSpeaking]  = useState(false);
  const [audioOn,   setAudioOn]   = useState(true);
  const [transcript,setTranscript]= useState("");
  const [micErr,     setMicErr]    = useState("");
  const [audioLvl,   setAudioLvl]  = useState(0);

  const [typeText,   setTypeText]  = useState("");
  const [typing,     setTyping]    = useState(false);

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

  const startViz = (stream) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
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

  const typeAnim = (text, done) => {
    setTyping(true); setTypeText("");
    let i = 0;
    const iv = setInterval(()=>{
      i++; setTypeText(text.slice(0,i));
      if (i>=text.length) { clearInterval(iv); setTyping(false); done(text); }
    },9);
  };

  // ── API (GEMINI FIXED) ──────────────────────────────────────────
  const callAPI = async (msgs, extra = "") => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    // Map roles: Gemini only accepts "user" or "model"
    const contents = msgs.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: sysPrompt(roleName, level, style) + extra }]
      },
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    };

    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const d = await res.json();
    if (d.error) {
      console.error("Gemini Error:", d.error);
      throw new Error(d.error.message);
    }
    return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  const startInterview = async () => {
    setScreen("interview"); setLoading(true);
    try {
      // Must start with a "user" message for Gemini
      const text = await callAPI([{ role:"user", content:"Let's start. Please ask the first question." }]);
      setLoading(false);
      typeAnim(text, ft => { setMessages([{role:"assistant",content:ft}]); setQCount(1); speak(ft); });
    } catch (err) { 
      setLoading(false); 
      setMessages([{role:"assistant",content: "Error: " + err.message}]); 
    }
  };

  const send = async (override) => {
    const msg = (override!==undefined ? override : input).trim();
    if (!msg||loading||typing) return;
    setInput(""); setTranscript(""); finalRef.current=""; stopSpeak();
    
    const newMsgs = [...messages, {role:"user", content:msg}];
    setMessages(newMsgs); 
    setLoading(true);

    const isLast = qCount>=5;
    const extra  = isLast ? " This was the final answer. Provide FINAL EVALUATION now." : "";

    try {
      const text = await callAPI(newMsgs, extra);
      setLoading(false);
      typeAnim(text, ft => {
        setMessages(p=>[...p,{role:"assistant",content:ft}]);
        speak(ft);
        if (isLast) { setEvalText(ft); setTimeout(()=>setScreen("done"),1800); }
        else setQCount(c=>c+1);
      });
    } catch (err) {
      setLoading(false);
      setMessages(p=>[...p,{role:"assistant",content:"Failed to get response from AI."}]);
    }
  };

  const reset = () => {
    stopSpeak(); stopRec();
    setScreen("setup"); setRole(null); setMessages([]); setInput(""); setTranscript("");
    setQCount(0); setEvalText(null); setTypeText(""); finalRef.current="";
  };

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
 

      {screen==="setup" && (
        <div style={{maxWidth:860,margin:"0 auto",padding:"52px 24px 80px"}}>
          <div className="fadeUp" style={{marginBottom:52}}>
            <div style={{display:"inline-block",background:C.lime,color:C.dark,fontSize:11,fontWeight:600,letterSpacing:"2px",padding:"5px 14px",borderRadius:20,marginBottom:18}}>
              AI-POWERED PRACTICE
            </div>
            <h1 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(36px,5vw,58px)",fontWeight:600,lineHeight:1.1,letterSpacing:"-1.5px",marginBottom:14}}>
              Mock Interview<br/><em style={{color:C.brown,fontStyle:"italic"}}>Conductor</em>
            </h1>
          </div>

          <div className="fadeUp" style={{marginBottom:44,opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
              <div style={{width:26,height:26,background:C.dark,color:C.lime,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>1</div>
              <span style={{fontSize:13,fontWeight:600,color:C.gray1}}>SELECT YOUR ROLE</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
              {ROLES.map(r=>(
                <div key={r.id} className={`role-card ${role?.id===r.id?"active":""}`}
                  style={{background:C.white,borderRadius:10,padding:"16px 14px", border:`1.5px solid ${role?.id===r.id?C.dark:C.gray4}`}}
                  onClick={()=>setRole(r)}>
                  <div className="role-icon" style={{fontSize:20,marginBottom:8,color:role?.id===r.id?C.lime:C.gray2,fontFamily:"monospace",fontWeight:700}}>{r.icon}</div>
                  <div className="role-name" style={{fontSize:13,fontWeight:600,color:role?.id===r.id?C.lime:C.dark,marginBottom:3}}>{r.label}</div>
                  <div className="role-tag" style={{fontSize:11,color:role?.id===r.id?C.limeSoft:C.gray3}}>{r.tag}</div>
                </div>
              ))}
            </div>
            {role?.id==="custom" && (
              <input value={custom} onChange={e=>setCustom(e.target.value)}
                placeholder="e.g. Cybersecurity Analyst..."
                style={{marginTop:12,width:"100%",background:C.white,border:`1.5px solid ${C.gray4}`,color:C.dark,padding:"13px 16px",borderRadius:10,fontSize:14,fontFamily:"inherit"}}/>
            )}
          </div>

          <div className="fadeUp" style={{marginBottom:36,opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:26,height:26,background:C.dark,color:C.lime,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>2</div>
              <span style={{fontSize:13,fontWeight:600,color:C.gray1}}>EXPERIENCE LEVEL</span>
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

          <div className="fadeUp" style={{marginBottom:36,opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:26,height:26,background:C.dark,color:C.lime,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>3</div>
              <span style={{fontSize:13,fontWeight:600,color:C.gray1}}>INTERVIEW STYLE</span>
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

          <div className="fadeUp" style={{marginBottom:48,opacity:0,animationFillMode:"forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:26,height:26,background:C.dark,color:C.lime,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>4</div>
              <span style={{fontSize:13,fontWeight:600,color:C.gray1}}>MODE</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,maxWidth:540}}>
              {[{id:"text",icon:"⌨️",label:"Type Only"},{id:"voice",icon:"🎙️",label:"Voice Only"},{id:"both",icon:"✦",label:"Both"}].map(m=>(
                <div key={m.id} className={`mode-card ${mode===m.id?"active":""}`} onClick={()=>setMode(m.id)}>
                  <div style={{fontSize:22,marginBottom:8}}>{m.icon}</div>
                  <div style={{fontSize:13,fontWeight:600}}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={startInterview}
            disabled={!role||(role.id==="custom"&&!custom.trim())}
            style={{background: role?C.dark:"#ccc",color:role?C.lime:C.white,border:"none",padding:"16px 44px",borderRadius:12,fontSize:15,fontWeight:600,cursor:role?"pointer":"not-allowed",fontFamily:"inherit"}}>
            Begin Interview →
          </button>
        </div>
      )}

      {screen==="interview" && (
        <div style={{maxWidth:780,margin:"0 auto",padding:"32px 24px",display:"flex",flexDirection:"column",minHeight:"calc(100vh - 60px)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <p style={{fontSize:12,color:C.gray2}}>{roleName} · {level}</p>
              <p style={{fontSize:11,color:C.gray3}}>{style.toUpperCase()}</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {[1,2,3,4,5].map(n=>(
                <div key={n} style={{width:32,height:5,borderRadius:3,background: n<qCount?C.dark:n===qCount?C.lime:C.gray4}}/>
              ))}
            </div>
          </div>

          {speaking && (
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 16px",background:C.bgCream,border:`1px solid ${C.lime}`,borderRadius:10}}>
              <span style={{fontSize:12,color:C.dark}}>Interviewer is speaking…</span>
              <button onClick={stopSpeak} style={{marginLeft:"auto",background:"transparent",border:`1px solid ${C.gray4}`,fontSize:11,cursor:"pointer"}}>Skip ▶</button>
            </div>
          )}

          <div style={{flex:1,minHeight:340,maxHeight:440,overflowY:"auto",background:C.white,border:`1px solid ${C.gray4}`,borderRadius:16,padding:"20px",marginBottom:16,display:"flex",flexDirection:"column",gap:14}}>
            {messages.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:10}}>
                <div style={{maxWidth:"76%",padding:"13px 16px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"4px 14px 14px 14px",background:m.role==="user"?C.dark:C.bgCream, color:m.role==="user"?C.white:C.dark}}>
                  {m.role==="assistant" ? renderMsg(m.content) : m.content}
                </div>
              </div>
            ))}
            {(loading||typing) && (
              <div style={{fontSize:12, color:C.gray3}}>Interviewer is thinking...</div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div style={{background:C.white,border:`1px solid ${C.gray4}`,borderRadius:16,padding:"16px 18px"}}>
            {showVoice && (
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:showText?14:0}}>
                <button onClick={toggleMic} disabled={loading||typing}
                  style={{width:48,height:48,borderRadius:"50%",border:`2px solid ${recording?C.dark:C.gray4}`,background:recording?C.dark:C.white,color:recording?C.lime:C.gray2,cursor:"pointer"}}>
                  {recording?"⏹":"🎙"}
                </button>
                <span style={{fontSize:11}}>{recording?"● REC":"Tap to speak"}</span>
                {mode==="voice" && transcript && !recording && (
                  <button onClick={()=>send(transcript)} style={{background:C.dark,color:C.lime,padding:"8px 16px",borderRadius:8,cursor:"pointer"}}>Send →</button>
                )}
              </div>
            )}
            {showText && (
              <div style={{display:"flex",gap:10}}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                  placeholder="Type your answer..."
                  style={{flex:1,background:C.bg,border:`1.5px solid ${C.gray4}`,borderRadius:10,padding:"12px",resize:"none"}}/>
                <button onClick={()=>send()} disabled={!input.trim()||loading||typing} style={{background:C.dark,color:C.lime,borderRadius:10,padding:"0 20px",cursor:"pointer"}}>→</button>
              </div>
            )}
          </div>
        </div>
      )}

      {screen==="done" && (
        <div style={{maxWidth:720,margin:"0 auto",padding:"60px 24px 80px"}}>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:42,marginBottom:10}}>Interview Complete</h2>
          <div style={{background:C.white,border:`1.5px solid ${C.gray4}`,borderRadius:18,padding:"32px",marginBottom:32}}>
             {evalText ? renderMsg(evalText) : "No evaluation."}
          </div>
          <button onClick={reset} style={{background:C.dark,color:C.lime,padding:"14px 32px",borderRadius:12,cursor:"pointer"}}>Try Again →</button>
        </div>
      )}
    </div>
  );
}