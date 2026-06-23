import { useEffect, useRef } from "react";
import {
  Quote,
  Star,
  User,
  UserRound,
  Users,
  UserCheck,
  Globe,
  HeartHandshake,
} from "lucide-react";
import { Reveal } from "../components/Shared";

const avatars = [User, UserRound, Users, UserCheck, Globe, HeartHandshake];

const reviews = [
  {
    name: "Rahul Mehta",
    city: "Mumbai, India",
    text: "Her guidance helped me emotionally during one of the most difficult phases of my life. I felt truly seen and understood.",
  },
  {
    name: "Priya Nair",
    city: "Bengaluru, India",
    text: "I finally found clarity and emotional peace after years of confusion. Her reading changed my perspective completely.",
  },
  {
    name: "Arjun & Sunita",
    city: "Delhi, India",
    text: "She understands emotions deeply and guides with compassion. Our relationship grew stronger after every session.",
  },
  {
    name: "Vikram Sinha",
    city: "Pune, India",
    text: "Living abroad became emotionally overwhelming. Her sessions truly helped me rediscover my purpose and inner calm.",
  },
];

/* ── Canvas animation ── */
const WaveCanvas = () => {
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
    let mandalas = [];
    let shoot = null;
    let shootTimer;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      initParticles();
      initMandalas();
    };

    /* particles */
    const initParticles = () => {
      particles = Array.from({ length: 60 }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.8, 3.2),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.22, -0.06),
        alpha: rand(0.1, 0.5),
        pulse: rand(0, Math.PI * 2),
        spd: rand(0.007, 0.02),
        gold: Math.random() > 0.55,
      }));
    };

    /* mandala ring data */
    const initMandalas = () => {
      mandalas = [
        {
          cx: W * 0.05,
          cy: H * 0.1,
          r: 90,
          a: 0,
          spd: 0.004,
          petals: 6,
          clr: "rgba(201,168,76,",
        },
        {
          cx: W * 0.95,
          cy: H * 0.88,
          r: 110,
          a: 0.5,
          spd: -0.003,
          petals: 8,
          clr: "rgba(75,0,130,",
        },
        {
          cx: W * 0.9,
          cy: H * 0.12,
          r: 70,
          a: 1.2,
          spd: 0.005,
          petals: 6,
          clr: "rgba(201,168,76,",
        },
        {
          cx: W * 0.08,
          cy: H * 0.85,
          r: 80,
          a: 0.8,
          spd: -0.004,
          petals: 8,
          clr: "rgba(75,0,130,",
        },
      ];
    };

    const spawnShoot = () => {
      shoot = {
        x: rand(W * 0.05, W * 0.85),
        y: rand(H * 0.05, H * 0.3),
        len: rand(90, 140),
        alpha: 1,
        angle: rand(22, 40) * (Math.PI / 180),
        speed: rand(6, 10),
        life: 1,
      };
    };
    shootTimer = setTimeout(spawnShoot, rand(1200, 2800));

    /* draw mandala flower */
    const drawMandala = (m) => {
      m.a += m.spd;
      const alpha = 0.06 + 0.02 * Math.sin(t * 0.8 + m.cx);

      ctx.save();
      ctx.translate(m.cx, m.cy);
      ctx.rotate(m.a);

      /* outer ring */
      ctx.beginPath();
      ctx.arc(0, 0, m.r, 0, Math.PI * 2);
      ctx.strokeStyle = `${m.clr}${alpha * 1.2})`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      /* inner ring */
      ctx.beginPath();
      ctx.arc(0, 0, m.r * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = `${m.clr}${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      /* petals */
      for (let p = 0; p < m.petals; p++) {
        const ang = (p / m.petals) * Math.PI * 2;
        const px = Math.cos(ang) * m.r * 0.7;
        const py = Math.sin(ang) * m.r * 0.7;

        /* petal oval */
        ctx.save();
        ctx.translate(px / 2, py / 2);
        ctx.rotate(ang);
        ctx.scale(1, 0.45);
        ctx.beginPath();
        ctx.arc(0, 0, m.r * 0.38, 0, Math.PI * 2);
        ctx.strokeStyle = `${m.clr}${alpha * 0.8})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();

        /* spoke line */
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `${m.clr}${alpha * 0.5})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();

        /* dot at tip */
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${m.clr}${alpha * 2})`;
        ctx.fill();
      }
      ctx.restore();
    };

    /* draw wave ribbons */
    const drawWave = (offset, amplitude, freq, speed, alpha, color) => {
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      for (let x = 0; x <= W; x += 3) {
        const y =
          H / 2 +
          Math.sin((x / W) * freq * Math.PI * 2 + t * speed + offset) *
            amplitude +
          Math.sin(
            (x / W) * (freq * 1.6) * Math.PI * 2 +
              t * (speed * 0.7) +
              offset * 1.3,
          ) *
            (amplitude * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color.replace("A", `${alpha}`);
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      /* ── blobs ── */
      [
        {
          bx: W * 0.2 + Math.sin(t * 0.5) * 60,
          by: H * 0.2 + Math.cos(t * 0.4) * 40,
          r: 260,
          c: "rgba(201,168,76,0.07)",
        },
        {
          bx: W * 0.8 + Math.cos(t * 0.45) * 50,
          by: H * 0.3 + Math.sin(t * 0.6) * 35,
          r: 290,
          c: "rgba(75,0,130,0.055)",
        },
        {
          bx: W * 0.5 + Math.sin(t * 0.35) * 70,
          by: H * 0.7 + Math.cos(t * 0.5) * 40,
          r: 320,
          c: "rgba(201,168,76,0.05)",
        },
        {
          bx: W * 0.15 + Math.cos(t * 0.7) * 30,
          by: H * 0.75 + Math.sin(t * 0.65) * 25,
          r: 200,
          c: "rgba(75,0,130,0.04)",
        },
        {
          bx: W * 0.85 + Math.sin(t * 0.55) * 35,
          by: H * 0.8 + Math.cos(t * 0.45) * 30,
          r: 180,
          c: "rgba(201,168,76,0.04)",
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

      /* ── waves ── */
      const waveColor = "rgba(75,0,130,A)";
      const goldWave = "rgba(201,168,76,A)";
      drawWave(0, H * 0.04, 2.5, 0.3, 0.04, waveColor);
      drawWave(1.2, H * 0.03, 3, 0.45, 0.03, goldWave);
      drawWave(2.5, H * 0.025, 3.5, 0.25, 0.025, waveColor);
      drawWave(0.7, H * 0.035, 2, 0.38, 0.03, goldWave);

      /* ── mandalas ── */
      mandalas.forEach(drawMandala);

      /* ── particles ── */
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.spd;
        const a = p.alpha * (0.55 + 0.45 * Math.sin(p.pulse));
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
          : `rgba(75,0,130,${a * 0.7})`;
        ctx.fill();

        if (p.r > 2.2) {
          ctx.strokeStyle = p.gold
            ? `rgba(201,168,76,${a * 0.5})`
            : `rgba(75,0,130,${a * 0.4})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(p.x - p.r * 1.8, p.y);
          ctx.lineTo(p.x + p.r * 1.8, p.y);
          ctx.moveTo(p.x, p.y - p.r * 1.8);
          ctx.lineTo(p.x, p.y + p.r * 1.8);
          ctx.stroke();
        }
      });

      /* ── constellation lines ── */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 85) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(75,0,130,${(1 - d / 85) * 0.07})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      /* ── shooting star ── */
      if (shoot) {
        shoot.x += Math.cos(shoot.angle) * shoot.speed;
        shoot.y += Math.sin(shoot.angle) * shoot.speed;
        shoot.life -= 0.02;
        shoot.alpha = shoot.life;
        const tail = ctx.createLinearGradient(
          shoot.x - Math.cos(shoot.angle) * shoot.len,
          shoot.y - Math.sin(shoot.angle) * shoot.len,
          shoot.x,
          shoot.y,
        );
        tail.addColorStop(0, "transparent");
        tail.addColorStop(1, `rgba(201,168,76,${shoot.alpha * 0.95})`);
        ctx.beginPath();
        ctx.moveTo(
          shoot.x - Math.cos(shoot.angle) * shoot.len,
          shoot.y - Math.sin(shoot.angle) * shoot.len,
        );
        ctx.lineTo(shoot.x, shoot.y);
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(shoot.x, shoot.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,242,180,${shoot.alpha})`;
        ctx.fill();
        if (shoot.life <= 0 || shoot.x > W + 60 || shoot.y > H + 60) {
          shoot = null;
          shootTimer = setTimeout(spawnShoot, rand(4000, 8000));
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

/* ── Main Component ── */
const Testimonials = () => (
  <>
    <style>{`
      .testi-section{
        background:#fff;
        padding:110px 5% 120px;
        position:relative;
        overflow:hidden;
      }

      /* soft edge fade top/bottom */
      .testi-section::before,
      .testi-section::after{
        content:"";
        position:absolute;
        left:0;right:0;height:100px;
        pointer-events:none;z-index:1;
      }
      .testi-section::before{ top:0;    background:linear-gradient(to bottom,#fff,transparent); }
      .testi-section::after { bottom:0; background:linear-gradient(to top,#fff,transparent);    }

      .testi-inner{
        max-width:1200px;
        margin:0 auto;
        position:relative;
        z-index:2;
      }

      /* section badge */
      .testi-badge{
        display:inline-flex;
        align-items:center;
        gap:8px;
        background:rgba(201,168,76,0.1);
        border:1px solid rgba(201,168,76,0.3);
        color:#8a6a10;
        padding:7px 18px;
        border-radius:999px;
        font-size:.68rem;
        letter-spacing:3.5px;
        text-transform:uppercase;
        font-family: "Poppins", sans-serif;
        font-weight:600;
        margin-bottom:16px;
      }

      /* GRID */
      .testi-grid{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:26px;
        margin-top:56px;
      }

      /* CARD */
      .testi-card-new{
        background:#fff;
        border:1px solid rgba(75,0,130,0.09);
        border-radius:24px;
        padding:32px 28px;
        position:relative;
        overflow:hidden;
        transition:transform .4s cubic-bezier(.22,1,.36,1),
                   box-shadow .4s ease,
                   border-color .3s ease;
        display:flex;
        flex-direction:column;
        height:100%;
      }

      /* left accent bar slide */
      .testi-card-new::before{
        content:"";
        position:absolute;
        left:0;top:0;bottom:0;
        width:3px;
        background:linear-gradient(180deg,#4b0082,#c9a84c);
        transform:scaleY(0);
        transform-origin:top;
        transition:transform .45s ease;
      }
      .testi-card-new:hover::before{ transform:scaleY(1); }

      .testi-card-new:hover{
        transform:translateY(-10px);
        box-shadow:0 28px 70px rgba(75,0,130,0.13),
                   0 0 0 1px rgba(201,168,76,0.18);
        border-color:rgba(75,0,130,0.16);
      }

      /* decorative corner glow */
      .testi-corner{
        position:absolute;
        top:0;right:0;
        width:80px;height:80px;
        border-radius:0 24px 0 80px;
        background:linear-gradient(135deg,rgba(201,168,76,0.09),transparent);
        pointer-events:none;
        transition:background .3s;
      }
      .testi-card-new:hover .testi-corner{
        background:linear-gradient(135deg,rgba(201,168,76,0.16),transparent);
      }

      /* bottom corner */
      .testi-corner-b{
        position:absolute;
        bottom:0;left:0;
        width:60px;height:60px;
        border-radius:60px 0 0 24px;
        background:linear-gradient(315deg,rgba(75,0,130,0.05),transparent);
        pointer-events:none;
      }

      /* quote icon area */
      .testi-quote-icon{
        margin-bottom:18px;
        display:flex;
        align-items:center;
        gap:8px;
      }

      /* star row */
      .testi-stars{
        display:flex;
        gap:4px;
        margin-bottom:20px;
      }

      /* author row */
      .testi-author{
        display:flex;
        align-items:center;
        gap:14px;
        margin-top:auto;
        padding-top:20px;
        border-top:1px solid rgba(75,0,130,0.07);
      }

      .testi-avatar{
        width:46px;height:46px;border-radius:50%;
        background:linear-gradient(135deg,rgba(75,0,130,0.1),rgba(201,168,76,0.1));
        border:1px solid rgba(201,168,76,0.25);
        display:flex;align-items:center;justify-content:center;
        flex-shrink:0;
        transition:border-color .3s, background .3s;
      }
      .testi-card-new:hover .testi-avatar{
        border-color:rgba(201,168,76,0.5);
        background:linear-gradient(135deg,rgba(75,0,130,0.15),rgba(201,168,76,0.15));
      }

      /* RESPONSIVE */
      @media(max-width:1200px){
  .testi-grid{
    grid-template-columns:repeat(2,1fr);
  }
}

@media(max-width:768px){
  .testi-grid{
    grid-template-columns:1fr;
  }
}
      @media(max-width:480px){
        .testi-section{ padding:64px 4%; }
        .testi-card-new{ border-radius:20px; padding:22px 18px; }
      }
    `}</style>

    <section id="testimonials" className="testi-section">
      {/* Animated background canvas */}
      <WaveCanvas />

      <div className="testi-inner">
        {/* Heading */}
        <Reveal>
          <div style={{ textAlign: "center" }}>
            <h2
              className="font-marcellus"
              style={{
                fontSize: "clamp(2rem,4vw,3.2rem)",
                color: "#2d004f",
                margin: "8px 0 16px",
                lineHeight: 1.2,
              }}
            >
              Our Testimonials
            </h2>

            <div
              style={{
                width: 70,
                height: 3,
                background: "linear-gradient(90deg,#c9a84c,#f0d078,#c9a84c)",
                backgroundSize: "200% auto",
                margin: "0 auto 20px",
                borderRadius: 10,
                animation: "shimmer 3s linear infinite",
              }}
            />

            <p
              className="font-cormorant"
              style={{
                fontSize: "1.12rem",
                color: "#746d8d",
                fontStyle: "italic",
                maxWidth: 600,
                margin: "0 auto",
                lineHeight: 1.9,
              }}
            >
              Real transformations from real people who found their path through
              the stars.
            </p>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="testi-grid">
          {reviews.map((r, i) => {
            const AvatarIcon = avatars[i % avatars.length];
            return (
              <Reveal key={r.name} delay={i * 80}>
                <div className="testi-card-new">
                  {/* decorative corners */}
                  <div className="testi-corner" />
                  <div className="testi-corner-b" />

                  {/* Quote + star number */}
                  <div className="testi-quote-icon">
                    <Quote
                      size={26}
                      strokeWidth={1.5}
                      color="#c9a84c"
                      style={{ opacity: 0.75 }}
                    />
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: "#c9a84c",
                        letterSpacing: "1.5px",
                        fontWeight: 600,
                        fontFamily: "'DM Sans',sans-serif",
                        textTransform: "uppercase",
                      }}
                    >
                      Verified Review
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="testi-stars">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={15} color="#c9a84c" fill="#c9a84c" />
                    ))}
                  </div>

                  {/* Review text */}
                  <p
                    className="font-cormorant"
                    style={{
                      fontSize: "1.08rem",
                      color: "#4a3060",
                      lineHeight: 1.82,
                      fontStyle: "italic",
                      flexGrow: 1,
                      marginBottom: 0,
                    }}
                  >
                    "{r.text}"
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  </>
);

export default Testimonials;
