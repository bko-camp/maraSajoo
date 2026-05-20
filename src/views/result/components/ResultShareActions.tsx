"use client";

import { Download, Share2 } from "lucide-react";

type ResultShareActionsProps = {
  onShare: () => void;
};

const ResultShareActions = ({ onShare }: ResultShareActionsProps) => {
  return (
    <div className="flex gap-4 mb-12">
      <button
        type="button"
        onClick={onShare}
        className="flex-1 bg-[#1a1a1a] border border-gray-800 p-4 rounded-xl flex justify-center items-center gap-2 text-white font-bold hover:bg-[#2a2a2a] transition"
      >
        <Share2 className="w-5 h-5" />
        인스타/카톡 박제
      </button>
      <button
        type="button"
        onClick={onShare}
        className="w-14 bg-red-900/40 text-red-500 border border-red-900 p-4 rounded-xl flex justify-center items-center hover:bg-red-900/60 transition"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ResultShareActions;
