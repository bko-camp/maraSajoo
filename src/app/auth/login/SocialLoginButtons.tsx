"use client";

import { signIn } from "next-auth/react";

const SOCIAL_PROVIDERS = [
  {
    id: "kakao",
    label: "카카오로 시작하기",
    className: "bg-[#FEE500] text-[#191919] hover:bg-[#f5dc00]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.87 5.35 4.68 6.85-.15.55-.97 3.54-1.01 3.75 0 0-.02.17.1.24.12.07.27.02.27.02.2-.03 2.31-1.52 3.35-2.22.76.11 1.54.17 2.33.17 5.52 0 10-3.58 10-8.01S17.52 3 12 3z"
        />
      </svg>
    ),
  },
  {
    id: "google",
    label: "Google로 시작하기",
    className:
      "bg-white text-[#191919] hover:bg-gray-100 border border-gray-200",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
] as const;

export function SocialLoginButtons() {
  return (
    <>
      {SOCIAL_PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          className={`flex items-center justify-center gap-3 w-full rounded-xl py-4 px-6 font-bold text-sm transition-colors ${provider.className}`}
        >
          {provider.icon}
          {provider.label}
        </button>
      ))}
    </>
  );
}
