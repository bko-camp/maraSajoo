"use client";

import { SessionProvider } from "next-auth/react";

import Header from "@/components/Header";
import AuthGuideGuard from "./AuthGuideGuard";
import UserStoreSync from "./UserStoreSync";

type AppProvidersProps = {
  children: React.ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <SessionProvider>
      <UserStoreSync />
      <AuthGuideGuard />
      <Header />
      {children}
    </SessionProvider>
  );
};

export default AppProviders;
