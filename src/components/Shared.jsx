import { useEffect, useRef } from "react";

export const useReveal = (dir = "") => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cls =
      dir === "left"
        ? "reveal-left"
        : dir === "right"
          ? "reveal-right"
          : "reveal";
    el.classList.add(cls);
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [dir]);
  return ref;
};

export const Reveal = ({
  children,
  dir,
  delay,
  className = "",
  style = {},
}) => {
  const ref = useReveal(dir);
  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
};

export const SectionHeader = ({ tag, title, sub, center, light }) => (
  <div style={{ textAlign: center ? "center" : "left" }}>
    <span
      className="section-tag"
      style={{ color: light ? "rgba(201,168,76,0.9)" : undefined }}
    >
      ✦ {tag}
    </span>
    <h2
      className="font-marcellus"
      style={{
        fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
        color: light ? "#fff" : "var(--purple-dark)",
        lineHeight: 1.22,
        marginBottom: 14,
      }}
    >
      {title}
    </h2>
    <div
      className="gold-line"
      style={{ width: 50, margin: center ? "16px auto 0" : "16px 0 0" }}
    />
    {sub && (
      <p
        className="font-cormorant"
        style={{
          fontSize: "1.1rem",
          color: light ? "rgba(255,255,255,0.68)" : "var(--text-mid)",
          lineHeight: 1.8,
          fontStyle: "italic",
          maxWidth: 580,
          margin: center ? "18px auto 0" : "18px 0 0",
        }}
      >
        {sub}
      </p>
    )}
  </div>
);

export const FormField = ({
  label,
  placeholder,
  type = "text",
  dark,
  options,
  mb = 16,
}) => {
  const cls = dark
    ? "form-input form-input-dark"
    : "form-input form-input-light";
  return (
    <div style={{ marginBottom: mb }}>
      <label
        style={{
          display: "block",
          fontSize: "0.73rem",
          marginBottom: 7,
          color: dark ? "rgba(255,255,255,0.5)" : "var(--text-mid)",
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          ffontFamily: "Poppins, sans-serif",
        }}
      >
        {label}
      </label>
      {type === "select" ? (
        <select className={cls} style={{ cursor: "pointer" }}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className={cls}
          placeholder={placeholder}
          rows={3}
          style={{ resize: "vertical", minHeight: 90 }}
        />
      ) : (
        <input type={type} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
};
