"use client";

import dynamic from "next/dynamic";

// Dynamically import the form to avoid SSR issues with useSearchParams
const AcceptInviteForm = dynamic(() => import("./AcceptInviteForm"), { ssr: false });

export default function AcceptInvitePage() {
  return <AcceptInviteForm />;
}
