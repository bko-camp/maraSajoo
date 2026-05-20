"use client";

import { Lock } from "lucide-react";

import { TOSS_PAYMENT_AMOUNT } from "@/constants/payment";

type ResultBottomCtaProps = {
  shareCount: number;
  isShareDisabled: boolean;
  onOpenPayment: () => void;
  onKakaoShare: () => void;
};

const ResultBottomCta = ({
  shareCount,
  isShareDisabled,
  onOpenPayment,
  onKakaoShare,
}: ResultBottomCtaProps) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-40">
      <button
        type="button"
        onClick={onOpenPayment}
        className="w-full bg-yellow-400 text-black font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse"
      >
        <Lock className="w-5 h-5" />
        💸 {TOSS_PAYMENT_AMOUNT.toLocaleString("ko-KR")}원 결제하고 바로 확인하기
      </button>
      <button
        type="button"
        onClick={onKakaoShare}
        disabled={isShareDisabled}
        className="w-full bg-[#FEE500] text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        💬 카톡방 3곳에 공유하고 무료로 보기 (현재 {shareCount}/3)
      </button>
    </div>
  );
};

export default ResultBottomCta;
