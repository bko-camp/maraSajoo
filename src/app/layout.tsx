import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import AppProviders from "@/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "마라운 - 마라맛 사주 리딩",
  description: "어차피 망한 인생, 팩트폭행이나 맞고 가라.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} bg-black text-gray-100 antialiased min-h-screen flex justify-center`}>
        {/* Mobile App Container */}
        <main className="w-full max-w-md bg-[#0a0a0a] min-h-screen relative overflow-x-hidden shadow-2xl shadow-red-900/10">
          <AppProviders>{children}</AppProviders>
        </main>

        {/* Kakao SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
