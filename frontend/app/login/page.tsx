"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ManakaiLoginView } from "../../components/ManakaiLoginView";

export default function LoginPage() {
  const router = useRouter();

  return (
    <ManakaiLoginView
      onSuccess={(user) => {
        router.push("/");
      }}
      onBack={() => router.push("/")}
    />
  );
}
