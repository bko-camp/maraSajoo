import type { AuthProvider } from "@/stores/useUserStore";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      provider?: AuthProvider;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: AuthProvider;
  }
}
