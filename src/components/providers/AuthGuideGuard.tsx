"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuide } from "@/hooks";

export function AuthGuideGuard() {
  const router = useRouter();
  const { shouldRedirect, redirectTo } = useAuthGuide();

  useEffect(() => {
    if (shouldRedirect && redirectTo) {
      router.replace(redirectTo);
    }
  }, [shouldRedirect, redirectTo, router]);

  return null;
}
