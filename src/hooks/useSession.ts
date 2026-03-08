"use client";

import { useSessionContext } from "@/components/providers/AuthSessionProvider";

export function useSession() {
  return useSessionContext();
}
