"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AUTH_DEFAULT_REDIRECT,
  resolveAuthPolicy,
  type AuthPagePolicy,
} from "@/lib/auth-guide";

export type AuthGuideStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthGuideResult {
  pathname: string;
  policy: AuthPagePolicy;
  status: AuthGuideStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  shouldRedirect: boolean;
  redirectTo: string | null;
}

export function useAuthGuide(): AuthGuideResult {
  const pathname = usePathname() ?? "/";
  const { status } = useSession();

  const policy = resolveAuthPolicy(pathname);
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const { shouldRedirect, redirectTo } = useMemo(() => {
    if (isLoading) {
      return { shouldRedirect: false, redirectTo: null };
    }

    if (policy === "guest" && isAuthenticated) {
      return {
        shouldRedirect: true,
        redirectTo: AUTH_DEFAULT_REDIRECT,
      };
    }

    if (policy === "protected" && !isAuthenticated) {
      return {
        shouldRedirect: true,
        redirectTo: AUTH_DEFAULT_REDIRECT,
      };
    }

    return { shouldRedirect: false, redirectTo: null };
  }, [isLoading, isAuthenticated, policy, pathname]);

  return {
    pathname,
    policy,
    status,
    isAuthenticated,
    isLoading,
    shouldRedirect,
    redirectTo,
  };
}
