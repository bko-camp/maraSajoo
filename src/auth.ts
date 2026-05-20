import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";

// Vercel에 localhost AUTH_URL이 남아 있으면 trustHost 대신 localhost를 씀 → 제거
// VERCEL_URL(배포별 고유 URL)로 덮어쓰면 git-dev alias와 콜백 도메인이 어긋남
if (process.env.VERCEL && process.env.AUTH_URL?.includes("localhost")) {
  delete process.env.AUTH_URL;
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
