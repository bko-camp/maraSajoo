"use client";

import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/header";
import { AuthGuideGuard } from "./AuthGuideGuard";
import { UserStoreSync } from "./UserStoreSync";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserStoreSync />
      <AuthGuideGuard />
      <Header />
      {children}
    </SessionProvider>
  );
}
