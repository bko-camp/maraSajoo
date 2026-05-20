import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";

// Vercel에 localhost AUTH_URL이 남아 있으면 OAuth 콜백·리다이렉트가 localhost로 감
if (process.env.VERCEL_URL) {
  const vercelOrigin = `https://${process.env.VERCEL_URL}`;
  const authUrl = process.env.AUTH_URL;
  if (!authUrl || authUrl.includes("localhost")) {
    process.env.AUTH_URL = vercelOrigin;
  }
}

const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

if (process.env.AUTH_KAKAO_ID && process.env.AUTH_KAKAO_SECRET) {
  providers.push(Kakao);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers,
  pages: {
    signIn: "/auth/login",
  },
});
