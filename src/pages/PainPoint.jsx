import { useEffect, useRef, useState, useCallback } from "react";
import {
  HeartCrack,
  Users,
  CloudRain,
  Brain,
  Home,
  Briefcase,
  BatteryLow,
  Sparkles,
  HandHeart,
} from "lucide-react";

const painPoints = [
  {
    icon: <HeartCrack size={22} />,
    text: "Relationship Confusion",
    sub: "When love feels distant",
    image: "/relationship.jpg",
  },
  {
    icon: <Users size={22} />,
    text: "Marriage Stress",
    sub: "Navigating life together",
    image: "/marriage.jpg",
  },
  {
    icon: <CloudRain size={22} />,
    text: "Emotional Loneliness",
    sub: "Feeling unseen abroad",
    image: "/loneliness.jpg",
  },
  {
    icon: <Brain size={22} />,
    text: "Anxiety & Overthinking",
    sub: "When the mind won't rest",
    image: "/anxiety.jpg",
  },
  {
    icon: <Home size={22} />,
    text: "Family Pressure From India",
    sub: "Expectations from back home",
    image: "/family.jpg",
  },
  {
    icon: <Briefcase size={22} />,
    text: "Career Uncertainty",
    sub: "Finding your path forward",
    image: "/career.jpg",
  },
  {
    icon: <BatteryLow size={22} />,
    text: "Emotional Exhaustion",
    sub: "Running on empty inside",
    image: "/emotional.jpg",
  },
  {
    icon: <Sparkles size={22} />,
    text: "Spiritual Emptiness",
    sub: "Searching for deeper meaning",
    image: "/spiritual.jpg",
  },
  {
    icon: <HandHeart size={22} />,
    text: "Lack Of Emotional Support",
    sub: "No one to truly listen",
    image: "/support.jpg",
  },
];

// Infinite clone strategy:
// Track order: [clone of last N] + [original N] + [clone of first N]
// Real index lives in the middle block (offset N)
// When we hit a clone, we silently jump to the real counterpart with no transition

const N = painPoints.length;
const INTERVAL = 3000;
const CLONE_COUNT = 3; // how many clones on each side

// Build the extended list: last CLONE_COUNT + all originals + first CLONE_COUNT
const buildExtended = () => {
  const tail = painPoints.slice(N - CLONE_COUNT);
  const head = painPoints.slice(0, CLONE_COUNT);
  return [...tail, ...painPoints, ...head];
};

const extended = buildExtended();
// Real cards start at index CLONE_COUNT in extended array
const REAL_OFFSET = CLONE_COUNT;

const PainPoint = () => {
  const trackRef = useRef(null);
  const autoRef = useRef(null);
  const progressRef = useRef(null);
  const progressPctRef = useRef(0);
  const isTransitioning = useRef(false);

  // extIdx = current index in extended array (starts pointing at first real card)
  const [extIdx, setExtIdx] = useState(REAL_OFFSET);
  const extIdxRef = useRef(REAL_OFFSET);

  const [progress, setProgress] = useState(0);
  const isPausedRef = useRef(false);

  // realIdx = 0..N-1, derived from extIdx
  const realIdx = ((extIdx - REAL_OFFSET) % N + N) % N;

  const getCardWidth = useCallback(() => {
    const card = trackRef.current?.querySelector(".pp-card");
    if (!card) return 360;
    return card.offsetWidth + 20;
  }, []);

  // Move track to given extIdx, with or without animation
  const moveTo = useCallback(
    (idx, animate = true) => {
      if (!trackRef.current) return;
      const cardW = getCardWidth();
      const offset = idx * cardW;
      if (!animate) {
        trackRef.current.style.transition = "none";
      } else {
        trackRef.current.style.transition =
          "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      }
      trackRef.current.style.transform = `translateX(${-offset}px)`;
    },
    [getCardWidth]
  );

  // After an animated move, check if we landed on a clone and silently jump
  const handleTransitionEnd = useCallback(() => {
    isTransitioning.current = false;
    const idx = extIdxRef.current;
    let jump = null;

    if (idx < REAL_OFFSET) {
      // Landed on left clone → jump to real counterpart on the right
      jump = idx + N;
    } else if (idx >= REAL_OFFSET + N) {
      // Landed on right clone → jump to real counterpart on the left
      jump = idx - N;
    }

    if (jump !== null) {
      extIdxRef.current = jump;
      setExtIdx(jump);
      moveTo(jump, false);
      // Re-enable transition after a tick
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (trackRef.current) {
            trackRef.current.style.transition =
              "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          }
        });
      });
    }
  }, [moveTo]);

  // Navigate to a real index (0..N-1)
  const goToReal = useCallback(
    (rIdx) => {
      const newExt = REAL_OFFSET + rIdx;
      extIdxRef.current = newExt;
      setExtIdx(newExt);
      moveTo(newExt, true);
      // reset progress
      setProgress(0);
      progressPctRef.current = 0;
    },
    [moveTo]
  );

  const stepForward = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    const next = extIdxRef.current + 1;
    extIdxRef.current = next;
    setExtIdx(next);
    moveTo(next, true);
    setProgress(0);
    progressPctRef.current = 0;
  }, [moveTo]);

  const stepBack = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    const prev = extIdxRef.current - 1;
    extIdxRef.current = prev;
    setExtIdx(prev);
    moveTo(prev, true);
    setProgress(0);
    progressPctRef.current = 0;
  }, [moveTo]);

  // Auto-play
  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    clearInterval(progressRef.current);
    progressPctRef.current = 0;
    setProgress(0);

    progressRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      progressPctRef.current += 100 / (INTERVAL / 50);
      setProgress(Math.min(100, progressPctRef.current));
    }, 50);

    autoRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      stepForward();
    }, INTERVAL);
  }, [stepForward]);

  const pauseAuto = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resumeAuto = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  // On mount: position track at first real card with no animation
  useEffect(() => {
    moveTo(REAL_OFFSET, false);
    startAuto();
    return () => {
      clearInterval(autoRef.current);
      clearInterval(progressRef.current);
    };
  }, []);

  // Attach transitionend listener
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("transitionend", handleTransitionEnd);
    return () => track.removeEventListener("transitionend", handleTransitionEnd);
  }, [handleTransitionEnd]);

  // Drag / swipe
  const dragStartX = useRef(null);
  const touchStartX = useRef(null);

  const onMouseDown = (e) => {
    dragStartX.current = e.clientX;
    pauseAuto();
  };
  const onMouseUp = (e) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? stepForward() : stepBack();
    }
    dragStartX.current = null;
    resumeAuto();
  };
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    pauseAuto();
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? stepForward() : stepBack();
    }
    touchStartX.current = null;
    resumeAuto();
  };

  return (
    <>
      <style>{`
        .pp-section {
          position: relative;
          padding: 64px 0 72px;
          overflow: hidden;
        }
        .pp-tag {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 999px;
          padding: 6px 18px;
          margin-bottom: 22px;
          background: rgba(201,168,76,0.06);
        }
        .pp-title {
          font-size: clamp(1.7rem, 3.5vw, 2.8rem);
          font-weight: 500;
          color: #2d004f;
          line-height: 1.22;
          margin: 0 0 18px;
        }
        .pp-gold-line {
          width: 72px;
          height: 2.5px;
          margin: 0 auto 20px;
          border-radius: 999px;
          background: linear-gradient(90deg, #c9a84c 0%, #f5df9a 50%, #c9a84c 100%);
        }
        .pp-subtitle {
          max-width: 640px;
          margin: 0 auto;
          font-size: 1rem;
          line-height: 1.85;
          color: #746d8d;
        }
        .pp-viewport {
          overflow: hidden;
          padding: 12px 0 16px;
          cursor: grab;
          user-select: none;
        }
        .pp-viewport:active { cursor: grabbing; }
        .pp-track {
          display: flex;
          gap: 20px;
          padding: 0 24px;
          will-change: transform;
        }
        .pp-card {
          position: relative;
          width: 340px;
          min-width: 340px;
          height: 240px;
          border-radius: 24px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: flex-end;
          padding: 28px 26px;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .pp-card:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow: 0 24px 56px rgba(0,0,0,0.28);
        }
        .pp-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s ease;
          z-index: 0;
          pointer-events: none;
        }
        .pp-card:hover .pp-card-img {
          transform: scale(1.07);
        }
        .pp-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,2,20,0.92) 0%,
            rgba(8,2,20,0.50) 45%,
            rgba(8,2,20,0.15) 100%
          );
          z-index: 1;
        }
        .pp-card-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pp-card-icon {
          width: 54px;
          height: 54px;
          min-width: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(201,168,76,0.5);
          color: #c9a84c;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .pp-card-text {
          color: #fff;
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.45;
        }
        .pp-card-text small {
          display: block;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.55);
          font-weight: 400;
          margin-top: 3px;
        }
        .pp-card-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2.5px;
          background: linear-gradient(90deg, #c9a84c, #f5df9a, #c9a84c);
          z-index: 3;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .pp-card.is-active .pp-card-accent { opacity: 1; }
        .pp-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 28px;
          flex-wrap: wrap;
          padding: 0 16px;
        }
        .pp-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          background: rgba(201,168,76,0.22);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .pp-dot.active {
          width: 28px;
          border-radius: 4px;
          background: rgba(201,168,76,0.3);
        }
        .pp-dot:hover:not(.active) {
          background: rgba(201,168,76,0.55);
          transform: scale(1.2);
        }
        .pp-dot-fill {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          background: #c9a84c;
          border-radius: 4px;
          transition: width 0.05s linear;
        }
        .pp-support-card {
          max-width: 760px;
          width: 100%;
          text-align: center;
          padding: 52px 44px;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid rgba(201,168,76,0.18);
          box-shadow: 0 20px 60px rgba(45,0,79,0.07);
          position: relative;
          overflow: hidden;
        }
        .pp-support-card::before {
          content: "";
          position: absolute;
          top: 0; right: 0;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(201,168,76,0.09), transparent 70%);
          pointer-events: none;
        }
        .pp-support-icon {
          width: 68px; height: 68px;
          margin: 0 auto 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.28);
        }
        .pp-support-title {
          font-size: clamp(1.3rem, 2.6vw, 1.9rem);
          font-weight: 500;
          color: #2d004f;
          margin-bottom: 14px;
          line-height: 1.3;
        }
        .pp-support-msg {
          max-width: 620px;
          margin: 0 auto;
          font-size: 1rem;
          line-height: 1.95;
          color: #746d8d;
        }
        @media (max-width: 600px) {
          .pp-card { width: 280px; min-width: 280px; height: 200px; padding: 22px 20px; }
          .pp-card-text { font-size: 0.95rem; }
          .pp-support-card { padding: 36px 24px; }
        }
      `}</style>

      <section className="pp-section">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, padding: "0 24px" }}>
          <h2 className="pp-title font-marcellus">
            Sometimes Success Abroad
            <br />
            Comes With Silent Emotional Struggles
          </h2>
          <div className="pp-gold-line" />
          <p className="pp-subtitle">
            Many overseas Indians silently carry emotional burdens while
            building a successful life abroad.
          </p>
        </div>

        {/* Slider */}
        <div
          className="pp-viewport"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="pp-track" ref={trackRef}>
            {extended.map((item, i) => {
              // figure out real index for this extended slot
              const slotReal = ((i - REAL_OFFSET) % N + N) % N;
              const isActive = slotReal === realIdx && i === extIdx;
              return (
                <div
                  key={i}
                  className={`pp-card${isActive ? " is-active" : ""}`}
                  onMouseEnter={pauseAuto}
                  onMouseLeave={resumeAuto}
                >
                  <div className="pp-card-accent" />
                  <img
                    src={item.image}
                    alt={item.text}
                    className="pp-card-img"
                    draggable={false}
                  />
                  <div className="pp-card-overlay" />
                  <div className="pp-card-content">
                    <div className="pp-card-icon">{item.icon}</div>
                    <div className="pp-card-text">
                      {item.text}
                      <small>{item.sub}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="pp-dots">
          {painPoints.map((_, i) => (
            <button
              key={i}
              className={`pp-dot${realIdx === i ? " active" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                goToReal(i);
                startAuto();
              }}
            >
              <div
                className="pp-dot-fill"
                style={{ width: realIdx === i ? `${progress}%` : "0%" }}
              />
            </button>
          ))}
        </div>

        {/* Bottom support card */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <div className="pp-support-card">
            <h3 className="pp-support-title font-marcellus">
              You Don't Have To Carry It Alone
            </h3>
            <div className="pp-gold-line" />
            <p className="pp-support-msg">
              Professional guidance, emotional support, and spiritual clarity
              can help you move forward with greater confidence, balance, and
              inner peace — no matter where life has taken you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PainPoint;