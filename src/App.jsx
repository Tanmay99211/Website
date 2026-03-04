import { useState, useEffect, useRef } from "react";

const THEMES = {
  deeptech: {
    id: "deeptech", label: "DeepTech",
    bg: "#060c1a", bgCard: "rgba(13,26,53,0.85)", bgSection: "rgba(26,60,255,0.05)",
    primary: "#1a3cff", accent: "#00d4ff",
    text: "#f4f6ff", textMuted: "rgba(244,246,255,0.56)",
    border: "rgba(26,60,255,0.2)", borderHov: "rgba(26,60,255,0.55)",
    gridColor: "rgba(26,60,255,0.07)", toggleBg: "#0d1a35",
    font: "'Barlow Condensed', sans-serif",
    bodyFont: "'Barlow', sans-serif",
    monoFont: "'Space Mono', monospace",
    tagline: "Engineering India's UAV Future",
    isET: false,
  },
  edtech: {
    id: "edtech", label: "EdTech",
    bg: "#fffbf5", bgCard: "#ffffff", bgSection: "#fff8ee",
    primary: "#ff6b1a", accent: "#ffb800",
    text: "#1a1208", textMuted: "rgba(26,18,8,0.5)",
    border: "rgba(255,107,26,0.18)", borderHov: "rgba(255,107,26,0.5)",
    gridColor: "rgba(255,107,26,0.05)", toggleBg: "#fff0e0",
    font: "'Nunito', sans-serif",
    bodyFont: "'Nunito', sans-serif",
    monoFont: "'Space Mono', monospace",
    tagline: "Building India's Drone-Ready Generation",
    isET: true,
  },
};

function FontLoader() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Nunito:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useReveal();
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease` }}>{children}</div>;
}

function ImgBox({ label, height = 200, t }) {
  return (
    <div style={{ width: "100%", height, background: t.isET ? "rgba(255,107,26,0.06)" : "rgba(26,60,255,0.07)", border: `1.5px dashed ${t.border}`, borderRadius: t.isET ? 14 : 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: t.textMuted, fontFamily: t.monoFont, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
        <rect x="1" y="1" width="30" height="30" rx={t.isET ? 6 : 0} stroke={t.primary} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.5" />
        <circle cx="11" cy="12" r="3" stroke={t.primary} strokeWidth="1.2" opacity="0.5" />
        <path d="M2 24 L9 17 L15 22 L21 15 L30 24" stroke={t.primary} strokeWidth="1.2" strokeLinejoin="round" opacity="0.5" />
      </svg>
      {label}
    </div>
  );
}

/* ── GLIDING TOGGLE ── */
function ThemeToggle({ theme, onSwitch }) {
  const activeIdx = theme.id === "deeptech" ? 0 : 1;
  const [pillPos, setPillPos]     = useState(activeIdx);   // 0 = left, 1 = right
  const [hovered, setHovered]     = useState(null);
  const btnRefs                   = [useRef(null), useRef(null)];
  const trackRef                  = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 4, width: 120 });

  // Inject keyframes once
  useEffect(() => {
    if (document.getElementById("px-toggle-styles")) return;
    const s = document.createElement("style");
    s.id = "px-toggle-styles";
    s.innerHTML = `
      @keyframes px-pulse {
        0%,100% { opacity: 1;   transform: scale(1);    }
        50%      { opacity: 0.6; transform: scale(1.18); }
      }
      @keyframes px-corona {
        0%,100% { box-shadow: 0 0 0px 0px var(--px-c); }
        50%      { box-shadow: 0 0 40px 12px var(--px-c); }
      }
      @keyframes px-scan {
        0%   { transform: translateX(-120%); opacity: 0.6; }
        60%  { opacity: 1; }
        100% { transform: translateX(320%);  opacity: 0; }
      }
      @keyframes px-bloom {
        0%,100% { opacity: 0.55; transform: scale(1);    }
        50%      { opacity: 0.9;  transform: scale(1.12); }
      }
      .px-pill {
        position: absolute; top: 4px; bottom: 4px;
        border-radius: 3px; pointer-events: none; z-index: 1;
        transition: left 0.52s cubic-bezier(0.34,1.56,0.64,1),
                    width 0.52s cubic-bezier(0.34,1.56,0.64,1),
                    background 0.45s ease,
                    box-shadow 0.45s ease;
      }
      .px-btn-label {
        position: relative; z-index: 3; cursor: pointer; border: none;
        background: transparent; display: flex; align-items: center; gap: 9px;
        transition: color 0.38s ease, transform 0.2s ease;
      }
      .px-btn-label:hover { transform: scale(1.04); }
      .px-btn-label:active { transform: scale(0.97); }
      .px-scan-shine {
        position: absolute; inset: 0; overflow: hidden;
        border-radius: 3px; pointer-events: none; z-index: 4;
      }
      .px-scan-shine::after {
        content: '';
        position: absolute; top: 0; bottom: 0; width: 40%;
        background: linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
        animation: px-scan 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
      }
    `;
    document.head.appendChild(s);
  }, []);

  // Measure real button positions to drive the pill
  const measurePill = (idx) => {
    const btn   = btnRefs[idx]?.current;
    const track = trackRef.current;
    if (!btn || !track) return;
    const bRect = btn.getBoundingClientRect();
    const tRect = track.getBoundingClientRect();
    setPillStyle({ left: bRect.left - tRect.left - 4, width: bRect.width + 8 });
  };

  useEffect(() => {
    const newIdx = theme.id === "deeptech" ? 0 : 1;
    setPillPos(newIdx);
    // Small delay so DOM has settled after theme switch
    requestAnimationFrame(() => measurePill(newIdx));
  }, [theme.id]);

  // Re-measure on resize
  useEffect(() => {
    const fn = () => measurePill(pillPos);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [pillPos]);

  const [scanning, setScanning] = useState(false);
  const handleClick = (id, idx) => {
    if (id === theme.id) return;
    setScanning(true);
    setTimeout(() => setScanning(false), 750);
    onSwitch(id);
  };

  const isDeep   = theme.id === "deeptech";
  const glowDeep = "#1a3cff";
  const glowET   = "#ff6b1a";
  const glowCol  = isDeep ? glowDeep : glowET;
  const trackBg  = isDeep ? "#06101f" : "#fff0e2";
  const trackBdr = isDeep ? "rgba(26,60,255,0.4)" : "rgba(255,107,26,0.35)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>

      {/* ── "Choose Your World" label ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ display: "block", width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${glowCol})` }} />
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: "0.56rem",
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: glowCol, fontWeight: 700,
          textShadow: `0 0 12px ${glowCol}`,
          transition: "color 0.5s, text-shadow 0.5s",
        }}>Choose Your World</span>
        <span style={{ display: "block", width: 36, height: 1, background: `linear-gradient(90deg, ${glowCol}, transparent)` }} />
      </div>

      {/* ── Ambient bloom behind track ── */}
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", inset: -16,
          background: `radial-gradient(ellipse at ${isDeep ? "30%" : "70%"} 50%, ${glowCol}55 0%, transparent 70%)`,
          filter: "blur(18px)",
          transition: "background 0.6s ease",
          animation: "px-bloom 3s ease-in-out infinite",
          "--px-c": glowCol + "44",
          pointerEvents: "none",
          borderRadius: "50%",
          zIndex: 0,
        }} />

        {/* ── Track ── */}
        <div ref={trackRef} style={{
          position: "relative", display: "flex", alignItems: "center",
          background: trackBg,
          border: `1px solid ${trackBdr}`,
          borderRadius: 4, padding: "4px 4px",
          gap: 0,
          boxShadow: `0 0 0 1px ${glowCol}22, 0 0 32px 0px ${glowCol}33, inset 0 1px 0 rgba(255,255,255,0.05)`,
          transition: "box-shadow 0.5s ease, border-color 0.5s ease, background 0.5s ease",
          zIndex: 1,
        }}>

          {/* Sliding pill */}
          <div
            className="px-pill"
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              background: isDeep
                ? "linear-gradient(135deg, #2a4fff 0%, #0a1ecc 100%)"
                : "linear-gradient(135deg, #ff7a2f 0%, #e8500a 100%)",
              boxShadow: `
                0 0 0 1px ${glowCol}99,
                0 0 18px 4px  ${glowCol}99,
                0 0 42px 10px ${glowCol}55,
                0 0 80px 20px ${glowCol}22,
                inset 0 1px 0 rgba(255,255,255,0.2)
              `,
              animation: "px-corona 2.8s ease-in-out infinite",
              "--px-c": glowCol + "66",
            }}
          />

          {/* Scan shine — fires on switch */}
          {scanning && <div className="px-scan-shine" style={{ left: pillStyle.left, width: pillStyle.width, position: "absolute", top: 4, bottom: 4 }} />}

          {/* Buttons */}
          {[
            { id: "deeptech", label: "DeepTech" },
            { id: "edtech",   label: "EdTech"   },
          ].map(({ id, label }, idx) => {
            const active = theme.id === id;
            const isHov  = hovered === idx;
            const gc     = id === "deeptech" ? glowDeep : glowET;
            return (
              <button
                key={id}
                ref={btnRefs[idx]}
                className="px-btn-label"
                onClick={() => handleClick(id, idx)}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "11px 34px",
                  borderRadius: 2,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: active ? 700 : 400,
                  color: active ? "#fff" : isHov ? (theme.isET ? "#1a1208" : "#f4f6ff") : theme.textMuted,
                  textShadow: active ? `0 0 10px rgba(255,255,255,0.6)` : "none",
                  // separator
                  borderRight: idx === 0 ? `1px solid ${trackBdr}` : "none",
                  borderLeft: "none", borderTop: "none", borderBottom: "none",
                }}
              >
                {/* Live dot on active */}
                <span style={{
                  display: "inline-block",
                  width: active ? 6 : 4, height: active ? 6 : 4,
                  borderRadius: "50%",
                  background: active ? "#fff" : isHov ? gc : (theme.isET ? "rgba(26,18,8,0.2)" : "rgba(244,246,255,0.2)"),
                  boxShadow: active ? `0 0 8px 3px ${gc}, 0 0 16px 5px ${gc}88` : "none",
                  flexShrink: 0,
                  transition: "all 0.35s ease",
                  animation: active ? "px-pulse 2s ease-in-out infinite" : "none",
                }} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'Barlow', sans-serif", fontSize: "0.7rem",
        letterSpacing: "0.06em", color: theme.textMuted,
        fontStyle: "italic", transition: "color 0.5s, opacity 0.5s",
      }}>{theme.tagline}</div>
    </div>
  );
}

/* ── NAV ── */
function Nav({ t, onSwitch }) {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navBg = t.isET
    ? sc ? "rgba(255,251,245,0.97)" : "rgba(255,251,245,0.9)"
    : sc ? "rgba(6,12,26,0.98)" : "rgba(6,12,26,0.88)";

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300 }}>
      {/* ── Logo bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "13px 40px",
        background: navBg,
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${t.border}`,
        transition: "background 0.3s",
      }}>
        <div style={{ fontFamily: t.font, fontWeight: 900, fontSize: "1.5rem", letterSpacing: "0.04em", color: t.text }}>
          PRARAMBH<span style={{ color: t.primary }}>X</span>
          <span style={{ marginLeft: 8, fontFamily: t.monoFont, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontWeight: 400 }}>Technologies</span>
        </div>
        <nav style={{ display: "flex", gap: 26 }}>
          {["About", "Products", "Traction", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ fontFamily: t.monoFont, fontSize: "0.63rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = t.primary}
              onMouseLeave={e => e.target.style.color = t.textMuted}
            >{l}</a>
          ))}
        </nav>
      </div>

      {/* ── Toggle bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "14px 40px",
        background: navBg,
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${t.border}`,
        // Subtle bottom glow on the whole bar matching active theme
        boxShadow: t.isET
          ? "0 4px 24px -4px rgba(255,107,26,0.12)"
          : "0 4px 24px -4px rgba(26,60,255,0.18)",
        transition: "box-shadow 0.5s ease",
      }}>
        <ThemeToggle theme={t} onSwitch={onSwitch} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DEEPTECH SITE
══════════════════════════════════════════ */
function DeepTechSite({ t }) {
  const products = [
    { status: "POC Stage", sc: "#ffb800", title: "Logistics UAV Platform", body: "Mission-specific payload release mechanism for reliable, repeatable delivery operations — designed for last-mile logistics and emergency supply drops across Indian urban terrain.", img: "Logistics Drone / Prototype Photo" },
    { status: "POC Performed", sc: "#00ff88", title: "SkyAlert — Public Safety UAV", body: "A UAV-based alert system for real-time information distribution during natural disasters. Funded by La Trobe University, Melbourne and PCCOE Pune (INR 52,000).", img: "SkyAlert Drone in Operation" },
    { status: "Schematic Stage", sc: t.accent, title: "Smart Flight Controller", body: "In-house flight controller with built-in OLED display showing altitude, GPS count, battery voltage and flight modes — fully independent of off-the-shelf autopilot platforms.", img: "PCB / Flight Controller Concept" },
    { status: "CAD Design Stage", sc: t.accent, title: "Modular UAV Architecture", body: "Interchangeable modules for airframe, propulsion, avionics and payload interfaces — enabling faster mission adaptability and reduced time-to-deployment.", img: "Modular UAV CAD Render" },
  ];

  return (
    <>
      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 48px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: t.font, fontWeight: 900, fontSize: "clamp(100px,20vw,280px)", color: "rgba(26,60,255,0.04)", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: "-0.03em" }}>UAV</div>
        <DLabel t={t}>// Aerospace · Drone Technology · Component Manufacturing</DLabel>
        <h1 style={{ fontFamily: t.font, fontWeight: 900, fontSize: "clamp(54px,10vw,132px)", lineHeight: 0.9, textTransform: "uppercase", letterSpacing: "-0.02em", marginTop: 10 }}>
          <span style={{ color: t.primary }}>Logistics</span><br />
          <span style={{ WebkitTextStroke: `2px ${t.text}`, color: "transparent" }}>UAV</span><br />
          Platform
        </h1>
        <p style={{ marginTop: 26, fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.7, maxWidth: 490, color: t.textMuted }}>
          Mission-specific drone solutions engineered for India's dense urban airspace — from payload delivery to public safety emergency response.
        </p>
        <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <DBtn t={t} href="#products">Explore Products →</DBtn>
          <DBtnOut t={t} href="#contact">Partner With Us</DBtnOut>
        </div>
        <div style={{ display: "flex", gap: 36, marginTop: 56, flexWrap: "wrap" }}>
          {[{ n: "#2", l: "Global Drone Design\nSAE Aero West 2025" }, { n: "2", l: "UAV Platforms\nIn Development" }, { n: "₹52K", l: "International\nPrototype Funding" }].map(s => (
            <div key={s.n} style={{ borderLeft: `2px solid ${t.primary}`, paddingLeft: 14 }}>
              <div style={{ fontFamily: t.font, fontWeight: 900, fontSize: "2.2rem", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: t.monoFont, fontSize: "0.57rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, marginTop: 5, lineHeight: 1.6, whiteSpace: "pre-line" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)", width: 320 }}>
          <ImgBox label="Flagship Drone / Hero Shot" height={220} t={t} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            <ImgBox label="Prototype Photo" height={100} t={t} />
            <ImgBox label="SkyAlert UAV" height={100} t={t} />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 48px", borderTop: `1px solid ${t.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <Reveal>
          <DLabel t={t}>About DeepTech Vertical</DLabel>
          <h2 style={DH2(t)}>UAV Solutions<br />Built for India</h2>
          <p style={{ marginTop: 16, fontSize: "1rem", lineHeight: 1.78, color: t.textMuted }}>India's UAV market needs platforms designed from the ground up for Indian conditions — dense urban layouts, complex airspace, and diverse missions. PrarambhX engineers mission-specific UAV systems with in-house architecture.</p>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {["Mission-specific design & payload integration", "In-house flight controller architecture", "Modular airframe for rapid mission adaptability", "Designed for Indian urban airspace & regulations"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: "0.88rem", color: t.textMuted }}>
                <span style={{ color: t.accent, fontSize: "0.75rem" }}>◆</span>{f}
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <ImgBox label="UAV Design / In-house Development" height={280} t={t} />
        </Reveal>
      </section>

      {/* PRODUCTS */}
      <section id="products" style={{ padding: "100px 48px", background: t.bgSection, borderTop: `1px solid ${t.border}` }}>
        <Reveal><DLabel t={t}>Products</DLabel><h2 style={DH2(t)}>What We're<br />Engineering</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginTop: 50 }}>
          {products.map((p, i) => <Reveal key={p.title} delay={i * 0.08}><DProductCard p={p} t={t} /></Reveal>)}
        </div>
      </section>

      {/* TARGET SECTORS */}
      <section style={{ padding: "100px 48px", borderTop: `1px solid ${t.border}` }}>
        <Reveal><DLabel t={t}>Target Sectors</DLabel><h2 style={DH2(t)}>Where Our<br />UAVs Operate</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, marginTop: 50 }}>
          {[
            { icon: "📦", title: "Logistics & Last-Mile", body: "Cost-effective drone delivery in urban and semi-urban areas where conventional logistics face access barriers." },
            { icon: "🚨", title: "Disaster Management", body: "Real-time aerial alerts and emergency supply delivery to affected zones during floods, earthquakes and other disasters." },
            { icon: "🏗️", title: "Construction & Inspection", body: "Aerial monitoring, surveying and inspection of construction sites and infrastructure using custom drone platforms." },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <DSectorCard s={s} t={t} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="traction" style={{ padding: "100px 48px", background: t.bgSection, borderTop: `1px solid ${t.border}` }}>
        <Reveal>
          <DLabel t={t}>Competition Record</DLabel>
          <h2 style={DH2(t)}>Proven on the<br />Global Stage</h2>
          <p style={{ marginTop: 14, fontSize: "1rem", color: t.textMuted, maxWidth: 500 }}>Our engineering team has ranked at the highest levels — validating PrarambhX's technical capabilities on the world stage.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, marginTop: 50 }}>
          {[
            { rank: "#1", color: "#ffd700", label: "All India Rank\nSAE Drone Dev Challenge 2023" },
            { rank: "#1", color: "#ffd700", label: "All India — Technical Presentation\nSAE Drone Dev Challenge 2024" },
            { rank: "#2", color: "#c0c0c0", label: "Global — Drone Design\nSAE Aero Design West, CA 2025" },
            { rank: "#5", color: "#cd7f32", label: "Global — Overall\nSAE Aero Design West, CA 2025" },
          ].map((a, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ padding: "34px 22px", background: t.bgCard, border: `1px solid ${t.border}`, textAlign: "center" }}>
                <div style={{ fontFamily: t.font, fontWeight: 900, fontSize: "3.6rem", color: a.color, lineHeight: 1 }}>{a.rank}</div>
                <div style={{ fontFamily: t.monoFont, fontSize: "0.6rem", letterSpacing: "0.1em", color: t.textMuted, marginTop: 10, whiteSpace: "pre-line", lineHeight: 1.6 }}>{a.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15}>
          <div style={{ marginTop: 28, padding: "20px 26px", background: "rgba(0,212,255,0.05)", border: `1px solid rgba(0,212,255,0.18)`, borderLeft: `4px solid ${t.accent}` }}>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: t.textMuted }}>SkyAlert received prototype development funding from <strong style={{ color: t.accent }}>La Trobe University, Melbourne, Australia</strong> and <strong style={{ color: t.accent }}>PCCOE, Pune</strong>.</p>
          </div>
        </Reveal>
      </section>

      <ContactSection t={t} />
    </>
  );
}

function DLabel({ children, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <span style={{ display: "inline-block", width: 18, height: 1, background: t.accent }} />
      <span style={{ fontFamily: t.monoFont, fontSize: "0.63rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.accent }}>{children}</span>
    </div>
  );
}
function DH2(t) { return { fontFamily: t.font, fontWeight: 800, fontSize: "clamp(30px,5vw,66px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.01em" }; }
function DBtn({ children, href, t }) {
  const [h, setH] = useState(false);
  return <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: h ? "#3a6fff" : t.primary, color: "#fff", fontFamily: t.monoFont, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 26px", textDecoration: "none", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))", transition: "all 0.2s", transform: h ? "translateY(-2px)" : "none" }}>{children}</a>;
}
function DBtnOut({ children, href, t }) {
  const [h, setH] = useState(false);
  return <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid ${h ? t.accent : "rgba(244,246,255,0.28)"}`, color: h ? t.accent : t.text, fontFamily: t.monoFont, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 26px", textDecoration: "none", transition: "all 0.2s" }}>{children}</a>;
}
function DProductCard({ p, t }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "30px 26px", background: h ? "rgba(26,60,255,0.1)" : t.bgCard, border: `1px solid ${h ? t.borderHov : t.border}`, transition: "all 0.25s", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: t.primary, transform: h ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s" }} />
      <div style={{ display: "inline-block", fontFamily: t.monoFont, fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", border: `1px solid ${p.sc}`, color: p.sc, marginBottom: 12, alignSelf: "flex-start" }}>{p.status}</div>
      <div style={{ fontFamily: t.font, fontWeight: 700, fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 9 }}>{p.title}</div>
      <div style={{ fontSize: "0.86rem", lineHeight: 1.65, color: t.textMuted, marginBottom: 18 }}>{p.body}</div>
      <ImgBox label={p.img} height={150} t={t} />
    </div>
  );
}
function DSectorCard({ s, t }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "34px 26px", background: h ? "rgba(26,60,255,0.1)" : t.bgCard, border: `1px solid ${h ? t.borderHov : t.border}`, transition: "all 0.25s", transform: h ? "translateY(-4px)" : "none" }}>
      <div style={{ fontSize: "1.9rem", marginBottom: 12 }}>{s.icon}</div>
      <div style={{ fontFamily: t.font, fontWeight: 700, fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 9 }}>{s.title}</div>
      <div style={{ fontSize: "0.86rem", lineHeight: 1.65, color: t.textMuted }}>{s.body}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   EDTECH SITE
══════════════════════════════════════════ */
function EdTechSite({ t }) {
  const workshops = [
    { emoji: "🔧", title: "Build-a-Drone Workshop", dur: "1 Day", lvl: "Grade 6–12", body: "Students assemble a working quadcopter from parts, learning aerodynamics, electronics and flight physics through hands-on building.", img: "Students Building Drone" },
    { emoji: "🖥️", title: "Drone Programming & Coding", dur: "1–2 Days", lvl: "Grade 8–12", body: "Students code autonomous flight paths, learn sensor integration and basic computer science concepts through drone programming.", img: "Students Coding on Laptop" },
    { emoji: "🚀", title: "STEM Aerospace Module", dur: "Half Day", lvl: "Grade 5–10", body: "Structured curriculum covering physics of flight, UAV history and aeronautical engineering basics — aligned with school syllabi.", img: "STEM Classroom Session" },
    { emoji: "🏫", title: "Drone Innovation Lab Setup", dur: "Annual Program", lvl: "Institution-wide", body: "Turnkey drone lab setup — hardware kits, curriculum, instructor training and annual support. Aligned with national ATL initiatives.", img: "Drone Innovation Lab Setup" },
  ];

  const schools = ["PM SHRI JNV Pune, Maharashtra", "PM SHRI JNV Satara, Maharashtra", "PM SHRI JNV Jalgaon, Maharashtra", "PM SHRI JNV Parbhani, Maharashtra", "PM SHRI JNV South Goa", "PM SHRI JNV Chh. Sambhajinagar, Maharashtra"];

  return (
    <>
      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "160px 48px 80px", background: `linear-gradient(135deg, ${t.bg} 55%, #fff5e8 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 450, height: 450, borderRadius: "50%", background: "rgba(255,107,26,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: "28%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,184,0,0.09)", pointerEvents: "none" }} />
        <div style={{ flex: 1, maxWidth: 560 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,107,26,0.1)", border: `1px solid rgba(255,107,26,0.22)`, borderRadius: 999, padding: "5px 15px", marginBottom: 20 }}>
            <span>✦</span>
            <span style={{ fontFamily: t.monoFont, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.primary }}>UAV Workshops · STEM Programs · School Labs</span>
          </div>
          <h1 style={{ fontFamily: t.font, fontWeight: 900, fontSize: "clamp(48px,8vw,104px)", lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: 22 }}>
            <span style={{ color: t.primary }}>Hands-On</span><br />Drone<br /><span style={{ color: t.accent }}>Education</span>
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.74, color: t.textMuted, maxWidth: 460, marginBottom: 38 }}>
            Making drone education accessible to every student across India — structured UAV workshops and STEM curriculum delivered directly to schools.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <EBtn t={t} href="#products">See Our Workshops →</EBtn>
            <EBtnOut t={t} href="#contact">Book a Workshop</EBtnOut>
          </div>
          <div style={{ display: "flex", gap: 30, marginTop: 48, flexWrap: "wrap" }}>
            {[{ n: "6", l: "Schools Reached" }, { n: "₹2.65L", l: "Revenue Generated" }, { n: "100s", l: "Students Impacted" }].map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: t.font, fontWeight: 900, fontSize: "2.3rem", color: t.primary, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: t.monoFont, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, maxWidth: 340, marginLeft: "auto" }}>
          <ImgBox label="Students Building Drone / Workshop Photo" height={220} t={t} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <ImgBox label="Classroom Session" height={110} t={t} />
            <ImgBox label="School Event" height={110} t={t} />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 48px", borderTop: `1px solid ${t.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <Reveal><ImgBox label="Hands-on Workshop / Students with UAV" height={300} t={t} /></Reveal>
          <Reveal delay={0.15}>
            <ELabel t={t}>Why EdTech?</ELabel>
            <h2 style={EH2(t)}>The Skill Gap<br />We're Closing</h2>
            <p style={{ marginTop: 16, fontSize: "1rem", lineHeight: 1.78, color: t.textMuted }}>India has a massive skill vacuum in UAV development. Practical drone education doesn't exist in schools in any structured, curriculum-aligned form. Under national initiatives like ATL, schools are actively seeking future-ready STEM programs — PrarambhX delivers exactly that.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 26 }}>
              {["Curriculum-aligned workshops", "Hands-on drone building", "DGCA & safety training", "Available PAN India"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(255,107,26,0.06)", borderRadius: 8, border: `1px solid rgba(255,107,26,0.12)`, fontSize: "0.84rem", color: t.text, fontWeight: 600 }}>
                  <span style={{ color: t.primary }}>✓</span>{f}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WORKSHOPS */}
      <section id="products" style={{ padding: "100px 48px", background: t.bgSection, borderTop: `1px solid ${t.border}` }}>
        <Reveal>
          <ELabel t={t}>Our Programs</ELabel>
          <h2 style={EH2(t)}>Workshops &<br />Services</h2>
          <p style={{ marginTop: 14, fontSize: "1rem", color: t.textMuted, maxWidth: 500 }}>Every program is interactive, practical, and aligned with school curricula — no prior drone experience needed.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, marginTop: 50 }}>
          {workshops.map((w, i) => <Reveal key={w.title} delay={i * 0.08}><EWorkshopCard w={w} t={t} /></Reveal>)}
        </div>
      </section>

      {/* STUDENT OUTCOMES */}
      <section style={{ padding: "100px 48px", borderTop: `1px solid ${t.border}` }}>
        <Reveal>
          <ELabel t={t}>Student Outcomes</ELabel>
          <h2 style={EH2(t)}>What Students<br />Take Home</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 50 }}>
          {[
            { icon: "🧠", title: "Technical Proficiency", body: "Real hands-on skills in electronics, programming and aeronautics beyond textbook learning." },
            { icon: "🔬", title: "STEM Career Readiness", body: "Exposure to aerospace engineering, robotics and coding opens high-demand career pathways." },
            { icon: "✈️", title: "Safe Drone Operations", body: "Students learn DGCA regulations and responsible UAV usage from day one." },
            { icon: "💡", title: "Problem-Solving Mindset", body: "Mission-based challenges build critical thinking, teamwork and creative engineering." },
          ].map((o, i) => (
            <Reveal key={o.title} delay={i * 0.08}>
              <div style={{ padding: "26px 20px", background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, textAlign: "center" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 12 }}>{o.icon}</div>
                <div style={{ fontFamily: t.font, fontWeight: 800, fontSize: "1.05rem", marginBottom: 8, color: t.text }}>{o.title}</div>
                <div style={{ fontSize: "0.83rem", lineHeight: 1.65, color: t.textMuted }}>{o.body}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRACTION */}
      <section id="traction" style={{ padding: "100px 48px", background: t.bgSection, borderTop: `1px solid ${t.border}` }}>
        <Reveal>
          <ELabel t={t}>Our Reach</ELabel>
          <h2 style={EH2(t)}>Schools We've<br />Worked With</h2>
          <p style={{ marginTop: 14, fontSize: "1rem", color: t.textMuted, maxWidth: 480 }}>PrarambhX has delivered paid educational programs across 6 Jawahar Navodaya Vidyalayas, generating ₹2,65,854 in EdTech revenue.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginTop: 50, alignItems: "start" }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {schools.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", background: t.bgCard, borderRadius: 10, border: `1px solid ${t.border}`, fontSize: "0.88rem", color: t.text, fontWeight: 500 }}>
                  <div style={{ width: 26, height: 26, background: t.primary, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: t.font, fontWeight: 800, fontSize: "0.88rem", flexShrink: 0 }}>{i + 1}</div>
                  {s}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[{ n: "6", l: "Schools\nServed" }, { n: "₹2.65L", l: "Revenue\nGenerated" }, { n: "100%", l: "Paid\nWorkshops" }, { n: "5+", l: "States\nCovered" }].map((s, i) => (
                <div key={s.n} style={{ padding: "22px 16px", background: i % 2 === 0 ? t.primary : t.bgCard, borderRadius: 12, border: `1px solid ${t.border}`, textAlign: "center" }}>
                  <div style={{ fontFamily: t.font, fontWeight: 900, fontSize: "2.4rem", color: i % 2 === 0 ? "#fff" : t.primary, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: t.monoFont, fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: i % 2 === 0 ? "rgba(255,255,255,0.6)" : t.textMuted, marginTop: 6, whiteSpace: "pre-line", lineHeight: 1.6 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <ImgBox label="Workshop / Event Photo" height={150} t={t} />
          </Reveal>
        </div>
      </section>

      <ContactSection t={t} />
    </>
  );
}

function ELabel({ children, t }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,107,26,0.1)", borderRadius: 999, padding: "4px 14px", marginBottom: 12 }}>
      <span style={{ fontFamily: t.monoFont, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.primary }}>{children}</span>
    </div>
  );
}
function EH2(t) { return { fontFamily: t.font, fontWeight: 900, fontSize: "clamp(28px,4.5vw,60px)", lineHeight: 1, letterSpacing: "-0.01em", color: t.text }; }
function EBtn({ children, href, t }) {
  const [h, setH] = useState(false);
  return <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: h ? "#e85a10" : t.primary, color: "#fff", fontFamily: t.bodyFont, fontSize: "0.88rem", fontWeight: 700, padding: "13px 26px", textDecoration: "none", borderRadius: 999, transition: "all 0.2s", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? "0 8px 24px rgba(255,107,26,0.28)" : "0 2px 8px rgba(255,107,26,0.12)" }}>{children}</a>;
}
function EBtnOut({ children, href, t }) {
  const [h, setH] = useState(false);
  return <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `2px solid ${t.primary}`, color: h ? "#fff" : t.primary, background: h ? t.primary : "transparent", fontFamily: t.bodyFont, fontSize: "0.88rem", fontWeight: 700, padding: "13px 26px", textDecoration: "none", borderRadius: 999, transition: "all 0.2s" }}>{children}</a>;
}
function EWorkshopCard({ w, t }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "26px 24px", background: h ? t.bg : t.bgCard, border: `1px solid ${h ? t.borderHov : t.border}`, borderRadius: 14, transition: "all 0.25s", transform: h ? "translateY(-4px)" : "none", boxShadow: h ? "0 12px 30px rgba(255,107,26,0.09)" : "0 2px 6px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "1.9rem", marginBottom: 10 }}>{w.emoji}</div>
      <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: t.monoFont, fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 9px", border: `1px solid ${t.primary}`, color: t.primary, borderRadius: 999 }}>{w.dur}</span>
        <span style={{ fontFamily: t.monoFont, fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 9px", background: "rgba(255,184,0,0.12)", color: "#a07000", borderRadius: 999 }}>{w.lvl}</span>
      </div>
      <div style={{ fontFamily: t.font, fontWeight: 800, fontSize: "1.25rem", marginBottom: 9, color: t.text }}>{w.title}</div>
      <div style={{ fontSize: "0.85rem", lineHeight: 1.68, color: t.textMuted, marginBottom: 16 }}>{w.body}</div>
      <ImgBox label={w.img} height={130} t={t} />
    </div>
  );
}

/* ── SHARED CONTACT ── */
function ContactSection({ t }) {
  const [form, setForm] = useState({ name: "", org: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const isET = t.isET;

  return (
    <section id="contact" style={{ padding: "100px 48px", borderTop: `1px solid ${t.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
        <Reveal>
          <h2 style={{ fontFamily: t.font, fontWeight: 900, fontSize: "clamp(36px,5.5vw,78px)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: isET ? "none" : "uppercase", marginBottom: 30 }}>
            {isET ? <>Let's Bring<br />Drones to<br /><span style={{ color: t.primary }}>Your School</span></> : <>Let's<br />Build<br /><span style={{ color: t.primary }}>Together</span></>}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {[{ icon: "📞", label: "Phone", value: "+91 9561109023", href: "tel:+919561109023" }, { icon: "🌐", label: "Website", value: "www.prarambhx.com", href: "https://www.prarambhx.com" }, { icon: "📍", label: "Address", value: "H-1309, GK AARCON,\nPunawale - 411033, Pune, MH" }].map(ci => (
              <div key={ci.label} style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
                <div style={{ width: 38, height: 38, background: isET ? "rgba(255,107,26,0.1)" : "rgba(26,60,255,0.14)", border: `1px solid ${t.border}`, borderRadius: isET ? 9 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0 }}>{ci.icon}</div>
                <div>
                  <div style={{ fontFamily: t.monoFont, fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted, marginBottom: 3 }}>{ci.label}</div>
                  {ci.href ? <a href={ci.href} style={{ fontSize: "0.9rem", color: t.text, textDecoration: "none" }}>{ci.value}</a> : <p style={{ fontSize: "0.9rem", color: t.text, whiteSpace: "pre-line" }}>{ci.value}</p>}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          {sent ? (
            <div style={{ padding: "48px 32px", background: isET ? "rgba(255,107,26,0.06)" : "rgba(26,60,255,0.08)", border: `1px solid ${t.border}`, borderRadius: isET ? 18 : 0, textAlign: "center" }}>
              <div style={{ fontSize: "2.8rem", marginBottom: 14 }}>🎉</div>
              <div style={{ fontFamily: t.font, fontWeight: 800, fontSize: "1.5rem", marginBottom: 8 }}>Message Sent!</div>
              <p style={{ color: t.textMuted, fontSize: "0.88rem" }}>We'll get back to you shortly.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 13, background: isET ? t.bgCard : "transparent", padding: isET ? 28 : 0, borderRadius: isET ? 18 : 0, border: isET ? `1px solid ${t.border}` : "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
                {[{ l: "Name", k: "name", p: "Your name" }, { l: "Organisation", k: "org", p: "School / Company" }].map(f => (
                  <CField key={f.k} t={t} label={f.l} value={form[f.k]} onChange={v => setForm({ ...form, [f.k]: v })} placeholder={f.p} />
                ))}
              </div>
              <CField t={t} label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="your@email.com" type="email" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: t.monoFont, fontSize: "0.57rem", letterSpacing: "0.13em", textTransform: "uppercase", color: t.textMuted }}>Message</label>
                <textarea value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} placeholder={isET ? "Tell us about your school and students..." : "Tell us about your requirements..."} rows={4}
                  style={{ background: isET ? t.bg : "rgba(13,26,53,0.85)", border: `1px solid ${t.border}`, color: t.text, fontFamily: t.bodyFont, fontSize: "0.88rem", padding: "11px 13px", outline: "none", resize: "none", borderRadius: isET ? 9 : 0, width: "100%" }} />
              </div>
              {isET
                ? <button onClick={() => form.name && form.email && setSent(true)} style={{ background: t.primary, color: "#fff", fontFamily: t.bodyFont, fontSize: "0.88rem", fontWeight: 700, padding: "13px 26px", border: "none", borderRadius: 999, cursor: "pointer", alignSelf: "flex-start" }}>Book a Workshop →</button>
                : <button onClick={() => form.name && form.email && setSent(true)} style={{ background: t.primary, color: "#fff", fontFamily: t.monoFont, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "13px 26px", border: "none", cursor: "pointer", alignSelf: "flex-start", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>Send Message →</button>
              }
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function CField({ t, label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: t.monoFont, fontSize: "0.57rem", letterSpacing: "0.13em", textTransform: "uppercase", color: t.textMuted }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ background: t.isET ? t.bg : "rgba(13,26,53,0.85)", border: `1px solid ${t.border}`, color: t.text, fontFamily: t.bodyFont, fontSize: "0.88rem", padding: "10px 13px", outline: "none", borderRadius: t.isET ? 9 : 0, width: "100%" }} />
    </div>
  );
}

/* ── FOOTER ── */
function Footer({ t }) {
  return (
    <footer style={{ padding: "28px 48px", borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, background: t.bg }}>
      <div style={{ fontFamily: t.font, fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.04em", color: t.textMuted }}>
        PRARAMBH<span style={{ color: t.primary }}>X</span> Technologies Pvt. Ltd.
      </div>
      <div style={{ fontFamily: t.monoFont, fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, textAlign: "right", lineHeight: 1.9 }}>
        CIN: U62099PN2025PTC248557 · +91 9561109023<br />
        www.prarambhx.com · Punawale, Pune - 411033<br />
        © 2025 PrarambhX Technologies Pvt. Ltd.
      </div>
    </footer>
  );
}

/* ── GLOBAL STYLES ── */
function GlobalStyles({ t }) {
  return (
    <style>{`
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { background: ${t.bg}; color: ${t.text}; font-family: ${t.bodyFont}; overflow-x: hidden; transition: background 0.4s, color 0.4s; }
      body::before {
        content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
        ${t.id === "deeptech"
          ? `background-image: linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px); background-size: 56px 56px;`
          : `background-image: radial-gradient(circle, ${t.gridColor} 1.5px, transparent 1.5px); background-size: 30px 30px;`
        }
      }
      * { position: relative; z-index: 1; }
      input::placeholder, textarea::placeholder { color: ${t.textMuted}; opacity: 0.7; }
      input:focus, textarea:focus { border-color: ${t.primary} !important; outline: none; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: ${t.bg}; }
      ::-webkit-scrollbar-thumb { background: ${t.primary}55; }
    `}</style>
  );
}

/* ── WHOOSH SOUND via Web Audio API (no file needed) ── */
function playWhoosh(toEdtech) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Whoosh = filtered white noise swept with a gain envelope
    const bufSize  = ctx.sampleRate * 0.35;
    const buffer   = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data     = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter — sweeps pitch to feel like direction
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    // DeepTech → EdTech: sweep up (higher freq = lighter/warmer)
    // EdTech → DeepTech: sweep down (lower freq = heavier/darker)
    filter.frequency.setValueAtTime(toEdtech ? 280 : 900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(toEdtech ? 1800 : 180, ctx.currentTime + 0.32);

    // Gain envelope: fast attack, smooth decay
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.34);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.36);

    // Cleanup context after sound ends
    setTimeout(() => ctx.close(), 500);
  } catch (e) {
    // Silently fail if audio not available
  }
}

/* ══════════════════════════════════════════
   APP
══════════════════════════════════════════ */
export default function App() {
  const [themeId, setThemeId] = useState("deeptech");
  const [fading,  setFading]  = useState(false);
  const t = THEMES[themeId];

  const switchTheme = (id) => {
    if (id === themeId) return;

    // Play directional whoosh immediately on click
    playWhoosh(id === "edtech");

    // Simple fade out → swap → fade in
    setFading(true);
    setTimeout(() => {
      setThemeId(id);
      window.scrollTo({ top: 0 });
      // Small tick to let new theme render before fading back in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFading(false));
      });
    }, 280);
  };

  return (
    <>
      <FontLoader />
      <GlobalStyles t={t} />
      <Nav t={t} onSwitch={switchTheme} />
      <div style={{
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 0.28s ease" : "opacity 0.38s ease",
        willChange: "opacity",
      }}>
        <main style={{ paddingTop: 140 }}>
          {themeId === "deeptech" ? <DeepTechSite t={t} /> : <EdTechSite t={t} />}
        </main>
        <Footer t={t} />
      </div>
    </>
  );
}
