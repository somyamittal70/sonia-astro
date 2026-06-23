import { useState, useEffect, useRef } from "react";
import { Reveal } from "../components/Shared";

const items = [
  [
    "Are sessions online?",
    "Yes. Sessions are available worldwide through WhatsApp, Zoom or Google Meet.",
  ],
  [
    "Are consultations confidential?",
    "Absolutely. Every session is completely private and confidential.",
  ],
  [
    "Which countries do you serve?",
    "Clients connect globally from USA, UK, Canada, UAE, Australia, Singapore and many other countries.",
  ],
  [
    "Do I need spiritual knowledge before booking?",
    "No. Sessions are simple, emotionally supportive and practical.",
  ],
  [
    "How do I choose the right service?",
    "You can book the clarity session and Sonia will guide you toward the most suitable consultation.",
  ],
];

/* ─────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    canvas.width = W;
    canvas.height = H;

    const TOTAL = 40;

    const rand = (a, b) => Math.random() * (b - a) + a;

    const makeParticle = () => ({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1, 3),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.2, -0.05),
      alpha: rand(0.15, 0.5),
      pulse: rand(0, Math.PI * 2),
      speed: rand(0.008, 0.02),
      gold: Math.random() > 0.6,
    });

    let particles = Array.from({ length: TOTAL }, makeParticle);

    let blobT = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      blobT += 0.004;

      /* animated blobs */
      const blobs = [
        {
          x: W * 0.15 + Math.sin(blobT * 0.7) * 40,
          y: H * 0.2 + Math.cos(blobT * 0.5) * 30,
          r: 240,
          color: "rgba(201,168,76,0.06)",
        },
        {
          x: W * 0.85 + Math.cos(blobT * 0.6) * 35,
          y: H * 0.25 + Math.sin(blobT * 0.8) * 25,
          r: 260,
          color: "rgba(75,0,130,0.05)",
        },
      ];

      blobs.forEach((b) => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);

        g.addColorStop(0, b.color);
        g.addColorStop(1, "transparent");

        ctx.fillStyle = g;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      /* particles */
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.speed;

        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

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
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;

      canvas.width = W;
      canvas.height = H;

      particles = Array.from({ length: TOTAL }, makeParticle);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
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

/* ─────────────────────────────────────────────
   FAQ COMPONENT
───────────────────────────────────────────── */
const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <>
      <style>
        {`
          .faq-section{
            background:#ffffff;
            padding:110px 5%;
            position:relative;
            overflow:hidden;
          }

          .faq-section::before,
          .faq-section::after{
            content:"";
            position:absolute;
            left:0;
            right:0;
            height:120px;
            pointer-events:none;
            z-index:1;
          }

          .faq-section::before{
            top:0;
            background:linear-gradient(
              to bottom,
              rgba(255,255,255,1),
              transparent
            );
          }

          .faq-section::after{
            bottom:0;
            background:linear-gradient(
              to top,
              rgba(255,255,255,1),
              transparent
            );
          }

          .faq-container{
            max-width:850px;
            margin:0 auto;
            position:relative;
            z-index:2;
          }

          .faq-tag{
            display:inline-flex;
            align-items:center;
            gap:10px;
            background:rgba(201,168,76,0.1);
            border:1px solid rgba(201,168,76,0.3);
            color:#8a6a10;
            padding:8px 20px;
            border-radius:999px;
            font-size:.7rem;
            letter-spacing:3px;
            text-transform:uppercase;
            font-family: "Poppins", sans-serif;
            font-weight:600;
            margin-bottom:20px;
          }

          .faq-item{
            background:#fff;
            border:1px solid rgba(75,0,130,0.09);
            border-radius:22px;
            margin-bottom:18px;
            overflow:hidden;
            transition:.4s ease;
            box-shadow:0 10px 35px rgba(0,0,0,.04);
            position:relative;
          }

          .faq-item::before{
            content:"";
            position:absolute;
            top:0;
            left:0;
            width:4px;
            height:100%;
            background:linear-gradient(
              180deg,
              #4b0082,
              #c9a84c
            );
            opacity:0;
            transition:.35s ease;
          }

          .faq-item:hover{
            transform:translateY(-4px);
            box-shadow:
              0 20px 50px rgba(75,0,130,.08);
            border-color:rgba(75,0,130,0.15);
          }

          .faq-item:hover::before{
            opacity:1;
          }

          .faq-question{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:20px;
            padding:24px 28px;
            cursor:pointer;
          }

          .faq-toggle{
            width:34px;
            height:34px;
            border-radius:50%;
            background:rgba(75,0,130,0.07);
            color:#4b0082;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:1.2rem;
            flex-shrink:0;
            transition:.35s ease;
          }

          .faq-toggle.open{
            background:#4b0082;
            color:#fff;
            transform:rotate(180deg);
          }

          .faq-answer{
            max-height:0;
            overflow:hidden;
            transition:max-height .45s ease;
          }

          .faq-answer.open{
            max-height:300px;
          }

          .faq-answer p{
            padding:
              0 28px 24px 28px;
          }

          @media(max-width:768px){

            .faq-section{
              padding:80px 5%;
            }

            .faq-question{
              padding:20px;
            }

            .faq-answer p{
              padding:
                0 20px 20px 20px;
              font-size:.95rem !important;
            }
          }

          @media(max-width:480px){

            .faq-section{
              padding:65px 4%;
            }

            .faq-item{
              border-radius:18px;
            }

            .faq-question{
              padding:18px 16px;
              gap:14px;
            }

            .faq-question h4{
              font-size:.92rem !important;
            }

            .faq-toggle{
              width:30px;
              height:30px;
              font-size:1rem;
            }

            .faq-answer p{
              padding:
                0 16px 18px 16px;
              line-height:1.7 !important;
            }
          }
        `}
      </style>

      <section id="faq" className="faq-section">
        {/* Animated Background */}
        <ParticleCanvas />

        <div className="faq-container">
          {/* Heading */}
          <Reveal>
            <div
              style={{
                textAlign: "center",
                marginBottom: 60,
              }}
            >
              <h2
                className="font-marcellus"
                style={{
                  fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
                  color: "#2d004f",
                  marginBottom: 14,
                }}
              >
                Honest answers to the questions we hear most from first-time
                seekers.
              </h2>
              <div
                style={{
                  width: 70,
                  height: 3,
                  background: "linear-gradient(90deg,#c9a84c,#f0d078,#c9a84c)",
                  backgroundSize: "200% auto",
                  margin: "0 auto 18px",
                  borderRadius: 10,
                }}
              />
            </div>
          </Reveal>

          {/* FAQ ITEMS */}
          <div>
            {items.map(([q, a], i) => (
              <Reveal key={q} delay={i * 70}>
                <div className="faq-item">
                  <div
                    className="faq-question"
                    onClick={() => setOpen(open === i ? -1 : i)}
                  >
                    <h4
                      className="font-marcellus"
                      style={{
                        fontSize: "1rem",
                        color: "#2d004f",
                        flex: 1,
                        lineHeight: 1.5,
                      }}
                    >
                      {q}
                    </h4>

                    <div className={`faq-toggle ${open === i ? "open" : ""}`}>
                      {open === i ? "−" : "+"}
                    </div>
                  </div>

                  <div className={`faq-answer ${open === i ? "open" : ""}`}>
                    <p
                      className="font-cormorant"
                      style={{
                        fontSize: "1rem",
                        color: "#6b6680",
                        lineHeight: 1.9,
                      }}
                    >
                      {a}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;