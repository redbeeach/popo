"use client";

import "./Footer.css";

import Copy from "../Copy/Copy";

export default function Footer({ className = "", children }) {
  return (
    <footer className={`smoke-footer ${className}`}>
      {children}

      <div className="footer-content">
        <div className="container">
          <div className="footer-heading">
            <Copy trigger=".smoke-footer">
              <p className="mono">Establish Contact</p>
            </Copy>
            <Copy trigger=".smoke-footer">
              <h2 className="type-2">
                Let's Make Something They Can't Walk Away From
              </h2>
            </Copy>
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <div className="container">
          <div className="footer-bar-left">
            <Copy trigger=".smoke-footer">
              <p className="mono">2026 Yunhongbi Portfolio</p>
            </Copy>
          </div>
          <div className="footer-bar-right">
            <Copy trigger=".smoke-footer">
              <p className="mono">Developed By Yunhongbi</p>
            </Copy>
          </div>
        </div>
      </div>
    </footer>
  );
}
