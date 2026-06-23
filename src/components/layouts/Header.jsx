import { useState, useEffect } from "react";

const Header = ({ onBookNow }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    "Destiny",
    "About",
    "Services",
    "Testimonials",
    "FAQ",
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 80,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(201,168,76,0.25)"
            : "1px solid rgba(201,168,76,0.08)",
          transition: "all 0.4s ease",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1300px",
            height: "100%",
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <a
            href="#home"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Astropalace Logo"
              style={{
                width: "140px",
                height: "140px",
                objectFit: "contain",
              }}
            />
          </a>

          {/* DESKTOP LINKS */}
          <ul
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {links.map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="nav-link-item">
                  {l}
                </a>
              </li>
            ))}

            <li>
              <a
                href="#"
                className="btn-gold"
                onClick={(e) => {
                  e.preventDefault();
                  onBookNow();
                }}
                style={{
                  padding: "11px 24px",
                  fontSize: "0.92rem",
                  borderRadius: "14px",
                }}
              >
                Book Now
              </a>
            </li>
          </ul>

          {/* HAMBURGER */}
          <div
            className="show-mobile"
            onClick={() => setOpen(!open)}
            style={{
              display: "none",
              flexDirection: "column",
              gap: 5,
              cursor: "pointer",
              padding: 6,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "#c9a84c",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  transform:
                    open && i === 0
                      ? "rotate(45deg) translate(5px,5px)"
                      : open && i === 2
                        ? "rotate(-45deg) translate(5px,-5px)"
                        : "",
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 70,
            left: 0,
            right: 0,
            zIndex: 999,
            background: "#4b0082",
            backdropFilter: "blur(16px)",
            padding: "24px 5%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            borderTop: "1px solid rgba(201,168,76,0.15)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: "0.88rem",
                letterSpacing: "1.2px",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontWeight: 500,
              }}
            >
              {l}
            </a>
          ))}

          <a
            href="#"
             onClick={(e) => { e.preventDefault(); onBookNow(); }}
            style={{
              color: "#c9a84c",
              textDecoration: "none",
              fontSize: "0.88rem",
              letterSpacing: "1.2px",
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontWeight: 500,
            }}
          >
            Book Now
          </a>
        </div>
      )}
    </>
  );
};

export default Header;