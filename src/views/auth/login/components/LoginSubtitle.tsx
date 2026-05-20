"use client";

import { useSajuPendingStore } from "@/store";

const LoginSubtitle = () => {
  const pending = useSajuPendingStore((s) => s.pending);

  return (
    <p className="text-gray-400 font-medium mt-4">
      {pending
        ? "입력하신 정보로 로그인하면 바로 사주 분석을 시작해요"
        : "소셜 계정으로 간편하게 시작하세요"}
    </p>
  );
};

export default LoginSubtitle;
