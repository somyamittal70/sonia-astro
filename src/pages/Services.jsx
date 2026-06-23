import { useEffect, useRef } from "react";
import { Reveal } from "../components/Shared";

const services = [
  {
    tag: "Intuitive Guidance",
    title: "Tarot Reading",
    desc: "Gain clarity about relationships, marriage, career, finances, family and important life decisions through intuitive Tarot guidance.",
    idealFor: ["Relationship confusion","Love and marriage questions","Career decisions","Emotional uncertainty"],
    cta: "Book Tarot Session",
    image: "/service1.jpg",
  },
  {
    tag: "Vedic Wisdom",
    title: "Astrology Consultation",
    desc: "Understand your life patterns, strengths, timing cycles and future possibilities through detailed astrological guidance.",
    idealFor: ["Career direction","Marriage compatibility","Family and financial concerns","Life purpose understanding"],
    cta: "Book Astrology Session",
    image: "/service2.jpg",
  },
  {
    tag: "Safe & Confidential",
    title: "Emotional Counselling",
    desc: "A safe, compassionate and confidential space to express, process and heal emotional pain.",
    idealFor: ["Anxiety and stress","Emotional overwhelm","Relationship pain","Loneliness abroad"],
    cta: "Book Counselling Session",
    image: "/service3.jpg",
  },
  {
    tag: "Energy & Healing",
    title: "Spiritual Healing",
    desc: "Release emotional heaviness, energetic blockages and inner negativity through guided spiritual healing sessions.",
    idealFor: ["Emotional exhaustion","Negative energy","Mental restlessness","Inner imbalance"],
    cta: "Book Healing Session",
    image: "/service4.jpg",
  },
  {
    tag: "Soul Journey",
    title: "Akashic Records Reading",
    desc: "Explore deeper soul patterns, karmic lessons and emotional blockages influencing your present life journey.",
    idealFor: ["Repeated life struggles","Spiritual awakening","Soul purpose clarity","Deep emotional patterns"],
    cta: "Explore Akashic Reading",
    image: "/service5.jpg",
  },
];

const hexPoints = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

const Services = ({ onBookNow }) => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = wrap.offsetWidth; canvas.height = wrap.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3,
      gold: Math.random() > 0.55, phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.9,
      dx: (Math.random() - 0.5) * 0.00005, dy: (Math.random() - 0.5) * 0.000038,
    }));

    const floaters = [
      { x: 0.08, y: 0.3, r: 100, gold: true, phase: 0 },
      { x: 0.92, y: 0.25, r: 85, gold: false, phase: 1.8 },
      { x: 0.5, y: 0.85, r: 110, gold: true, phase: 3.2 },
      { x: 0.25, y: 0.75, r: 65, gold: false, phase: 2.1 },
    ];

    const mandalaSet = [{ xf: 0.05, yf: 0.5 }, { xf: 0.95, yf: 0.5 }, { xf: 0.5, yf: 0.05 }];

    let animId;
    const frame = (t) => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      floaters.forEach((f) => {
        const fx = (f.x + Math.sin(t * 0.00022 + f.phase) * 0.07) * w;
        const fy = (f.y + Math.cos(t * 0.00017 + f.phase * 1.2) * 0.06) * h;
        const fr = f.r * (0.88 + 0.12 * Math.sin(t * 0.0008 + f.phase));
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
        g.addColorStop(0, f.gold ? "rgba(201,168,76,0.09)" : "rgba(130,80,200,0.07)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
      mandalaSet.forEach((m, mi) => {
        const cx = m.xf * w, cy = m.yf * h;
        const rr = Math.min(w, h) * 0.18;
        const rot = t * (mi % 2 === 0 ? 0.00005 : -0.00006) + mi * 1.2;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.strokeStyle = "rgba(201,168,76,0.05)"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke();
        const pts = hexPoints(0, 0, rr);
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
        ctx.closePath(); ctx.stroke(); ctx.restore();
      });
      particles.forEach((p) => {
        const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * p.speed * 0.001 + p.phase));
        const px = (((p.x + p.dx * t) % 1) + 1) % 1;
        const py = (((p.y + p.dy * t) % 1) + 1) % 1;
        ctx.beginPath(); ctx.arc(px * w, py * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? `rgba(201,168,76,${tw * 0.68})` : `rgba(130,80,200,${tw * 0.4})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(frame);
    };
    animId = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <>
      <style>{`
        .svc-section { background: #fdfaf6; padding: 100px 5%; position: relative; overflow: hidden; }
        .svc-tag { display: inline-block; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; color: #c9a84c; border: 1px solid rgba(201,168,76,0.35); border-radius: 999px; padding: 6px 18px; margin-bottom: 20px; background: rgba(201,168,76,0.05); }
        .svc-headline { font-size: clamp(2rem, 4vw, 3.2rem); color: #2d004f; margin: 0 0 18px; line-height: 1.2; }
        .svc-gold-line { width: 72px; height: 2.5px; margin: 0 auto; border-radius: 999px; background: linear-gradient(90deg, #c9a84c 0%, #f5df9a 50%, #c9a84c 100%); }
        .svc-row {
          display: grid;
          grid-template-columns: 1fr 1fr; /* image left, content right — hamesha */
          gap: 0; margin-bottom: 6px; border-radius: 28px; overflow: hidden;
          border: 1px solid rgba(201,168,76,0.13); box-shadow: 0 8px 40px rgba(45,0,79,0.06);
          background: #fff; transition: box-shadow 0.35s ease;
        }
        .svc-row:hover { box-shadow: 0 20px 64px rgba(45,0,79,0.12); }
        .svc-img-pane { position: relative; min-height: 380px; overflow: hidden; }
        .svc-img-pane img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; transition: transform 0.7s ease; }
        .svc-row:hover .svc-img-pane img { transform: scale(1.06); }
        .svc-img-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(45,0,79,0.45) 0%, rgba(45,0,79,0.1) 100%); z-index: 1; }
        .svc-img-tag { position: absolute; bottom: 24px; left: 28px; z-index: 2; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #c9a84c; background: rgba(0,0,0,0.45); backdrop-filter: blur(8px); border: 1px solid rgba(201,168,76,0.3); border-radius: 999px; padding: 5px 14px; }
        .svc-content-pane { display: flex; flex-direction: column; justify-content: center; padding: 48px; background: #fff; position: relative; overflow: hidden; }
        .svc-content-pane::before { content: ""; position: absolute; top: -40px; right: -40px; width: 160px; height: 160px; border-radius: 50%; background: radial-gradient(circle, rgba(201,168,76,0.07), transparent 70%); pointer-events: none; }
        .svc-content-number { font-size: 0.72rem; letter-spacing: 2px; color: #c9a84c; font-weight: 600; text-transform: uppercase; margin-bottom: 10px; }
        .svc-content-title { font-size: clamp(1.4rem, 2.5vw, 2rem); color: #2d004f; margin: 0 0 6px; line-height: 1.2; }
        .svc-content-accent { width: 48px; height: 2px; background: linear-gradient(90deg, #c9a84c, #f5df9a); border-radius: 999px; margin-bottom: 18px; }
        .svc-content-desc { font-size: 0.96rem; color: #746d8d; line-height: 1.85; margin-bottom: 24px; }
        .svc-ideal-label { font-size: 0.72rem; letter-spacing: 1.8px; text-transform: uppercase; color: #2d004f; font-weight: 700; margin-bottom: 12px; }
        .svc-ideal-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px; }
        .svc-ideal-item { display: flex; align-items: center; gap: 10px; font-size: 0.86rem; color: #746d8d; }
        .svc-ideal-dot { width: 6px; height: 6px; border-radius: 50%; background: #c9a84c; flex-shrink: 0; }
        .svc-cta { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; border-radius: 999px; background: linear-gradient(135deg, #2d004f, #4b0082); color: #fff; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.5px; text-decoration: none; border: none; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; align-self: flex-start; box-shadow: 0 8px 24px rgba(45,0,79,0.25); }
        .svc-cta:hover { transform: translateY(-3px); box-shadow: 0 16px 36px rgba(45,0,79,0.35); }
        .svc-cta-arrow { font-size: 1rem; transition: transform 0.3s ease; }
        .svc-cta:hover .svc-cta-arrow { transform: translateX(4px); }
        .svc-separator { display: flex; align-items: center; gap: 16px; margin: 32px 0; }
        .svc-sep-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent); }
        .svc-sep-icon { color: rgba(201,168,76,0.4); font-size: 1rem; }
        @media (max-width: 900px) { .svc-row { grid-template-columns: 1fr; } .svc-img-pane { min-height: 260px; } .svc-content-pane { padding: 36px 30px; } }
        @media (max-width: 500px) { .svc-content-pane { padding: 28px 22px; } .svc-section { padding: 70px 18px !important; } }
      `}</style>

      <section id="services" ref={wrapRef} className="svc-section">
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 className="svc-headline font-marcellus">Services Offered</h2>
              <div className="svc-gold-line" />
            </div>
          </Reveal>

          {services.map((s, i) => (
            <div key={i}>
              <Reveal delay={i * 80}>
                <div className="svc-row">
                  {/* Image — hamesha left */}
                  <div className="svc-img-pane">
                    <img src={s.image} alt={s.title} draggable={false} />
                    <div className="svc-img-overlay" />
                    <div className="svc-img-tag">{s.tag}</div>
                  </div>
                  {/* Content — hamesha right */}
                  <div className="svc-content-pane">
                    <ContentBlock s={s} onBookNow={onBookNow} />
                  </div>
                </div>
              </Reveal>

              {i < services.length - 1 && (
                <div className="svc-separator">
                  <div className="svc-sep-line" />
                  <span className="svc-sep-icon">✦</span>
                  <div className="svc-sep-line" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

const ContentBlock = ({ s, onBookNow }) => (
  <>
    <div className="svc-content-number">{s.number} — {s.tag}</div>
    <h3 className="svc-content-title font-marcellus">{s.title}</h3>
    <div className="svc-content-accent" />
    <p className="svc-content-desc">{s.desc}</p>
    <div className="svc-ideal-label">Ideal For</div>
    <div className="svc-ideal-list">
      {s.idealFor.map((item, j) => (
        <div key={j} className="svc-ideal-item">
          <div className="svc-ideal-dot" />
          {item}
        </div>
      ))}
    </div>
    <button onClick={onBookNow} className="svc-cta">
      {s.cta}
      <span className="svc-cta-arrow">→</span>
    </button>
  </>
);

export default Services;