import React from "react";
import "../app/footer.css";

/**
 * Official Government of India & Bureau of Indian Standards Emblems
 */
export const EmblemOfIndia: React.FC<{ className?: string }> = ({ className = "h-14 w-auto" }) => (
  <svg
    viewBox="0 0 200 240"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="National Emblem of India - Satyameva Jayate"
  >
    {/* Ashoka Lion Capital Simplified Vector Silhouette */}
    <g fill="currentColor">
      {/* Central Lion Head */}
      <path d="M100 20 C92 20 85 27 85 36 C85 41 87 45 91 48 C88 52 86 58 86 64 C86 73 92 81 100 83 C108 81 114 73 114 64 C114 58 112 52 109 48 C113 45 115 41 115 36 C115 27 108 20 100 20 Z" />
      {/* Left Lion Head */}
      <path d="M68 32 C62 32 57 37 57 44 C57 48 59 52 62 55 C59 58 57 63 57 68 C57 76 62 82 69 84 C72 79 77 75 83 73 C81 68 81 61 82 56 C77 54 74 49 74 44 C74 40 76 36 79 34 C76 33 72 32 68 32 Z" />
      {/* Right Lion Head */}
      <path d="M132 32 C128 32 124 33 121 34 C124 36 126 40 126 44 C126 49 123 54 118 56 C119 61 119 68 117 73 C123 75 128 79 131 84 C138 82 143 76 143 68 C143 63 141 58 138 55 C141 52 143 48 143 44 C143 37 138 32 132 32 Z" />
      
      {/* Mane & Torso Base */}
      <path d="M62 88 C55 93 52 101 54 110 C56 118 64 125 74 127 C75 122 78 116 83 112 C80 105 81 97 86 91 C77 89 69 88 62 88 Z" />
      <path d="M138 88 C131 88 123 89 114 91 C119 97 120 105 117 112 C122 116 125 122 126 127 C136 125 144 118 146 110 C148 101 145 93 138 88 Z" />
      <path d="M85 86 C82 92 82 100 84 107 C88 112 94 116 100 117 C106 116 112 112 116 107 C118 100 118 92 115 86 C110 88 105 89 100 89 C95 89 90 88 85 86 Z" />

      {/* Abacus / Pedestal */}
      <rect x="42" y="132" width="116" height="8" rx="2" />
      
      {/* Ashoka Chakra in Center of Abacus */}
      <circle cx="100" cy="155" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="100" cy="155" r="3" />
      <line x1="100" y1="141" x2="100" y2="169" stroke="currentColor" strokeWidth="1.2" />
      <line x1="86" y1="155" x2="114" y2="155" stroke="currentColor" strokeWidth="1.2" />
      <line x1="90" y1="145" x2="110" y2="165" stroke="currentColor" strokeWidth="1.2" />
      <line x1="90" y1="165" x2="110" y2="145" stroke="currentColor" strokeWidth="1.2" />
      
      {/* Horse on Left of Abacus */}
      <path d="M56 148 C52 146 48 149 47 154 C46 158 48 162 52 163 C55 163 58 161 60 158 C62 160 65 160 68 157 C67 153 64 150 61 149 Z" />
      {/* Bull on Right of Abacus */}
      <path d="M144 148 C140 146 136 149 135 154 C134 158 136 162 140 163 C143 163 146 161 148 158 C150 160 153 160 156 157 C155 153 152 150 149 149 Z" />

      {/* Lotus Base */}
      <path d="M38 174 C48 168 62 166 76 168 C84 169 92 172 100 172 C108 172 116 169 124 168 C138 166 152 168 162 174 C152 182 136 186 122 186 C114 186 107 184 100 184 C93 184 86 186 78 186 C64 186 48 182 38 174 Z" />

      {/* Satyameva Jayate (सत्यमेव जयते) in Devanagari */}
      <text
        x="100"
        y="214"
        textAnchor="middle"
        fontSize="17"
        fontWeight="bold"
        fontFamily="'Noto Sans Devanagari', 'Mangal', 'Segoe UI', Arial, sans-serif"
        letterSpacing="2"
      >
        सत्यमेव जयते
      </text>
    </g>
  </svg>
);

export const BisEmblem: React.FC<{ className?: string }> = ({ className = "h-14 w-auto" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Bureau of Indian Standards Official Logo"
  >
    {/* Blue Ring */}
    <circle cx="50" cy="50" r="46" fill="#0A2540" stroke="#FF9933" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="41" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" />
    
    {/* Center Gold Shield */}
    <path
      d="M50 18 L74 27 V52 C74 67 63 78 50 82 C37 78 26 67 26 52 V27 L50 18 Z"
      fill="#D97706"
      stroke="#FDE68A"
      strokeWidth="1.5"
    />
    
    {/* BIS Standard / ISI Symbol */}
    <path
      d="M44 34 H56 V40 H51 V47 H55 V52 H51 V63 H44 V34 Z"
      fill="#FFFFFF"
    />
    <circle cx="50" cy="50" r="2.5" fill="#0A2540" />
    
    {/* Sanskrit Motto Arc: मानक: पथप्रदर्शक: */}
    <path id="curve" d="M20 50 A30 30 0 0 1 80 50" fill="none" />
    <text fill="#FEF3C7" fontSize="5.5" fontWeight="bold" letterSpacing="0.8">
      <textPath href="#curve" startOffset="50%" textAnchor="middle">
        मानक: पथप्रदर्शक:
      </textPath>
    </text>
  </svg>
);
