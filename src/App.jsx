import { useState, useRef, useCallback, useEffect } from "react";
import headshotImg from "./headshot.jpeg";
import { haptic, attachIosHaptic, hapticTick } from "./haptic";

const MENU_ITEMS = [
  { id: "now-playing", label: "Now Playing", preview: "🎵" },
  { id: "resume", label: "Resume", preview: "📄" },
  { id: "projects", label: "Projects", preview: "🚀" },
  { id: "content", label: "Content", preview: "✍️" },
  { id: "experience", label: "Experience", preview: "💼" },
  { id: "contact", label: "Contact", preview: "📬" },
];

const PROJECTS = [
  { name: "Appeal IQ", role: "Founder", description: "Local-first property-tax appeal OS for advisory firms. County research, scoring, briefs. Sold inside consulting, not public download.", status: "Live", url: "https://appealiq.org" },
  { name: "Steadfast Growth", role: "Founder", description: "Private office AI; Steadfast Local = one machine, imaged/wired, you own it.", status: "Active", url: "https://steadfastgrowth.io" },
  { name: "Open Tool Cafe", role: "Builder", description: "Share and download open source tools. Connect with other founders and builders. Enjoy some java.", status: "Live", url: "https://opentool.cafe" },
  { name: "Fractional GTM", role: "Operator", description: "Full-cycle outbound + close, Clay-native.", status: "Recent" },
  { name: "Custom AI Builds", role: "Builder", description: "Lead gen, automation, dashboards when the problem is real and repeatable.", status: "Ongoing" },
];

const PODCASTS = [
  { name: "Playing it Forward Coaching", url: "https://www.youtube.com/watch?v=UjxNjEdHkqI&t=577s" },
  { name: "Beyond Pipeline", url: "https://www.youtube.com/watch?v=FvZBs5wOgYk&t=47s" },
  { name: "What the Heck is Tech Sales", url: "https://www.youtube.com/watch?v=lLTotSPyjvY&t=2363s" },
  { name: "Outbound Kitchen Sales Podcast", url: "https://www.youtube.com/watch?v=pn9mpI60nuQ&t=219s" },
  { name: "Career Bound by Praxis (Ep 12-27)", url: "https://www.youtube.com/watch?v=CuarA5lzMB4&list=PLV59VC43BAzsgKF77LYDRG7SFTHpsSUQ0&index=12" },
  { name: "Fresh Wave Podcast (S1, Ep 3)", url: "https://www.youtube.com/watch?v=UBJ8rhXlAtE" },
  { name: "Fresh Wave Podcast (S1, Ep 13)", url: "https://www.youtube.com/watch?v=kKxcJzQjwNo&t=273s" },
];

const EXPERIENCE = [
  { company: "Steadfast Growth / Appeal IQ", title: "Founder", period: "2025–Present", highlights: ["Built and sell Appeal IQ — local-first property-tax appeal OS for advisory firms", "Steadfast Local: one machine, imaged and wired, you own it", "Founder sales into tax shops"] },
  { company: "Fractional GTM", title: "Contract", period: "2025–2026", highlights: ["Full-cycle outbound + close", "Clay-native"] },
  { company: "Praxis Careers", title: "Full-Cycle AE / Business Development Manager", period: "May 2025 – Aug 2026", highlights: ["Closed 36 partner deals in under 6 months", "$175k+ in potential job placements generated", "Built an entire hiring partner network from scratch", "Managed 1 BDR intern"] },
  { company: "Praxis Careers", title: "Admissions Lead", period: "May 2024 – April 2025", highlights: ["$2.4M in pipeline generated", "$420k+ in revenue closed", "20+ monthly screening calls (inbound & outbound)"] },
  { company: "Fourth / HotSchedules", title: "Sales Development Rep", period: "Nov 2023 – May 2024", highlights: ["120% avg quota attainment (246% in ramp month)", "$600k+ in qualified pipeline", "Team records: 6 meetings in a day, 11 in a week", "Built cadences used by entire Mid-Market segment"] },
  { company: "Power Locker", title: "Operations Manager (Employee #5)", period: "Nov 2021 – June 2023", highlights: ["$150k+ in direct sales & investment revenue", "Managed vending fleets across U.S. and Canada"] },
];

const themes = {
  light: {
    bg: "#e5e1db",
    ipodBody: "linear-gradient(180deg, #d9d9d9 0%, #cccccc 30%, #c0c0c0 70%, #b3b3b3 100%)",
    ipodBorder: "#aaa",
    ipodShadow: "0 20px 60px rgba(0,0,0,0.25), 0 6px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
    screenBg: "#cdd8e4",
    screenBorder: "#7a8a9a",
    headerBg: "linear-gradient(180deg, #919fae 0%, #6e7f90 100%)",
    headerText: "#fff",
    menuText: "#1a1a2e",
    menuBg: "linear-gradient(180deg, #d4dde8 0%, #c8d2df 100%)",
    menuHighlight: "linear-gradient(180deg, #4a8df5 0%, #2a6dd5 100%)",
    menuHighlightText: "#fff",
    menuDivider: "#b8c4d0",
    previewBg: "#bcc8d6",
    wheelBg: "linear-gradient(145deg, #ddd 0%, #ccc 40%, #bbb 100%)",
    wheelCenter: "linear-gradient(145deg, #f0f0f0 0%, #ddd 100%)",
    wheelText: "#888",
    wheelShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
    wheelCenterShadow: "0 3px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
    pageBg: "linear-gradient(180deg, #e0e8f2 0%, #d0daea 50%, #c4d0e0 100%)",
    pageHeaderBg: "linear-gradient(180deg, #919fae 0%, #6e7f90 100%)",
    pageHeaderText: "#fff",
    pageText: "#1a1a2e",
    pageSecondary: "#506070",
    pageAccent: "#2a6dd5",
    pageCard: "rgba(255,255,255,0.65)",
    pageCardBorder: "rgba(255,255,255,0.8)",
    pageCardShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
    pageTag: "rgba(42,109,213,0.1)",
    pageTagText: "#2a6dd5",
    pageDivider: "rgba(106,122,138,0.15)",
    modeToggle: "#506070",
  },
  dark: {
    bg: "#0c0c0c",
    ipodBody: "linear-gradient(180deg, #222 0%, #1a1a1a 30%, #141414 70%, #0e0e0e 100%)",
    ipodBorder: "#333",
    ipodShadow: "0 20px 60px rgba(0,0,0,0.6), 0 6px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)",
    screenBg: "#182030",
    screenBorder: "#2a3848",
    headerBg: "linear-gradient(180deg, #2e3e50 0%, #1e2e40 100%)",
    headerText: "#c0ccd8",
    menuText: "#c0ccd8",
    menuBg: "linear-gradient(180deg, #1a2435 0%, #15202e 100%)",
    menuHighlight: "linear-gradient(180deg, #3a7de5 0%, #1a5dc5 100%)",
    menuHighlightText: "#fff",
    menuDivider: "#253548",
    previewBg: "#152030",
    wheelBg: "linear-gradient(145deg, #252525 0%, #1a1a1a 40%, #111 100%)",
    wheelCenter: "linear-gradient(145deg, #2e2e2e 0%, #1e1e1e 100%)",
    wheelText: "#555",
    wheelShadow: "inset 0 2px 8px rgba(0,0,0,0.35)",
    wheelCenterShadow: "0 3px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
    pageBg: "linear-gradient(180deg, #121a28 0%, #0e1620 50%, #0a1018 100%)",
    pageHeaderBg: "linear-gradient(180deg, #2e3e50 0%, #1e2e40 100%)",
    pageHeaderText: "#c0ccd8",
    pageText: "#d4dce8",
    pageSecondary: "#8898aa",
    pageAccent: "#5a9cf5",
    pageCard: "rgba(22,32,48,0.7)",
    pageCardBorder: "rgba(50,65,85,0.5)",
    pageCardShadow: "0 2px 12px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)",
    pageTag: "rgba(90,156,245,0.12)",
    pageTagText: "#5a9cf5",
    pageDivider: "rgba(50,65,85,0.3)",
    modeToggle: "#8898aa",
  },
};

function GlassCard({ theme, children, style, href }) {
  const base = { background: theme.pageCard, border: `1px solid ${theme.pageCardBorder}`, borderRadius: 14, padding: "18px 20px", backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)", boxShadow: theme.pageCardShadow, transition: "all 0.2s ease", ...style };
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{ ...base, textDecoration: "none", color: "inherit", display: "block" }}>{children}</a>;
  return <div style={base}>{children}</div>;
}

function Tag({ theme, children }) {
  return <span style={{ background: theme.pageTag, color: theme.pageTagText, fontSize: 10, padding: "4px 12px", borderRadius: 20, fontWeight: 700, letterSpacing: 0.8, fontFamily: "'SF Mono', 'Fira Code', monospace", textTransform: "uppercase" }}>{children}</span>;
}

function Headshot({ size = 110, style = {} }) {
  return <img src={headshotImg} alt="John P. Ciannello" style={{ width: size, height: size, objectFit: "cover", ...style }} />;
}

function PageWrapper({ theme, title, onBack, onToggle, mode, isMobile, children }) {
  const isLight = mode === "light";
  const desktopBg = isLight
    ? "linear-gradient(160deg, #6e9bc4 0%, #4d7da8 45%, #2f5a85 100%)"
    : "linear-gradient(160deg, #0a121f 0%, #111c2e 50%, #0a1018 100%)";
  const menuBarBg = isLight
    ? "linear-gradient(180deg, rgba(248,248,248,0.92) 0%, rgba(225,225,225,0.92) 100%)"
    : "linear-gradient(180deg, rgba(48,48,52,0.92) 0%, rgba(28,28,32,0.92) 100%)";
  const menuText = isLight ? "#1c1c1c" : "#e8e8e8";
  const windowBorder = isLight ? "#7e7e7e" : "#000";
  const titleBarBg = isLight
    ? "linear-gradient(180deg, #f0f0f0 0%, #d1d1d1 100%)"
    : "linear-gradient(180deg, #3a3d44 0%, #25282e 100%)";
  const titleBarBorder = isLight ? "#9a9a9a" : "#0a0a0a";
  const titleBarText = isLight ? "#2a2a2a" : "#d8d8d8";
  const contentBg = theme.pageBg;
  const [hoverClose, setHoverClose] = useState(false);
  const clockLabel = (() => { try { return new Date().toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" }); } catch(e) { return ""; } })();

  return (
    <div style={{ height: "100%", maxHeight: "100vh", background: desktopBg, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: 24, background: menuBarBg, backdropFilter: "blur(14px) saturate(1.4)", WebkitBackdropFilter: "blur(14px) saturate(1.4)", display: "flex", alignItems: "center", padding: "0 14px", color: menuText, gap: isMobile ? 12 : 18, flexShrink: 0, boxShadow: "0 1px 0 rgba(0,0,0,0.15)", zIndex: 60 }}>
        <span style={{ fontSize: 13, lineHeight: 1, transform: "translateY(-1px)" }}>🍎</span>
        <span style={{ fontWeight: 700, fontSize: 13 }}>PortfolioOS</span>
        {!isMobile && ["File", "Edit", "View", "Window", "Help"].map(m => <span key={m} style={{ fontSize: 13, opacity: 0.85 }}>{m}</span>)}
        <span style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
          <button onClick={onToggle} title="Toggle light/dark" style={{ background: "none", border: "none", color: menuText, fontSize: 13, cursor: "pointer", padding: 0, lineHeight: 1 }}>{isLight ? "◐" : "◑"}</button>
          <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{clockLabel}</span>
        </span>
      </div>
      <div style={{ flex: 1, padding: isMobile ? "12px 10px 18px" : "28px 32px 40px", display: "flex", justifyContent: "center", minHeight: 0 }}>
        <div style={{ background: contentBg, borderRadius: isMobile ? 8 : 10, border: `1px solid ${windowBorder}`, boxShadow: "0 18px 60px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25)", width: "100%", maxWidth: 960, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ background: titleBarBg, padding: isMobile ? "6px 10px" : "8px 14px", display: "flex", alignItems: "center", position: "relative", borderBottom: `1px solid ${titleBarBorder}`, flexShrink: 0, minHeight: 22 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={onBack} onMouseEnter={() => setHoverClose(true)} onMouseLeave={() => setHoverClose(false)} title="Close" aria-label="Close" style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", border: "1px solid #e0443e", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(80,0,0,0.7)", fontSize: 9, fontWeight: 900, lineHeight: 1 }}>{hoverClose ? "×" : ""}</button>
              <span title="Minimize" style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", border: "1px solid #d89c1e" }} />
              <span title="Zoom" style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", border: "1px solid #1aa036" }} />
            </div>
            <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 13, fontWeight: 600, color: titleBarText, pointerEvents: "none", letterSpacing: 0.2 }}>{title}</span>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: isMobile ? "26px 18px 36px" : "40px 52px 56px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NowPlayingContent({ theme, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <div style={{ width: 110, height: 110, borderRadius: "50%", overflow: "hidden", border: `3px solid ${theme.pageCardBorder}`, boxShadow: theme.pageCardShadow }}>
        <Headshot size={110} style={{ borderRadius: "50%" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, color: theme.pageText, letterSpacing: -0.5, marginBottom: 8 }}>John P. Ciannello</div>
        <div style={{ fontSize: 15, color: theme.pageSecondary, lineHeight: 1.7, marginBottom: 6 }}>Builder. Seller. Follower of Christ.</div>
        <div style={{ fontSize: 13, color: theme.pageAccent, fontWeight: 600 }}>Nashville · Founder (AppealIQ / Steadfast) · Full-cycle GTM</div>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
        {[
          { emoji: "🏢", name: "Appeal IQ", sub: "Local-first tax appeal OS", url: "https://appealiq.org" },
          { emoji: "🤖", name: "Steadfast Growth", sub: "Private office AI", url: "https://steadfastgrowth.io" },
        ].map((item, i) => (
          <GlassCard key={i} theme={theme} href={item.url} style={{ flex: "1 1 200px", maxWidth: 260, padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{item.emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.pageText, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: theme.pageSecondary }}>{item.sub}</div>
          </GlassCard>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%" }}>
        {[{ n: "$3M+", l: "Pipeline" }, { n: "$600k+", l: "Closed" }, { n: "120%", l: "Quota" }].map((s, i) => (
          <GlassCard key={i} theme={theme} style={{ textAlign: "center", padding: "20px 12px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.pageAccent, fontFamily: "'SF Mono', monospace", letterSpacing: -1 }}>{s.n}</div>
            <div style={{ fontSize: 10, color: theme.pageSecondary, marginTop: 5, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "monospace" }}>{s.l}</div>
          </GlassCard>
        ))}
      </div>
      <GlassCard theme={theme} style={{ width: "100%", padding: 24 }}>
        <div style={{ fontSize: 14, lineHeight: 1.9, color: theme.pageText }}>
          <p>I sell and I ship. Phones, email, demos, outbound, partner networks — then I build the system so it keeps running.</p>
          <p style={{ marginTop: 14 }}>Fractional GTM. Career totals: $3M+ pipeline, $600k+ closed, 120% quota at Fourth.</p>
          <p style={{ marginTop: 14 }}>Remote from Nashville. Open to a founding AE / early GTM seat (equity + side clients OK) while still building with select firms.</p>
          <p style={{ marginTop: 14 }}>If you can't tell, I like building things. Give me a problem and I'll find a way to make it work.</p>
        </div>
      </GlassCard>
      <div style={{ display: "flex", gap: 12, width: "100%", flexDirection: isMobile ? "column" : "row" }}>
        {[
          { emoji: "📅", label: "Free Intro Call", sub: "30 min · no pitch, no pressure", cta: "Book Now ↗", url: "https://calendly.com/john-steadfastgrowth/30min" },
          { emoji: "📄", label: "Resume", sub: "One page · view only", cta: "View ↗", url: "/resume.html" },
        ].map((cal, i) => (
          <GlassCard key={i} theme={theme} href={cal.url} style={{ flex: 1, textAlign: "center", padding: "22px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{cal.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.pageText, marginBottom: 3 }}>{cal.label}</div>
            <div style={{ fontSize: 12, color: theme.pageSecondary, marginBottom: 10 }}>{cal.sub}</div>
            <div style={{ fontSize: 11, color: theme.pageAccent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{cal.cta}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ProjectsContent({ theme, isMobile }) {
  return (
    <div>
      <div style={{ fontSize: 14, color: theme.pageSecondary, marginBottom: 24 }}>Things I'm building.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {PROJECTS.map((p, i) => (
          <GlassCard key={i} theme={theme} href={p.url} style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.pageText }}>{p.name} {p.url && <span style={{ fontSize: 11, color: theme.pageAccent }}>↗</span>}</div>
              <Tag theme={theme}>{p.status}</Tag>
            </div>
            <div style={{ fontSize: 12, color: theme.pageAccent, fontWeight: 600, marginBottom: 12, letterSpacing: 0.3 }}>{p.role}</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: theme.pageSecondary }}>{p.description}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ContentContent({ theme, isMobile }) {
  return (
    <div>
      <div style={{ fontSize: 14, color: theme.pageSecondary, marginBottom: 24 }}>Writing, podcast appearances, and more.</div>
      <GlassCard theme={theme} style={{ marginBottom: 24, padding: 22 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: theme.pageText, marginBottom: 16 }}>✍️ Writing</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Blog", sub: "jpcblogs.com", url: "https://jpcblogs.com" },
            { label: "Newsletter", sub: "Made to Build", url: "https://made2build.substack.com/" },
            { label: "X", sub: "@johnciannello", url: "https://x.com/johnciannello" },
            { label: "LinkedIn", sub: "/in/johnciannello", url: "https://www.linkedin.com/in/johnciannello/" },
          ].map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: theme.pageAccent, textDecoration: "none", fontSize: 13, fontWeight: 500, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: theme.pageTag }}>
              <span>{l.label} <span style={{ color: theme.pageSecondary, fontWeight: 400 }}>— {l.sub}</span></span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>↗</span>
            </a>
          ))}
        </div>
      </GlassCard>
      <div style={{ fontSize: 15, fontWeight: 700, color: theme.pageText, marginBottom: 14 }}>🎙️ Podcast Appearances</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PODCASTS.map((pod, i) => (
          <GlassCard key={i} theme={theme} href={pod.url} style={{ padding: "14px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: theme.pageText }}>{pod.name}</div>
              <div style={{ fontSize: 11, color: theme.pageAccent, fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>▶ ↗</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ExperienceContent({ theme, isMobile }) {
  return (
    <div>
      <div style={{ fontSize: 14, color: theme.pageSecondary, marginBottom: 24 }}>Where I've been and what I've done.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {EXPERIENCE.map((exp, i) => (
          <GlassCard key={i} theme={theme} style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: 6, marginBottom: 6 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.pageText }}>{exp.company}</div>
              <Tag theme={theme}>{exp.period}</Tag>
            </div>
            <div style={{ fontSize: 12, color: theme.pageAccent, fontWeight: 600, marginBottom: 14, letterSpacing: 0.3 }}>{exp.title}</div>
            {exp.highlights.map((h, j) => (
              <div key={j} style={{ fontSize: 13, color: theme.pageSecondary, lineHeight: 1.7, paddingLeft: 14, position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 0, color: theme.pageAccent, fontWeight: 700 }}>·</span>{h}
              </div>
            ))}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ResumeContent() {
  return (
    <div style={{ margin: "0 -8px", minHeight: "70vh" }}>
      <iframe src="/resume.html?embed=1" title="John P. Ciannello resume" style={{ width: "100%", height: "calc(100vh - 110px)", minHeight: 560, border: 0, borderRadius: 8, background: "#d8e0ea" }} />
    </div>
  );
}

function ContactContent({ theme, isMobile }) {
  return (
    <div>
      <div style={{ fontSize: 14, color: theme.pageSecondary, marginBottom: 24 }}>Open to remote founding AE / fractional GTM. Building with select clients on the side.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {[
          { icon: "🌐", label: "Steadfast Growth", value: "steadfastgrowth.io", href: "https://steadfastgrowth.io" },
          { icon: "🏢", label: "Appeal IQ", value: "appealiq.org", href: "https://appealiq.org" },
          { icon: "📄", label: "Resume", value: "johnciannello.com/resume", href: "/resume.html" },
          { icon: "🐙", label: "GitHub", value: "/steadfastgrowth", href: "https://github.com/steadfastgrowth" },
          { icon: "📧", label: "Email", value: "john@steadfastgrowth.io", href: "mailto:john@steadfastgrowth.io" },
          { icon: "𝕏", label: "X", value: "@johnciannello", href: "https://x.com/johnciannello" },
          { icon: "💼", label: "LinkedIn", value: "/in/johnciannello", href: "https://www.linkedin.com/in/johnciannello/" },
        ].map((c, i) => (
          <GlassCard key={i} theme={theme} href={c.href} style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.pageText }}>{c.label}</div>
                <div style={{ fontSize: 12, color: theme.pageSecondary }}>{c.value}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      <div style={{ height: 1, background: theme.pageDivider, marginBottom: 24 }} />
      <div style={{ fontSize: 15, fontWeight: 700, color: theme.pageText, marginBottom: 16 }}>📅 Book a Call</div>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
        {[
          { label: "Free Intro Call", url: "https://calendly.com/john-steadfastgrowth/30min" },
        ].map((cal, i) => (
          <GlassCard key={i} theme={theme} href={cal.url} style={{ flex: 1, textAlign: "center", padding: "24px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.pageText, marginBottom: 4 }}>{cal.label}</div>
            <div style={{ fontSize: 12, color: theme.pageSecondary, marginBottom: 12 }}>30 min · no pitch, no pressure</div>
            <div style={{ fontSize: 11, color: theme.pageAccent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Book Now ↗</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

const CONTENT_MAP = { "now-playing": NowPlayingContent, resume: ResumeContent, projects: ProjectsContent, content: ContentContent, experience: ExperienceContent, contact: ContactContent };

function IPodScreen({ theme, selectedIndex }) {
  return (
    <div style={{ width: "100%", height: 180, background: theme.screenBg, borderRadius: 6, overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)", border: `1.5px solid ${theme.screenBorder}`, display: "flex", flexDirection: "column", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ background: theme.headerBg, padding: "3px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 600, color: theme.headerText, flexShrink: 0, minHeight: 20 }}>
        <span>PortfolioPod</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 7 }}>▶</span>
          <div style={{ width: 20, height: 8, border: `1px solid ${theme.headerText}`, borderRadius: 2, display: "flex", alignItems: "center", padding: "0 1px", gap: 0.5 }}>
            {[1, 1, 1, 0.3].map((o, i) => <div key={i} style={{ flex: 1, height: 4, background: theme.headerText, borderRadius: 0.5, opacity: o }} />)}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: theme.menuBg, overflow: "hidden" }}>
          {MENU_ITEMS.map((item, i) => (
            <div key={item.id} style={{ padding: "0 10px", height: 25, minHeight: 25, maxHeight: 25, fontSize: 11, fontWeight: i === selectedIndex ? 700 : 400, color: i === selectedIndex ? theme.menuHighlightText : theme.menuText, background: i === selectedIndex ? theme.menuHighlight : "transparent", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < MENU_ITEMS.length - 1 ? `0.5px solid ${theme.menuDivider}` : "none", flexShrink: 0, boxSizing: "border-box" }}>
              <span>{item.label}</span>
              <span style={{ fontSize: 9, opacity: 0.6 }}>›</span>
            </div>
          ))}
        </div>
        <div style={{ width: "38%", background: theme.previewBg, borderLeft: `0.5px solid ${theme.menuDivider}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 36, transition: "all 0.15s ease", fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" }}>{MENU_ITEMS[selectedIndex].preview}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("light");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openSection, setOpenSection] = useState(null);
  const [zoomPhase, setZoomPhase] = useState("idle");
  const [isMobile, setIsMobile] = useState(false);
  const wheelRef = useRef(null);
  const centerRef = useRef(null);
  const lastAngleRef = useRef(null);
  const accumulatorRef = useRef(0);
  const isTrackingRef = useRef(false);
  const theme = themes[mode];

  useEffect(() => { const c = () => setIsMobile(window.innerWidth < 640); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);
  useEffect(() => attachIosHaptic(wheelRef.current, { touchAction: "none", mark: "data-haptic-ring" }), []);
  useEffect(() => attachIosHaptic(centerRef.current, { mark: "data-haptic-center" }), []);

  const getAngle = useCallback((x, y) => { if (!wheelRef.current) return 0; const r = wheelRef.current.getBoundingClientRect(); return Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2)) * (180 / Math.PI); }, []);
  const handleWheelStart = useCallback((x, y) => { if (openSection || zoomPhase !== "idle") return; lastAngleRef.current = getAngle(x, y); accumulatorRef.current = 0; isTrackingRef.current = true; }, [getAngle, openSection, zoomPhase]);
  const handleWheelMove = useCallback((x, y) => {
    if (!isTrackingRef.current || openSection || zoomPhase !== "idle") return;
    const a = getAngle(x, y); let d = a - lastAngleRef.current;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    accumulatorRef.current += d; lastAngleRef.current = a;
    if (accumulatorRef.current > 28) { setSelectedIndex(p => Math.min(p + 1, MENU_ITEMS.length - 1)); accumulatorRef.current = 0; hapticTick(wheelRef.current); }
    else if (accumulatorRef.current < -28) { setSelectedIndex(p => Math.max(p - 1, 0)); accumulatorRef.current = 0; hapticTick(wheelRef.current); }
  }, [getAngle, openSection, zoomPhase]);
  const handleWheelEnd = useCallback(() => { isTrackingRef.current = false; lastAngleRef.current = null; }, []);

  useEffect(() => { const up = () => handleWheelEnd(); const mv = (e) => handleWheelMove(e.clientX, e.clientY); window.addEventListener("mouseup", up); window.addEventListener("mousemove", mv); return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", mv); }; }, [handleWheelEnd, handleWheelMove]);

  const handleSelect = () => { if (openSection || zoomPhase !== "idle") return; setOpenSection(MENU_ITEMS[selectedIndex].id); haptic(15); setZoomPhase("zooming"); setTimeout(() => setZoomPhase("open"), 400); };
  const handleBack = () => { haptic(10); setZoomPhase("closing"); setTimeout(() => { setZoomPhase("idle"); setOpenSection(null); }, 350); };

  useEffect(() => {
    const h = (e) => {
      if (openSection && zoomPhase === "open") { if (e.key === "Escape") { e.preventDefault(); handleBack(); } return; }
      if (zoomPhase !== "idle") return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(p => Math.min(p + 1, MENU_ITEMS.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(p => Math.max(p - 1, 0)); }
      if (e.key === "Enter") handleSelect();
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [openSection, selectedIndex, zoomPhase]);

  const toggleMode = () => setMode(m => m === "light" ? "dark" : "light");
  const ContentComponent = openSection ? CONTENT_MAP[openSection] : null;
  const sectionTitle = openSection ? MENU_ITEMS.find(m => m.id === openSection)?.label || "" : "";
  const ipodW = isMobile ? Math.min(300, typeof window !== "undefined" ? window.innerWidth * 0.85 : 300) : 320;

  const ipodContainerStyle = (() => {
    const base = { display: "flex", flexDirection: "column", alignItems: "center", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" };
    if (zoomPhase === "idle") return { ...base, transform: "scale(1)", opacity: 1, pointerEvents: "auto" };
    if (zoomPhase === "zooming") return { ...base, transform: "scale(1.03)", opacity: 0, pointerEvents: "none" };
    if (zoomPhase === "open") return { ...base, opacity: 0, pointerEvents: "none", position: "absolute" };
    if (zoomPhase === "closing") return { ...base, transform: "scale(1)", opacity: 1, pointerEvents: "none" };
    return base;
  })();

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", transition: "background 0.6s ease", position: "relative", overflow: "hidden" }}>
      <style>{`@keyframes contentIn { from { opacity: 0; } to { opacity: 1; } } @keyframes contentOut { from { opacity: 1; } to { opacity: 0; } } * { box-sizing: border-box; } body { margin: 0; }`}</style>

      {zoomPhase === "idle" && !openSection && (
        <button onClick={toggleMode} style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, background: "rgba(128,128,128,0.12)", border: `1px solid ${theme.modeToggle}30`, borderRadius: 20, padding: "6px 14px", color: theme.modeToggle, fontSize: 11, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
          {mode === "light" ? "● DARK" : "○ LIGHT"}
        </button>
      )}

      <div style={ipodContainerStyle}>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, letterSpacing: -0.5, color: mode === "light" ? "#1a1a1a" : "#e0e0e0" }}>John P. Ciannello</div>
        </div>
        <div style={{ width: ipodW, background: theme.ipodBody, borderRadius: 24, padding: isMobile ? "16px 14px" : "20px 18px", boxShadow: theme.ipodShadow, border: `1px solid ${theme.ipodBorder}`, display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 12 : 16 }}>
          <IPodScreen theme={theme} selectedIndex={selectedIndex} />
          <div ref={wheelRef} style={{ width: isMobile ? Math.min(185, ipodW * 0.63) : 205, height: isMobile ? Math.min(185, ipodW * 0.63) : 205, borderRadius: "50%", background: theme.wheelBg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer", boxShadow: theme.wheelShadow, userSelect: "none", WebkitUserSelect: "none", touchAction: "none" }}
            onMouseDown={e => handleWheelStart(e.clientX, e.clientY)}
            onTouchStart={e => { const t = e.touches[0]; handleWheelStart(t.clientX, t.clientY); }}
            onTouchMove={e => { e.preventDefault(); const t = e.touches[0]; handleWheelMove(t.clientX, t.clientY); }}
            onTouchEnd={() => handleWheelEnd()}>
            <span style={{ position: "absolute", top: 14, fontSize: 9, fontWeight: 600, color: theme.wheelText, letterSpacing: 1.5 }}>MENU</span>
            <span style={{ position: "absolute", bottom: 14, fontSize: 8, color: theme.wheelText, letterSpacing: 1 }}>▶︎❙❙</span>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 8, color: theme.wheelText }}>◂◂</span>
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 8, color: theme.wheelText }}>▸▸</span>
            <div ref={centerRef} onClick={e => { e.stopPropagation(); handleSelect(); }}
              style={{ width: isMobile ? Math.min(66, ipodW * 0.22) : 74, height: isMobile ? Math.min(66, ipodW * 0.22) : 74, borderRadius: "50%", background: theme.wheelCenter, boxShadow: theme.wheelCenterShadow, zIndex: 2, cursor: "pointer", transition: "transform 0.1s", position: "relative" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(0.96)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
          </div>
        </div>
        <div style={{ marginTop: 18, fontSize: 10, fontFamily: "monospace", color: mode === "light" ? "#888" : "#666", letterSpacing: 1.5, opacity: 0.5, textAlign: "center" }}>
          {isMobile ? "DRAG THE WHEEL TO SCROLL · TAP CENTER TO SELECT" : "DRAG THE WHEEL TO SCROLL · CLICK CENTER TO SELECT · ↑↓ ENTER"}
        </div>
      </div>

      {openSection && zoomPhase === "open" && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, overflow: "hidden", animation: "contentIn 0.25s ease forwards" }}>
          <PageWrapper theme={theme} title={sectionTitle} onBack={handleBack} onToggle={toggleMode} mode={mode} isMobile={isMobile}>
            {ContentComponent && <ContentComponent theme={theme} isMobile={isMobile} />}
          </PageWrapper>
        </div>
      )}

      {openSection && zoomPhase === "closing" && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, overflow: "hidden", animation: "contentOut 0.2s ease forwards", pointerEvents: "none" }}>
          <PageWrapper theme={theme} title={sectionTitle} onBack={() => {}} onToggle={() => {}} mode={mode} isMobile={isMobile}>
            {ContentComponent && <ContentComponent theme={theme} isMobile={isMobile} />}
          </PageWrapper>
        </div>
      )}
    </div>
  );
}
