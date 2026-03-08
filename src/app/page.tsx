"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto h-24 w-full max-w-sm animate-pulse rounded-3xl bg-[#e5ecfb]" />
    </div>
  );
}
