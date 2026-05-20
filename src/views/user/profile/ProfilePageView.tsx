"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

import { PROVIDER_LABELS } from "@/constants/auth";
import { AUTH_DEFAULT_REDIRECT } from "@/lib/auth-guide";
import { useUserStore } from "@/store";

const ProfilePageView = () => {
  const router = useRouter();
  const { status } = useSession();
  const name = useUserStore((s) => s.name);
  const provider = useUserStore((s) => s.provider);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: AUTH_DEFAULT_REDIRECT });
    router.push(AUTH_DEFAULT_REDIRECT);
  };

  if (status === "loading" || !name || !provider) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        <p className="text-gray-400 text-sm mt-4">프로필 불러오는 중...</p>
      </div>
    );
  }

  const providerInfo = PROVIDER_LABELS[provider];

  return (
    <div className="flex flex-col min-h-screen px-6 py-12">
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8"
      >
        ← 홈으로
      </Link>

      <div className="text-center mb-10 mt-8">
        <h1
          className="text-4xl font-black mb-4 tracking-tighter text-glitch"
          data-text="프로필"
        >
          프로필
        </h1>
        <p className="text-gray-400 font-medium">연결된 소셜 계정 정보</p>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            이름
          </p>
          <p className="text-2xl font-black text-white">{name}</p>
        </div>

        <div className="h-px bg-gray-800" />

        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            로그인 방식
          </p>
          <span
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${providerInfo.className}`}
          >
            {providerInfo.label}
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={handleSignOut}
        className="w-full bg-[#1a1a1a] border border-gray-800 text-gray-300 font-bold py-4 rounded-xl hover:border-red-500 hover:text-white transition-colors mt-10"
      >
        로그아웃
      </button>
    </div>
  );
};

export default ProfilePageView;
