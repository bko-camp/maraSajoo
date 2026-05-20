"use client";

import type { SajuAiContent } from "@/types/saju-result";

type ResultPaywallProps = {
  content: SajuAiContent;
  isUnlocked: boolean;
};

const ResultPaywall = ({ content, isUnlocked }: ResultPaywallProps) => {
  return (
    <div className="relative">
      <h2 className="text-xl font-black text-white mb-4">
        ⚠️ 2026년, 니 돈을 다 털어먹을 액운과 대처법
      </h2>

      <div
        className={`
            border border-gray-800 rounded-xl p-6 relative overflow-hidden transition-all duration-1000
            ${!isUnlocked ? "h-64" : "auto"}
          `}
      >
        <p
          className={`
               text-lg leading-relaxed
               ${!isUnlocked ? "blur-sm text-gray-500 select-none" : "text-gray-100 font-medium"}
             `}
        >
          {content.paid_solution}
        </p>

        {!isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-end p-6">
            <p className="text-center font-bold text-gray-300 mb-8 max-w-[250px]">
              {content.bait}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPaywall;
