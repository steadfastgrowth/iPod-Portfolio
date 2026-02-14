import { useState, useRef, useCallback, useEffect } from "react";
import headshotImg from "./headshot.jpeg";

const MENU_ITEMS = [
  { id: "now-playing", label: "Now Playing", preview: "🎵" },
  { id: "about", label: "About", preview: "👤" },
  { id: "projects", label: "Projects", preview: "🚀" },
  { id: "content", label: "Content", preview: "✍️" },
  { id: "experience", label: "Experience", preview: "💼" },
  { id: "contact", label: "Contact", preview: "📬" },
];

const PROJECTS = [
  { name: "Steadfast Growth LLC", role: "Founder & Lead Sales Guy", description: "Revenue strategy and fractional AE services for businesses that need help generating revenue.", status: "Active" },
  { name: "Sales Rep Cards", role: "Founder", description: "A collectible trading card platform for sales professionals. Think Topps, but for closers.", status: "Coming Soon" },
  { name: "Vibe Coding", role: "Builder", description: "I build apps, tools, and automations by collaborating with AI. From Chrome extensions to full web apps — if I can dream it, I can ship it.", status: "Ongoing" },
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
  { company: "Praxis Careers", title: "Full-Cycle AE / Business Development Manager", period: "May 2025 – Present", highlights: ["Closed 36 partner deals in under 6 months", "$175k+ in potential job placements generated", "Built an entire hiring partner network from scratch", "Managed 1 BDR intern"] },
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
  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: theme.pageHeaderBg, padding: "0 16px", height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 6px rgba(0,0,0,0.2)", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: theme.pageHeaderText, fontSize: 14, cursor: "pointer", fontWeight: 500, opacity: 0.9, fontFamily: "inherit", padding: 0 }}>‹ Menu</button>
        <span style={{ fontSize: 14, fontWeight: 700, color: theme.pageHeaderText, letterSpacing: 0.3 }}>{title}</span>
        <button onClick={onToggle} style={{ background: "none", border: "none", color: theme.pageHeaderText, fontSize: 14, cursor: "pointer", opacity: 0.7, fontFamily: "monospace", padding: 0 }}>{mode === "light" ? "●" : "○"}</button>
      </div>
      <div style={{ flex: 1, maxWidth: 640, width: "100%", margin: "0 auto", padding: isMobile ? "28px 16px 48px" : "36px 28px 64px" }}>{children}</div>
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
        <div style={{ fontSize: 13, color: theme.pageAccent, fontWeight: 600 }}>Founder @ Steadfast Growth · BDM @ Praxis Careers</div>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
        {[{ emoji: "📈", name: "Steadfast Growth", sub: "Founder & Lead Sales Guy" }, { emoji: "🤝", name: "Praxis Careers", sub: "Business Development Manager" }].map((item, i) => (
          <GlassCard key={i} theme={theme} style={{ flex: "1 1 200px", maxWidth: 260, padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{item.emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.pageText, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: theme.pageSecondary }}>{item.sub}</div>
          </GlassCard>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%" }}>
        {[{ n: "$3M+", l: "Pipeline" }, { n: "$700k+", l: "Revenue" }, { n: "120%", l: "Avg Quota" }].map((s, i) => (
          <GlassCard key={i} theme={theme} style={{ textAlign: "center", padding: "20px 12px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.pageAccent, fontFamily: "'SF Mono', monospace", letterSpacing: -1 }}>{s.n}</div>
            <div style={{ fontSize: 10, color: theme.pageSecondary, marginTop: 5, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "monospace" }}>{s.l}</div>
          </GlassCard>
        ))}
      </div>
      <GlassCard theme={theme} style={{ width: "100%", padding: 24 }}>
        <div style={{ fontSize: 14, lineHeight: 1.9, color: theme.pageText }}>
          <p>I've spent my entire career helping businesses grow — and I've loved every bit of it.</p>
          <p style={{ marginTop: 14 }}>Phones, email, demos, strategy — I've done it all.</p>
          <p style={{ marginTop: 14 }}>I've generated over $3M in pipeline, closed over $700k in revenue, built a partner network from scratch, held team records, and created outbound systems used by entire sales orgs.</p>
          <p style={{ marginTop: 14 }}>If you can't tell, I like building things. Give me a problem and I'll find a way to make it work.</p>
          <p style={{ marginTop: 14 }}>That's what Steadfast Growth is. I bring what I've learned to businesses that need help generating revenue.</p>
        </div>
      </GlassCard>
      <div style={{ display: "flex", gap: 12, width: "100%", flexDirection: isMobile ? "column" : "row" }}>
        {[{ label: "Steadfast Growth", url: "https://calendly.com/john-steadfastgrowth/30min" }, { label: "Praxis", url: "https://calendly.com/john-praxis/30min" }].map((cal, i) => (
          <GlassCard key={i} theme={theme} href={cal.url} style={{ flex: 1, textAlign: "center", padding: "22px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.pageText, marginBottom: 3 }}>{cal.label}</div>
            <div style={{ fontSize: 12, color: theme.pageSecondary, marginBottom: 10 }}>30 min chat</div>
            <div style={{ fontSize: 11, color: theme.pageAccent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Book Now ↗</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function AboutContent({ theme, isMobile }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 24, alignItems: isMobile ? "center" : "flex-start", marginBottom: 32 }}>
        <div style={{ width: 110, height: 110, borderRadius: 16, overflow: "hidden", border: `2px solid ${theme.pageCardBorder}`, flexShrink: 0, boxShadow: theme.pageCardShadow }}>
          <Headshot size={110} style={{ borderRadius: 16 }} />
        </div>
        <div>
          <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: theme.pageText, letterSpacing: -0.5, marginBottom: 4 }}>John P. Ciannello</div>
          <div style={{ fontSize: 13, color: theme.pageAccent, fontWeight: 600, marginBottom: 14 }}>Founder @ Steadfast Growth · BDM @ Praxis Careers</div>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: theme.pageText }}>I've spent my entire career helping businesses grow — and I've loved every bit of it. Phones, email, demos, strategy — I've done it all.</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
        {[{ n: "$3M+", l: "Pipeline" }, { n: "$700k+", l: "Revenue" }, { n: "120%", l: "Avg Quota" }].map((s, i) => (
          <GlassCard key={i} theme={theme} style={{ textAlign: "center", padding: "18px 12px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: theme.pageAccent, fontFamily: "'SF Mono', monospace" }}>{s.n}</div>
            <div style={{ fontSize: 10, color: theme.pageSecondary, marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "monospace" }}>{s.l}</div>
          </GlassCard>
        ))}
      </div>
      <div style={{ height: 1, background: theme.pageDivider, marginBottom: 28 }} />
      <GlassCard theme={theme} style={{ padding: 24 }}>
        <div style={{ fontSize: 14, lineHeight: 1.9, color: theme.pageText }}>
          <p>I've generated over $3M in pipeline, closed over $700k in revenue, built a partner network from scratch, held team records, and created outbound systems used by entire sales orgs.</p>
          <p style={{ marginTop: 16 }}>If you can't tell, I like building things. Give me a problem and I'll find a way to make it work.</p>
          <p style={{ marginTop: 16 }}>That's what Steadfast Growth is. I bring what I've learned to businesses that need help generating revenue.</p>
        </div>
      </GlassCard>
    </div>
  );
}

function ProjectsContent({ theme, isMobile }) {
  return (
    <div>
      <div style={{ fontSize: 14, color: theme.pageSecondary, marginBottom: 24 }}>Things I'm building.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {PROJECTS.map((p, i) => (
          <GlassCard key={i} theme={theme} style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.pageText }}>{p.name}</div>
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
            { label: "Newsletter", sub: "Another in the Fire", url: "https://another-in-the-fire.beehiiv.com/" },
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

function ContactContent({ theme, isMobile }) {
  return (
    <div>
      <div style={{ fontSize: 14, color: theme.pageSecondary, marginBottom: 24 }}>Let's connect.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {[
          { icon: "📧", label: "Steadfast Growth", value: "john@steadfastgrowth.io", href: "mailto:john@steadfastgrowth.io" },
          { icon: "📧", label: "Praxis", value: "john@joinpraxis.com", href: "mailto:john@joinpraxis.com" },
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
          { label: "Steadfast Growth", url: "https://calendly.com/john-steadfastgrowth/30min" },
          { label: "Praxis", url: "https://calendly.com/john-praxis/30min" },
        ].map((cal, i) => (
          <GlassCard key={i} theme={theme} href={cal.url} style={{ flex: 1, textAlign: "center", padding: "24px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.pageText, marginBottom: 4 }}>{cal.label}</div>
            <div style={{ fontSize: 12, color: theme.pageSecondary, marginBottom: 12 }}>30 min chat</div>
            <div style={{ fontSize: 11, color: theme.pageAccent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Book Now ↗</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

const CONTENT_MAP = { "now-playing": NowPlayingContent, about: AboutContent, projects: ProjectsContent, content: ContentContent, experience: ExperienceContent, contact: ContactContent };

function IPodScreen({ theme, selectedIndex }) {
  return (
    <div style={{ width: "100%", height: 180, background: theme.screenBg, borderRadius: 6, overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)", border: `1.5px solid ${theme.screenBorder}`, display: "flex", flexDirection: "column", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ background: theme.headerBg, padding: "3px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 600, color: theme.headerText, flexShrink: 0, minHeight: 20 }}>
        <span>iPod</span>
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
  const lastAngleRef = useRef(null);
  const accumulatorRef = useRef(0);
  const isTrackingRef = useRef(false);
  const theme = themes[mode];

  useEffect(() => { const c = () => setIsMobile(window.innerWidth < 640); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

  const getAngle = useCallback((x, y) => { if (!wheelRef.current) return 0; const r = wheelRef.current.getBoundingClientRect(); return Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2)) * (180 / Math.PI); }, []);
  const handleWheelStart = useCallback((x, y) => { if (openSection || zoomPhase !== "idle") return; lastAngleRef.current = getAngle(x, y); accumulatorRef.current = 0; isTrackingRef.current = true; }, [getAngle, openSection, zoomPhase]);
  const handleWheelMove = useCallback((x, y) => {
    if (!isTrackingRef.current || openSection || zoomPhase !== "idle") return;
    const a = getAngle(x, y); let d = a - lastAngleRef.current;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    accumulatorRef.current += d; lastAngleRef.current = a;
    if (accumulatorRef.current > 28) { setSelectedIndex(p => Math.min(p + 1, MENU_ITEMS.length - 1)); accumulatorRef.current = 0; }
    else if (accumulatorRef.current < -28) { setSelectedIndex(p => Math.max(p - 1, 0)); accumulatorRef.current = 0; }
  }, [getAngle, openSection, zoomPhase]);
  const handleWheelEnd = useCallback(() => { isTrackingRef.current = false; lastAngleRef.current = null; }, []);

  useEffect(() => { const up = () => handleWheelEnd(); const mv = (e) => handleWheelMove(e.clientX, e.clientY); window.addEventListener("mouseup", up); window.addEventListener("mousemove", mv); return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", mv); }; }, [handleWheelEnd, handleWheelMove]);

  const handleSelect = () => { if (openSection || zoomPhase !== "idle") return; setOpenSection(MENU_ITEMS[selectedIndex].id); setZoomPhase("zooming"); setTimeout(() => setZoomPhase("open"), 600); };
  const handleBack = () => { setZoomPhase("closing"); setTimeout(() => { setZoomPhase("idle"); setOpenSection(null); }, 450); };

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
    const base = { display: "flex", flexDirection: "column", alignItems: "center", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" };
    if (zoomPhase === "idle") return { ...base, transform: "scale(1)", opacity: 1, pointerEvents: "auto" };
    if (zoomPhase === "zooming") return { ...base, transform: `scale(${isMobile ? 4 : 5}) translateY(-12%)`, opacity: 0, pointerEvents: "none", transformOrigin: "50% 30%" };
    if (zoomPhase === "open") return { ...base, opacity: 0, pointerEvents: "none", position: "absolute" };
    if (zoomPhase === "closing") return { ...base, transform: "scale(1)", opacity: 1, pointerEvents: "none", transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)" };
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
            <div onClick={e => { e.stopPropagation(); handleSelect(); }}
              style={{ width: isMobile ? Math.min(66, ipodW * 0.22) : 74, height: isMobile ? Math.min(66, ipodW * 0.22) : 74, borderRadius: "50%", background: theme.wheelCenter, boxShadow: theme.wheelCenterShadow, zIndex: 2, cursor: "pointer", transition: "transform 0.1s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(0.96)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
          </div>
        </div>
        <div style={{ marginTop: 18, fontSize: 10, fontFamily: "monospace", color: mode === "light" ? "#888" : "#666", letterSpacing: 1.5, opacity: 0.5, textAlign: "center" }}>
          {isMobile ? "SWIPE WHEEL · TAP CENTER" : "SCROLL WHEEL · CLICK CENTER · ↑↓ ENTER"}
        </div>
      </div>

      {openSection && zoomPhase === "open" && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, overflow: "auto", animation: "contentIn 0.35s ease forwards" }}>
          <PageWrapper theme={theme} title={sectionTitle} onBack={handleBack} onToggle={toggleMode} mode={mode} isMobile={isMobile}>
            {ContentComponent && <ContentComponent theme={theme} isMobile={isMobile} />}
          </PageWrapper>
        </div>
      )}

      {openSection && zoomPhase === "closing" && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, overflow: "hidden", animation: "contentOut 0.35s ease forwards", pointerEvents: "none" }}>
          <PageWrapper theme={theme} title={sectionTitle} onBack={() => {}} onToggle={() => {}} mode={mode} isMobile={isMobile}>
            {ContentComponent && <ContentComponent theme={theme} isMobile={isMobile} />}
          </PageWrapper>
        </div>
      )}
    </div>
  );
}
