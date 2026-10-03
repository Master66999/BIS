"use client";

import React from "react";
import Link from "next/link";
import "../app/footer.css";

interface FooterProps {
  onNavigateTab?: (tab: string) => void;
  onOpenInfo?: (topic: "about" | "help" | "privacy" | "terms" | "accessibility") => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenInfo }) => {
  return (
    <footer className="footer bg-[#07172c] text-slate-200 border-t border-white/10 w-full relative z-20">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>
            <i className="fa-solid fa-shield-halved text-[#FF9933]"></i>{" "}
            <span className="reactbits-blur text-white font-extrabold tracking-tight">MANAKAI</span>
          </h2>
          <p className="reactbits-blur text-slate-300 text-xs leading-relaxed max-w-sm" data-i18n="footer.brandDesc">
            Empowering industries, manufacturers, and consumers with intelligent access to Bureau of Indian Standards information.
          </p>
        </div>

        <div className="footer-links">
          <h3 className="reactbits-blur" data-i18n="footer.quickLinks">
            Quick Links
          </h3>
          <ul>
            <li>
              {onNavigateTab ? (
                <button
                  type="button"
                  onClick={() => onNavigateTab("finder")}
                  className="reactbits-blur text-left hover:text-[#FF9933] transition"
                  data-i18n="footer.searchStandards"
                >
                  Search Standards
                </button>
              ) : (
                <Link href="/" className="reactbits-blur" data-i18n="footer.searchStandards">
                  Search Standards
                </Link>
              )}
            </li>
            <li>
              {onNavigateTab ? (
                <button
                  type="button"
                  onClick={() => onNavigateTab("journey")}
                  className="reactbits-blur text-left hover:text-[#FF9933] transition"
                  data-i18n="footer.certificationSchemes"
                >
                  Certification Schemes
                </button>
              ) : (
                <Link href="/" className="reactbits-blur" data-i18n="footer.certificationSchemes">
                  Certification Schemes
                </Link>
              )}
            </li>
            <li>
              {onNavigateTab ? (
                <button
                  type="button"
                  onClick={() => onNavigateTab("labs")}
                  className="reactbits-blur text-left hover:text-[#FF9933] transition"
                  data-i18n="footer.labDirectory"
                >
                  Lab Directory
                </button>
              ) : (
                <Link href="/" className="reactbits-blur" data-i18n="footer.labDirectory">
                  Lab Directory
                </Link>
              )}
            </li>
            <li>
              {onOpenInfo ? (
                <button
                  type="button"
                  onClick={() => onOpenInfo("help")}
                  className="reactbits-blur text-left hover:text-[#FF9933] transition"
                  data-i18n="footer.helpCenter"
                >
                  Help Center
                </button>
              ) : (
                <Link href="/help" className="reactbits-blur" data-i18n="footer.helpCenter">
                  Help Center
                </Link>
              )}
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h3 className="reactbits-blur" data-i18n="footer.legal">
            Legal
          </h3>
          <ul>
            <li>
              {onOpenInfo ? (
                <button
                  type="button"
                  onClick={() => onOpenInfo("privacy")}
                  className="reactbits-blur text-left hover:text-[#FF9933] transition"
                  data-i18n="footer.privacy"
                >
                  Privacy Policy
                </button>
              ) : (
                <Link href="/privacy" className="reactbits-blur" data-i18n="footer.privacy">
                  Privacy Policy
                </Link>
              )}
            </li>
            <li>
              {onOpenInfo ? (
                <button
                  type="button"
                  onClick={() => onOpenInfo("terms")}
                  className="reactbits-blur text-left hover:text-[#FF9933] transition"
                  data-i18n="footer.terms"
                >
                  Terms of Service
                </button>
              ) : (
                <Link href="/terms" className="reactbits-blur" data-i18n="footer.terms">
                  Terms of Service
                </Link>
              )}
            </li>
            <li>
              {onOpenInfo ? (
                <button
                  type="button"
                  onClick={() => onOpenInfo("accessibility")}
                  className="reactbits-blur text-left hover:text-[#FF9933] transition"
                  data-i18n="footer.accessibility"
                >
                  Accessibility
                </button>
              ) : (
                <Link href="/accessibility" className="reactbits-blur" data-i18n="footer.accessibility">
                  Accessibility
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="reactbits-blur" data-i18n="footer.copyright">
          © 2026 SIH Project - MANAKAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
