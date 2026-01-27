import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; {new Date().getFullYear()} StayEase. All rights reserved.</p>
        <div style={styles.links}>
          <a href="#home" style={styles.link}>Home</a>
          <a href="#contact" style={styles.link}>Contact</a>
          <a href="#about" style={styles.link}>About</a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "50px",
    background: "#1e293b",
    color: "#fff",
    padding: "20px 0",
    textAlign: "center",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s",
  },
};
