"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ManakaiInfoView } from "../../components/ManakaiInfoView";

export default function TermsPage() {
  const router = useRouter();

  return (
    <ManakaiInfoView
      topic="terms"
      onSelectTopic={(topic) => {
        if (topic === "about") router.push("/company");
        else router.push(`/${topic}`);
      }}
      onBack={() => router.push("/")}
      onStartChat={(query) => {
        router.push(`/?tab=chat${query ? `&q=${encodeURIComponent(query)}` : ""}`);
      }}
    />
  );
}
