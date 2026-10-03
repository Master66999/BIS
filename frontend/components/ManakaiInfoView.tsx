"use client";

import React from "react";

export type InfoTopic = "about" | "help" | "privacy" | "terms" | "accessibility";

interface ManakaiInfoViewProps {
  topic: InfoTopic;
  onSelectTopic: (topic: InfoTopic) => void;
  onBack: () => void;
  onStartChat: (initialQuery?: string) => void;
}

export const ManakaiInfoView: React.FC<ManakaiInfoViewProps> = ({
  topic,
  onSelectTopic,
  onBack,
  onStartChat,
}) => {
  return (
    <div className="mk-info">
      {/* Header Banner */}
      <header className="info-header">
        <div className="info-topbar">
          <div className="info-logo">
            <img
              src="/images/Manakai_AI_Tech_Logo_on_Navy_Gradient-removebg-preview.png"
              alt="MANAKAI"
            />
          </div>
          <button type="button" className="info-back" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Home</span>
          </button>
        </div>

        <div className="info-hero">
          <p className="info-eyebrow">
            {topic === "about" && "About The Initiative"}
            {topic === "help" && "Support & Documentation"}
            {topic === "privacy" && "Statutory Data Governance"}
            {topic === "terms" && "Terms of Service"}
            {topic === "accessibility" && "Digital Inclusion Policy"}
          </p>
          <h1>
            {topic === "about" && "MANAKAI Intelligence Consortium"}
            {topic === "help" && "MANAKAI Help & Documentation Center"}
            {topic === "privacy" && "Privacy & Data Protection Policy"}
            {topic === "terms" && "Terms of Service & Usage Framework"}
            {topic === "accessibility" && "Accessibility Statement"}
          </h1>
          <p>
            {topic === "about" &&
              "Empowering Indian manufacturers, MSMEs, labs, and consumers with grounded AI intelligence across 23,866+ Indian Standards."}
            {topic === "help" &&
              "Find answers to frequently asked questions, learn how to audit MTC certificates, scan ISI marks, and navigate BIS certification."}
            {topic === "privacy" &&
              "Compliant with the Digital Personal Data Protection Act (DPDP), 2023 and Government of India regulatory frameworks."}
            {topic === "terms" &&
              "Guidelines governing authorized access, research queries, and standard compliance verification via MANAKAI."}
            {topic === "accessibility" &&
              "Ensuring universal digital accessibility in accordance with GIGW (Guidelines for Indian Government Websites) and WCAG 2.1 AA."}
          </p>
        </div>
      </header>

      {/* Main Body Card */}
      <main className="info-body">
        <div className="info-card">
          <div className="info-meta">
            <span>Last Updated: October 2026 &bull; Bureau of Indian Standards &bull; Smart India Hackathon</span>
          </div>

          {/* TOPIC 1: ABOUT / COMPANY */}
          {topic === "about" && (
            <div>
              <div className="info-grid">
                <div className="info-tile">
                  <i className="fa-solid fa-scale-balanced"></i>
                  <strong>23,866+ Standards</strong>
                  <span>Full coverage of civil, chemical, electrotechnical &amp; food codes</span>
                </div>
                <div className="info-tile">
                  <i className="fa-solid fa-microchip"></i>
                  <strong>Zero Hallucination RAG</strong>
                  <span>Every clause citation is grounded with page and paragraph traceability</span>
                </div>
                <div className="info-tile">
                  <i className="fa-solid fa-handshake-angle"></i>
                  <strong>MSME Enablement</strong>
                  <span>Accelerated 30-day certification roadmap with 50% concession guidance</span>
                </div>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-landmark"></i> About the Organization
                </h2>
                <p>
                  <strong>MANAKAI</strong> is an advanced regulatory AI platform developed under the Smart India
                  Hackathon (SIH26107) in collaboration with the <strong>Bureau of Indian Standards (BIS)</strong>,
                  Ministry of Consumer Affairs, Food &amp; Public Distribution, Government of India.
                </p>
                <p style={{ marginTop: "0.75rem" }}>
                  The Bureau of Indian Standards is the National Standards Body of India established under the
                  BIS Act 2016 for the harmonious development of the activities of standardization, marking, and
                  quality certification of goods.
                </p>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-bullseye"></i> Our Core Mission
                </h2>
                <ul>
                  <li>
                    <strong>Democratize Standards Knowledge:</strong> Enable MSME entrepreneurs and citizens to
                    comprehend complex technical specifications in English, Hindi, and Marathi.
                  </li>
                  <li>
                    <strong>Combat Counterfeits:</strong> Instant verification of ISI marks, Hallmark Unique
                    Identification (HUID) codes, and CM/L license authenticity.
                  </li>
                  <li>
                    <strong>Automate Compliance Auditing:</strong> AI-powered Mill Test Certificate (MTC) scrutiny
                    to detect out-of-specification industrial materials before they cause structural failure.
                  </li>
                </ul>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-headset"></i> Get In Touch
                </h2>
                <p>
                  Have questions about standards compliance, scheme applications, or laboratory testing?
                </p>
                <div style={{ marginTop: "0.85rem" }}>
                  <button
                    type="button"
                    onClick={() => onStartChat("Tell me about the Bureau of Indian Standards (BIS) organization and mandate.")}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#0A2540",
                      color: "#ffffff",
                      padding: "0.65rem 1.25rem",
                      borderRadius: "8px",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Ask MANAKAI AI About BIS &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 2: HELP CENTER */}
          {topic === "help" && (
            <div>
              <div className="info-grid">
                <div className="info-tile">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <strong>Standards Finder</strong>
                  <span>Search IS codes by product name, HSN, or category</span>
                </div>
                <div className="info-tile">
                  <i className="fa-solid fa-shield-halved"></i>
                  <strong>Mark Scanner</strong>
                  <span>Verify CM/L licenses and 6-digit Gold HUID numbers</span>
                </div>
                <div className="info-tile">
                  <i className="fa-solid fa-calculator"></i>
                  <strong>Fee Calculator</strong>
                  <span>Estimate statutory application, testing, and annual marking fees</span>
                </div>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-circle-question"></i> Frequently Asked Questions
                </h2>

                <details className="info-faq" open>
                  <summary>How do I find the applicable Indian Standard for my product?</summary>
                  <p>
                    Navigate to the <strong>Standards Finder</strong> or use the search bar on the landing page.
                    You can type the product name (e.g. &quot;Cement&quot;, &quot;Electric Vehicle Charger&quot;,
                    &quot;TMT Steel&quot;), and MANAKAI will automatically identify the corresponding IS code,
                    mandatory testing parameters, and whether a Quality Control Order (QCO) is enforced.
                  </p>
                </details>

                <details className="info-faq">
                  <summary>What is a Mill Test Certificate (MTC) Inspector?</summary>
                  <p>
                    The MTC Inspector allows structural engineers, procurement officers, and lab auditors to
                    upload test reports. MANAKAI checks chemical composition (Carbon, Sulphur, Phosphorus) and
                    mechanical properties (Yield Strength, Elongation) against official IS tolerance limits.
                  </p>
                </details>

                <details className="info-faq">
                  <summary>How can I verify a Gold Jewellery HUID code?</summary>
                  <p>
                    Open the <strong>Fake Mark Scanner</strong>, select Hallmarking, and input the 6-character
                    alphanumeric HUID stamped on your jewellery piece. The system validates the code against the
                    BIS CARE database to ensure the purity (22K, 18K, 14K) and registered Assaying &amp; Hallmarking
                    Centre (AHC).
                  </p>
                </details>

                <details className="info-faq">
                  <summary>Are MSME concessions supported in the Fee Calculator?</summary>
                  <p>
                    Yes! Under Government of India schemes, recognized Micro and Small enterprises receive up to a
                    50% rebate on application and marking fees, with an additional 10% concession for women-led
                    enterprises.
                  </p>
                </details>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-phone"></i> Statutory Helplines
                </h2>
                <ul>
                  <li><strong>National Consumer Helpline:</strong> 1800-11-4000 or 1915 (Toll-Free)</li>
                  <li><strong>BIS Helpdesk:</strong> +91 11 2323 0131 / 2323 3375</li>
                  <li><strong>Official Email:</strong> info@bis.gov.in</li>
                </ul>
              </div>
            </div>
          )}

          {/* TOPIC 3: PRIVACY POLICY */}
          {topic === "privacy" && (
            <div>
              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-lock"></i> 1. Scope and Applicability
                </h2>
                <p>
                  This Privacy Policy delineates how <strong>MANAKAI</strong> handles information collected through
                  the platform. We are committed to safeguarding user data in strict conformity with the
                  <strong>Digital Personal Data Protection Act (DPDP Act), 2023</strong> and the Information
                  Technology Act, 2000.
                </p>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-database"></i> 2. Information We Collect
                </h2>
                <ul>
                  <li><strong>Account Credentials:</strong> Name, official email, phone number, and organization details provided during registration.</li>
                  <li><strong>Regulatory Queries:</strong> Questions asked via the AI Co-Pilot to generate contextually grounded standard summaries.</li>
                  <li><strong>Inspection Documents:</strong> Test certificates or product labels uploaded for automated conformity verification.</li>
                  <li><strong>Telemetry &amp; Audit Logs:</strong> Timestamped records of standard retrievals for compliance reporting.</li>
                </ul>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-shield-halved"></i> 3. Data Protection &amp; Confidentiality
                </h2>
                <p>
                  All uploaded test certificates and proprietary manufacturer documentation are processed in
                  ephemeral sandboxes and encrypted in transit via TLS 1.3 and at rest via AES-256. Documents are never
                  used to train public foundation models without explicit organizational consent.
                </p>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-user-shield"></i> 4. User Rights
                </h2>
                <p>
                  Users retain the right to review, update, or request the deletion of their personal and organizational
                  profiles by contacting the Data Protection Officer at privacy@manakai.gov.in.
                </p>
              </div>
            </div>
          )}

          {/* TOPIC 4: TERMS OF SERVICE */}
          {topic === "terms" && (
            <div>
              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-file-contract"></i> 1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or utilizing the MANAKAI platform, you agree to abide by these Terms of Service.
                  If you are utilizing the portal on behalf of an enterprise, you certify having statutory
                  authority to bind that entity.
                </p>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-book"></i> 2. Nature of Guidance &amp; Disclaimers
                </h2>
                <p>
                  MANAKAI provides automated regulatory guidance and standards cross-referencing. While the AI
                  engine grounds all responses directly in gazetted Bureau of Indian Standards publications, the
                  authoritative legal text remains the published standard copies accessible on the BIS portal.
                </p>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-gavel"></i> 3. Lawful &amp; Ethical Use
                </h2>
                <ul>
                  <li>Users shall not submit fraudulent, altered, or fabricated test certificates.</li>
                  <li>Users shall not attempt to reverse engineer or overload the public API endpoints.</li>
                  <li>All marks (ISI, CRS, Hallmark) remain statutory property of the Bureau of Indian Standards.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TOPIC 5: ACCESSIBILITY */}
          {topic === "accessibility" && (
            <div>
              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-universal-access"></i> Universal Access Commitment
                </h2>
                <p>
                  MANAKAI is designed to be accessible to all users, regardless of device, technology, or ability.
                  The interface complies with Level AA of the <strong>Web Content Accessibility Guidelines (WCAG 2.1)</strong>
                  and follows the <strong>Guidelines for Indian Government Websites (GIGW)</strong>.
                </p>
              </div>

              <div className="info-section">
                <h2>
                  <i className="fa-solid fa-eye"></i> Accessibility Features
                </h2>
                <ul>
                  <li><strong>Multilingual Support:</strong> Complete interface available in English, हिन्दी, and मराठी.</li>
                  <li><strong>High Contrast &amp; Dark Mode:</strong> Yin/Yang visual mode toggle for enhanced legibility.</li>
                  <li><strong>Keyboard Navigability:</strong> Full keyboard shortcut support (⌘K / Ctrl+K Spotlight).</li>
                  <li><strong>Screen Reader Optimization:</strong> Proper ARIA roles, landmarks, and alt tags for emblems.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Cross-navigation Footer */}
          <div className="info-footer">
            <nav>
              <button
                type="button"
                onClick={() => onSelectTopic("about")}
                className={topic === "about" ? "active" : ""}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                About MANAKAI
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => onSelectTopic("help")}
                className={topic === "help" ? "active" : ""}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Help Center
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => onSelectTopic("privacy")}
                className={topic === "privacy" ? "active" : ""}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Privacy Policy
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => onSelectTopic("terms")}
                className={topic === "terms" ? "active" : ""}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Terms of Service
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => onSelectTopic("accessibility")}
                className={topic === "accessibility" ? "active" : ""}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Accessibility
              </button>
            </nav>
            <p>&copy; 2026 Bureau of Indian Standards &bull; Smart India Hackathon &bull; MANAKAI</p>
          </div>
        </div>
      </main>
    </div>
  );
};
