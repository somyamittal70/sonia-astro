import { useEffect, useRef, useState } from "react";
import bannerDesktop from "/banner.png";

const Hero = ({ onBookNow }) => {
  const titleRef  = useRef(null);
  const subRef    = useRef(null);
  const btnsRef   = useRef(null);
  const statsRef  = useRef(null);
  const canvasRef = useRef(null);

  const getView = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (w <= 380)  return "xs";
    if (w <= 480)  return "mobile";
    if (w <= 768)  return "mobileLg";
    if (w <= 1024) return "tablet";
    if (w <= 1280) return "laptop";
    return "desktop";
  };

  const [view, setView] = useState(getView);

  useEffect(() => {
    const onResize = () => setView(getView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isXS         = view === "xs";
  const isMobile     = view === "mobile" || isXS;
  const isMobileLg   = view === "mobileLg";
  const isTablet     = view === "tablet";
  const isLargeScreen = view === "laptop" || view === "desktop";
  // screens where image overlaps content — use dark overlay + stack layout
  const isStacked    = isMobile || isMobileLg || isTablet;

  // ── Entrance animation ──────────────────────────────────────────
  useEffect(() => {
    [titleRef, subRef, btnsRef, statsRef].forEach((r, i) => {
      if (r.current)
        r.current.style.animation = `heroFadeUp 0.9s ${i * 0.15}s cubic-bezier(.22,1,.36,1) both`;
    });
  }, []);

  // ── Canvas: stars + orbs + shooting stars ──────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      gold: Math.random() > 0.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
      drift:  (Math.random() - 0.5) * 0.00008,
      driftY: (Math.random() - 0.5) * 0.00004,
    }));

    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      baseR: 50 + Math.random() * 90,
      phase: Math.random() * Math.PI * 2,
      gold: i < 3,
    }));

    const newShoot = () => ({
      x: Math.random(), y: Math.random() * 0.5,
      len: 0.06 + Math.random() * 0.1,
      angle: Math.PI / 5 + (Math.random() - 0.5) * 0.4,
      speed: 0.0015 + Math.random() * 0.002,
      prog: Math.random(), timer: 0, delay: Math.random() * 400,
    });
    const shoots = Array.from({ length: 3 }, newShoot);
    const mandalaAngles = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);

    let animId;
    const animate = (ts) => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      orbs.forEach((o) => {
        const x = (o.x + Math.sin(ts * 0.0003 + o.phase) * 0.08) * w;
        const y = (o.y + Math.cos(ts * 0.0002 + o.phase * 1.3) * 0.06) * h;
        const r = o.baseR * (0.9 + 0.1 * Math.sin(ts * 0.001 + o.phase));
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, o.gold ? "rgba(201,168,76,0.15)" : "rgba(120,90,220,0.13)");
        g.addColorStop(1, o.gold ? "rgba(201,168,76,0)"   : "rgba(80,60,180,0)");
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      const ringR = Math.min(canvas.width, canvas.height) * 0.38;
      ctx.save();
      ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
      ctx.rotate(ts * 0.00008);
      ctx.strokeStyle = "rgba(201,168,76,0.08)"; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, ringR * 0.72, 0, Math.PI * 2); ctx.stroke();
      mandalaAngles.forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * ringR * 0.72, Math.sin(a) * ringR * 0.72);
        ctx.lineTo(Math.cos(a) * ringR, Math.sin(a) * ringR);
        ctx.stroke();
      });
      ctx.restore();

      stars.forEach((s) => {
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(ts * s.speed * 0.001 + s.phase));
        const px = (((s.x + s.drift  * ts) % 1) + 1) % 1;
        const py = (((s.y + s.driftY * ts) % 1) + 1) % 1;
        ctx.beginPath(); ctx.arc(px * w, py * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(201,168,76,${tw*0.9})` : `rgba(255,255,255,${tw*0.85})`;
        ctx.fill();
        if (s.r > 1.1 && tw > 0.7) {
          ctx.beginPath();
          ctx.moveTo(px*w, py*h - s.r*3); ctx.lineTo(px*w, py*h + s.r*3);
          ctx.moveTo(px*w - s.r*3, py*h); ctx.lineTo(px*w + s.r*3, py*h);
          ctx.strokeStyle = s.gold
            ? `rgba(201,168,76,${(tw-0.7)*0.6})`
            : `rgba(255,255,255,${(tw-0.7)*0.5})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      });

      shoots.forEach((s) => {
        s.timer++;
        if (s.timer < s.delay) return;
        s.prog += s.speed;
        if (s.prog > 1.3) { Object.assign(s, newShoot()); s.timer = 0; return; }
        const fade = s.prog < 0.1 ? s.prog / 0.1 : s.prog > 0.8 ? (1 - s.prog) / 0.2 : 1;
        const tx  = s.x + Math.cos(s.angle) * s.prog * 0.35;
        const ty  = s.y + Math.sin(s.angle) * s.prog * 0.25;
        const tx2 = tx - Math.cos(s.angle) * s.len;
        const ty2 = ty - Math.sin(s.angle) * s.len;
        const g = ctx.createLinearGradient(tx2*w, ty2*h, tx*w, ty*h);
        g.addColorStop(0,   "rgba(255,255,255,0)");
        g.addColorStop(0.6, `rgba(247,215,120,${fade*0.7})`);
        g.addColorStop(1,   `rgba(255,255,255,${fade*0.9})`);
        ctx.beginPath(); ctx.moveTo(tx2*w, ty2*h); ctx.lineTo(tx*w, ty*h);
        ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.stroke();
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  // ── Responsive tokens ────────────────────────────────────────────
  const tk = {
    xs:       { h1: "clamp(22px,6vw,26px)",   sub: "11.5px", btn: "12.5px", statNum: "1.25rem", statLbl: "0.53rem", btnPad: "12px 20px", statPad: "12px 10px", statGap: "8px",  statCols: "1fr 1fr" },
    mobile:   { h1: "clamp(26px,6.5vw,30px)", sub: "12px",   btn: "13px",   statNum: "1.4rem",  statLbl: "0.56rem", btnPad: "13px 22px", statPad: "14px 12px", statGap: "8px",  statCols: "1fr 1fr" },
    mobileLg: { h1: "clamp(26px,5vw,32px)",   sub: "13px",   btn: "13.5px", statNum: "1.5rem",  statLbl: "0.58rem", btnPad: "13px 24px", statPad: "14px 14px", statGap: "10px", statCols: "repeat(3,1fr)" },
    tablet:   { h1: "clamp(28px,4vw,36px)",   sub: "13.5px", btn: "14px",   statNum: "1.65rem", statLbl: "0.60rem", btnPad: "13px 28px", statPad: "16px 14px", statGap: "10px", statCols: "repeat(3,1fr)" },
    laptop:   { h1: "clamp(36px,3.5vw,46px)", sub: "15px",   btn: "14px",   statNum: "1.9rem",  statLbl: "0.62rem", btnPad: "14px 28px", statPad: "18px 15px", statGap: "12px", statCols: "repeat(3,1fr)" },
    desktop:  { h1: "clamp(40px,3.2vw,54px)", sub: "16px",   btn: "15px",   statNum: "2.2rem",  statLbl: "0.64rem", btnPad: "15px 32px", statPad: "20px 18px", statGap: "14px", statCols: "repeat(3,1fr)" },
  };
  const t = tk[view] || tk.desktop;

  // Spacing
  const sidePad  = isXS ? "16px" : isMobile ? "20px" : isMobileLg ? "24px" : isTablet ? "40px" : "3%";
  // Extra top padding on xs/mobile to clear the navbar (typically 60-72px tall)
  const padTop   = isXS ? "82px" : isMobile ? "82px" : isMobileLg ? "80px" : isTablet ? "max(72px,9vh)" : "max(60px, 8vh)";
  const padBot   = isStacked ? "max(48px, 7vh)"  : "max(40px, 6vh)";
  const h1Mb     = `clamp(8px, 1.8vh, ${isStacked ? "14px" : "22px"})`;
  const subMb    = `clamp(12px, 2vh, ${isStacked ? "18px" : "34px"})`;
  const btnsMb   = `clamp(16px, 3vh, ${isStacked ? "24px" : "42px"})`;

  const stats = [
    { num: "300K+", label: "Global Community\nInstagram & YouTube" },
    { num: "15+",   label: "Years of\nExperience" },
    { num: "20K",   label: "Private Online\nSessions Worldwide" },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-stat { transition: transform .25s ease, box-shadow .25s ease; }
        .hero-stat:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(0,0,0,.13); }

        .hero-btn { transition: transform .22s ease, box-shadow .22s ease; }
        .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201,168,76,.55) !important; }

        @media (prefers-reduced-motion: reduce) {
          .hero-btn, .hero-stat { transition: none !important; }
        }
      `}</style>

      <section
        id="home"
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          /* On large screens: image sits on the right, content left */
          justifyContent: isLargeScreen ? "flex-start" : "center",
          backgroundImage: `url(${bannerDesktop})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: isLargeScreen ? "right center" : "center top",
          /* 
           * Large screen  → contain  (image right side, content left, no overlap)
           * Stacked screens → cover + dark overlay so image doesn't obscure text
           */
          backgroundSize: isLargeScreen ? "contain" : "cover",
        }}
      >
        {/* ── Dark overlay for stacked layouts so text is readable ── */}
        {isStacked && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              /* Gradient: opaque at top (text area) → transparent at bottom (image shows) */
              background: isTablet
                ? "linear-gradient(to right, rgba(255,252,245,0.97) 0%, rgba(255,252,245,0.82) 55%, rgba(255,252,245,0.15) 100%)"
                : "linear-gradient(to bottom, rgba(255,252,245,0.96) 0%, rgba(255,252,245,0.90) 60%, rgba(255,252,245,0.55) 85%, rgba(255,252,245,0.1) 100%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            pointerEvents: "none", zIndex: 1,
          }}
        />

        {/* Gold glow */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            background: "radial-gradient(ellipse 55% 55% at 28% 55%, rgba(201,168,76,0.09) 0%, transparent 70%)",
          }}
        />

        {/* ── CONTENT ── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: isLargeScreen ? "920px" : "100%",
            paddingTop:    padTop,
            paddingBottom: padBot,
            paddingLeft:   sidePad,
            paddingRight:  sidePad,
            display: "flex",
            alignItems: isLargeScreen ? "center" : "flex-start",
            /* On tablet: push content to left so image shows on right */
            justifyContent: isTablet ? "flex-start" : "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isLargeScreen ? "620px" : isTablet ? "52%" : "500px",
              textAlign: isTablet || isLargeScreen ? "left" : "center",
            }}
          >
            {/* H1 */}
            <h1
              ref={titleRef}
              style={{
                fontSize: t.h1,
                color: "#4b267c",
                lineHeight: 1.18,
                marginTop: 30,
                marginBottom: h1Mb,
                fontWeight: 700,
                letterSpacing: isLargeScreen ? "-0.5px" : "0",
              }}
            >
              Indians Find <span style={{ color: "#4b267c" }}>Clarity</span> &amp;{" "}
              <br />
              <span style={{ color: "#4b267c" }}>Emotional Balance</span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subRef}
              style={{
                fontSize: t.sub,
                color: "rgba(80,75,90,0.92)",
                maxWidth: isLargeScreen ? "510px" : "100%",
                margin: isTablet || isLargeScreen
                  ? `0 0 ${subMb}`
                  : `0 auto ${subMb}`,
                lineHeight: 1.82,
              }}
            >
              Trusted Tarot Expert, Relationship Coach &amp; Certified Counsellor with{" "}
              <strong style={{ color: "#4b267c", fontWeight: 600 }}>15+ Years</strong>{" "}
              of Global Experience — helping people navigate Love, Career, Emotional Stress &amp; Spiritual Growth.
            </p>

            {/* Buttons */}
            <div
              ref={btnsRef}
              style={{
                display: "flex",
                flexDirection: isLargeScreen || isTablet ? "row" : "column",
                alignItems: isTablet || isLargeScreen ? "flex-start" : "center",
                gap: "10px",
                margin: isTablet || isLargeScreen
                  ? `0 0 ${btnsMb}`
                  : `0 auto ${btnsMb}`,
                maxWidth: isLargeScreen ? "460px" : isTablet ? "420px" : "340px",
                width: "100%",
              }}
            >
              {[
                { label: "✦ Book Your Clarity Session", href: "#booknow",                    onClick: (e) => { e.preventDefault(); onBookNow(); } },
                { label: "Chat on WhatsApp",             href: "https://wa.me/919873523528", external: true },
              ].map(({ label, href, onClick, external }) => (
                <a
                  key={label}
                  href={href}
                  className="hero-btn"
                  onClick={onClick}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  style={{
                    background: "linear-gradient(135deg, #c9a84c 0%, #e8cc7a 50%, #c9a84c 100%)",
                    backgroundSize: "200% auto",
                    color: "#2a0050",
                    padding: t.btnPad,
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: t.btn,
                    textDecoration: "none",
                    textAlign: "center",
                    display: "block",
                    /* On large + tablet: auto width (side by side); small: full width */
                    flex: isLargeScreen || isTablet ? "1 1 0" : undefined,
                    width: isLargeScreen || isTablet ? undefined : "100%",
                    maxWidth: isLargeScreen || isTablet ? "none" : "340px",
                    boxShadow: "0 6px 24px rgba(201,168,76,0.4)",
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              style={{
                display: "grid",
                gridTemplateColumns: t.statCols,
                gap: t.statGap,
                maxWidth: isLargeScreen ? "500px" : isTablet ? "100%" : "100%",
                margin: isTablet || isLargeScreen ? "0" : "0 auto",
                width: "100%",
              }}
            >
              {stats.map(({ num, label }, i) => (
                <div
                  key={i}
                  className="hero-stat"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: "14px",
                    padding: t.statPad,
                    backdropFilter: "blur(14px)",
                    textAlign: "center",
                    // 3rd card full-width on 2-col grid (xs/mobile)
                    ...((isMobile || isXS) && i === 2
                      ? { gridColumn: "1 / -1", maxWidth: "260px", margin: "0 auto", width: "100%" }
                      : {}),
                  }}
                >
                  <div style={{
                    fontSize: t.statNum,
                    color: "#4b267c",
                    fontWeight: 800,
                    lineHeight: 1,
                    marginBottom: "5px",
                    textShadow: "0 2px 12px rgba(201,168,76,0.35)",
                  }}>
                    {num}
                  </div>
                  <div style={{
                    fontSize: t.statLbl,
                    color: "#6b4fa0",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    lineHeight: 1.55,
                    whiteSpace: "pre-line",
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;