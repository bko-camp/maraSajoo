"use client";

import { forwardRef } from "react";
import { AlertTriangle } from "lucide-react";

import type { SajuAiContent } from "@/types/saju-result";

type ResultShareCardProps = {
  content: SajuAiContent;
};

const ResultShareCard = forwardRef<HTMLDivElement, ResultShareCardProps>(
  ({ content }, ref) => {
    return (
      <div
        ref={ref}
        className="border-2 border-red-500 rounded-xl p-6 bg-[#0a0a0a] shadow-[0_0_15px_rgba(239,68,68,0.3)] mb-8"
      >
        <div className="text-3xl font-black text-white mb-6 leading-relaxed">
          &quot;{content.summary}&quot;
        </div>

        <div className="bg-red-950/30 -mx-6 px-6 py-5 border-y border-red-900/50 mb-6">
          <h3 className="text-red-500 font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            보살의 팩트폭행
          </h3>
          <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
            {content.roast}
          </p>
        </div>

        <div className="flex justify-between items-center opacity-50 mt-8">
          <span className="text-sm font-bold text-red-500">🔥 마라맛 보살</span>
          <span className="text-xs">marasajoo.com</span>
        </div>
      </div>
    );
  },
);

ResultShareCard.displayName = "ResultShareCard";

export default ResultShareCard;
