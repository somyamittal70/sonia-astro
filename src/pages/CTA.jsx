import { useEffect, useRef, useState } from "react";
import { Reveal } from "../components/Shared";

/* ── Canvas: rich dark-bg animation ── */
const CTACanvas = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rand = (a, b) => Math.random() * (b - a) + a;

    let W,
      H,
      t = 0;
    let particles = [];
    let rings = [];
    let shoot = null;
    let shootTimer;
    let flowLines = [];

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      initAll();
    };

    const initParticles = () => {
      particles = Array.from({ length: 70 }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.6, 2.8),
        vx: rand(-0.1, 0.1),
        vy: rand(-0.28, -0.07),
        alpha: rand(0.15, 0.65),
        pulse: rand(0, Math.PI * 2),
        spd: rand(0.008, 0.022),
        gold: Math.random() > 0.5,
      }));
    };

    const initRings = () => {
      rings = [
        {
          cx: W * 0.5,
          cy: H * 0.5,
          rx: Math.min(W, H) * 0.38,
          ry: Math.min(W, H) * 0.16,
          a: 0,
          spd: 0.003,
        },
        {
          cx: W * 0.5,
          cy: H * 0.5,
          rx: Math.min(W, H) * 0.52,
          ry: Math.min(W, H) * 0.22,
          a: 0.8,
          spd: -0.002,
        },
        { cx: W * 0.18, cy: H * 0.2, rx: 90, ry: 42, a: 0.3, spd: 0.005 },
        { cx: W * 0.82, cy: H * 0.78, rx: 100, ry: 46, a: 1.1, spd: -0.004 },
        { cx: W * 0.78, cy: H * 0.15, rx: 70, ry: 32, a: 0.6, spd: 0.006 },
        { cx: W * 0.2, cy: H * 0.82, rx: 80, ry: 36, a: 1.5, spd: -0.005 },
      ];
    };

    const initFlowLines = () => {
      flowLines = Array.from({ length: 5 }, () => ({
        pts: Array.from({ length: 8 }, (_, i) => ({
          x: (i / 7) * W,
          y: rand(H * 0.1, H * 0.9),
        })),
        alpha: rand(0.03, 0.07),
        spd: rand(0.003, 0.007),
        phase: rand(0, Math.PI * 2),
        gold: Math.random() > 0.5,
      }));
    };

    const initAll = () => {
      initParticles();
      initRings();
      initFlowLines();
    };

    const spawnShoot = () => {
      shoot = {
        x: rand(W * 0.05, W * 0.8),
        y: rand(H * 0.05, H * 0.35),
        len: rand(100, 160),
        alpha: 1,
        angle: rand(18, 38) * (Math.PI / 180),
        speed: rand(7, 12),
        life: 1,
      };
    };
    shootTimer = setTimeout(spawnShoot, rand(800, 2000));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.01;

      [
        {
          bx: W * 0.25 + Math.sin(t * 0.5) * 70,
          by: H * 0.3 + Math.cos(t * 0.4) * 50,
          r: 280,
          c: "rgba(201,168,76,0.09)",
        },
        {
          bx: W * 0.75 + Math.cos(t * 0.45) * 60,
          by: H * 0.65 + Math.sin(t * 0.55) * 45,
          r: 310,
          c: "rgba(150,50,200,0.08)",
        },
        {
          bx: W * 0.5 + Math.sin(t * 0.3) * 80,
          by: H * 0.5 + Math.cos(t * 0.35) * 55,
          r: 360,
          c: "rgba(201,168,76,0.06)",
        },
        {
          bx: W * 0.1 + Math.cos(t * 0.6) * 35,
          by: H * 0.15 + Math.sin(t * 0.5) * 30,
          r: 190,
          c: "rgba(120,0,200,0.07)",
        },
        {
          bx: W * 0.9 + Math.sin(t * 0.55) * 40,
          by: H * 0.85 + Math.cos(t * 0.6) * 35,
          r: 210,
          c: "rgba(201,168,76,0.07)",
        },
      ].forEach(({ bx, by, r, c }) => {
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        g.addColorStop(0, c);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.fill();
      });

      flowLines.forEach((fl) => {
        fl.phase += fl.spd;
        ctx.beginPath();
        fl.pts.forEach((pt, i) => {
          const y = pt.y + Math.sin(fl.phase + i * 0.8) * H * 0.12;
          i === 0 ? ctx.moveTo(pt.x, y) : ctx.lineTo(pt.x, y);
        });
        ctx.strokeStyle = fl.gold
          ? `rgba(201,168,76,${fl.alpha})`
          : `rgba(180,120,255,${fl.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      rings.forEach((ring) => {
        ring.a += ring.spd;
        ctx.save();
        ctx.translate(ring.cx, ring.cy);
        ctx.rotate(ring.a * 0.1);
        ctx.scale(1, ring.ry / ring.rx);
        ctx.beginPath();
        ctx.arc(0, 0, ring.rx, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(201,168,76,0.09)";
        ctx.lineWidth = 0.7;
        ctx.setLineDash([3, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        const dotX = ring.cx + Math.cos(ring.a) * ring.rx;
        const dotY = ring.cy + Math.sin(ring.a) * ring.ry;
        const da = 0.35 + 0.25 * Math.sin(t * 1.5 + ring.a);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${da})`;
        ctx.fill();

        const gw = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 10);
        gw.addColorStop(0, `rgba(201,168,76,${da * 0.35})`);
        gw.addColorStop(1, "transparent");
        ctx.fillStyle = gw;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.spd;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        if (p.y < -10) {
          p.y = H + 10;
          p.x = rand(0, W);
        }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${a})`
          : `rgba(220,180,255,${a * 0.8})`;
        ctx.fill();

        if (p.r > 1.8) {
          ctx.strokeStyle = p.gold
            ? `rgba(201,168,76,${a * 0.6})`
            : `rgba(220,180,255,${a * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - p.r * 2, p.y);
          ctx.lineTo(p.x + p.r * 2, p.y);
          ctx.moveTo(p.x, p.y - p.r * 2);
          ctx.lineTo(p.x, p.y + p.r * 2);
          ctx.stroke();
        }
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 95) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${(1 - d / 95) * 0.1})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      if (shoot) {
        shoot.x += Math.cos(shoot.angle) * shoot.speed;
        shoot.y += Math.sin(shoot.angle) * shoot.speed;
        shoot.life -= 0.018;
        shoot.alpha = shoot.life;

        const tail = ctx.createLinearGradient(
          shoot.x - Math.cos(shoot.angle) * shoot.len,
          shoot.y - Math.sin(shoot.angle) * shoot.len,
          shoot.x,
          shoot.y,
        );
        tail.addColorStop(0, "transparent");
        tail.addColorStop(0.6, `rgba(255,230,130,${shoot.alpha * 0.5})`);
        tail.addColorStop(1, `rgba(255,215,80,${shoot.alpha})`);

        ctx.beginPath();
        ctx.moveTo(
          shoot.x - Math.cos(shoot.angle) * shoot.len,
          shoot.y - Math.sin(shoot.angle) * shoot.len,
        );
        ctx.lineTo(shoot.x, shoot.y);
        ctx.strokeStyle = tail;
        ctx.lineWidth = 2;
        ctx.stroke();

        const hg = ctx.createRadialGradient(
          shoot.x,
          shoot.y,
          0,
          shoot.x,
          shoot.y,
          8,
        );
        hg.addColorStop(0, `rgba(255,240,160,${shoot.alpha})`);
        hg.addColorStop(1, "transparent");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(shoot.x, shoot.y, 8, 0, Math.PI * 2);
        ctx.fill();

        if (shoot.life <= 0 || shoot.x > W + 80 || shoot.y > H + 80) {
          shoot = null;
          shootTimer = setTimeout(spawnShoot, rand(3500, 7000));
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(shootTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
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
  );
};

/* ── Main CTA ── */
const CTA = ({ onBookNow }) => {
  const [showPopup, setShowPopup] = useState(false); // ← popup control

  return (
    <>
      <style>{`
        .cta-section{
          background:#ffffff;
          padding:110px 5% 120px;
          text-align:center;
          position:relative;
          overflow:hidden;
        }
        .cta-center-glow{
          position:absolute;
          inset:0;
          background:
            radial-gradient(ellipse 65% 70% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 20% 20%, rgba(75,0,130,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 35% 35% at 80% 80%, rgba(201,168,76,0.05) 0%, transparent 55%);
          pointer-events:none;
          z-index:0;
        }
        .cta-inner{ max-width:700px; margin:0 auto; position:relative; z-index:2; }
        .cta-badge{
          display:inline-flex; align-items:center; gap:10px;
          background:rgba(201,168,76,0.12); border:1px solid rgba(201,168,76,0.3);
          color:rgba(232,204,122,0.95); padding:8px 22px; border-radius:999px;
          font-size:.68rem; letter-spacing:3.5px; text-transform:uppercase;
          font-family:"Poppins",sans-serif; font-weight:600; margin-bottom:28px;
          animation:fade-up .7s ease both;
        }
        .cta-title{
          font-size:clamp(1.9rem,4.5vw,3rem); color:#4b0082;
          line-height:1.22; margin-bottom:0; animation:fade-up .7s .15s ease both;
        }
        .cta-title span{
          background:linear-gradient(90deg,#c9a84c,#f0d078,#c9a84c);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; animation:shimmer 3s linear infinite;
        }
        .cta-divider{
          width:70px; height:2px;
          background:linear-gradient(90deg,transparent,#c9a84c,transparent);
          margin:24px auto; border-radius:2px; animation:fade-up .7s .3s ease both;
        }
        .cta-sub{
          font-size:1.18rem; color:black; max-width:500px;
          margin:0 auto 44px; line-height:1.85; animation:fade-up .7s .45s ease both;
        }
        .cta-buttons{
          display:flex; gap:16px; justify-content:center;
          flex-wrap:wrap; animation:fade-up .7s .6s ease both;
        }
        .cta-pills{
          display:flex; gap:12px; justify-content:center;
          flex-wrap:wrap; margin-top:42px; animation:fade-up .7s .75s ease both;
        }
        .cta-pill{
          display:inline-flex; align-items:center; gap:7px;
          padding:8px 18px; border-radius:999px;
          background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
          color:rgba(255,255,255,0.65); font-size:.72rem;
          font-family:"Poppins",sans-serif; letter-spacing:.5px;
          backdrop-filter:blur(6px); transition:background .3s,border-color .3s,color .3s;
        }
        .cta-pill:hover{
          background:rgba(201,168,76,0.12); border-color:rgba(201,168,76,0.35);
          color:rgba(232,204,122,0.95);
        }
        .cta-pill-dot{ width:5px; height:5px; border-radius:50%; background:currentColor; opacity:.6; }
        .cta-symbol{
          font-size:3.2rem; display:block; margin-bottom:24px;
          animation:float 5s ease-in-out infinite,fade-up .7s ease both;
          filter:drop-shadow(0 0 20px rgba(201,168,76,0.35));
        }
        @media(max-width:768px){
          .cta-section{ padding:80px 5%; }
          .cta-title{ font-size:1.8rem; }
          .cta-sub{ font-size:1.05rem; }
          .cta-pills{ gap:9px; }
          .cta-pill{ font-size:.66rem; padding:7px 14px; }
        }
        @media(max-width:480px){
          .cta-section{ padding:64px 4%; }
          .cta-buttons{ flex-direction:column; align-items:center; }
          .cta-pill{ font-size:.62rem; }
        }
      `}</style>

      <section className="cta-section">
        <CTACanvas />
        <div className="cta-center-glow" />

        <Reveal>
          <div className="cta-inner">
            <h2 className="font-marcellus cta-title">
              You Don't Have To Carry
              <br />
              Everything <span>Alone</span>
            </h2>

            <div className="cta-divider" />

            <p className="font-cormorant cta-sub">
              Sometimes one honest conversation can bring clarity, emotional
              relief and inner peace.
            </p>

            <div className="cta-buttons">
              {/* ← Book Now button popup se linked */}
              <a
                href="#"
                className="btn-gold"
                onClick={(e) => {
                  e.preventDefault();
                  onBookNow();
                }}
              >
                Book Your Session Now ✦
              </a>

              <a
                href="https://wa.me/919873523528"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
};

export default CTA;
