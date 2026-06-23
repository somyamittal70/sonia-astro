import { useState, useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";

/* ─── tiny reusable field ─── */
const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label
      style={{
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "#4a1a7a",
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "10px 13px",
  borderRadius: 10,
  border: "1.5px solid rgba(74,26,122,0.18)",
  background: "#faf8ff",
  fontSize: "0.84rem",
  color: "#1c0535",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const FloatingStars = () =>
  Array.from({ length: 7 }, (_, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        top: `${[8, 18, 72, 85, 12, 60, 40][i]}%`,
        left: `${[5, 88, 92, 6, 50, 78, 20][i]}%`,
        color: i % 2 === 0 ? "#c9a84c" : "rgba(74,26,122,0.25)",
        fontSize: ["10px", "7px", "9px", "6px", "8px", "7px", "10px"][i],
        animation: `popStar ${2.5 + i * 0.4}s ease-in-out infinite`,
        animationDelay: `${i * 0.35}s`,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      ✦
    </div>
  ));

const PopUp = ({ isOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    tob: "",
    consultationType: "",
    question: "",
  });

  // Track whether user has manually closed — prevents auto-open from reopening
  const manuallyClosed = useRef(false);

  /* Auto-open on page load — only if not manually closed */
  useEffect(() => {
    const t = setTimeout(() => {
      if (!manuallyClosed.current) setOpen(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  /* Sync with external isOpen prop (Book Now buttons) */
  useEffect(() => {
    if (isOpen === true) {
      manuallyClosed.current = false;
      setOpen(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    manuallyClosed.current = true;
    setOpen(false);
    onClose?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = new FormData();
      payload.append("first_name", formData.firstName);
      payload.append("last_name", formData.lastName);
      payload.append("email", formData.email);
      payload.append("dob", formData.dob);
      payload.append("tob", formData.tob);
      payload.append("consultation_type", formData.consultationType);
      payload.append("question", formData.question);

      const response = await fetch("https://landing.theastropalace.com/send-mail.php", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Try to parse JSON response if available, otherwise treat as success
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
        if (result.success === false) {
          throw new Error(result.message || "Something went wrong. Please try again.");
        }
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setErrorMsg("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        tob: "",
        consultationType: "",
        question: "",
      });
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Lato:wght@300;400;600&display=swap');

        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 0, 30, 0.72);
          backdrop-filter: blur(6px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: overlayIn 0.35s ease forwards;
        }

        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .popup-card {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 560px;
          max-height: 92vh;
          overflow-y: auto;
          position: relative;
          box-shadow:
            0 0 0 1px rgba(201,168,76,0.25),
            0 32px 80px rgba(28,5,53,0.45),
            0 0 60px rgba(201,168,76,0.08);
          animation: cardIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          scrollbar-width: thin;
          scrollbar-color: rgba(74,26,122,0.2) transparent;
        }

        .popup-card::-webkit-scrollbar { width: 4px; }
        .popup-card::-webkit-scrollbar-thumb {
          background: rgba(74,26,122,0.2);
          border-radius: 4px;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.88) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .popup-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: all 0.2s;
          z-index: 100000;
        }

        .popup-close:hover {
          background: rgba(255,255,255,0.9);
          color: #4a1a7a;
          transform: rotate(90deg);
        }

        .popup-header {
          background: linear-gradient(135deg, #2e0057 0%, #4b0082 60%, #3a006f 100%);
          padding: 32px 36px 28px;
          border-radius: 22px 22px 0 0;
          position: relative;
          overflow: hidden;
        }

        .popup-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 15% 50%, rgba(201,168,76,0.18), transparent 40%),
            radial-gradient(circle at 85% 20%, rgba(255,255,255,0.07), transparent 35%);
          pointer-events: none;
        }

        .popup-header-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .popup-body {
          padding: 28px 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .input-focus:focus {
          border-color: #c9a84c !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12) !important;
          background: #fff !important;
        }

        .popup-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2e0057 0%, #6b2fa0 100%);
          color: #f0d98a;
          border: none;
          border-radius: 12px;
          font-family: 'Marcellus', serif;
          font-size: 1rem;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 6px 22px rgba(74,26,122,0.35);
          position: relative;
          overflow: hidden;
        }

        .popup-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.12), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .popup-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(74,26,122,0.45);
        }

        .popup-submit:hover:not(:disabled)::after { opacity: 1; }

        .popup-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .popup-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
          margin: 2px 0;
        }

        @keyframes popStar {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.9; transform: scale(1.5); }
        }

        .success-tick {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2e0057, #6b2fa0);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
          box-shadow: 0 8px 24px rgba(74,26,122,0.3);
          animation: bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes bounceIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .error-box {
          background: #fff0f0;
          border: 1.5px solid #f5c0c0;
          border-radius: 10px;
          padding: 10px 14px;
          color: #c0392b;
          font-size: 0.8rem;
          line-height: 1.5;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(240,217,138,0.4);
          border-top-color: #f0d98a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @media (max-width: 520px) {
          .popup-header  { padding: 26px 22px 22px; }
          .popup-body    { padding: 20px 22px 26px; }
          .form-row      { grid-template-columns: 1fr; gap: 14px; }
          .popup-card    { border-radius: 18px; }
          .popup-header  { border-radius: 16px 16px 0 0; }
        }
      `}</style>

      <div
        className="popup-overlay"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div className="popup-card">

          {/* Close */}
          <button className="popup-close" onClick={handleClose}>
            <X size={16} strokeWidth={2.2} />
          </button>

          {/* Header */}
          <div className="popup-header">
            <div className="popup-header-ring" style={{ width: 280, height: 280, top: -120, right: -80 }} />
            <div className="popup-header-ring" style={{ width: 180, height: 180, top: -70, right: -30 }} />
            <FloatingStars />

            <div style={{ marginBottom: 14, position: "relative", zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Marcellus', serif", color: "#fff", fontSize: "clamp(1.3rem, 4vw, 1.65rem)", lineHeight: 1.3, margin: 0 }}>
                Book Your Personal<br />
                <span style={{ color: "#c9a84c" }}>Clarity Session</span>
              </h2>

              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", marginTop: 8, lineHeight: 1.6 }}>
                Get clarity on life, career &amp; relationships — guided by the stars.
              </p>
            </div>

            <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c, rgba(201,168,76,0.2))", borderRadius: 2, width: "40%", position: "relative", zIndex: 1 }} />
          </div>

          {/* Body */}
          <div className="popup-body">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                <div className="success-tick">✦</div>
                <h3 style={{ fontFamily: "'Marcellus', serif", color: "#2e0057", fontSize: "1.3rem", marginBottom: 10 }}>
                  Session Requested!
                </h3>
                <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 320, margin: "0 auto 24px" }}>
                  Thank you! We'll reach out within 24 hours to confirm your consultation.
                </p>
                <button onClick={handleClose} className="popup-submit" style={{ maxWidth: 200 }}>
                  Close ✦
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-row">
                  <Field label="First Name">
                    <input
                      className="input-focus"
                      style={inputStyle}
                      placeholder="Ravi"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field label="Last Name">
                    <input
                      className="input-focus"
                      style={inputStyle}
                      placeholder="Sharma"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Field>
                </div>

                <Field label="Email Address">
                  <input
                    className="input-focus"
                    style={inputStyle}
                    type="email"
                    placeholder="ravi@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <div className="form-row">
                  <Field label="Date of Birth">
                    <input
                      className="input-focus"
                      style={inputStyle}
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field label="Time of Birth">
                    <input
                      className="input-focus"
                      style={inputStyle}
                      type="time"
                      name="tob"
                      value={formData.tob}
                      onChange={handleChange}
                    />
                  </Field>
                </div>

                <Field label="Consultation Type">
                  <select
                    className="input-focus"
                    style={{ ...inputStyle, cursor: "pointer" }}
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic…</option>
                    {["Marriage Challenges", "Emotional Healing", "Career Confusion", "Personal Growth", "Spiritual Awakening"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Your Question">
                  <textarea
                    className="input-focus"
                    style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                    placeholder="Briefly describe what you'd like guidance on…"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                  />
                </Field>

                {/* Error message */}
                {errorMsg && (
                  <div className="error-box">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="popup-divider" />

                <button type="submit" className="popup-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Sending…
                    </>
                  ) : (
                    "Reserve My Session ✦"
                  )}
                </button>

                <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#aaa", marginTop: -4 }}>
                  🔒 Your details are private &amp; secure
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PopUp;