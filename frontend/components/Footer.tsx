"use client";

import React from "react";
import { Shield, ExternalLink, Smartphone, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { EmblemOfIndia, BisEmblem } from "./GovEmblem";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07192C] text-slate-300 text-xs border-t-2 border-amber-500 font-sans">
      {/* 1. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Official National Standards Body Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <EmblemOfIndia className="h-12 w-auto text-amber-400" />
              <BisEmblem className="h-10 w-auto" />
              <div>
                <h3 className="font-bold text-white text-sm font-serif leading-tight">
                  भारतीय मानक ब्यूरो
                </h3>
                <p className="text-[11px] text-amber-300 font-semibold">
                  BUREAU OF INDIAN STANDARDS
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              The National Standards Body of India, established under the <strong>Bureau of Indian Standards Act, 2016</strong>, for harmonious development of standardization, marking, and quality certification.
            </p>
            <div className="space-y-1 text-[11px] text-slate-300 pt-1">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>मानक भवन, 9 बहादुर शाह जफर मार्ग, नई दिल्ली - 110002</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Toll-Free Helpline: <strong>1800-11-0001</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2: Official Portals & Verification */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400 border-b border-slate-700 pb-1">
              आधिकारिक पोर्टल / Official Portals
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a
                  href="https://www.manakonline.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>Manakonline (e-Standards & Sales)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.services.bis.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>e-BIS Portal (Know Your Standards)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.crsbis.in/BIS/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>CRS Portal (Electronics Registration)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>BIS Corporate Portal (bis.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.consumerhelpline.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center justify-between group"
                >
                  <span>National Consumer Helpline (NCH)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key National Schemes */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400 border-b border-slate-700 pb-1">
              मानक योजनाएं / BIS Schemes
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• Scheme I: ISI Mark Product Certification</li>
              <li>• Scheme II: Compulsory Registration (CRS)</li>
              <li>• Scheme IV: Foreign Manufacturers (FMCS)</li>
              <li>• Gold & Silver Hallmarking (6-digit HUID)</li>
              <li>• Laboratory Recognition Scheme (LRS)</li>
              <li>• MSME Fast-Track Concession Procedure</li>
              <li>• Quality Control Orders (QCO) Gazette Registry</li>
            </ul>
          </div>

          {/* Col 4: Consumer App & National Portals */}
          <div className="space-y-3">
            <div className="bg-[#0B2545] p-3.5 rounded border border-[#163E6E] space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>BIS CARE Mobile App</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Download the official BIS CARE app on Android & iOS to verify ISI Marks, Gold HUID, and CRS Registrations.
              </p>
              <div className="flex gap-2 pt-1">
                <a
                  href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-center text-[10px] transition-colors"
                >
                  Google Play
                </a>
                <a
                  href="https://apps.apple.com/in/app/bis-care/id1524316719"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded text-center text-[10px] transition-colors border border-white/20"
                >
                  App Store
                </a>
              </div>
            </div>

            {/* National Initiative Badges */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">
                india.gov.in
              </a>
              <span>•</span>
              <a href="https://www.digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">
                Digital India
              </a>
              <span>•</span>
              <a href="https://www.mygov.in" target="_blank" rel="noreferrer" className="hover:text-white">
                MyGov
              </a>
            </div>
          </div>
        </div>

        {/* 2. Official Government Web Guidelines (GIGW) Mandatory Footer Links */}
        <div className="py-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="hover:text-white cursor-pointer">Website Policies</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Hyperlinking Policy</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Copyright Policy</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Disclaimer</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Web Information Manager</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Help & Feedback</span>
        </div>

        {/* 3. Official Copyright & Disclaimers */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 text-center sm:text-left gap-2">
          <div>
            <p className="font-medium text-slate-300">
              © 2026 Bureau of Indian Standards (BIS), Government of India.
            </p>
            <p className="text-slate-400 mt-0.5">
              Developed for Smart India Hackathon (SIH26107) • Factual Grounding & Retrieval-Augmented Generation.
            </p>
          </div>
          <div className="text-slate-400 text-[10px]">
            <p>Last Reviewed & Updated: <strong>29 September 2026</strong></p>
            <p>Guidelines for Indian Government Websites (GIGW) Compliant</p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Tricolor Stripe */}
      <div className="tricolor-stripe" />
    </footer>
  );
};
