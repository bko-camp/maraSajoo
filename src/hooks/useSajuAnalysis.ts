"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { SajuFormPayload } from "@/types/saju";

const LOADING_MESSAGES = [
  "신내림 받는 중...",
  "너의 망한 팔자 스캔 중...",
  "어휴... 한숨부터 나오네...",
  "거의 다 왔어, 각오해라...",
];

const MIN_LOADING_MS = 3000;

export function useSajuAnalysis() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const analyze = useCallback(
    async (payload: SajuFormPayload): Promise<boolean> => {
      setIsLoading(true);
      setLoadingMsgIdx(0);

      const interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1200);

      const startedAt = Date.now();

      try {
        const res = await fetch("/api/saju", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_LOADING_MS) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_LOADING_MS - elapsed),
          );
        }

        clearInterval(interval);

        if (result.id) {
          router.push(`/result/${result.id}`);
          return true;
        }

        alert("사주 분석에 실패했습니다. 다시 시도해주세요.");
        setIsLoading(false);
        return false;
      } catch (err) {
        console.error(err);
        clearInterval(interval);
        setIsLoading(false);
        alert("서버 오류가 발생했습니다.");
        return false;
      }
    },
    [router],
  );

  return {
    analyze,
    isLoading,
    loadingMsgIdx,
    loadingMessages: LOADING_MESSAGES,
  };
}
