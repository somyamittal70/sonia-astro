import { useEffect, useRef } from "react";
import { BadgeInfo, Orbit, HeartHandshake, Sparkles } from "lucide-react";
import { Reveal, SectionHeader } from "../components/Shared";
import astrologerImg from "/astrologer.png";

const cards = [
  {
    icon: <BadgeInfo size={24} strokeWidth={1.5} color="#c9a84c" />,
    title: "15+ Years Experience",
    desc: "Helping individuals and couples navigate life's challenges with guidance and clarity.",
  },
  {
    icon: <Orbit size={24} strokeWidth={1.5} color="#c9a84c" />,
    title: "300K+ Community",
    desc: "A growing global community connected through trust, transformation, and support.",
  },
  {
    icon: <HeartHandshake size={24} strokeWidth={1.5} color="#c9a84c" />,
    title: "Global Clients",
    desc: "Providing online consultations and emotional healing support worldwide.",
  },
  {
    icon: <Sparkles size={24} strokeWidth={1.5} color="#c9a84c" />,
    title: "Certified Counsellor",
    desc: "Professional guidance focused on relationships, emotional well-being, and personal growth.",
  },
];

const Destiny = () => {
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

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      gold: Math.random() > 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.9,
      dx: (Math.random() - 0.5) * 0.00006,
      dy: (Math.random() - 0.5) * 0.00004,
    }));

    const floaters = Array.from({ length: 5 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 30 + Math.random() * 60,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.4,
    }));

    const newShoot = () => ({
      x: Math.random() * 0.7,
      y: Math.random() * 0.4,
      angle: Math.PI / 6 + (Math.random() - 0.5) * 0.5,
      speed: 0.001 + Math.random() * 0.0015,
      len: 0.07 + Math.random() * 0.09,
      prog: 0,
      timer: 0,
      delay: Math.floor(Math.random() * 600) + 100,
    });
    const shoots = Array.from({ length: 3 }, newShoot);

    const mandalaAngles = Array.from(
      { length: 8 },
      (_, i) => (i / 8) * Math.PI * 2,
    );

    let animId;

    const frame = (t) => {
      const w = canvas.width,
        h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Floating orbs
      floaters.forEach((f) => {
        const fx = (f.x + Math.sin(t * 0.00025 + f.phase) * 0.06) * w;
        const fy = (f.y + Math.cos(t * 0.0002 + f.phase * 1.2) * 0.05) * h;
        const fr = f.r * (0.88 + 0.12 * Math.sin(t * 0.0008 + f.phase));
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
        if (f.gold) {
          g.addColorStop(0, "rgba(201,168,76,0.09)");
          g.addColorStop(0.5, "rgba(201,168,76,0.03)");
          g.addColorStop(1, "rgba(201,168,76,0)");
        } else {
          g.addColorStop(0, "rgba(160,100,200,0.07)");
          g.addColorStop(1, "rgba(160,100,200,0)");
        }
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // Mandala ring (right side)
      const cx = w * 0.85,
        cy = h * 0.5;
      const rr = Math.min(w, h) * 0.28;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.00006);
      ctx.strokeStyle = "rgba(201,168,76,0.06)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, rr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, rr * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      mandalaAngles.forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * rr * 0.65, Math.sin(a) * rr * 0.65);
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        ctx.stroke();
      });
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.0001);
      ctx.strokeStyle = "rgba(180,130,230,0.04)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, rr * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Particles
      particles.forEach((p) => {
        const twinkle =
          0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * p.speed * 0.001 + p.phase));
        const px = (((p.x + p.dx * t) % 1) + 1) % 1;
        const py = (((p.y + p.dy * t) % 1) + 1) % 1;
        ctx.beginPath();
        ctx.arc(px * w, py * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${twinkle * 0.7})`
          : `rgba(160,100,220,${twinkle * 0.45})`;
        ctx.fill();
        if (p.r > 0.9 && twinkle > 0.65) {
          ctx.beginPath();
          ctx.moveTo(px * w, py * h - p.r * 2.5);
          ctx.lineTo(px * w, py * h + p.r * 2.5);
          ctx.moveTo(px * w - p.r * 2.5, py * h);
          ctx.lineTo(px * w + p.r * 2.5, py * h);
          ctx.strokeStyle = p.gold
            ? `rgba(201,168,76,${(twinkle - 0.65) * 0.5})`
            : `rgba(160,100,220,${(twinkle - 0.65) * 0.35})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      });

      // Shooting stars
      shoots.forEach((s) => {
        s.timer++;
        if (s.timer < s.delay) return;
        s.prog += s.speed;
        if (s.prog > 1.2) {
          Object.assign(s, newShoot());
          s.timer = 0;
          return;
        }
        const fade =
          s.prog < 0.12
            ? s.prog / 0.12
            : s.prog > 0.75
              ? (1 - s.prog) / 0.25
              : 1;
        const tx = s.x + Math.cos(s.angle) * s.prog * 0.3;
        const ty = s.y + Math.sin(s.angle) * s.prog * 0.22;
        const tx2 = tx - Math.cos(s.angle) * s.len;
        const ty2 = ty - Math.sin(s.angle) * s.len;
        const g = ctx.createLinearGradient(tx2 * w, ty2 * h, tx * w, ty * h);
        g.addColorStop(0, "rgba(201,168,76,0)");
        g.addColorStop(0.5, `rgba(201,168,76,${fade * 0.5})`);
        g.addColorStop(1, `rgba(255,240,180,${fade * 0.8})`);
        ctx.beginPath();
        ctx.moveTo(tx2 * w, ty2 * h);
        ctx.lineTo(tx * w, ty * h);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(tx * w, ty * h, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,200,${fade * 0.9})`;
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
      id="destiny"
      ref={wrapRef}
      style={{
        background: "#ffff",
        padding: "50px 5%",
        position: "relative",
        overflow: "hidden",
        marginTop: 40,
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
        }}
      />

      <div
        style={{
          maxWidth: 1150,
          margin: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="grid-2" style={{ gap: 80 }}>
          {/* LEFT SIDE IMAGE */}

          <Reveal dir="left">
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: 40,
                width: "100%",
                animation: "floatLuxury 6s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-3px",
                  borderRadius: "28px",
                  background: "linear-gradient(120deg, rgba(201,168,76,0.9))",
                  backgroundSize: "200% 100%",
                  animation: "goldShimmer 4s linear infinite",
                  zIndex: 0,
                  filter: "blur(1px)",
                }}
              />

              <img
                src={astrologerImg}
                alt="Counsellor"
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "24px",
                  display: "block",
                  margin: "0 auto",
                  objectFit: "cover",
                  background: "#fff",
                  padding: "3px",
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.18), 0 0 35px rgba(201,168,76,0.18)",
                }}
              />
            </div>
          </Reveal>

          {/* RIGHT SIDE CONTENT */}

          <Reveal dir="right">
            <SectionHeader
              tag="Limited Slots Available Daily"
              title={
                <>
                  Trusted Guidance
                  <br />
                  For Emotional Healing
                </>
              }
              sub="Professional counselling and spiritual guidance designed to help you overcome relationship challenges, emotional struggles, and personal obstacles with clarity and confidence."
            />

            <p
              style={{
                color: "var(--text-mid)",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                margin: "15px 0 20px",
                maxWidth: "520px",
              }}
            >
              Trusted by clients worldwide for relationship guidance, emotional
              healing, and personal transformation. Join thousands who have
              found clarity, confidence, and a renewed sense of purpose through
              expert counselling and spiritual insight.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {cards.map((c, i) => (
                <Reveal key={c.title} delay={i * 80}>
                  <div className="destiny-card" style={{ height: "100%" }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "rgba(201,168,76,0.08)",
                        border: "1px solid rgba(201,168,76,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 13px",
                      }}
                    >
                      {c.icon}
                    </div>

                    <h4
                      className="font-marcellus"
                      style={{
                        fontSize: "0.92rem",
                        color: "var(--purple-dark)",
                        marginBottom: 6,
                      }}
                    >
                      {c.title}
                    </h4>

                    <p
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-mid)",
                        lineHeight: 1.5,
                      }}
                    >
                      {c.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Destiny;
