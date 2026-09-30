"use client";

import React from "react";
import { ScamDetectorView } from "./ScamDetectorView";

interface VerifyMarkViewProps {
  onAskAI?: (query: string) => void;
}

export function VerifyMarkView({ onAskAI }: VerifyMarkViewProps) {
  return <ScamDetectorView onAskAI={onAskAI} />;
}
