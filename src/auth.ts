import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";

// Vercel에서는 AUTH_URL 없이 trustHost가 접속 URL을 콜백 URI로 사용
if (process.env.VERCEL) {
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
  callbacks: {
    jwt({ token, account }) {
      if (account?.provider === "google" || account?.provider === "kakao") {
        token.provider = account.provider;
      }
      return token;
    },
    session({ session, token }) {
      if (
        session.user &&
        (token.provider === "google" || token.provider === "kakao")
      ) {
        session.user.provider = token.provider;
      }
      return session;
    },
  },
});
