"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useUserStore } from "@/store";
import type { AuthProvider } from "@/types/auth";

const isAuthProvider = (value: string | undefined): value is AuthProvider =>
  value === "google" || value === "kakao";

const UserStoreSync = () => {
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
};

export default UserStoreSync;
