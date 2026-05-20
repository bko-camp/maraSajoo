"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore, type AuthProvider } from "@/stores";

function isAuthProvider(value: string | undefined): value is AuthProvider {
  return value === "google" || value === "kakao";
}

export function UserStoreSync() {
  const { data: session, status } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.user?.name) {
      clearUser();
      return;
    }

    const provider = session.user.provider;
    if (!isAuthProvider(provider)) {
      clearUser();
      return;
    }

    setUser({ name: session.user.name, provider });
  }, [session, status, setUser, clearUser]);

  return null;
}
