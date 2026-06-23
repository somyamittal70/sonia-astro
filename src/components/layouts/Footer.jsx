import { MapPin, Phone, Mail } from "lucide-react";
import logo from "/logo.png";

/* ── SVG brand icons (no external lib needed) ── */
const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1c0535" />
  </svg>
);

const WhatsAppIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const Footer = () => (
  <>
    <style>{`
      .footer-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr;
        gap: 44px;
      }

      .footer-social {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .footer-social:hover {
        background: rgba(201,168,76,0.18);
        border-color: rgba(201,168,76,0.5);
        transform: translateY(-3px);
        box-shadow: 0 6px 18px rgba(201,168,76,0.2);
      }

      .footer-link {
        color: rgb(255, 255, 255);
        text-decoration: none;
        font-size: 0.89rem;
        transition: 0.2s;
      }

      .footer-link:hover {
        color: #e8c053;
      }

      /* ── Fixed floating buttons ── */
      .fab-call, .fab-whatsapp {
        position: fixed;
        bottom: 28px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 11px 18px 11px 14px;
        border-radius: 50px;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
        box-shadow: 0 6px 24px rgba(0,0,0,0.35);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        border: none;
      }

      .fab-call {
        left: 24px;
        background: linear-gradient(135deg, #5a0a0a 0%, #c31432 100%);
        color: #ebd074;
        border: 1px solid rgba(201,168,76,0.35);
      }

      .fab-whatsapp {
        right: 24px;
        background: linear-gradient(135deg, #1a5c2a 0%, #25a244 100%);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.15);
      }

      .fab-call:hover, .fab-whatsapp:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      }

      .fab-call .fab-icon-wrap {
        width: 30px;
        height: 30px;
        background: rgba(201,168,76,0.18);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .fab-whatsapp .fab-icon-wrap {
        width: 30px;
        height: 30px;
        background: rgba(255,255,255,0.15);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      /* pulse ring on call button */
      .fab-call::before {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50px;
        border: 2px solid rgba(201,168,76,0.4);
        animation: fabPulse 2.2s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes fabPulse {
        0%   { opacity: 1;   transform: scale(1); }
        70%  { opacity: 0;   transform: scale(1.12); }
        100% { opacity: 0;   transform: scale(1.12); }
      }

      @media (max-width: 992px) {
        .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
      }

      @media (max-width: 768px) {
        .footer-grid { grid-template-columns: 1fr; gap: 35px; }
        .footer-bottom { flex-direction: column; text-align: center; }
        .fab-call, .fab-whatsapp { padding: 10px 14px 10px 12px; font-size: 0.72rem; }
        .fab-call  { left: 12px; bottom: 20px; }
        .fab-whatsapp { right: 12px; bottom: 20px; }
      }
    `}</style>

    {/* ── Fixed Floating Buttons ── */}
    <a href="tel:+919873523528" className="fab-call">
      <span className="fab-icon-wrap">
        <Phone size={14} strokeWidth={2.2} color="white" />
      </span>
      Call Us
    </a>

    <a
      href="https://wa.me/919873523528"
      target="_blank"
      rel="noopener noreferrer"
      className="fab-whatsapp"
    >
      <span className="fab-icon-wrap">
        <WhatsAppIcon size={16} />
      </span>
      WhatsApp
    </a>

    {/* ── Footer ── */}
    <footer
      style={{
        background: "#b67ddf",
        color: "rgb(254, 245, 245)",
        padding: "70px 5% 32px",
      }}
    >
      <div
        className="footer-grid"
        style={{
          paddingBottom: 48,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 32,
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                borderRadius: 12,
                padding: "6px 16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={logo}
                alt="Jyotish Vedic Logo"
                style={{
                  height: 100,
                  width: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.8,
              maxWidth: 240,
              marginBottom: 22,
            }}
          >
            Astrology is not just guesswork — it is based on precise
            astronomical data, ancient wisdom, and human psychology.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4
            className="font-marcellus"
            style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 18 }}
          >
            Services
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Tarot Reading",
              "Astrology Consultation",
              "Emotional Counselling",
              "Spiritual Healing",
              "Akashic Records Reading",
            ].map((link) => (
              <li key={link} style={{ marginBottom: 12 }}>
                <a href="#services" className="footer-link">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            className="font-marcellus"
            style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 18 }}
          >
            Quick Links
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { label: "Home", href: "#home" },
              { label: "About", href: "#about" },
              { label: "Clients", href: "#clients" },
              { label: "Testimonials", href: "#testimonials" },
              { label: "FAQ", href: "#faq" },
            ].map(({ label, href }) => (
              <li key={label} style={{ marginBottom: 12 }}>
                <a href={href} className="footer-link">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4
            className="font-marcellus"
            style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 18 }}
          >
            Contact
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              [MapPin, "j 12 Pandav nagar , Akshardham,delhi -110092"],
              [Phone, "+91-9873523528"],
              [Mail, "sandeepkaur18oct@gmail.com"],
            ].map(([Icon, text]) => (
              <li
                key={text}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: "0.86rem",
                  marginBottom: 14,
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  color="white"
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "rgb(255, 255, 255)",
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="footer-bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          fontSize: "0.86rem",
          color: "white",
        }}
      >
        <span>
          © 2025 Jyotish Vedic | Sonia Tarot Expert. All rights reserved.
        </span>
        <span>
          <a href="#" style={{ color: "white", textDecoration: "none" }}>
            @Developed by Debox Technology
          </a>
        </span>
      </div>
    </footer>
  </>
);

export default Footer;
