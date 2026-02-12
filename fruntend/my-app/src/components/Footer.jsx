import React, { useState } from "react";

export default function Footer() {
  const [hover, setHover] = useState({});

  const handleMouseEnter = (key) => setHover((p) => ({ ...p, [key]: true }));
  const handleMouseLeave = (key) => setHover((p) => ({ ...p, [key]: false }));

  const getLinkStyle = (key) => ({
    ...styles.link,
    ...(hover[key] && styles.linkHover),
  });

  const getSocialLinkStyle = (key) => ({
    ...styles.socialLink,
    ...(hover[key] && styles.socialLinkHover),
  });

  const getButtonStyle = (key) => ({
    ...styles.newsletterButton,
    ...(hover[key] && styles.newsletterButtonHover),
  });

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Column 1: About */}
          <div style={styles.column}>
            <h3 style={styles.heading}>StayEase</h3>
            <p style={styles.description}>
              Your one-stop solution for finding the perfect stay. We connect
              you with thousands of verified PGs, hostels, and apartments.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={getSocialLinkStyle("twitter")} onMouseEnter={() => handleMouseEnter("twitter")} onMouseLeave={() => handleMouseLeave("twitter")}>🐦</a>
              <a href="#" style={getSocialLinkStyle("facebook")} onMouseEnter={() => handleMouseEnter("facebook")} onMouseLeave={() => handleMouseLeave("facebook")}>📘</a>
              <a href="#" style={getSocialLinkStyle("instagram")} onMouseEnter={() => handleMouseEnter("instagram")} onMouseLeave={() => handleMouseLeave("instagram")}>📸</a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div style={styles.column}>
            <h3 style={styles.heading}>Quick Links</h3>
            <a href="/userpage" style={getLinkStyle("home")} onMouseEnter={() => handleMouseEnter("home")} onMouseLeave={() => handleMouseLeave("home")}>Home</a>
            <a href="/about" style={getLinkStyle("about")} onMouseEnter={() => handleMouseEnter("about")} onMouseLeave={() => handleMouseLeave("about")}>About Us</a>
            <a href="/contact" style={getLinkStyle("contact")} onMouseEnter={() => handleMouseEnter("contact")} onMouseLeave={() => handleMouseLeave("contact")}>Contact</a>
            <a href="/faq" style={getLinkStyle("faq")} onMouseEnter={() => handleMouseEnter("faq")} onMouseLeave={() => handleMouseLeave("faq")}>FAQs</a>
          </div>

          {/* Column 3: Legal */}
          <div style={styles.column}>
            <h3 style={styles.heading}>Legal</h3>
            <a href="/privacy" style={getLinkStyle("privacy")} onMouseEnter={() => handleMouseEnter("privacy")} onMouseLeave={() => handleMouseLeave("privacy")}>Privacy Policy</a>
            <a href="/terms" style={getLinkStyle("terms")} onMouseEnter={() => handleMouseEnter("terms")} onMouseLeave={() => handleMouseLeave("terms")}>Terms of Service</a>
            <a href="/disclaimer" style={getLinkStyle("disclaimer")} onMouseEnter={() => handleMouseEnter("disclaimer")} onMouseLeave={() => handleMouseLeave("disclaimer")}>Disclaimer</a>
          </div>

          {/* Column 4: Newsletter */}
          <div style={styles.column}>
            <h3 style={styles.heading}>Subscribe to our Newsletter</h3>
            <p style={styles.description}>
              Get the latest updates and offers directly in your inbox.
            </p>
            <div style={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" style={styles.newsletterInput} />
              <button style={getButtonStyle("subscribe")} onMouseEnter={() => handleMouseEnter("subscribe")} onMouseLeave={() => handleMouseLeave("subscribe")}>Subscribe</button>
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} StayEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#1e293b", // slate-800
    color: "#cbd5e1", // slate-300
    padding: "60px 20px 20px",
    marginTop: "auto", // Pushes footer to the bottom if content is short
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "40px",
    marginBottom: "40px",
    textAlign: "left",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  heading: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "8px",
    marginTop: 0,
  },
  description: {
    lineHeight: "1.6",
    fontSize: "0.9rem",
    margin: 0,
    color: "#94a3b8", // slate-400
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#cbd5e1", // slate-300
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "color 0.2s ease-in-out",
  },
  linkHover: {
    color: "#fff",
  },
  socialLinks: {
    display: "flex",
    gap: "16px",
    marginTop: "10px",
  },
  socialLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.5rem",
    transition: "transform 0.2s ease-in-out",
  },
  socialLinkHover: {
    transform: "scale(1.2)",
  },
  newsletterForm: {
    display: "flex",
    marginTop: "10px",
  },
  newsletterInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #475569", // slate-600
    borderRadius: "4px 0 0 4px",
    background: "#334155", // slate-700
    color: "#fff",
    outline: "none",
    fontSize: "0.9rem",
  },
  newsletterButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "0 4px 4px 0",
    background: "#c53030", // professional red
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  newsletterButtonHover: {
    background: "#9b2c2c", // darker red
  },
  bottomBar: {
    borderTop: "1px solid #334155", // slate-700
    paddingTop: "20px",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#94a3b8", // slate-400
  },
};
