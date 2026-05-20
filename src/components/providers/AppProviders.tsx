"use client";

import { SessionProvider } from "next-auth/react";
import { UserStoreSync } from "./UserStoreSync";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserStoreSync />
      {children}
    </SessionProvider>
  );
}
