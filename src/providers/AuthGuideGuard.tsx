"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthGuide } from "@/hooks";

const AuthGuideGuard = () => {
  const router = useRouter();
  const { shouldRedirect, redirectTo } = useAuthGuide();

  useEffect(() => {
    if (shouldRedirect && redirectTo) {
      router.replace(redirectTo);
    }
  }, [shouldRedirect, redirectTo, router]);

  return null;
};

export default AuthGuideGuard;
