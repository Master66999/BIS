"use client";

import React from "react";
import { Shield, ExternalLink, Smartphone, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#061526] text-slate-300 text-xs border-t border-[#132A45] pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-white">BIS SmartAssist</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-powered Intelligent Assistant for Indian Standards and BIS Services. Developed for <strong>SIH26107</strong> to empower Indian industries, MSMEs, startups, and citizens with source-traceable standards discovery.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-amber-400 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official 23,866 Indian Standards Indexed</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-amber-400">
              BIS Official Portals
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://www.manakonline.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  Manakonline Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.services.bis.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  e-BIS Services <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.crsbis.in/BIS/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  CRS Electronic Registration <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  BIS Official Website <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-amber-400">
              Key Certifications & Schemes
            </h4>
            <ul className="space-y-1.5">
              <li>
                <span className="hover:text-white transition-colors">Scheme I: ISI Mark Product Certification</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Scheme II: Compulsory Registration (CRS)</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Scheme IV: Foreign Manufacturers (FMCS)</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Gold & Silver Hallmarking (6-digit HUID)</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Laboratory Recognition Scheme (LRS)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Consumer App */}
          <div className="space-y-3 bg-[#0A2540] p-4 rounded-xl border border-[#16385C]">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>BIS CARE Mobile App</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Verify ISI Mark (CM/L), Hallmarked Gold HUID, and CRS Registration directly on your phone.
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded text-center text-[10px] transition-colors"
              >
                Google Play
              </a>
              <a
                href="https://apps.apple.com/in/app/bis-care/id1524316719"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded text-center text-[10px] transition-colors border border-white/20"
              >
                App Store
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-[#132A45] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 Bureau of Indian Standards (BIS). Smart India Hackathon Prototype (SIH26107).</p>
          <p className="mt-2 sm:mt-0">
            For official regulatory compliance, consult the current notified gazette and Indian Standard document.
          </p>
        </div>
      </div>
    </footer>
  );
};
