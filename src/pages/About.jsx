import { useEffect, useRef } from "react";
import { Reveal } from "../components/Shared";
import {
  HeartHandshake,
  Heart,
  Sparkles,
  Briefcase,
  Sprout,
  Stars,
} from "lucide-react";

const helpTopics = [
  { icon: HeartHandshake, label: "Relationships" },
  { icon: Heart, label: "Marriage Challenges" },
  { icon: Sparkles, label: "Emotional Healing" },
  { icon: Briefcase, label: "Career Confusion" },
  { icon: Sprout, label: "Personal Growth" },
  { icon: Stars, label: "Spiritual Awakening" },
];

const stats = [
  { number: "15+", label: "Years of Practice" },
  { number: "10+", label: "Countries Served" },
  { number: "20K+", label: "Lives Transformed" },
];

const About = () => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.3,
      gold: Math.random() > 0.55,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.8,
      dx: (Math.random() - 0.5) * 0.00005,
      dy: (Math.random() - 0.5) * 0.000035,
    }));
    const floaters = [
      { x: 0.1, y: 0.2, r: 100, gold: true, phase: 0 },
      { x: 0.85, y: 0.7, r: 80, gold: false, phase: 1.5 },
      { x: 0.5, y: 0.05, r: 60, gold: true, phase: 3 },
    ];
    const newShoot = () => ({
      x: Math.random() * 0.8,
      y: Math.random() * 0.5,
      angle: Math.PI / 6 + (Math.random() - 0.5) * 0.5,
      speed: 0.0012 + Math.random() * 0.0013,
      len: 0.07 + Math.random() * 0.08,
      prog: 0,
      timer: 0,
      delay: Math.floor(Math.random() * 700) + 200,
    });
    const shoots = Array.from({ length: 3 }, newShoot);
    const mandalaAngles = Array.from(
      { length: 8 },
      (_, i) => (i / 8) * Math.PI * 2,
    );

    let animId;
    const frame = (t) => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      floaters.forEach((f) => {
        const fx = (f.x + Math.sin(t * 0.00022 + f.phase) * 0.07) * w;
        const fy = (f.y + Math.cos(t * 0.00018 + f.phase * 1.3) * 0.06) * h;
        const fr = f.r * (0.9 + 0.1 * Math.sin(t * 0.0007 + f.phase));
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
        g.addColorStop(0, f.gold ? "rgba(201,168,76,0.08)" : "rgba(130,80,200,0.07)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      const cx = w * 0.5, cy = h * 0.5, rr = Math.min(w, h) * 0.38;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.00003);
      ctx.strokeStyle = "rgba(201,168,76,0.04)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, rr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, rr * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      mandalaAngles.forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * rr * 0.7, Math.sin(a) * rr * 0.7);
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        ctx.stroke();
      });
      ctx.restore();
      particles.forEach((p) => {
        const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * p.speed * 0.001 + p.phase));
        const px = (((p.x + p.dx * t) % 1) + 1) % 1;
        const py = (((p.y + p.dy * t) % 1) + 1) % 1;
        ctx.beginPath();
        ctx.arc(px * w, py * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${tw * 0.65})`
          : `rgba(130,80,200,${tw * 0.4})`;
        ctx.fill();
      });
      shoots.forEach((s) => {
        s.timer++;
        if (s.timer < s.delay) return;
        s.prog += s.speed;
        if (s.prog > 1.2) {
          Object.assign(s, newShoot());
          s.timer = 0;
          return;
        }
        const fade = s.prog < 0.12 ? s.prog / 0.12 : s.prog > 0.75 ? (1 - s.prog) / 0.25 : 1;
        const tx = s.x + Math.cos(s.angle) * s.prog * 0.3;
        const ty = s.y + Math.sin(s.angle) * s.prog * 0.22;
        const tx2 = tx - Math.cos(s.angle) * s.len;
        const ty2 = ty - Math.sin(s.angle) * s.len;
        const g = ctx.createLinearGradient(tx2 * w, ty2 * h, tx * w, ty * h);
        g.addColorStop(0, "rgba(201,168,76,0)");
        g.addColorStop(0.5, `rgba(201,168,76,${fade * 0.45})`);
        g.addColorStop(1, `rgba(255,240,180,${fade * 0.75})`);
        ctx.beginPath();
        ctx.moveTo(tx2 * w, ty2 * h);
        ctx.lineTo(tx * w, ty * h);
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.9;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(tx * w, ty * h, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,200,${fade * 0.85})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(frame);
    };
    animId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="about"
      ref={wrapRef}
      style={{
        background: "#fff",
        padding: "40px 5%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Heading */}
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="ab-headline font-marcellus">Meet Sonia</h2>
            <div className="ab-gold-line" />
          </div>
        </Reveal>

        {/* Two column layout */}
        <div className="ab-grid">

          {/* ── LEFT ── */}
          <Reveal dir="left">
            <div className="ab-left">

              {/* Quote block */}
              <div className="ab-quote-block">
                <div className="ab-quote-mark">"</div>
                <p className="ab-quote-text">
                  Healing begins when someone truly listens — without judgement,
                  without rush, with complete presence.
                </p>
                <div className="ab-quote-author">— Sonia</div>
              </div>

              {/* Stats */}
              <div className="ab-stats-col">
                {stats.map((s, i) => (
                  <div key={i} className="ab-stat-row">
                    <div className="ab-stat-number font-marcellus">{s.number}</div>
                    <div className="ab-stat-divider" />
                    <div className="ab-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Credentials */}
              <div className="ab-cred-strip">
                <span className="ab-cred-badge">MSc Human Development</span>
                <span className="ab-cred-badge">Certified Counsellor</span>
                <span className="ab-cred-badge">15+ Yrs Experience</span>
              </div>
            </div>
          </Reveal>

          {/* ── RIGHT ── */}
          <Reveal dir="right">
            <div className="ab-right">
              <p className="ab-para">
                Sonia is a <strong>Tarot Expert</strong>,{" "}
                <strong>Relationship Coach</strong>,{" "}
                <strong>Certified Counsellor</strong> and{" "}
                <strong>Spiritual Guide</strong> with more than 15 years of
                experience serving clients globally through online consultations.
              </p>
              <p className="ab-para">
                She holds a{" "}
                <strong>Master's Degree (MSc) in Human Development</strong> and
                combines emotional understanding, spiritual insight and practical
                guidance to help people heal, grow and gain clarity.
              </p>
              <p className="ab-para" style={{ marginBottom: 32 }}>
                Her approach is <strong>compassionate</strong>,{" "}
                <strong>non-judgmental</strong> and deeply personalized —
                meeting every soul exactly where they are.
              </p>

              {/* Divider */}
              <div className="ab-section-divider">
                <div className="ab-divider-line" />
                <span className="ab-divider-text font-marcellus">Areas of Guidance</span>
                <div className="ab-divider-line" />
              </div>

              {/* Topic pills */}
              <div className="ab-topics-grid">
                {helpTopics.map((t, i) => {
                  const IconComponent = t.icon;
                  return (
                    <div
                      key={i}
                      className="ab-topic-pill"
                      style={{ animationDelay: `${0.3 + i * 0.07}s` }}
                    >
                      <IconComponent className="ab-topic-icon" size={18} strokeWidth={1.8} />
                      <span className="ab-topic-label">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .ab-headline {
          font-size: clamp(1.8rem, 4vw, 3.2rem);
          color: #2d004f;
          margin: 0 0 18px;
          line-height: 1.2;
        }
        .ab-gold-line {
          width: 72px;
          height: 2.5px;
          margin: 0 auto;
          border-radius: 999px;
          background: linear-gradient(90deg, #c9a84c 0%, #f5df9a 50%, #c9a84c 100%);
        }

        /* ── Grid ── */
        .ab-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        /* ── LEFT ── */
        .ab-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: sticky;
          top: 100px;
        }

        .ab-quote-block {
          background: linear-gradient(135deg, #2d004f 0%, #4b0082 100%);
          border-radius: 20px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(45,0,79,0.2);
        }
        .ab-quote-block::before {
          content: "";
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(201,168,76,0.08);
          pointer-events: none;
        }
        .ab-quote-mark {
          font-size: 4.5rem;
          line-height: 0.6;
          color: #c9a84c;
          font-family: "Poppins", sans-serif;
          margin-bottom: 14px;
          opacity: 0.7;
        }
        .ab-quote-text {
          color: rgba(255,255,255,0.9);
          font-size: 0.98rem;
          line-height: 1.85;
          font-style: italic;
          margin: 0 0 16px;
        }
        .ab-quote-author {
          color: #c9a84c;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .ab-stats-col {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(201,168,76,0.15);
        }
        .ab-stat-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #fff;
          border-bottom: 1px solid rgba(201,168,76,0.1);
          transition: background 0.25s ease;
        }
        .ab-stat-row:last-child { border-bottom: none; }
        .ab-stat-row:hover { background: rgba(201,168,76,0.04); }
        .ab-stat-number {
          font-size: 1.8rem;
          line-height: 1;
          background: linear-gradient(135deg, #c9a84c, #f5df9a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          min-width: 64px;
        }
        .ab-stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(201,168,76,0.25);
          flex-shrink: 0;
        }
        .ab-stat-label {
          font-size: 0.78rem;
          color: #746d8d;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 500;
        }

        .ab-cred-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ab-cred-badge {
          font-size: 0.72rem;
          font-weight: 600;
          color: #2d004f;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 999px;
          padding: 5px 12px;
          letter-spacing: 0.3px;
        }

        /* ── RIGHT ── */
        .ab-right {
          display: flex;
          flex-direction: column;
        }
        .ab-para {
          color: #746d8d;
          font-size: 0.97rem;
          line-height: 1.9;
          margin-bottom: 14px;
        }
        .ab-para strong {
          color: #2d004f;
          font-weight: 600;
        }

        .ab-section-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .ab-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent);
        }
        .ab-divider-text {
          font-size: 0.8rem;
          color: #c9a84c;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* Pills — 2 col always, flex on large screens */
        .ab-topics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .ab-topic-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid rgba(201,168,76,0.2);
          box-shadow: 0 3px 12px rgba(45,0,79,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          animation: pillUp 0.5s ease both;
          justify-content: flex-start;
        }
        .ab-topic-pill:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(45,0,79,0.1);
          border-color: rgba(201,168,76,0.5);
        }
        .ab-topic-icon {
          width: 17px;
          height: 17px;
          color: #c9a84c;
          flex-shrink: 0;
        }
        .ab-topic-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #2d004f;
          white-space: nowrap;
        }

        @keyframes pillUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Tablet (max 860px) ── */
        @media (max-width: 860px) {
          .ab-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .ab-left {
            position: static;
          }
        }

        /* ── Mobile (max 600px) ── */
        @media (max-width: 600px) {
          .ab-topics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .ab-topic-pill {
            padding: 9px 12px;
            gap: 6px;
          }
          .ab-topic-label {
            font-size: 0.76rem;
          }
          .ab-quote-block {
            padding: 24px 20px;
          }
          .ab-quote-mark {
            font-size: 3.5rem;
          }
          .ab-quote-text {
            font-size: 0.9rem;
          }
          .ab-stat-row {
            padding: 14px 16px;
            gap: 12px;
          }
          .ab-stat-number {
            font-size: 1.5rem;
            min-width: 52px;
          }
          .ab-stat-label {
            font-size: 0.72rem;
          }
          .ab-para {
            font-size: 0.9rem;
          }
          .ab-cred-badge {
            font-size: 0.68rem;
            padding: 4px 10px;
          }
        }

        /* ── Very small (max 380px) ── */
        @media (max-width: 380px) {
          .ab-topics-grid {
            grid-template-columns: 1fr;
          }
          .ab-topic-pill {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default About;